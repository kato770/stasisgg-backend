/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as lambda from '../../get-one-match-card/getOneMatchCard';
import { eventMock } from '../mock';
import { kayn } from '../../intializeKayn';
import { faker, fakerMatch } from '../faker_3827552557';
jest.mock('../../intializeKayn.ts');


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
  it('normal request', async () => {
    (kayn.Match.get as any).mockImplementation(() => Promise.resolve(fakerMatch));
    eventMock.queryStringParameters = {
      "gameId": fakerMatch.gameId!.toString(),
      "summonerId": faker.summonerId
    };
    const result = await lambda.getOneMatchCard(eventMock);
    console.log(result);
    expect(result.statusCode).toBe(200);
  });
  it('getPlayerDTO return success', async () => {
    const player = lambda.getPlayerDTO(fakerMatch, fakerMatch.gameId!, faker.summonerId);
    expect(player.participantId).toBe(faker.participantId);
  });
});