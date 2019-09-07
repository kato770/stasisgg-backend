require('dotenv').config();
import { Kayn, REGIONS, LRUCache, METHOD_NAMES } from 'kayn';

const RIOT_LOL_API_KEY = process.env.RIOT_LOL_API_KEY || 'dummyAPIKey';
const lruCache = new LRUCache({ max: 500 });

export const kayn = Kayn(RIOT_LOL_API_KEY)({
  region: REGIONS.KOREA,
  debugOptions: {
    isEnabled: true,
    showKey: false,
  },
  requestOptions: {
    shouldRetry: true,
    numberOfRetriesBeforeAbort: 3,
    delayBeforeRetry: 1,
    burst: false,
    shouldExitOn403: false,
  },
  cacheOptions: {
    cache: lruCache,
    timeToLives: {
      useDefault: true,
      byGroup: {
        MATCH: 60 * 60 * 24 * 30,
      },
      byMethod: {
        [METHOD_NAMES.SUMMONER.GET_BY_SUMMONER_NAME_V4]: 1000,
        [METHOD_NAMES.MATCH.GET_MATCHLIST_V4]: 1000
      },
    },
  },
});