import { GetMatchesResponse, GetMatchesDto } from 'stasisgg-types';
import { MatchListingMatches } from 'twisted/dist/models-dto';
import {
  StasisError,
  ApiNotFoundError,
  ApiRateLimitError,
  ApiServiceUnavailable,
  ApiError
} from '../helper/error';
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

  private errorHandler(err: ApiError, params: ValidGetMatchesQuery): never {
    if (err instanceof ApiRateLimitError) {
      throw new StasisError(429, params, 'Reached Riot rate limit.');
    } else if (err instanceof ApiServiceUnavailable) {
      throw new StasisError(503, params, 'Riot API has been shut down.');
    } else {
      throw new StasisError(500, params, 'Something went wrong.');
    }
  }

  private getNonNullableGameIds(matches: MatchListingMatches[]): number[] {
    return matches
      .map(({ gameId }) => gameId)
      .filter((item: number | undefined): item is number => item !== null);
  }

  public async startService(
    params: ValidGetMatchesQuery
  ): Promise<GetMatchesResponse> {
    const { summonerName, region, offset, limit } = params;
    // Get account id by summoner name
    let accountId: string;
    try {
      accountId = await this.api.getRiotAccountIdByName(summonerName, region);
    } catch (err) {
      this.logger?.info({
        error: err
      });
      if (err instanceof ApiNotFoundError) {
        throw new StasisError(
          404,
          params,
          `Summoner Name: ${params.summonerName} was not found.`
        );
      }
      this.errorHandler(err, params);
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
      if (err instanceof ApiNotFoundError) {
        throw new StasisError(404, params, 'No games.');
      }
      this.errorHandler(err, params);
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
  }
}
