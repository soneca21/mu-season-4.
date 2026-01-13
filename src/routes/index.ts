import { Express } from 'express';
import { router as healthRouter } from './health.route.js';

export function registerRoutes(app: Express) {
  app.use('/health', healthRouter);
}
