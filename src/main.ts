import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { Logger } from '@nestjs/common';
const env = process.env.NODE_ENV;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get('ConfigService') as ConfigService;
  const logger = app.get('NestWinston') as Logger;
  app.useLogger(logger);

  logger.verbose(`Application Starting on: ${config.apiPort}`, 'Main.bootstrap');
  await app.listen(config.apiPort);
}
bootstrap();
