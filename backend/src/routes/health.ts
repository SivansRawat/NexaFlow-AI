// backend/src/routes/health.ts
import express from 'express';
import { healthCheck, readinessCheck, livenessCheck } from '../controllers/healthController';

const router = express.Router();

// Health check endpoints
router.get('/health', healthCheck);
router.get('/readiness', readinessCheck);
router.get('/liveness', livenessCheck);

export default router;