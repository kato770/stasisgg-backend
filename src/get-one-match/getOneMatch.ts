import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { kayn } from '..//helper/intializeKayn';
import { makeErrorResponse, makeAPIErrorResponse, makeResponse } from '../helper/responseBuilder';


export const getOneMatch = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.queryStringParameters === null || !event.queryStringParameters.gameId) {
    return makeErrorResponse(400, 'gameId parameter is required.');
  }
  const gameId = +event.queryStringParameters.gameId;
  if (isNaN(gameId)) {
    return makeErrorResponse(400, `'${event.queryStringParameters.gameId}' must be number.`);
  }

  let response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify({
      message: ""
    })
  };
  await kayn.Match.get(gameId)
    .then(data => {
      response = makeResponse(200, event.queryStringParameters, data);
    })
    .catch(err => {
      response = makeAPIErrorResponse(err);
    });

  return response;
};
