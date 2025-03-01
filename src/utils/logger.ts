// import { isProduction, mongoDB } from '@configs/config';
// import winston from 'winston';
// import { MongoDB } from 'winston-mongodb';
// require('winston-mongodb');

// const logger = winston.createLogger({
//     level: 'info',
//     // format: logFormat,
//     format: winston.format.json(),
//     transports: [
//         new winston.transports.File({
//             filename: 'logs/errors.log',
//             level: 'error',
//         }),
//         new winston.transports.File({
//             filename: 'logs/all.log',
//         }),
//         new winston.transports.MongoDB({
//             db: mongoDB.uri as string,
//             level: 'error',
//             collection: 'logs',
//         }),
//     ],
// });

// export function log(options: { message: string; [key: string]: any }) {
//     logger.log({ level: 'info', ...options });
// }

// if (!isProduction) {
//     logger.add(
//         new winston.transports.Console({
//             format: winston.format.simple(),
//         })
//     );
// }
