import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetMatchesService } from './getMatchesService';
import { StasisError } from '../helper/error';
import { Logger } from '../helper/logger';
import { convertStrToRegions, GetMatchesQuery } from 'stasisgg-types';
import { RiotApiTwisted } from '../infrastructure/riotApiTwisted';

export type ValidGetMatchesQuery = Required<GetMatchesQuery>;

export const validateParameters = (
  params: {
    [name: string]: string;
  } | null
): ValidGetMatchesQuery => {
  if (params === null || !params.summonerName || !params.region) {
    throw new StasisError(
      400,
      params,
      'summonerName and region parameters are required.'
    );
  }
  const region = convertStrToRegions(params.region.toUpperCase());
  if (!region) {
    throw new StasisError(400, params, `regin must be valid value.`);
  }

  const offset = +params.offset || 0;
  const limit = +params.limit || 10;

  return {
    summonerName: params.summonerName,
    region: region,
    offset: offset,
    limit: limit
  };
};

export const getMatchesHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const api = new RiotApiTwisted();
  const logger = new Logger().logger;

  let validParams: ValidGetMatchesQuery;
  try {
    validParams = validateParameters(event.queryStringParameters);
  } catch (err) {
    return {
      statusCode: err.code,
      body: JSON.stringify(err, null, 2)
    };
  }

  try {
    const getMatchesService = new GetMatchesService(api, logger);
    const response = await getMatchesService.startService(validParams);
    return {
      statusCode: response.statusCode,
      body: JSON.stringify(response.body, null, 2)
    };
  } catch (err) {
    if (err instanceof StasisError) {
      logger.error(err);
      return {
        statusCode: err.code,
        body: JSON.stringify(err, null, 2)
      };
    } else {
      logger.error(err);
      return {
        statusCode: 500,
        body: JSON.stringify({
          params: event.queryStringParameters,
          message: 'unknown error'
        })
      };
    }
  }
};
