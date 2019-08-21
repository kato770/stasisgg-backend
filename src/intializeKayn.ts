require('dotenv').config();
import { Kayn, REGIONS } from 'kayn';


export const kayn = Kayn(process.env.RIOT_LOL_API_KEY)({
  region: REGIONS.JAPAN,
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