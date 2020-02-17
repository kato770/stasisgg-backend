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
