import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { kayn } from '../intializeKayn';
import { makeErrorResponse } from '../responseBuilder';


export const getOneMatch = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.queryStringParameters === null || event.queryStringParameters.gameId === "") {
    return makeErrorResponse(400, 'gameId parameter is required.');
  }
  const gameId = +event.queryStringParameters.gameId;
  if (isNaN(gameId)) {
    return makeErrorResponse(400, `'${event.queryStringParameters.gameId}' must be number.`);
  }

  const game = await kayn.Match.get(gameId)
    .then(data => data)
    .catch(err => {
      return makeErrorResponse(+err.statusCode, err.error);
    });

  return {
    statusCode: 200,
    body: JSON.stringify({
      params: event.queryStringParameters,
      message: game,
    }),
  };
};
