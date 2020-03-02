import {
  GetOneMatchCardResponse,
  GetOneMatchCardDto,
  MatchInfo,
  PlayerInfo,
  Item,
  Lane,
  ParticipantInfo
} from 'stasisgg-types';
import { RiotApi } from '../infrastructure/riotApi';
import * as winston from 'winston';
import {
  ApiError,
  ApiRateLimitError,
  StasisError,
  ApiServiceUnavailable,
  ApiNotFoundError
} from '../helper/error';
import { ValidGetOneMatchCardQuery } from './getOneMatchCardHandler';
import {
  MatchDto,
  MatchParticipantDTO,
  MatchParticipantsStatsDto,
  MatchParticipantsTimelineDto
} from 'twisted/dist/models-dto';
import { getMapFromQueueId } from '../helper/queueHelper';
import { DDragon } from '../helper/ddragon';

export class GetOneMatchCardService {
  private api: RiotApi;
  private ddragon: DDragon;
  private logger: winston.Logger | undefined;

  constructor(api: RiotApi, ddragon: DDragon, logger?: winston.Logger) {
    this.api = api;
    this.ddragon = ddragon;
    this.logger = logger;
  }

  private errorHandler(
    err: ApiError,
    params: ValidGetOneMatchCardQuery
  ): never {
    if (err instanceof ApiRateLimitError) {
      throw new StasisError(429, params, 'Reached Riot rate limit.');
    } else if (err instanceof ApiServiceUnavailable) {
      throw new StasisError(503, params, 'Riot API has been shut down.');
    } else {
      throw new StasisError(500, params, 'Something went wrong.');
    }
  }

  private extractPlayerDtoFromMatch(
    summonerId: string,
    match: MatchDto
  ): MatchParticipantDTO | undefined {
    const playerIdentities = match.participantIdentities.find(
      pIdentity => pIdentity.player.summonerId === summonerId
    );
    const player = match.participants.find(
      p => p.participantId === playerIdentities?.participantId
    );

    if (!playerIdentities || !player) {
      this.logger?.info({
        playerIdentities: playerIdentities,
        match: match.participantIdentities
      });
    }
    return player;
  }

  private constructMatchInfo(
    gameId: number,
    match: MatchDto,
    player: MatchParticipantDTO
  ): MatchInfo {
    return {
      gameId: gameId,
      gameMode: getMapFromQueueId(match.queueId) || 'Unknown Mode',
      win: player.stats.win || false,
      gameDurationSecond: match.gameDuration || 0,
      gameCreationUnix: match.gameCreation || 0,
      gameVersion: match.gameVersion || 'Unknown Version'
    };
  }

  private constructPlayerItemsInfo(stats: MatchParticipantsStatsDto): Item[] {
    const itemIds: { id: number; order: number }[] = [];
    itemIds.push({ id: stats.item0 || 0, order: 0 });
    itemIds.push({ id: stats.item1 || 0, order: 1 });
    itemIds.push({ id: stats.item2 || 0, order: 2 });
    itemIds.push({ id: stats.item3 || 0, order: 3 });
    itemIds.push({ id: stats.item4 || 0, order: 4 });
    itemIds.push({ id: stats.item5 || 0, order: 5 });
    itemIds.push({ id: stats.item6 || 0, order: 6 });

    const items: Item[] = [];
    for (const itemId of itemIds) {
      if (itemId.id === 0) {
        items.push({ order: itemId.order, spriteURL: '' });
      } else {
        items.push({
          order: itemId.order,
          spriteURL: this.ddragon.getItemSpriteURL(itemId.id)
        });
      }
    }

    return items;
  }

  private getLane(timeLine: MatchParticipantsTimelineDto): Lane {
    if (!timeLine.lane || !timeLine.role) {
      return Lane.UNKNOWN;
    }
    if (timeLine.lane === Lane.BOTTOM) {
      if (timeLine.role === 'DUO_CARRY') {
        return Lane.BOTTOM;
      } else {
        return Lane.SUPPORT;
      }
    } else {
      return timeLine.lane as Lane;
    }
  }

