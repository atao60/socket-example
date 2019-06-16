import * as Joi from '@hapi/joi';
import { config as envConfig } from 'dotenv';

envConfig(); // will load values from .env to process.env

// define validation for all the env vars
const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string()
        .description("The application environment")
        .allow(['development', 'production', 'test', 'provision'])
        .default('development'),
    WS_CONTEXT: Joi.string()
        .description("WebSocket Server Context Path")
        .default(''),
    WS_HOST: Joi.string()
        .description("WebSocket Server Host")
        .default('localhost'),
    WS_PORT: Joi.number()
        .description("WebSocket Server Port")
        .default(4444),
    WS_PATH: Joi.string()
        .description("WebSocket Server Redirection Path")
        .default('')
}).unknown()
    .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
    throw new Error(`Configuration validation error: ${error.message}`);
}

const wsUrl = [
    'http://',
    envVars.WS_HOST,
    ':',
    envVars.WS_PORT,
    envVars.WS_PATH && envVars.WS_PATH[0] !== '/' ? '/' : '',
    envVars.WS_PATH
].join('');

export const config = {
    env: envVars.NODE_ENV,
    ws: {
        port: envVars.WS_PORT,
        url: wsUrl
    }
};
