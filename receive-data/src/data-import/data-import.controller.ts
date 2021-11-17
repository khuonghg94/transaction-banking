import {Controller, Post, UseInterceptors, UploadedFile, BadRequestException} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import { Multer } from 'multer';
import { DataImportService } from './data-import.service';

@Controller('data-import')
export class DataImportController {
    constructor(
        private readonly dataImportService: DataImportService,
    ) {
    }
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        fileFilter: (req: Request, file, cb) => {
            if (!file.originalname.match(/\.(csv|xlsx|xls)$/)) {
                return cb(new BadRequestException('Uploaded file must be csv or excel!'), false);
            }
            cb(null, true);
        }
    }))
    async uploadFile(@UploadedFile() file: Multer.File) {
        return this.dataImportService.uploadData(file.buffer);
    }
}
