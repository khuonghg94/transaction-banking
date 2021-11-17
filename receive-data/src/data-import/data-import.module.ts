import { Module } from '@nestjs/common';
import { RabbitMqModule } from '../rabbit-mq/rabbit-mq.module';
import { DataImportController } from './data-import.controller';
import { DataImportService } from './data-import.service';

@Module({
  imports: [RabbitMqModule],
  controllers: [DataImportController],
  providers: [DataImportService]
})
export class DataImportModule {}
