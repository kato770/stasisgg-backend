import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { kayn } from '..//helper/intializeKayn';
import { makeErrorResponse, makeAPIErrorResponse, makeResponse } from '../helper/responseBuilder';
import { SummonerV4SummonerDTO } from 'kayn/typings/dtos';
import { DDragon } from '../helper/ddragon';


export const getPlayerProfile = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.queryStringParameters === null || !event.queryStringParameters.summonerName) {
    return makeErrorResponse(400, 'summonerName parameter is required.');
  }

  const summonerName = event.queryStringParameters.summonerName;
  let player: SummonerV4SummonerDTO;
  try {
    player = await kayn.Summoner.by.name(summonerName);
  } catch(error) {
    // if ${summonerName} does't exist in riot server, this return 404 status code
    return makeAPIErrorResponse(error);
  }

  if (!player.name || !player.profileIconId || !player.summonerLevel) {
    return makeErrorResponse(404, 'player information are missing.');
  }

  const ddragon = new DDragon();
  const profileIconURL = await ddragon.getProfileIconURL(player.profileIconId);

  const responseBody = {
    profileIconURL: profileIconURL,
    summonerName: player.name,
    summonerLevel: player.summonerLevel
  };

  return makeResponse(200, event.queryStringParameters, responseBody);
};