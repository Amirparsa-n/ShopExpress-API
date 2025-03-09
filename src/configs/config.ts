import dotenv from 'dotenv';
dotenv.config();

export const port = process.env.PORT;
export const isProduction = process.env.NODE_ENV === 'production';

export const redisURI = process.env.REDIS_URL;
export const mongoURI = process.env.MONGODB_URI;


// Auth
export const jwtSecretKey = process.env.JWT_SECRET;
