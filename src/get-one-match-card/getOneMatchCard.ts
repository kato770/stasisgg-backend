import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { REGIONS } from 'kayn';
import { kayn } from '..//helper/intializeKayn';
import { makeErrorResponse, makeAPIErrorResponse, makeResponse } from '../helper/responseBuilder';
import { MatchV4MatchDTO, MatchV4ParticipantDTO, MatchV4ParticipantIdentityDTO, MatchV4ParticipantStatsDTO, MatchV4ParticipantTimelineDTO } from 'kayn/typings/dtos';
import { DDragon } from '../helper/ddragon';
import { getMapFromQueueId } from '../helper/queueHelper';


enum Lane {
  TOP = 'TOP',
  MIDDLE = 'MIDDLE',
  JUNGLE = 'JUNGLE',
  BOTTOM = 'BOTTOM',
  SUPPORT = 'SUPPORT',
  UNKNOWN = ''
}

type item = {
  order: number;
  spriteURL: string;
};

type participant = {
  participantId: number;
  championIconURL: string;
  summonerName: string;
  lanePosition: Lane;
  isYou: boolean;
};

type matchInformation = {
  gameId: number;
  gameMode: string;
  win: boolean;
  gameDurationSecond: number;
  gameCreationUnix: number;
  gameVersion: string;
};

type playerInformation = {
  championIconURL: string;
  lanePosition: Lane;  // MIDDLE, TOP, JUNGLE, BOTTOM, SUPPORT
  summonerSpell1Id: number;  // spell1Id
  summonerSpell2Id: number;  // spell2Id
  runeMain: number;  // perk0
  runeSub: number;  // perkSubStyle
  items: Array<item>;
  kill: number;
  death: number;
  assist: number;
  kda: number;
  level: number;  // champLevel
  cs: number;  // totalMinionsKilled
  csPerMinutes: number;
  kp: number;
};

export function getPlayerDTO(game: MatchV4MatchDTO, gameId: number, summonerId: string): MatchV4ParticipantDTO {
  if (!game || !game.participantIdentities || !game.participantIdentities || !game.participants) {
    throw new Error('invalid match information');
  }
  const playerIdentity = game.participantIdentities.find(pIdentity => {
    if (pIdentity.player) {
      return pIdentity.player.summonerId == summonerId;
    }
  });

  if (!playerIdentity) {
    throw new Error(`summonerId: ${summonerId} doesn't exist in gameId: ${gameId}`);
  }

  const player = game.participants.find(p => p.participantId == playerIdentity.participantId);
  if (!player) {
    throw new Error(`summonerId: ${summonerId} doesn't exist in gameId: ${gameId}`);
  }

  return player;
}

export async function getItemsInformation(ddragon: DDragon, stats: MatchV4ParticipantStatsDTO): Promise<Array<item>> {
  const itemIds: { id: number; order: number }[] = [];
  itemIds.push({id: stats.item0 || 0, order: 0});
  itemIds.push({id: stats.item1 || 0, order: 1});
  itemIds.push({id: stats.item2 || 0, order: 2});
  itemIds.push({id: stats.item3 || 0, order: 3});
  itemIds.push({id: stats.item4 || 0, order: 4});
  itemIds.push({id: stats.item5 || 0, order: 5});
  itemIds.push({id: stats.item6 || 0, order: 6});

  const items: Array<item> = [];
  for (const itemId of itemIds) {
    if (itemId.id === 0) {
      items.push({ order: itemId.order, spriteURL: "" });
    } else {
      items.push({ order: itemId.order, spriteURL: await ddragon.getItemSpriteURL(itemId.id) });
    }
  }

  return items;
}

