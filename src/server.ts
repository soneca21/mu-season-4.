import app from './app.js';

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

try {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  server.on('error', (err: unknown) => {
    console.error('Server error:', err);
    process.exit(1);
  });
} catch (err) {
  console.error('Failed to start server:', err);
  process.exit(1);
}
