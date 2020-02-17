import { Regions } from 'twisted/dist/constants/regions';
import {
  MatchQueryDTO,
  MatchDto,
  SummonerV4DTO,
  MatchListingMatches
} from 'twisted/dist/models-dto';

export interface RiotApi {
  getRiotSummonerByName(
    summonerName: string,
    region: Regions
  ): Promise<SummonerV4DTO>;
  getRiotAccountIdByName(
    summonerName: string,
    region: Regions
  ): Promise<string>;
  getRiotMatchList(
    accountId: string,
    region: Regions,
    query?: MatchQueryDTO | undefined
  ): Promise<MatchListingMatches[]>;
  getRiotMatch(matchId: number, region: Regions): Promise<MatchDto>;
}
