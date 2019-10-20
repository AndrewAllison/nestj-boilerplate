import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

const logLevel = process.env.LOG_LEVEL || 'debug';
const env = process.env.NODE_ENV || 'develop';

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

// https://docs.nestjs.com/techniques/logger
// https://stackify.com/winston-logging-tutorial/
// https://github.com/gremo/nest-winston
// https://github.com/winstonjs/winston
@Module({
  imports: [
    ConfigModule,
    WinstonModule.forRoot({
      format: alignedWithColorsAndTime,
      transports: [new winston.transports.Console()],
      level: logLevel,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
