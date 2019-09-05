require('dotenv').config();
import { Kayn, REGIONS } from 'kayn';

const RIOT_LOL_API_KEY = process.env.RIOT_LOL_API_KEY || 'dummyAPIKey';
export const kayn = Kayn(RIOT_LOL_API_KEY)({
  region: REGIONS.KOREA,
  debugOptions: {
    isEnabled: true,
    showKey: true,
  },
  requestOptions: {
    shouldRetry: true,
    numberOfRetriesBeforeAbort: 3,
    delayBeforeRetry: 1,
    burst: true,
    shouldExitOn403: false,
  },
  cacheOptions: {
    cache: null,
    timeToLives: {
      useDefault: false,
      byGroup: {},
      byMethod: {},
    },
  },
});