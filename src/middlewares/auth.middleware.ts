import { Request, Response, NextFunction } from 'express';
import config from '../config/index.js';

/**
 * Auth middleware para validar API Key
 * Aplicado apenas às rotas /tasks
 */

export interface AuthenticatedRequest extends Request {
  apiKey?: string;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'] as string | undefined;

  if (!apiKey || apiKey !== config.API_KEY) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or missing API key',
      },
    });
  }

  req.apiKey = apiKey;
  next();
}
