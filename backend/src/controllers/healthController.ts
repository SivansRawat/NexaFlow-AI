// backend/src/controllers/healthController.ts
import { Request, Response } from 'express';
import os from 'os';
import prisma from '../lib/prisma';
import { cacheService } from '../services/cacheService';
import { logger } from '../utils/logger';

export const healthCheck = async (req: Request, res: Response) => {
  try {
    const startTime = Date.now();
    
    // Check database
    let dbHealthy = false;
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbHealthy = true;
    } catch (error) {
      logger.error('Database health check failed:', error);
    }

    // Check Redis cache
    let cacheHealthy = false;
    try {
      const testKey = 'health:test';
      await cacheService.set(testKey, 'ok', 10);
      const result = await cacheService.get(testKey);
      if (result === 'ok') {
        cacheHealthy = true;
      }
      await cacheService.delete(testKey);
    } catch (error) {
      logger.error('Cache health check failed:', error);
    }

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: `${Date.now() - startTime}ms`,
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(os.totalmem() / 1024 / 1024),
        free: Math.round(os.freemem() / 1024 / 1024),
      },
      cpu: {
        cores: os.cpus().length,
        load: os.loadavg(),
      },
      services: {
        database: {
          status: dbHealthy ? 'healthy' : 'unhealthy',
          message: dbHealthy ? 'Connected' : 'Connection failed',
        },
        cache: {
          status: cacheHealthy ? 'healthy' : 'degraded',
          message: cacheHealthy ? 'Connected' : 'Cache unavailable',
        },
      },
      environment: process.env.NODE_ENV || 'development',
    };

    const isHealthy = dbHealthy;
    const statusCode = isHealthy ? 200 : 503;

    res.status(statusCode).json(health);
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: 'Health check failed',
      timestamp: new Date().toISOString(),
    });
  }
};

export const readinessCheck = async (req: Request, res: Response) => {
  const checks = {
    database: false,
    cache: false,
  };

  // Check database
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = true;
  } catch (error) {
    logger.error('Readiness - Database check failed:', error);
  }

  // Check cache (optional for readiness)
  try {
    await cacheService.set('readiness:test', 'ok', 5);
    checks.cache = true;
  } catch (error) {
    logger.warn('Readiness - Cache check failed (non-critical):', error);
    checks.cache = true; // Cache is optional
  }

  const isReady = checks.database;

  res.status(isReady ? 200 : 503).json({
    ready: isReady,
    checks,
    timestamp: new Date().toISOString(),
  });
};

export const livenessCheck = (req: Request, res: Response) => {
  res.status(200).json({
    alive: true,
    timestamp: new Date().toISOString(),
  });
};