import { Module } from '@nestjs/common';
import {MulterModule} from '@nestjs/platform-express';
import { DataImportModule } from './data-import/data-import.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { ConfigService } from './config/config.service';
import { RabbitMqModule } from './rabbit-mq/rabbit-mq.module';

@Module({
  imports: [
    DataImportModule,
    MulterModule.register(),
    RabbitMqModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    ConfigService
  ],
})
export class AppModule {}
