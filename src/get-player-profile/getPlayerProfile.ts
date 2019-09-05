import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { kayn } from '..//helper/intializeKayn';
import { makeErrorResponse, makeAPIErrorResponse, makeResponse } from '../helper/responseBuilder';
import { SummonerV4SummonerDTO } from 'kayn/typings/dtos';
import { DDragon } from '../helper/ddragon';


export const getPlayerProfile = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.queryStringParameters === null || !event.queryStringParameters.summonerId) {
    return makeErrorResponse(400, 'summonerId parameter is required.');
  }

  const summonerId = event.queryStringParameters.summonerId;
  let player: SummonerV4SummonerDTO;
  try {
    player = await kayn.Summoner.by.id(summonerId);
  } catch(error) {
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