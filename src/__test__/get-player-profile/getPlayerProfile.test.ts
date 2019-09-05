/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as lambda from '../../get-player-profile/getPlayerProfile';
import { eventMock } from '../mock';
import { kayn } from '../../helper/intializeKayn';
import { faker } from '../faker_3827552557';
jest.mock('../../helper/intializeKayn.ts');


describe('get-player-profile', () => {
  it('without any queries', async () => {
    eventMock.queryStringParameters = {};
    const result = await lambda.getPlayerProfile(eventMock);
    console.log(result);
    expect(result.statusCode).toBe(400);
  });
  it('with empty parameter', async () => {
    eventMock.queryStringParameters = {
      "summonerName": ""
    };
    const result = await lambda.getPlayerProfile(eventMock);
    console.log(result);
    expect(result.statusCode).toBe(400);
  });
  it('normal request', async () => {
    (kayn.Summoner.by.name as any).mockImplementation(() => Promise.resolve(faker));
    eventMock.queryStringParameters = {
      "summonerName": faker.summonerName
    };
    const result = await lambda.getPlayerProfile(eventMock);
    console.log(result);
    expect(result.statusCode).toBe(200);
  });
});