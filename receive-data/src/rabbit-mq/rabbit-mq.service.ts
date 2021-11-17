import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitMqService {
    constructor(
        @Inject('register-module') private readonly client: ClientProxy,
    ) {}

    async send(pattern: string, data: any) {
        this.client.emit<any>(pattern, data);
    }
    
    async onApplicationBootstrap() {
        await this.client.connect();
    }
  
}