  private constructParticipantsInfo(
    match: MatchDto,
    playerParticipantId: number
  ): ParticipantInfo[] {
    const { participants, participantIdentities } = match;
    const participantList = participants.map(participant => {
      const championSmallIconURL = this.ddragon.getChampionSmallSpriteURL(
        participant.championId
      );
      const identity = participantIdentities.find(
        identity => identity.participantId === participant.participantId
      );
      const summonerName = identity?.player.summonerName || 'Unknown Player';
      const lane = this.getLane(participant.timeline);
      const p: ParticipantInfo = {
        participantId: participant.participantId || 0,
        championIconURL: championSmallIconURL,
        summonerName: summonerName,
        lanePosition: lane,
        isYou: playerParticipantId === participant.participantId
      };
      return p;
    });

    return participantList;
  }

  private getKillParticipation(
    participants: MatchParticipantDTO[] | undefined,
    teamId: number | undefined,
    targetStats: MatchParticipantsStatsDto
  ): number {
    if (!participants || !teamId) {
      return 0;
    }
    const myTeam = participants.filter(player => player.teamId === teamId);
    const initialValue = 0;
    const teamKills = myTeam.reduce((accumulator, current) => {
      if (!current.stats) {
        return 0;
      }
      return accumulator + (current.stats.kills || 0);
    }, initialValue);
    const kd = (targetStats.kills || 0) + (targetStats.assists || 0);
    // round to the nearest whole number. e.g. 42
    return Math.round((kd / teamKills) * 100) | 0;
  }

  private constructPlayerInfo(
    match: MatchDto,
    player: MatchParticipantDTO
  ): PlayerInfo {
    const championIconURL = this.ddragon.getChampionSpriteURL(
      player.championId
    );
    const lane = this.getLane(player.timeline);
    // KDA
    let kda = 0;
    if (player.stats.deaths !== 0) {
      kda =
        ((player.stats.kills || 0) + (player.stats.assists || 0)) /
        (player.stats.deaths || 0);
      // round to two decimal places. e.g. 5.33
      kda = Math.round(kda * 100) / 100;
    }
    // Total cs in this match
    const totalCS =
      (player.stats.totalMinionsKilled || 0) +
      (player.stats.neutralMinionsKilled || 0);
    // a number of cs per minutes
    // round to one decimal place. e.g. 9.1
    const csPerMinutes =
      Math.round((totalCS / match.gameDuration) * 60 * 10) / 10;
    // player's items
    const items = this.constructPlayerItemsInfo(player.stats);
    // Kill participation
    const kp = this.getKillParticipation(
      match.participants,
      player.teamId,
      player.stats
    );

    return {
      championIconURL: championIconURL,
      lanePosition: lane,
      summonerSpell1Id: player.spell1Id,
      summonerSpell2Id: player.spell2Id,
      runeMain: player.stats.perk0,
      runeSub: player.stats.perkSubStyle,
      items: items,
      kill: player.stats.kills,
      death: player.stats.deaths,
      assist: player.stats.assists,
      kda: kda,
      kp: kp,
      level: player.stats.champLevel,
      cs: totalCS,
      csPerMinutes: csPerMinutes
    };
  }

  public async startService(
    params: ValidGetOneMatchCardQuery
  ): Promise<GetOneMatchCardResponse> {
    const { summonerId, gameId, region } = params;

    let match: MatchDto;
    try {
      match = await this.api.getRiotMatch(gameId, region);
    } catch (err) {
      if (err instanceof ApiNotFoundError) {
        throw new StasisError(404, params, `Game id: ${gameId} was not found.`);
      }
      this.errorHandler(err, params);
    }

    const playerDto = this.extractPlayerDtoFromMatch(summonerId, match);
    if (!playerDto) {
      throw new StasisError(404, params, `MatchDTO has been changed?`);
    }

    const matchInfo = this.constructMatchInfo(gameId, match, playerDto);

    const playerInfo = this.constructPlayerInfo(match, playerDto);

    const participantsInfo = this.constructParticipantsInfo(
      match,
      playerDto.participantId
    );

    const responseBody: GetOneMatchCardDto = {
      match: matchInfo,
      player: playerInfo,
      participants: participantsInfo
    };

    this.logger?.info({
      params: params,
      response: responseBody
    });

    return {
      statusCode: 200,
      body: {
        params: params,
        message: responseBody
      }
    };
  }
}
