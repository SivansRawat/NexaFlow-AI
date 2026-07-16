// // backend/src/utils/logger.ts
// import winston from 'winston';

// // Define log levels
// const levels = {
//   error: 0,
//   warn: 1,
//   info: 2,
//   http: 3,
//   debug: 4,
// };

// const level = () => {
//   const env = process.env.NODE_ENV || 'development';
//   const isDevelopment = env === 'development';
//   return isDevelopment ? 'debug' : 'warn';
// };

// // Define colors for each level
// const colors = {
//   error: 'red',
//   warn: 'yellow',
//   info: 'green',
//   http: 'magenta',
//   debug: 'white',
// };

// winston.addColors(colors);

// // Custom format
// const format = winston.format.combine(
//   winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
//   winston.format.colorize({ all: true }),
//   winston.format.printf(
//     (info) => `${info.timestamp} ${info.level}: ${info.message}`,
//   ),
// );

// // Define which transports to use
// const transports = [
//   new winston.transports.Console(),
//   new winston.transports.File({
//     filename: 'logs/error.log',
//     level: 'error',
//   }),
//   new winston.transports.File({
//     filename: 'logs/all.log',
//   }),
// ];

// // Create the logger instance
// export const logger = winston.createLogger({
//   level: level(),
//   levels,
//   format,
//   transports,
// });

// // Morgan integration for HTTP logging
// export const morganMiddleware = winston.createLogger({
//   level: 'http',
//   format: winston.format.combine(
//     winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
//     winston.format.printf(
//       (info) => `${info.timestamp} ${info.level}: ${info.message}`,
//     ),
//   ),
//   transports: [
//     new winston.transports.Console(),
//     new winston.transports.File({
//       filename: 'logs/http.log',
//     }),
//   ],
// });






// backend/src/utils/logger.ts
import winston from 'winston';
import fs from 'fs';
import path from 'path';

// Ensure logs directory exists
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// Custom format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Define which transports to use
const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: path.join(logDir, 'error.log'),
    level: 'error',
  }),
  new winston.transports.File({
    filename: path.join(logDir, 'all.log'),
  }),
];

// Create the logger instance
export const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

// Morgan integration for HTTP logging
export const morganMiddleware = winston.createLogger({
  level: 'http',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(logDir, 'http.log'),
    }),
  ],
});