/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as lambda from '../../get-player-profile/getPlayerProfileHandler';
import { eventMock } from '../mock';
// import { kayn } from '../../helper/initializeKayn';
// import { faker } from '../faker_3827552557';
jest.mock('../../helper/initializeKayn.ts');

describe('get-player-profile', () => {
  it('without any queries', async () => {
    eventMock.queryStringParameters = {};
    expect(() => {
      lambda.validateParameters(eventMock.queryStringParameters);
    }).toThrowError('summonerName and Region parameters are required.');
  });

  it('with empty parameter', async () => {
    eventMock.queryStringParameters = {
      summonerName: '',
      region: ''
    };
    expect(() => {
      lambda.validateParameters(eventMock.queryStringParameters);
    }).toThrowError('summonerName and Region parameters are required.');
  });

  // it('normal request', async () => {
  //   const regionMock = {
  //     region: jest.fn(() => Promise.resolve(faker))
  //   };
  //   (kayn.Summoner.by.name as any).mockImplementation(() => regionMock);
  //   eventMock.queryStringParameters = {
  //     summonerName: faker.summonerName,
  //     region: 'kr'
  //   };
  //   const result = await lambda.getPlayerProfile(eventMock);
  //   console.log(result);
  //   expect(result.statusCode).toBe(200);
  // });
});