export function getLane(timeLine: MatchV4ParticipantTimelineDTO): Lane {
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

export async function getParticipantsInformation(ddragon: DDragon, participants: MatchV4ParticipantDTO[], participantIdentities: MatchV4ParticipantIdentityDTO[], player: MatchV4ParticipantDTO): Promise<participant[]> {
  const participantList = await Promise.all(participants.map(async participant => {
    const championIconURL = await ddragon.getChampionSpriteURL(participant.championId);
    const identity = participantIdentities.find(identity => {
      return identity.participantId === participant.participantId;
    });
    let summonerName: string;
    if (!identity || !identity.player || !identity.player.summonerName) {
      summonerName = 'Unknown Player';
    } else {
      summonerName = identity.player.summonerName;
    }
    let lane: Lane;
    if (!participant.timeline) {
      lane = Lane.UNKNOWN;
    } else {
      lane = getLane(participant.timeline);
    }
    const p: participant = {
      participantId: participant.participantId || 0,
      championIconURL: championIconURL,
      summonerName: summonerName,
      lanePosition: lane,
      isYou: player.participantId === participant.participantId
    };
    return p;
  }));

  return participantList;
}

export function getKillParticipation(participants: MatchV4ParticipantDTO[] | undefined, teamId: number | undefined, targetStats: MatchV4ParticipantStatsDTO): number {
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
  return Math.round(kd / teamKills * 100) | 0;
}

export const getOneMatchCard = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.queryStringParameters === null || !event.queryStringParameters.gameId || !event.queryStringParameters.summonerId || !event.queryStringParameters.region) {
    return makeErrorResponse(400, 'gameId, summonerId, and region parameter are required.');
  }

  const gameId = +event.queryStringParameters.gameId;
  if (isNaN(gameId)) {
    return makeErrorResponse(400, `'${event.queryStringParameters.gameId}' must be number.`);
  }

  const summonerId = event.queryStringParameters.summonerId;

  const region = event.queryStringParameters.region;
  if (!Object.values(REGIONS).find(value => value === region)) {
    return makeErrorResponse(400, `${region} must be one of ${Object.values(REGIONS)}`);
  }

  let game: MatchV4MatchDTO;
  try {
    game = await kayn.Match.get(gameId).region(region);
  } catch (error) {
    return makeAPIErrorResponse(error);
  }

  let player: MatchV4ParticipantDTO;
  try {
    player = getPlayerDTO(game, gameId, summonerId);
  } catch (error) {
    return makeErrorResponse(404, error.message);
  }

  if (!player.stats || !player.timeline) {
    return makeErrorResponse(404, `participantId: ${player.participantId} doesn't have stats or timeline`);
  }

  if (!game.participants || !game.participantIdentities) {
    return makeErrorResponse(404, 'Are you alone?');
  }

  const matchInformation: matchInformation = {
    gameId: gameId,
    gameMode: getMapFromQueueId(game.queueId) || 'Unknown Mode',
    win: player.stats.win || false,
    gameDurationSecond: game.gameDuration || 0,
    gameCreationUnix: game.gameCreation || 0,
    gameVersion: game.gameVersion || 'Unknown Version',
  };
  
  const ddragon = new DDragon();
  const items = await getItemsInformation(ddragon, player.stats);
  const championSpriteURL = await ddragon.getChampionSpriteURL(player.championId);
  const lane: Lane = getLane(player.timeline);
  let kda = 0;
  if (player.stats.deaths !== 0) {
    kda = ((player.stats.kills || 0) + (player.stats.assists || 0)) / (player.stats.deaths || 0);
    // round to two decimal places. e.g. 5.33
    kda = Math.round(kda * 100) / 100;
  }
  const totalCS = (player.stats.totalMinionsKilled || 0) + (player.stats.neutralMinionsKilled || 0);
  // round to one decimal place. e.g. 9.1
  const csPerMinutes = Math.round(totalCS / matchInformation.gameDurationSecond * 60 * 10) / 10;
  const kp = getKillParticipation(game.participants, player.teamId, player.stats);

  const playerInformation: playerInformation = {
    championIconURL: championSpriteURL,
    lanePosition: lane,
    summonerSpell1Id: player.spell1Id || 0,
    summonerSpell2Id: player.spell2Id || 0,
    runeMain: player.stats.perk0 || 0,
    runeSub: player.stats.perkSubStyle || 0,
    items: items,
    kill: player.stats.kills || 0,
    death: player.stats.deaths || 0,
    assist: player.stats.assists || 0,
    kda: kda,
    level: player.stats.champLevel || 0,
    cs: totalCS,
    csPerMinutes: csPerMinutes,
    kp: kp
  };

  const participants = await getParticipantsInformation(ddragon, game.participants, game.participantIdentities, player);

  const responseBody = {
    match: matchInformation,
    player: playerInformation,
    participants: participants
  };

  // TODO: make response more useful
  return makeResponse(200, event.queryStringParameters, responseBody);
};