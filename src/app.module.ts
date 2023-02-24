import { configurationService } from '@app/config';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRootAsync(configurationService.getThrottleConfig()),
    TypeOrmModule.forRootAsync(
      configurationService.getTypeOrmConfig(__dirname),
    ),
    HttpModule.register(configurationService.getHttpModuleConfig()),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
