import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import {plainToClass} from 'class-transformer';
import * as moment from 'moment';
import { RabbitMqService } from 'src/rabbit-mq/rabbit-mq.service';
import {utils, read} from 'xlsx';
import { DataImportDto } from './dto/data-import.dto';
import {validate} from 'class-validator';

@Injectable()
export class DataImportService {
    private readonly logger = new Logger(DataImportService.name);
    constructor(
        private readonly rabbitMQService: RabbitMqService
    ) {
    }
    async uploadData( buffer: Buffer) {
        const data = read(buffer, {type:'buffer', cellDates:true, dateNF:'DD/MM/YYYY HH:mm:ss'});
        const dataList: DataImportDto[] = [];
        let rowIndex = 0;
        let numberSuccess = 0;
        const sheetData = utils.sheet_to_json(data.Sheets[data.SheetNames[0]]);
        if (sheetData.length == 0) {
            throw new NotFoundException('There are not any rows in file');
        }
        const promise = new Promise((resolve) => {
                sheetData.forEach(async row => {
                    const rowData = {
                        date: moment(row['date'], "DD/MM/YYYY HH:mm:ss", true).toISOString(),
                        content: row['content'],
                        amount: row['amount'].toString(),
                        type: row['type']
                    }
                    const transaction = plainToClass(
                        DataImportDto,
                        rowData,
                    );
                    validate(transaction).then(error => {
                        if (error.length > 0) {
                            this.logger.error('Error in record ' + rowIndex + ': ' + error);
                        } else {
                            numberSuccess++;
                            dataList.push(transaction);
                        }
                        rowIndex++
                        if (rowIndex == sheetData.length - 1) {
                            resolve("OK");
                        }
                    })

                })
            }
        );

        await promise.then(async () => {
                const size = 100;
                const total = Math.ceil(dataList.length / size);
                for (let i = 0; i < total; i++) {
                    this.rabbitMQService.send('rabbitmq-producer', dataList.slice(i * size, i * size + size));
                }
            }
        )
        return { result : { numberRecords: sheetData.length, validRecords: numberSuccess }, message: 'Import transaction done' };
    }
}
