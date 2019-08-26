import { APIGatewayProxyHandler } from 'aws-lambda';
import { kayn } from '../intializeKayn';
import { makeErrorResponse } from '../responseBuilder';
import * as fs from 'fs';


export const getOneMatch: APIGatewayProxyHandler = async (event, _context) => {
  fs.writeFile("test.txt", JSON.stringify(_context, null, 2), function(err) {
    if (err) {
        console.log(err);
    }
});
  if (event.queryStringParameters === null || event.queryStringParameters.gameId === undefined) {
    return makeErrorResponse(400, 'gameId parameter is required.');
  }
  const gameId = +event.queryStringParameters.gameId;
  if (isNaN(gameId)) {
    return makeErrorResponse(400, 'invalid gameId.');
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
