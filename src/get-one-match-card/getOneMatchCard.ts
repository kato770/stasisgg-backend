import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { kayn } from '../intializeKayn';
import { makeErrorResponse, makeAPIErrorResponse, makeResponse } from '../responseBuilder';
import { MatchV4MatchDTO, MatchV4ParticipantDTO } from 'kayn/typings/dtos';


type matchInformation = {
  gameMode: string;
  win: boolean;
  gameDurationSecond: number;
  Date: string;
  gameVersion: string;
};

function getPlayerDTO(game: MatchV4MatchDTO, gameId: number, summonerId: string): MatchV4ParticipantDTO {
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
    return makeErrorResponse(404, error);
  }

  return makeResponse(200, event.queryStringParameters, player.participantId);
};