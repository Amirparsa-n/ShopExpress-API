/* eslint-disable n/no-process-env */
import { Config } from '@fullstacksjs/config';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config();

// Define a global variable for the public directory path
const publicDir = path.join(__dirname, '..', '..', 'public');

const schema = new Config({
    isProduction: Config.boolean().required(),
    port: Config.number({ default: 3000 }),
    BASE_URL: Config.string().required(),
    redisURI: Config.string().required(),
    mongoURI: Config.string().required(),
    jwtSecretKey: Config.string().required(),
});

const config = schema.parse({
    isProduction: process.env.NODE_ENV === 'production',
    port: process.env.PORT,
    BASE_URL: process.env.BASE_URL,
    redisURI: process.env.REDIS_URL,
    mongoURI: process.env.MONGODB_URI,
    jwtSecretKey: process.env.JWT_SECRET,
});

export { config, publicDir };
