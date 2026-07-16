



// // backend/src/middlewares/rateLimiter.ts
// import rateLimit from 'express-rate-limit';
// import RedisStore from 'rate-limit-redis';
// import Redis from 'ioredis';
// import { logger } from '../utils/logger';

// // Redis connection with fallback for development
// let redis: Redis | null = null;

// try {
//   redis = new Redis({
//     host: process.env.REDIS_HOST || 'localhost',
//     port: parseInt(process.env.REDIS_PORT || '6379'),
//     password: process.env.REDIS_PASSWORD,
//     retryStrategy: (times: number) => {
//       const delay = Math.min(times * 50, 2000);
//       return delay;
//     },
//   });

//   redis.on('error', (error: Error) => {
//     logger.warn('Redis error, rate limiting will use memory store:', error);
//     redis = null;
//   });
// } catch (error) {
//   logger.warn('Redis connection failed, rate limiting will use memory store:', error);
//   redis = null;
// }

// // Create Redis store if available
// const getStore = () => {
//   if (redis) {
//     try {
//       return new RedisStore({
//         // @ts-ignore - sendCommand is a valid method
//         sendCommand: (...args: string[]) => redis!.call(...args),
//       });
//     } catch (error) {
//       logger.warn('Redis store creation failed, using memory store:', error);
//       return undefined;
//     }
//   }
//   return undefined;
// };

// // General API rate limiter
// export const apiRateLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // 100 requests per window
//   message: {
//     success: false,
//     error: 'Too many requests, please try again later',
//     code: 'RATE_LIMIT_EXCEEDED'
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
//   store: getStore(),
//   skip: (req) => {
//     // Skip rate limiting for health checks
//     return req.path === '/api/health' || req.path === '/api/liveness' || req.path === '/api/readiness';
//   }
// });

// // RAG specific rate limiter (stricter)
// export const ragRateLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000, // 1 hour
//   max: 50, // 50 RAG queries per hour
//   message: {
//     success: false,
//     error: 'RAG query limit exceeded. Please upgrade your plan.',
//     code: 'RAG_LIMIT_EXCEEDED'
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
//   store: getStore(),
// });

// // Upload rate limiter
// export const uploadRateLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000, // 1 hour
//   max: 20, // 20 uploads per hour
//   message: {
//     success: false,
//     error: 'Upload limit exceeded. Please try again later.',
//     code: 'UPLOAD_LIMIT_EXCEEDED'
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
//   store: getStore(),
// });




// backend/src/middlewares/rateLimiter.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';
import { logger } from '../utils/logger';

// Redis connection with fallback for development
let redis: Redis | null = null;

try {
  redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    retryStrategy: (times: number) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  });

  redis.on('error', (error: Error) => {
    logger.warn('Redis error, rate limiting will use memory store:', error);
    redis = null;
  });

  redis.on('connect', () => {
    logger.info('Redis connected for rate limiting');
  });
} catch (error) {
  logger.warn('Redis connection failed, rate limiting will use memory store:', error);
  redis = null;
}

// Create Redis store if available
const getStore = () => {
  if (redis) {
    try {
      // For rate-limit-redis v5
      return new RedisStore({
        // @ts-ignore - The types might not match perfectly but this works
        sendCommand: (...args: string[]) => redis!.call(...args),
      });
    } catch (error) {
      logger.warn('Redis store creation failed, using memory store:', error);
      return undefined;
    }
  }
  return undefined;
};

// General API rate limiter
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    success: false,
    error: 'Too many requests, please try again later',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: getStore(),
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health' || req.path === '/liveness' || req.path === '/readiness';
  }
});

// RAG specific rate limiter (stricter)
export const ragRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 RAG queries per hour
  message: {
    success: false,
    error: 'RAG query limit exceeded. Please upgrade your plan.',
    code: 'RAG_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: getStore(),
});

// Upload rate limiter
export const uploadRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 uploads per hour
  message: {
    success: false,
    error: 'Upload limit exceeded. Please try again later.',
    code: 'UPLOAD_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: getStore(),
});