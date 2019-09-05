/* eslint-disable @typescript-eslint/no-explicit-any */
import { APIGatewayProxyResult } from 'aws-lambda';
import { KaynError } from 'kayn';


export function makeResponse(statusCode: number, params: { [name: string]: string } | null, message: any): APIGatewayProxyResult {
  return {
    statusCode: statusCode,
    body: JSON.stringify({
      params: params,
      message: message
    })
  };
}

export function makeErrorResponse(statusCode: number, message: string): APIGatewayProxyResult {
  return {
    statusCode: statusCode,
    body: JSON.stringify({
      message: message
    })
  };
}

export function makeAPIErrorResponse(err: KaynError): APIGatewayProxyResult {
  const responseBody = {
    url: err.error['options']['url'],
    requestHeaders: err.error['options']['headers'],
    responseBody: err.error['response']['body']
  };
  return {
    statusCode: err.error['response']['statusCode'],
    body: JSON.stringify(responseBody)
  };
}