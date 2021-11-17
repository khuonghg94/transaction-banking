import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ImportDataDto } from './dto/import-data.dto';
import {getConnection} from "typeorm";
import {RmqContext} from "@nestjs/microservices";
import { BankTransactionEntity } from './entity/bank-transactions.entity';

@Injectable()
export class ImportTransactionService {
    async create(data: ImportDataDto[], context: RmqContext) {
        const channel = context.getChannelRef();
        const orginalMessage = context.getMessage();
        const listTransaction:BankTransactionEntity[] = [];
        data.forEach( item => {
            const transaction = new BankTransactionEntity();
            transaction.amount = item.amount;
            transaction.content = item.content;
            transaction.date = item.date;
            transaction.type = item.type;
            listTransaction.push(transaction);
        });
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into(BankTransactionEntity)
                .values(listTransaction)
                .execute();
            await queryRunner.commitTransaction();
        } catch (e) {
            await queryRunner.rollbackTransaction();
            channel.nack(orginalMessage);
            throw new InternalServerErrorException('Internal server error');
        } finally {
            await queryRunner.release();
            channel.ack(orginalMessage);
        }
        return 'OK';
    }
}
