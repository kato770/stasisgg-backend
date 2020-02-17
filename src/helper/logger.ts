import * as winston from 'winston';

export class Logger {
  public logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      transports: new winston.transports.Console(),
      format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.json(),
        winston.format.prettyPrint()
      )
    });
  }
}
