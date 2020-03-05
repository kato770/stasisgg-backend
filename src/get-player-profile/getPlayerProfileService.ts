import { RiotApi } from '../infrastructure/riotApi';
import * as winston from 'winston';
import { ValidGetPlayerProfileQuery } from './getPlayerProfileHandler';
import { GetPlayerProfileResponse, GetPlayerProfileDto } from 'stasisgg-types';
import { SummonerV4DTO } from 'twisted/dist/models-dto';
import {
  ApiRateLimitError,
  ApiError,
  StasisError,
  ApiServiceUnavailable,
  ApiNotFoundError
} from '../helper/error';
import { DDragon } from '../helper/ddragon';

export class GetPlayerProfileService {
  private api: RiotApi;
  private logger: winston.Logger | undefined;

  constructor(api: RiotApi, logger?: winston.Logger) {
    this.api = api;
    this.logger = logger;
  }

  private errorHandler(
    err: ApiError,
    params: ValidGetPlayerProfileQuery
  ): never {
    if (err instanceof ApiRateLimitError) {
      throw new StasisError(429, params, 'Reached Riot rate limit.');
    } else if (err instanceof ApiServiceUnavailable) {
      throw new StasisError(503, params, 'Riot API has been shut down.');
    } else {
      throw new StasisError(500, params, 'Something went wrong.');
    }
  }

  public async startService(
    params: ValidGetPlayerProfileQuery
  ): Promise<GetPlayerProfileResponse> {
    const { summonerName, region } = params;
    let player: SummonerV4DTO;
    try {
      player = await this.api.getRiotSummonerByName(summonerName, region);
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
    const ddragon = new DDragon();
    const profileIconURL = await ddragon.getProfileIconURL(
      player.profileIconId
    );

    const responseBody: GetPlayerProfileDto = {
      summonerId: player.id,
      profileIconURL: profileIconURL,
      summonerName: player.name,
      summonerLevel: player.summonerLevel
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
