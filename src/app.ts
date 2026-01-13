import express from 'express';
import { registerRoutes } from './routes/index.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();

app.use(express.json());

// Routes
registerRoutes(app);

// Error middleware (must be last)
app.use(errorMiddleware);

export default app;
