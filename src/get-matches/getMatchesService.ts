import { GetMatchesResponse, GetMatchesDto } from 'stasisgg-types';
import { MatchListingMatches } from 'twisted/dist/models-dto';
import { StasisError } from '../helper/error';
import * as winston from 'winston';
import { ValidGetMatchesQuery } from './getMatchesHandler';
import { RiotApi } from '../infrastructure/riotApi';

export class GetMatchesService {
  private api: RiotApi;
  private logger: winston.Logger | undefined;

  constructor(api: RiotApi, logger?: winston.Logger) {
    this.api = api;
    this.logger = logger;
  }

  private getNonNullableGameIds = (
    matches: MatchListingMatches[]
  ): number[] => {
    return matches
      .map(({ gameId }) => gameId)
      .filter((item: number | undefined): item is number => item !== null);
  };

  public startService = async (
    params: ValidGetMatchesQuery
  ): Promise<GetMatchesResponse> => {
    const { summonerName, region, offset, limit } = params;
    // Get account id by summoner name
    let accountId: string;
    try {
      accountId = await this.api.getRiotAccountIdByName(summonerName, region);
    } catch (err) {
      this.logger?.info({
        error: err.message
      });
      throw new StasisError(
        404,
        params,
        `Summoner Name: ${summonerName} was not found.`
      );
    }

    let matches: MatchListingMatches[];
    try {
      matches = await this.api.getRiotMatchList(accountId, region, {
        queue: [420, 430],
        beginIndex: offset,
        endIndex: offset + limit
      });
    } catch (err) {
      this.logger?.info({
        error: err
      });
      throw new StasisError(404, params, 'No games.');
    }

    // get non-null game ids
    const nonNullableGameIds = this.getNonNullableGameIds(matches);

    if (nonNullableGameIds.length === 0) {
      this.logger?.info({
        matches: matches
      });
      throw new StasisError(404, params, 'No gameIds.');
    }

    const responseBody: GetMatchesDto = {
      matchesCount: nonNullableGameIds.length,
      matchIds: nonNullableGameIds,
      offset: offset,
      limit: limit
    };

    this.logger?.info({
      params: params,
      response: responseBody
    });

    return {
      statusCode: 200,
      body: {
        params: params,
        message: responseBody
      }
    };
  };
}
