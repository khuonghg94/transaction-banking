import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices'
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const service = new ConfigService();
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [
        service.get('BROKER_URL')
      ],
      queue: service.get('QUEUE_NAME'),
      noAck: false,
      prefetchCount: 1
    }
  });
  await app.listen();
}
bootstrap();
