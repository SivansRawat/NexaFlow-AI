import Redis from 'ioredis';

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
const redisPassword = process.env.REDIS_PASSWORD || undefined;

export const redis = new Redis({
  host: redisHost,
  port: redisPort,
  password: redisPassword,
  lazyConnect: true, // Don't throw unhandled errors if Redis container is offline
  retryStrategy(times) {
    // Retry up to 5 times with exponential backoff
    if (times > 5) {
      console.warn('⚠️ Redis connection retry limit reached. Redis will operate in fallback mode.');
      return null; // Stop retrying
    }
    return Math.min(times * 200, 2000);
  },
});

redis.on('connect', () => {
  console.log('✅ Connected to Redis successfully');
});

redis.on('error', (err) => {
  console.error('❌ Redis Connection Error:', err.message);
});

export default redis;
