import { Inject, Module } from '@nestjs/common';
import { RabbitMqService } from './rabbit-mq.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '../config/config.service';

const configService = new ConfigService();
@Module({
  imports: [
    ClientsModule.register([
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
    ]),
  ],
  controllers: [],
  providers: [
      RabbitMqService
  ],
  exports: [RabbitMqService],
})
export class RabbitMqModule {}
