// import { APIGatewayProxyResult } from 'aws-lambda';
// import { RiotApiTwisted } from '../infrastructure/riotApiTwisted';
// import { Logger } from '../helper/logger';
import { GetPlayerProfileQuery, convertStrToRegions } from 'stasisgg-types';
import { StasisError } from '../helper/error';
import { GetPlayerProfileService } from './getPlayerProfileService';
import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import { RiotApiTwisted } from '../infrastructure/riotApiTwisted';
import { Logger } from '../helper/logger';

export type ValidGetPlayerProfileQuery = Required<GetPlayerProfileQuery>;

export const validateParameters = (
  params: {
    [name: string]: string;
  } | null
): ValidGetPlayerProfileQuery => {
  if (params === null || !params.summonerName || !params.region) {
    throw new StasisError(
      400,
      params,
      'summonerName and Region parameters are required.'
    );
  }
  const region = convertStrToRegions(params.region.toUpperCase());
  if (!region) {
    throw new StasisError(400, params, `regin must be valid value.`);
  }
  return {
    summonerName: params.summonerName,
    region: region
  };
};

export const getPlayerProfileHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const api = new RiotApiTwisted();
  const logger = new Logger().logger;

  let validParams: ValidGetPlayerProfileQuery;
  try {
    validParams = validateParameters(event.queryStringParameters);
  } catch (err) {
    return {
      statusCode: err.code,
      body: JSON.stringify(err, null, 2)
    };
  }

  try {
    const getPlayerProfileService = new GetPlayerProfileService(api, logger);
    const response = await getPlayerProfileService.startService(validParams);
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
