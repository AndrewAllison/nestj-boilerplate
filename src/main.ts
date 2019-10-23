import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { Logger } from '@nestjs/common';

// https://docs.nestjs.com/techniques/security
import * as csurf from 'csurf';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
const env = process.env.NODE_ENV;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get('ConfigService') as ConfigService;
  const logger = app.get('NestWinston') as Logger;

  app.useLogger(logger);
  app.use(helmet());

  logger.verbose(
    `Application Starting on: ${config.apiPort}`,
    'Main.bootstrap',
  );

  app.enableCors();
  if (config.isCSURFEnabled) {
    app.use(csurf());
  }
  if (env === 'production') {
    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
      }),
    );
  }

  await app.listen(config.apiPort);
}
bootstrap();
