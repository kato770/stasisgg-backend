import { GetOneMatchCardQuery, convertStrToRegions } from 'stasisgg-types';
import { StasisError } from '../helper/error';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Logger } from '../helper/logger';
import { RiotApiTwisted } from '../infrastructure/riotApiTwisted';
import { GetOneMatchCardService } from './getOneMatchCardService';
import { DDragon } from '../helper/ddragon';

export type ValidGetOneMatchCardQuery = Required<GetOneMatchCardQuery>;

export const validateParameters = (
  params: {
    [name: string]: string;
  } | null
): ValidGetOneMatchCardQuery => {
  if (
    params === null ||
    !params.summonerId ||
    !params.gameId ||
    !params.region
  ) {
    throw new StasisError(
      400,
      params,
      'summonerId, gameId, and region parameters are required.'
    );
  }

  const gameId = parseInt(params.gameId);
  if (!gameId) {
    throw new StasisError(400, params, 'gameId must be int.');
  }

  const region = convertStrToRegions(params.region.toUpperCase());
  if (!region) {
    throw new StasisError(400, params, `regin must be valid value.`);
  }

  return {
    summonerId: params.summonerId,
    gameId: gameId,
    region: region
  };
};

export const getOneMatchCardHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const api = new RiotApiTwisted();
  const ddragon = new DDragon();
  const logger = new Logger().logger;

  let validParams: ValidGetOneMatchCardQuery;
  try {
    validParams = validateParameters(event.queryStringParameters);
  } catch (err) {
    return {
      statusCode: err.code,
      body: JSON.stringify(err, null, 2)
    };
  }

  try {
    const getMatchesService = new GetOneMatchCardService(api, ddragon, logger);
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
