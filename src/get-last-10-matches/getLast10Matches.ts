import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { kayn } from '../intializeKayn';
import { MatchV4MatchDTO } from 'kayn/typings/dtos';
import { makeResponse, makeErrorResponse } from '../responseBuilder';


export async function getMatchesFromGameIdsPromiseAll(gameIds: number[]): Promise<MatchV4MatchDTO[]> {
  const results = Promise.all(gameIds.map(async gameIds => {
    const r = await kayn.Match.get(gameIds);
    return r;
  }));
  return results;
}

export const getLast10Matches = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.queryStringParameters === null || !event.queryStringParameters.name) {
    return makeErrorResponse(400, 'name parameter is required.');
  }

  const name = event.queryStringParameters.name;
  const { accountId } = await kayn.Summoner.by.name(name);
  console.log(`name: ${name}\naccountId: ${accountId}`);
  if (accountId === undefined) {
    return makeErrorResponse(404, `Summoner Name: ${name} was not found.`);
  }

  const { matches } = await kayn.Matchlist.by
    .accountID(accountId)
    .query({ queue: [420, 430] });
  if (matches === undefined) {
    return makeErrorResponse(404, 'No games.');
  }

  const nonNullableGameIds: number[] = matches.slice(0, 10).map(({ gameId }) => gameId).filter(
    (item: number | undefined): item is number => item !== null
  );

  if (nonNullableGameIds.length === 0) {
    return makeErrorResponse(404, 'No gameIds.');
  }

  const results = await getMatchesFromGameIdsPromiseAll(nonNullableGameIds);
  console.log(results[0], results.length);

  // TODO: make response more useful
  return makeResponse(200, event.queryStringParameters, nonNullableGameIds);
};
