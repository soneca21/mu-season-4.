import express from 'express';
import { registerRoutes } from './routes/index.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { httpLogger } from './logger/http-logger.js';

const app = express();

// HTTP logger (must be early)
app.use(httpLogger);

app.use(express.json());

// Routes
registerRoutes(app);

// Error middleware (must be last)
app.use(errorMiddleware);

export default app;
