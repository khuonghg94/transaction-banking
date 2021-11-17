import { Module } from '@nestjs/common';
import { ImportTransactionController } from './import-transaction.controller';
import { ImportTransactionService } from './import-transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankTransactionEntity } from './entity/bank-transactions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BankTransactionEntity])],
  controllers: [ImportTransactionController],
  providers: [ImportTransactionService],
  exports: [ImportTransactionService],
})
export class ImportTransactionModule {}
