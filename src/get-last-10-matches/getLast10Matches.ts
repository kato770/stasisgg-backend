import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { REGIONS } from 'kayn';
import { kayn } from '../helper/initializeKayn';
import { makeResponse, makeErrorResponse } from '../helper/responseBuilder';

export const getLast10Matches = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (
    event.queryStringParameters === null ||
    !event.queryStringParameters.summonerName ||
    !event.queryStringParameters.region
  ) {
    return makeErrorResponse(
      400,
      'summonerName and region parameters are required.'
    );
  }

  const region = event.queryStringParameters.region;
  if (!Object.values(REGIONS).find(value => value === region)) {
    return makeErrorResponse(
      400,
      `${region} must be one of ${Object.values(REGIONS)}`
    );
  }

  const summonerName = event.queryStringParameters.summonerName;
  const { accountId } = await kayn.Summoner.by
    .name(summonerName)
    .region(region);
  // console.log(`name: ${name}\naccountId: ${accountId}`);
  if (accountId === undefined) {
    return makeErrorResponse(
      404,
      `Summoner Name: ${summonerName} was not found.`
    );
  }

  const { matches } = await kayn.Matchlist.by
    .accountID(accountId)
    .query({ queue: [420, 430] })
    .region(region);
  if (matches === undefined) {
    return makeErrorResponse(404, 'No games.');
  }

  // get non-null game ids
  const nonNullableGameIds: number[] = matches
    .slice(0, 10)
    .map(({ gameId }) => gameId)
    .filter((item: number | undefined): item is number => item !== null);

  if (nonNullableGameIds.length === 0) {
    return makeErrorResponse(404, 'No gameIds.');
  }

  const responseBody = {
    matchesCount: nonNullableGameIds.length,
    matchIds: nonNullableGameIds
  };

  // TODO: make response more useful
  return makeResponse(200, event.queryStringParameters, responseBody);
};
