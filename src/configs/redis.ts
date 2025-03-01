import { Redis } from 'ioredis';
import { redisURI } from './config';

const redis = new Redis(redisURI as string);

export default redis;
