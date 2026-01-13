import * as pinoHttpModule from 'pino-http';
import { Request } from 'express';
import { logger } from './logger.js';

/**
 * HTTP logger middleware com pino-http
 *
 * Características:
 * - Gera requestId automaticamente
 * - Redige (redact) dados sensíveis:
 *   - req.headers["x-api-key"]
 *   - req.headers.authorization
 * - Não loga body (evita expor payloads)
 * - Log automático de request/response com duration
 */

const PinoHttp = pinoHttpModule.default || pinoHttpModule;

export const httpLogger = PinoHttp({
  logger: logger,
  genReqId: () => {
    // Formato: timestamp-random
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },
  redact: {
    paths: [
      'req.headers.x-api-key',
      'req.headers.authorization',
      'req.headers["x-api-key"]',
    ],
    censor: '[REDACTED]',
  },
  autoLogging: {
    ignore: (req: Request) => {
      // Não logar health check (muito frequente)
      return req.url === '/health';
    },
  },
});

export default httpLogger;
