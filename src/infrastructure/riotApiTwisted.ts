import { RiotApi } from './riotApi';
import { IErrors } from 'twisted/src/errors/base';
import { Regions } from 'twisted/dist/constants';
import {
  SummonerV4DTO,
  MatchListingMatches,
  MatchQueryDTO,
  MatchDto
} from 'twisted/dist/models-dto';
import { riot } from '../helper/initializeRiot';
import {
  ApiError,
  ApiKeyNotFoundError,
  ApiNotFoundError,
  ApiServiceUnavailable,
  ApiRateLimitError
} from '../helper/error';

export class RiotApiTwisted implements RiotApi {
  private errorThrower(err: IErrors): never {
    if (err.status === 403) {
      throw new ApiKeyNotFoundError(err.message);
    } else if (err.status === 404) {
      throw new ApiNotFoundError(err.message);
    } else if (err.status === 500 || err.status === 503) {
      throw new ApiServiceUnavailable(err.message);
    } else if (err.status === 429) {
      throw new ApiRateLimitError(err.message);
    } else {
      throw new ApiError(err.message);
    }
  }

  async getRiotSummonerByName(
    summonerName: string,
    region: Regions
  ): Promise<SummonerV4DTO> {
    const summoner = await riot.Summoner.getByName(summonerName, region);
    return summoner.response;
  }

  async getRiotAccountIdByName(
    summonerName: string,
    region: Regions
  ): Promise<string> {
    try {
      const accountId = (await this.getRiotSummonerByName(summonerName, region))
        .accountId;
      return accountId;
    } catch (err) {
      this.errorThrower(err);
    }
  }

  async getRiotMatchList(
    accountId: string,
    region: Regions,
    query?: MatchQueryDTO | undefined
  ): Promise<MatchListingMatches[]> {
    const matchList = await riot.Match.list(accountId, region, query);
    return matchList.response.matches;
  }

  async getRiotMatch(matchId: number, region: Regions): Promise<MatchDto> {
    const match = await riot.Match.get(matchId, region);
    return match.response;
  }
}
