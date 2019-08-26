import { APIGatewayProxyEvent } from 'aws-lambda';


export const eventMock: APIGatewayProxyEvent = {
  "body": null,
  "headers": {
    "Host": "localhost:3000",
    "User-Agent": "curl/7.54.0",
    "Accept": "*/*"
  },
  "httpMethod": "GET",
  "isBase64Encoded": false,
  "multiValueHeaders": {
    "Host": [
      "localhost:3000"
    ],
    "User-Agent": [
      "curl/7.54.0"
    ],
    "Accept": [
      "*/*"
    ]
  },
  "multiValueQueryStringParameters": {
    "gameId": [
      "177026851"
    ]
  },
  "path": "/get-one-match",
  "pathParameters": null,
  "queryStringParameters": {
    "name": ""
  },
  "requestContext": {
    "accountId": "offlineContext_accountId",
    "apiId": "offlineContext_apiId",
    "authorizer": {
      "principalId": "offlineContext_authorizer_principalId"
    },
    "httpMethod": "GET",
    "identity": {
      "accessKey": null,
      "accountId": "offlineContext_accountId",
      "apiKey": "offlineContext_apiKey",
      "apiKeyId": null,
      "caller": "offlineContext_caller",
      "cognitoAuthenticationProvider": "offlineContext_cognitoAuthenticationProvider",
      "cognitoAuthenticationType": "offlineContext_cognitoAuthenticationType",
      "cognitoIdentityId": "offlineContext_cognitoIdentityId",
      "cognitoIdentityPoolId": "offlineContext_cognitoIdentityPoolId",
      "sourceIp": "127.0.0.1",
      "user": "offlineContext_user",
      "userAgent": "curl/7.54.0",
      "userArn": "offlineContext_userArn"
    },
    "path": "",
    "requestId": "offlineContext_requestId_cjzs9iuir0007cook8x2k6a5l",
    "requestTimeEpoch": 1566815548263,
    "resourceId": "offlineContext_resourceId",
    "resourcePath": "/get-one-match",
    "stage": "dev"
  },
  "stageVariables": null,
  "resource": "",
};
