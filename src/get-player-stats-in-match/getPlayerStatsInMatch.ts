import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
//import { kayn } from '../intializeKayn';
import { makeErrorResponse, makeAPIErrorResponse, makeResponse } from '../responseBuilder';


export const getPlayerStatsInMatch = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.queryStringParameters === null || !event.queryStringParameters.gameId || !event.queryStringParameters.name) {
    return makeErrorResponse(400, 'gameId and name parameter is required.');
  }
  const gameId = +event.queryStringParameters.gameId;
  if (isNaN(gameId)) {
    return makeErrorResponse(400, `'${event.queryStringParameters.gameId}' must be number.`);
  }

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify({
      message: ""
    })
  };

  return response;
};