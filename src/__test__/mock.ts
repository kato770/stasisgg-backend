import { APIGatewayProxyEvent } from 'aws-lambda';

export const eventMock: APIGatewayProxyEvent = {
  body: null,
  headers: {
    Host: 'localhost:3000',
    'User-Agent': 'curl/7.54.0',
    Accept: '*/*'
  },
  httpMethod: 'GET',
  isBase64Encoded: false,
  multiValueHeaders: {
    Host: ['localhost:3000'],
    'User-Agent': ['curl/7.54.0'],
    Accept: ['*/*']
  },
  multiValueQueryStringParameters: {
    gameId: ['177026851']
  },
  path: '/get-one-match',
  pathParameters: null,
  queryStringParameters: {
    name: ''
  },
  requestContext: {
    accountId: 'offlineContext_accountId',
    apiId: 'offlineContext_apiId',
    authorizer: {
      principalId: 'offlineContext_authorizer_principalId'
    },
    httpMethod: 'GET',
    protocol: 'HTTP/1.1',
    identity: {
      accessKey: null,
      accountId: 'offlineContext_accountId',
      apiKey: 'offlineContext_apiKey',
      apiKeyId: null,
      caller: 'offlineContext_caller',
      cognitoAuthenticationProvider:
        'offlineContext_cognitoAuthenticationProvider',
      cognitoAuthenticationType: 'offlineContext_cognitoAuthenticationType',
      cognitoIdentityId: 'offlineContext_cognitoIdentityId',
      cognitoIdentityPoolId: 'offlineContext_cognitoIdentityPoolId',
      principalOrgId: null,
      sourceIp: '127.0.0.1',
      user: 'offlineContext_user',
      userAgent: 'curl/7.54.0',
      userArn: 'offlineContext_userArn'
    },
    path: '',
    requestId: 'offlineContext_requestId_cjzs9iuir0007cook8x2k6a5l',
    requestTimeEpoch: 1566815548263,
    resourceId: 'offlineContext_resourceId',
    resourcePath: '/get-one-match',
    stage: 'dev'
  },
  stageVariables: null,
  resource: ''
};

export const versionsResponse = {
  data: [
    '9.23.1',
    '9.22.1',
    '9.21.1',
    '9.20.1',
    '9.19.1',
    '9.18.1',
    '9.17.1',
    '9.16.1',
    '9.15.1',
    '9.14.1',
    '9.13.1',
    '9.12.1',
    '9.11.1',
    '9.10.1',
    '9.9.1'
  ]
};
