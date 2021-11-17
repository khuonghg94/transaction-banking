import { Test, TestingModule } from '@nestjs/testing';
import { RabbitMqService } from './rabbit-mq.service';
import {ClientsModule, Transport} from "@nestjs/microservices";
import { ConfigService } from '../config/config.service';

describe('RabbitMqService', () => {
  let service: RabbitMqService;
  let configService : ConfigService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[ClientsModule.register([
        {
          name: 'register-module',
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get('BROKER_URL'),
            ],
            queue: configService.get('QUEUE_NAME'),
          },
        },
      ])],
      providers: [RabbitMqService, ConfigService],
    }).compile();

    service = module.get<RabbitMqService>(RabbitMqService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
