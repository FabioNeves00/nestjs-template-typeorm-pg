import { HttpModuleOptions } from '@nestjs/axios';
import { ThrottlerAsyncOptions } from '@nestjs/throttler';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { join } from 'path';

export class ConfigurationService {
  constructor(private env: { [k: string]: string | undefined }) {}

  public getValue(key: string, defaultValue?: string): string {
    const value = this.env[key];
    if (value === undefined && defaultValue === undefined) {
      throw new Error(`config error - missing env.${key}`);
    }

    if (value === undefined) {
      return defaultValue || '';
    }

    return value;
  }

  public isTest() {
    const mode = this.getValue('NODE_ENV');
    return mode === 'test';
  }

  public isProduction() {
    const mode = this.getValue('NODE_ENV');
    return mode === 'production';
  }

  public isDevelopment() {
    return !this.isProduction();
  }

  public getTypeOrmConfig(rootDir: string): TypeOrmModuleAsyncOptions {
    return {
      useFactory: () => ({
        type: 'postgres',
        host: this.getValue('POSTGRES_HOST'),
        port: parseInt(this.getValue('POSTGRES_PORT'), 10),
        username: this.getValue('POSTGRES_USER'),
        password: this.getValue('POSTGRES_PASSWORD'),
        database: this.getValue('POSTGRES_DB'),
        migrationsTableName: 'migrations',
        autoLoadEntities: true,
        migrations: [
          join(rootDir, 'migration/*{.ts,.js}'),
          join(rootDir, 'src/migration/*{.ts,.js}'),
        ],
        extra: {
          ssl: this.getValue('SSL_MODE'),
        },

        entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
        synchronize: true,
      }),
    };
  }

  public getThrottleConfig(): ThrottlerAsyncOptions {
    return {
      useFactory: () => ({
        ttl: 60 * 20,
        limit: 50,
      }),
    };
  }

  public getHttpModuleConfig(): HttpModuleOptions {
    return {
      timeout: 5000,
      maxRedirects: 5,
    };
  }
}

const configurationService = new ConfigurationService(process.env);

export { configurationService };
