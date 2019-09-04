import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { kayn } from '..//helper/intializeKayn';
import { makeErrorResponse, makeAPIErrorResponse, makeResponse } from '../helper/responseBuilder';
import { MatchV4MatchDTO, MatchV4ParticipantDTO, MatchV4ParticipantStatsDTO } from 'kayn/typings/dtos';
import { DDragon } from '../helper/ddragon';


type matchInformation = {
  gameMode: string;
  win: boolean;
  gameDurationSecond: number;
  gameCreationUnix: number;
  gameVersion: string;
};

type item = {
  order: number;
  spriteURL: string;
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

export const getOneMatchCard = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.queryStringParameters === null || !event.queryStringParameters.gameId || !event.queryStringParameters.summonerId) {
    return makeErrorResponse(400, 'gameId and summonerId parameter is required.');
  }

  const gameId = +event.queryStringParameters.gameId;
  if (isNaN(gameId)) {
    return makeErrorResponse(400, `'${event.queryStringParameters.gameId}' must be number.`);
  }

  const summonerId = event.queryStringParameters.summonerId;

  let game: MatchV4MatchDTO;
  try {
    game = await kayn.Match.get(gameId);
  } catch (error) {
    return makeAPIErrorResponse(error);
  }

  let player: MatchV4ParticipantDTO;
  try {
    player = getPlayerDTO(game, gameId, summonerId);
  } catch (error) {
    return makeErrorResponse(404, error.message);
  }

  if (!player.stats) {
    return makeErrorResponse(404, `participantId: ${player.participantId} doesn't have MatchV4ParticipantDTO.stats`);
  }

  const match: matchInformation = {
    gameMode: game.gameMode || 'Unknown Mode',
    win: player.stats.win || false,
    gameDurationSecond: game.gameDuration || 0,
    gameCreationUnix: game.gameCreation || 0,
    gameVersion: game.gameVersion || 'Unknown Version',
  };
  
  const ddragon = new DDragon();
  const items = await getItemsInformation(ddragon, player.stats);
  console.log(items);

  // TODO: make response more useful
  return makeResponse(200, event.queryStringParameters, match);
};