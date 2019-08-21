import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';


export const hello: APIGatewayProxyHandler = async (event, _context) => {
  const name = event.queryStringParameters != null && event.queryStringParameters.name || 'Jhon';
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: name,
    }),
  };
};
