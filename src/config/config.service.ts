import * as dotenv from 'dotenv';
import * as Joi from '@hapi/joi';
import * as fs from 'fs';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { loggerConfig } from './logger.config';

export interface EnvConfig {
  [ key: string ]: string;
}

export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(filePath: string) {
    const config = dotenv.parse(fs.readFileSync(filePath));
    this.envConfig = this.validateInput(config);
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      API_AUTH_ENABLED: Joi.boolean().required(),
      CSURF_ENABLED: Joi.boolean().default(false),
      LOG_LEVEL: Joi.string().default('debug'),
      NODE_ENV: Joi.string()
        .valid('develop', 'production', 'test')
        .default('develop'),
      PORT: Joi.number().default(3000),
      POSTGRES_HOST: Joi.string().default('localhost'),
      POSTGRES_USER: Joi.string().required(),
      POSTGRES_PASSWORD: Joi.string().required(),
      POSTGRES_DATABASE: Joi.string().required(),
      POSTGRES_PORT: Joi.string().required(),
      RUN_MIGRATIONS: Joi.boolean().default(false),
    });

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  get isApiAuthEnabled(): boolean {
    return Boolean(this.envConfig.API_AUTH_ENABLED);
  }

  get isCSURFEnabled(): boolean {
    return Boolean(this.envConfig.CSURF_ENABLED);
  }

  get apiPort(): number {
    return Number(this.envConfig.PORT);
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',

      host: this.envConfig.POSTGRES_HOST,
      port: Number(this.envConfig.POSTGRES_PORT),
      username: this.envConfig.POSTGRES_USER,
      password: this.envConfig.POSTGRES_PASSWORD,
      database: this.envConfig.POSTGRES_DATABASE,

      entities: ['**/*.entity{.ts,.js}'],

      migrationsTableName: 'migration',

      migrations: ['src/migration/*.ts'],

      cli: {
        migrationsDir: 'src/migration',
      },

      ssl: this.envConfig.NODE_ENV === 'production',
    };
  }

  public getLoggerConfig() {
    return loggerConfig;
  }
}

const configService = new ConfigService(`.${process.env.NODE_ENV || 'develop'}.env`);
export { configService };
