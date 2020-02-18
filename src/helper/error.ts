export class StasisError extends Error {
  code: number;
  params: { [name: string]: boolean | number | string | undefined } | null;
  detail: string;
  constructor(
    statusCode: number,
    params: { [name: string]: boolean | number | string | undefined } | null,
    message: string
  ) {
    super(message);
    this.params = params;
    this.code = statusCode;
    this.name = 'StasisError';
    this.detail = message;
  }
}

export class ApiError extends Error {
  code: number;
  constructor(message?: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class ApiKeyNotFoundError extends ApiError {
  constructor(message?: string) {
    super(message);
    this.code = 403;
  }
}

export class ApiNotFoundError extends ApiError {
  constructor(message?: string) {
    super(message);
    this.code = 404;
  }
}

export class ApiRateLimitError extends ApiError {
  constructor(message?: string) {
    super(message);
    this.code = 429;
  }
}

export class ApiServiceUnavailable extends ApiError {
  constructor(message?: string) {
    super(message);
    this.code = 503;
  }
}
