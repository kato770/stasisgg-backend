import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { kayn } from '../intializeKayn';
import { makeErrorResponse, makeAPIErrorResponse, makeResponse } from '../responseBuilder';
import { MatchV4MatchDTO } from 'kayn/typings/dtos';


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
  } catch (err) {
    return makeAPIErrorResponse(err);
  }
  if (!game || !game.participantIdentities || !game.participantIdentities) {
    return makeErrorResponse(404, 'invalid match information');
  }
  const participantIdentity = game.participantIdentities.find(participant => {
    if (participant.player) {
      return participant.player.summonerId == summonerId;
    }
  });
  if (!participantIdentity) {
    return makeErrorResponse(404, `summonerId: ${summonerId} doesn't exist in gameId: ${gameId}`);
  }

  return makeResponse(200, event.queryStringParameters, participantIdentity.participantId);
};