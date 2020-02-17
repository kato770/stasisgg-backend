import { LolApi } from 'twisted';
require('dotenv').config();

const RIOT_LOL_API_KEY = process.env.RIOT_LOL_API_KEY || 'dummyAPIKey';
const isDebug = process.env.NODE_ENV === 'development';

export const riot = new LolApi({
  rateLimitRetry: true,
  rateLimitRetryAttempts: 1,
  concurrency: undefined,
  key: RIOT_LOL_API_KEY,
  debug: {
    logTime: isDebug,
    logUrls: isDebug,
    logRatelimits: isDebug
  }
});
