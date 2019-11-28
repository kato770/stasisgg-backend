import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { REGIONS } from 'kayn';
import { kayn } from '../helper/initializeKayn';
import { makeErrorResponse, makeAPIErrorResponse, makeResponse } from '../helper/responseBuilder';
import { SummonerV4SummonerDTO } from 'kayn/typings/dtos';
import { DDragon } from '../helper/ddragon';


export const getPlayerProfile = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.queryStringParameters === null || !event.queryStringParameters.summonerName || !event.queryStringParameters.region) {
    return makeErrorResponse(400, 'summonerName and region parameter are required.');
  }

  const region = event.queryStringParameters.region;
  if (!Object.values(REGIONS).find(value => value === region)) {
    return makeErrorResponse(400, `${region} must be one of ${Object.values(REGIONS)}`);
  }

  const summonerName = event.queryStringParameters.summonerName;
  let player: SummonerV4SummonerDTO;
  try {
    player = await kayn.Summoner.by.name(summonerName).region(region);
  } catch(error) {
    // if ${summonerName} doesn't exist in riot server, this return 404 status code
    return makeAPIErrorResponse(error);
  }

  if (!player.id || !player.profileIconId || !player.summonerLevel) {
    return makeErrorResponse(404, 'player information are missing.');
  }

  const ddragon = new DDragon();
  const profileIconURL = await ddragon.getProfileIconURL(player.profileIconId);

  const responseBody = {
    summonerId: player.id,
    profileIconURL: profileIconURL,
    summonerName: player.name,
    summonerLevel: player.summonerLevel
  };

  return makeResponse(200, event.queryStringParameters, responseBody);
};