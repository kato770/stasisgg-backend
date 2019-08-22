import { getMatchesFromGameIdsPromiseAll } from '../get-last-10-matches/getLast10Matches';
import * as data from './177026851.json';

describe('getMatchHandler test', () => {
  test('get 1 game(id:177026851) from gameId by Promise.all', async () => {
    const gameId = 177026851;
    const match = await getMatchesFromGameIdsPromiseAll([gameId]);
    expect(match).toMatchObject(data);
  });
});