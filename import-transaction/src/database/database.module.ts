import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeormconfig = require('../config/typeormconfig');
function DatabaseOrmModule(): DynamicModule {
    return TypeOrmModule.forRootAsync({
        useFactory: typeormconfig
    })
}

@Module({
    imports: [
        DatabaseOrmModule()
    ]
})
export class DatabaseModule {}