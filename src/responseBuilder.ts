import { APIGatewayProxyResult } from 'aws-lambda';


export function makeErrorResponse(statusCode: number, message: string): APIGatewayProxyResult {
  return {
    statusCode: statusCode,
    body: JSON.stringify({
      message: message
    })
  };
}
