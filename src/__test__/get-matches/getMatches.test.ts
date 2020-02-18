/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as lambda from '../../get-matches/getMatchesHandler';
import { eventMock } from '../mock';
import { GetMatchesService } from '../../get-matches/getMatchesService';
import { Regions } from 'twisted/dist/constants';
import { RiotApiTwisted } from '../../infrastructure/riotApiTwisted';
import { Logger } from '../../helper/logger';
import { ApiNotFoundError } from '../../helper/error';

jest.mock('../../infrastructure/riotApiTwisted');

describe('get-matches', () => {
  it('without any queries', async () => {
    eventMock.queryStringParameters = {};
    expect(() => {
      lambda.validateParameters(eventMock.queryStringParameters);
    }).toThrowError('summonerName and region parameters are required.');
  });

  it('with empty parameter', async () => {
    eventMock.queryStringParameters = {
      summonerName: '',
      region: ''
    };
    expect(() => {
      lambda.validateParameters(eventMock.queryStringParameters);
    }).toThrowError('summonerName and region parameters are required.');
  });

  it('with invalid region parameter', async () => {
    eventMock.queryStringParameters = {
      summonerName: 'blablabla',
      region: 'My Home'
    };
    expect(() => {
      lambda.validateParameters(eventMock.queryStringParameters);
    }).toThrowError('regin must be valid value.');
  });

  it('with invalid offset and limit parameter', async () => {
    eventMock.queryStringParameters = {
      offset: 'Invalid offset',
      limit: 'Invalid limit',
      summonerName: 'hide on bush',
      region: 'kr'
    };
    expect(
      lambda.validateParameters(eventMock.queryStringParameters)
    ).toMatchObject({
      offset: 0,
      limit: 10,
      summonerName: 'hide on bush',
      region: 'KR'
    });
  });

  it('Summoner not found', async () => {
    const params = {
      summonerName: 'im not anywhere see you someday',
      region: Regions.KOREA,
      offset: 0,
      limit: 10
    };
    RiotApiTwisted.prototype.getRiotAccountIdByName = jest
      .fn()
      .mockRejectedValue(new ApiNotFoundError());
    const api = new RiotApiTwisted();
    const logger = new Logger().logger;
    const service = new GetMatchesService(api, logger);
    const servicePromise = service.startService(params);
    await expect(servicePromise).rejects.toThrow(
      `Summoner Name: ${params.summonerName} was not found.`
    );
  });
});
