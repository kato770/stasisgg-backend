/* eslint-disable @typescript-eslint/no-explicit-any */
import * as lambda from '../get-one-match/getOneMatch';
import { eventMock } from './mock';
//import { kayn } from '../intializeKayn';
jest.mock('../intializeKayn');


describe('get-one-match', () => {
  it('without any queries', async () => {
    eventMock.queryStringParameters = null;
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
});