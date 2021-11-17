import {ConnectionOptions} from 'typeorm';
import { ConfigService } from './config.service';

const configService = new ConfigService();
const configPromise = new Promise<ConnectionOptions>(async resolve => {
    const config: ConnectionOptions = {
        type: configService.get('DB_TYPE') || '',
        host: configService.get('DB_HOST') || '',
        port: configService.get('DB_PORT') || '',
        username: configService.get('DB_USER') || '',
        password: configService.get('DB_PASSWORD') || '',
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: configService.get('DB_LOGGING'),
        timezone: configService.get('DB_TIMEZONE'),

        // Run migrations automatically,
        // you can disable this if you prefer running migration manually.
        migrationsRun: false,

        // Allow both start:prod and start:dev to use migrations
        // __dirname is either dist or src folder, meaning either
        // the compiled js in prod or the ts in dev.
        migrations: [
            __dirname + '/migrations/**/*{.ts,.js}'
        ],
        cli: {
            // Location of migration should be inside src folder
            // to be compiled into dist/ folder.
            migrationsDir: 'src/migrations',
        },
    };
    resolve(config);
});

export = async () => {
    return await configPromise
};
