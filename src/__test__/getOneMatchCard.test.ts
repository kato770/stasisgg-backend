/* eslint-disable @typescript-eslint/no-explicit-any */
import * as lambda from '../get-one-match-card/getOneMatchCard';
import { eventMock } from './mock';
//import { kayn } from '../intializeKayn';
//import * as faker from './3827552557.json';
//jest.mock('../intializeKayn');


describe('get-one-match-card', () => {
  it('without any queries', async () => {
    eventMock.queryStringParameters = {};
    const result = await lambda.getOneMatchCard(eventMock);
    console.log(result);
    expect(result.statusCode).toBe(400);
  });
  it('with empty parameter', async () => {
    eventMock.queryStringParameters = {
      "gameId": "",
      "summonerId": ""
    };
    const result = await lambda.getOneMatchCard(eventMock);
    console.log(result);
    expect(result.statusCode).toBe(400);
  });
  it('with invalid gameId parameter', async () => {
    eventMock.queryStringParameters = {
      "gameId": "Invalid gameId",
      "summonerId": "blahblahblahblah"
    };
    const result = await lambda.getOneMatchCard(eventMock);
    console.log(result);
    expect(result.statusCode).toBe(400);
  });
  // it('normal request', async () => {
  //   (kayn.Match.get as any).mockImplementation(() => Promise.resolve(faker));
  //   eventMock.queryStringParameters = {
  //     "gameId": faker['gameId'].toString(),
  //     "summonerId": '3dKU4SONiX0Vh69_gBab3pRZIh9_vwNuojjYyy9L1R26lg'
  //   };
  //   const result = await lambda.getOneMatchCard(eventMock);
  //   console.log(result);
  //   expect(result.statusCode).toBe(200);
  // });
});