import { Controller } from '@nestjs/common';
import { ImportTransactionService } from './import-transaction.service';
import {Ctx, MessagePattern, Payload, RmqContext} from '@nestjs/microservices';
import { ImportDataDto } from './dto/import-data.dto';

@Controller('import-transaction')
export class ImportTransactionController {
    constructor(private readonly importTransactionService: ImportTransactionService) {
    }

    @MessagePattern('rabbitmq-producer')
    create(@Payload() data: ImportDataDto[], @Ctx() context: RmqContext) {
        return this.importTransactionService.create(data, context);
    }
}
