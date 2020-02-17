import { RiotApi } from './riotApi';
import { Regions } from 'twisted/dist/constants';
import {
  SummonerV4DTO,
  MatchListingMatches,
  MatchQueryDTO,
  MatchDto
} from 'twisted/dist/models-dto';
import { riot } from '../helper/initializeRiot';

export class RiotApiTwisted implements RiotApi {
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
    const accountId = (await this.getRiotSummonerByName(summonerName, region))
      .accountId;
    return accountId;
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
