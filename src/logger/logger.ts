import pino from 'pino';
import config from '../config/index.js';

/**
 * Logger singleton com níveis configuráveis por NODE_ENV
 *
 * - development: debug (todos os logs)
 * - test: silent (nenhum log)
 * - production: info (info, warn, error)
 */

function getLogLevel(): string {
  switch (config.NODE_ENV) {
    case 'development':
      return 'debug';
    case 'test':
      return 'silent';
    case 'production':
      return 'info';
    default:
      return 'info';
  }
}

export const logger = pino({
  level: getLogLevel(),
  transport:
    config.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
});

export default logger;
