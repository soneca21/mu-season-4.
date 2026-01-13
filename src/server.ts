import app from './app.js';
import config from './config/index.js';

try {
  const server = app.listen(config.PORT, () => {
    console.log(
      `✓ ${config.APP_NAME} running on port ${config.PORT} [${config.NODE_ENV}]`
    );
  });

  server.on('error', (err: unknown) => {
    console.error('Server error:', err);
    process.exit(1);
  });
} catch (err) {
  console.error('Failed to start server:', err);
  process.exit(1);
}
