/* eslint-disable @typescript-eslint/no-explicit-any */
import * as lambda from '../../get-one-match/getOneMatch';
import { eventMock } from '../mock';
import { kayn } from '../../helper/intializeKayn';
import * as faker from '../3827552557.json';
jest.mock('../../intializeKayn.ts');


describe('get-one-match', () => {
  it('without any queries', async () => {
    eventMock.queryStringParameters = {};
    const result = await lambda.getOneMatch(eventMock);
    console.log(result);
    expect(result.statusCode).toBe(400);
  });
  it('with empty gameId parameter', async () => {
    eventMock.queryStringParameters = {
      "gameId": ""
    };
    const result = await lambda.getOneMatch(eventMock);
    console.log(result);
    expect(result.statusCode).toBe(400);
  });
  it('with invalid gameId parameter', async () => {
    eventMock.queryStringParameters = {
      "gameId": "Invalid gameId"
    };
    const result = await lambda.getOneMatch(eventMock);
    console.log(result);
    expect(result.statusCode).toBe(400);
  });
  it('normal request', async () => {
    (kayn.Match.get as any).mockImplementation(() => Promise.resolve(faker));
    eventMock.queryStringParameters = {
      "gameId": faker['gameId'].toString()
    };
    const result = await lambda.getOneMatch(eventMock);
    //console.log(result);
    expect(result.statusCode).toBe(200);
  });
});