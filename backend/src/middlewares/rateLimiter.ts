import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';
import { logger } from '../utils/logger';

let redis: Redis | null = null;

if (process.env.REDIS_URL) {
  try {
    redis = new Redis(process.env.REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 1 });
  } catch (error: any) {
    logger.warn('Redis initialization skipped:', error.message);
  }
} else if (process.env.REDIS_HOST) {
  try {
    redis = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      lazyConnect: true,
      maxRetriesPerRequest: 1
    });
  } catch (error: any) {
    logger.warn('Redis initialization skipped:', error.message);
  }
}

if (redis) {
  redis.on('error', (error: Error) => {
    logger.warn('Redis connection error, rate limiting fallback to memory:', error.message);
  });
  redis.on('connect', () => {
    logger.info('Redis connected successfully for rate limiting');
  });
}

const getStore = () => {
  if (redis && (redis.status === 'ready' || redis.status === 'connecting')) {
    try {
      return new RedisStore({
        // @ts-ignore
        sendCommand: async (command: string, ...args: string[]) => {
          try {
            if (redis && redis.status === 'ready') {
              return await redis.call(command, ...args);
            }
          } catch (e) {
            // Silently fallback if redis call fails
          }
          return null;
        },
      });
    } catch (error) {
      logger.warn('RedisStore initialization failed, using memory store:', error);
    }
  }
  return undefined; // In-memory store
};

// General API rate limiter
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per window
  message: {
    success: false,
    error: 'Too many requests, please try again later',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: getStore(),
  skip: (req) => {
    return req.path === '/health' || req.path === '/liveness' || req.path === '/readiness';
  }
});

// RAG specific rate limiter
export const ragRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // 100 queries per hour
  message: {
    success: false,
    error: 'RAG query limit exceeded. Please try again later.',
    code: 'RAG_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: getStore(),
});

// Upload rate limiter
export const uploadRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // 100 uploads per hour
  message: {
    success: false,
    error: 'Upload limit exceeded. Please try again later.',
    code: 'UPLOAD_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: getStore(),
});