import app from './app.js';
import config from './config/index.js';
import { logger } from './logger/logger.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf-8')
);

try {
  const server = app.listen(config.PORT, () => {
    logger.info(
      {
        appName: config.APP_NAME,
        port: config.PORT,
        nodeEnv: config.NODE_ENV,
        version: packageJson.version,
      },
      'Server started'
    );
  });

  server.on('error', (err: unknown) => {
    logger.error(
      {
        errorMessage: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      },
      'Server error'
    );
    process.exit(1);
  });
} catch (err) {
  logger.error(
    {
      errorMessage: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    },
    'Failed to start server'
  );
  process.exit(1);
}

