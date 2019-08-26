/* eslint-disable @typescript-eslint/no-explicit-any */
import * as lambda from '../get-last-10-matches/getLast10Matches';
//import * as data from './177026851.json';
import { eventMock } from './mock';
import { kayn } from '../intializeKayn';
jest.mock('../intializeKayn');


// 外部API呼ぶテストってどうなの
// describe('getMatchHandler test', () => {
//   it('get 1 game(id:177026851) from gameId by Promise.all', async () => {
//     const gameId = 177026851;
//     const match = await getMatchesFromGameIdsPromiseAll([gameId]);
//     expect(match).toMatchObject(data);
//   });
// });

describe('get-last-10-matches', () => {
  it('without any queries', async () => {
    eventMock.queryStringParameters = {};
    const result = await lambda.getLast10Matches(eventMock);
    console.log(result);
    expect(result.statusCode).toBe(400);
  });

  it('with empty name parameter', async () => {
    eventMock.queryStringParameters = {
      "name": ""
    };
    const result = await lambda.getLast10Matches(eventMock);
    console.log(result);
    expect(result.statusCode).toBe(400);
  });

  it('with name does\'nt exist in riot server', async () => {
    const unknownName = 'I\'m nobody';
    (kayn.Summoner.by.name as any).mockImplementation(() => Promise.resolve(
      {
        "name": unknownName,
        "accountId": undefined
      }
    ));
    eventMock.queryStringParameters = {
      "name": unknownName
    };
    const result = await lambda.getLast10Matches(eventMock);
    console.log(result);
    expect(result.statusCode).toBe(404);
  });
});
