import { Test, TestingModule } from '@nestjs/testing';
import { RabbitMqModule } from '../rabbit-mq/rabbit-mq.module';
import { DataImportController } from './data-import.controller';
import { DataImportService } from './data-import.service';

describe('DataImportController', () => {
  let controller: DataImportController;
  let service: DataImportService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RabbitMqModule],
      controllers: [DataImportController],
      providers: [DataImportService]
    }).compile();

    controller = module.get<DataImportController>(DataImportController);
    service = module.get<DataImportService>(DataImportService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
