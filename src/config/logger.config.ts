import * as winston from 'winston';
// https://docs.nestjs.com/techniques/logger
// https://stackify.com/winston-logging-tutorial/
// https://github.com/gremo/nest-winston
// https://github.com/winstonjs/winston

const env = process.env.NODE_ENV || 'develop';
const logLevel = process.env.LOG_LEVEL || 'debug';

const alignedWithColorsAndTime = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.align(),
  winston.format.printf(info => {
    const { timestamp, level, message, ...extra } = info;

    return `${timestamp} [${env}] [${level}]: ${message} ${
      Object.keys(extra).length ? JSON.stringify(extra, null, 2) : ''
    }`;
  }),
);

const loggerConfig = {
  format: alignedWithColorsAndTime,
  transports: [new winston.transports.Console()],
  level: logLevel,
};
export { loggerConfig };
