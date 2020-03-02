/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as lambda from '../../get-one-match-card/getOneMatchCardHandler';
import { eventMock } from '../mock';
import { GetOneMatchCardService } from '../../get-one-match-card/getOneMatchCardService';
import { RiotApiTwisted } from '../../infrastructure/riotApiTwisted';
import { DDragon } from '../../helper/ddragon';
import { Regions } from 'twisted/dist/constants';
import faker from './faker_3827552557_response.json';
import fakerMatch from './faker_3827552557_getRiotMatch.json';

jest.mock('../../infrastructure/riotApiTwisted');

describe('get-one-match-card', () => {
  it('without any queries', async () => {
    eventMock.queryStringParameters = {};
    expect(() =>
      lambda.validateParameters(eventMock.queryStringParameters)
    ).toThrowError('summonerId, gameId, and region parameters are required.');
  });

  it('with empty parameter', async () => {
    eventMock.queryStringParameters = {
      gameId: '',
      summonerId: '',
      region: ''
    };
    expect(() =>
      lambda.validateParameters(eventMock.queryStringParameters)
    ).toThrowError('summonerId, gameId, and region parameters are required.');
  });

  it('with invalid gameId parameter', async () => {
    eventMock.queryStringParameters = {
      gameId: 'Invalid gameId',
      summonerId: 'blahblahblahblah',
      region: 'kr'
    };
    expect(() =>
      lambda.validateParameters(eventMock.queryStringParameters)
    ).toThrowError('gameId must be int.');
  });

  it('with invalid region parameter', async () => {
    eventMock.queryStringParameters = {
      gameId: '4649',
      summonerId: 'blahblahblahblah',
      region: 'My Home'
    };
    expect(() => {
      lambda.validateParameters(eventMock.queryStringParameters);
    }).toThrowError('regin must be valid value.');
  });

  it('normal request', async () => {
    const params = {
      gameId: fakerMatch.gameId,
      summonerId: faker.body.params.summonerId,
      region: Regions.KOREA
    };
    RiotApiTwisted.prototype.getRiotMatch = jest
      .fn()
      .mockResolvedValue(fakerMatch);
    const api = new RiotApiTwisted();
    const ddragon = new DDragon();
    const service = new GetOneMatchCardService(api, ddragon);
    const response = await service.startService(params);
    expect(response.body.message.player.kp).toBe(faker.body.message.player.kp);
  });
});
