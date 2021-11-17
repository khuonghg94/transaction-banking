import {parse} from 'dotenv';
import * as fs from 'fs';
import * as Joi from '@hapi/joi';
import {Logger} from '@nestjs/common';

export interface EnvConfig {
    [key: string]: string;
}

export class ConfigService {
    private readonly envConfig: EnvConfig;

    constructor(filePath = '.env') {
        if (fs.existsSync(filePath)) {
            this.envConfig = this.validateConfig(parse(fs.readFileSync(filePath)));
        } else {
            this.envConfig = this.validateConfig(process.env);
        }
    }

    public get(key: string): any {
        return this.envConfig[key];
    }

    public set(key: string, value: any) {
        try {
            if ((key in this.envConfig)) {
                this.envConfig[key] = value;
            }
        } catch (error) {
            Logger.error('[ConfigService.set ERROR]', error);
        }
    }

    private validateConfig(envConfig: EnvConfig) {
        const envSchema = Joi.object({
            BROKER_URL: Joi.string().default(''),
            QUEUE_NAME: Joi.string().default(''),
            // Authentication server config
            AUTH_SERVER_URL: Joi.string().default(''),
        }).unknown(true);

        const {error, value} = envSchema.validate(envConfig);

        if (error) {
            throw new Error(`Config validation error: ${error.message}`);
        }
        return value;
    }
}
