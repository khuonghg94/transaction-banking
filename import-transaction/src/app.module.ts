import { Module } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import { DatabaseModule } from './database/database.module';
import { ImportTransactionModule } from './import-transaction/import-transaction.module';

@Module({
  imports: [
    DatabaseModule, 
    ImportTransactionModule,
  ],
  controllers: [],
  providers: [ConfigService],
})
export class AppModule {}
