import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigService } from './config/config.service';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [],
  providers: [ConfigService],
})
export class AppModule {}
