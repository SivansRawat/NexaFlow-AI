// // backend/src/services/cacheService.ts
// import Redis from 'ioredis';
// import { logger } from '../utils/logger';

// export class CacheService {
//   private static instance: CacheService;
//   private redis: Redis;
//   private isConnected: boolean = false;

//   private constructor() {
//     this.redis = new Redis({
//       host: process.env.REDIS_HOST || 'localhost',
//       port: parseInt(process.env.REDIS_PORT || '6379'),
//       password: process.env.REDIS_PASSWORD,
//       retryStrategy: (times) => {
//         const delay = Math.min(times * 50, 2000);
//         return delay;
//       },
//     });

//     this.redis.on('connect', () => {
//       this.isConnected = true;
//       logger.info('Redis connected successfully');
//     });

//     this.redis.on('error', (error) => {
//       this.isConnected = false;
//       logger.error('Redis error:', error);
//     });
//   }

//   static getInstance(): CacheService {
//     if (!CacheService.instance) {
//       CacheService.instance = new CacheService();
//     }
//     return CacheService.instance;
//   }

//   async get<T>(key: string): Promise<T | null> {
//     if (!this.isConnected) return null;
//     try {
//       const data = await this.redis.get(key);
//       return data ? JSON.parse(data) : null;
//     } catch (error) {
//       logger.error(`Cache get error for key ${key}:`, error);
//       return null;
//     }
//   }

//   async set(key: string, value: any, ttl: number = 3600): Promise<boolean> {
//     if (!this.isConnected) return false;
//     try {
//       await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
//       return true;
//     } catch (error) {
//       logger.error(`Cache set error for key ${key}:`, error);
//       return false;
//     }
//   }

//   async delete(key: string): Promise<boolean> {
//     if (!this.isConnected) return false;
//     try {
//       await this.redis.del(key);
//       return true;
//     } catch (error) {
//       logger.error(`Cache delete error for key ${key}:`, error);
//       return false;
//     }
//   }

//   async deletePattern(pattern: string): Promise<number> {
//     if (!this.isConnected) return 0;
//     try {
//       const keys = await this.redis.keys(pattern);
//       if (keys.length === 0) return 0;
//       return await this.redis.del(...keys);
//     } catch (error) {
//       logger.error(`Cache delete pattern error for ${pattern}:`, error);
//       return 0;
//     }
//   }

//   async exists(key: string): Promise<boolean> {
//     if (!this.isConnected) return false;
//     try {
//       const result = await this.redis.exists(key);
//       return result === 1;
//     } catch (error) {
//       logger.error(`Cache exists error for key ${key}:`, error);
//       return false;
//     }
//   }

//   async increment(key: string, by: number = 1): Promise<number | null> {
//     if (!this.isConnected) return null;
//     try {
//       return await this.redis.incrby(key, by);
//     } catch (error) {
//       logger.error(`Cache increment error for key ${key}:`, error);
//       return null;
//     }
//   }

//   async getTTL(key: string): Promise<number | null> {
//     if (!this.isConnected) return null;
//     try {
//       return await this.redis.ttl(key);
//     } catch (error) {
//       logger.error(`Cache TTL error for key ${key}:`, error);
//       return null;
//     }
//   }
// }

// // Export singleton instance
// export const cacheService = CacheService.getInstance();







// backend/src/services/cacheService.ts
import Redis from 'ioredis';
import { logger } from '../utils/logger';

export class CacheService {
  private static instance: CacheService;
  private redis: Redis | null = null;
  private isConnected: boolean = false;
  private isRedisAvailable: boolean = true;

  private constructor() {
    try {
      this.redis = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        retryStrategy: (times: number) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
      });

      this.redis.on('connect', () => {
        this.isConnected = true;
        this.isRedisAvailable = true;
        logger.info('Redis connected successfully');
      });

      this.redis.on('error', (error: Error) => {
        this.isConnected = false;
        this.isRedisAvailable = false;
        logger.warn('Redis error:', error);
      });
    } catch (error) {
      logger.warn('Redis initialization failed, cache will be disabled:', error);
      this.isRedisAvailable = false;
      this.redis = null;
    }
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  private isAvailable(): boolean {
    return this.isRedisAvailable && this.redis !== null;
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isAvailable()) return null;
    try {
      const data = await this.redis!.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<boolean> {
    if (!this.isAvailable()) return false;
    try {
      await this.redis!.set(key, JSON.stringify(value), 'EX', ttl);
      return true;
    } catch (error) {
      logger.error(`Cache set error for key ${key}:`, error);
      return false;
    }
  }

  async delete(key: string): Promise<boolean> {
    if (!this.isAvailable()) return false;
    try {
      await this.redis!.del(key);
      return true;
    } catch (error) {
      logger.error(`Cache delete error for key ${key}:`, error);
      return false;
    }
  }

  async deletePattern(pattern: string): Promise<number> {
    if (!this.isAvailable()) return 0;
    try {
      const keys = await this.redis!.keys(pattern);
      if (keys.length === 0) return 0;
      return await this.redis!.del(...keys);
    } catch (error) {
      logger.error(`Cache delete pattern error for ${pattern}:`, error);
      return 0;
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.isAvailable()) return false;
    try {
      const result = await this.redis!.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`Cache exists error for key ${key}:`, error);
      return false;
    }
  }

  async increment(key: string, by: number = 1): Promise<number | null> {
    if (!this.isAvailable()) return null;
    try {
      return await this.redis!.incrby(key, by);
    } catch (error) {
      logger.error(`Cache increment error for key ${key}:`, error);
      return null;
    }
  }

  async getTTL(key: string): Promise<number | null> {
    if (!this.isAvailable()) return null;
    try {
      return await this.redis!.ttl(key);
    } catch (error) {
      logger.error(`Cache TTL error for key ${key}:`, error);
      return null;
    }
  }

  async flushAll(): Promise<boolean> {
    if (!this.isAvailable()) return false;
    try {
      await this.redis!.flushall();
      return true;
    } catch (error) {
      logger.error('Cache flush error:', error);
      return false;
    }
  }
}

// Export singleton instance
export const cacheService = CacheService.getInstance();