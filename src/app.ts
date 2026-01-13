import express from 'express';
import { registerRoutes } from './routes/index.js';

const app = express();

app.use(express.json());

// Routes
registerRoutes(app);

export default app;

// introduce an unused variable to cause ESLint error
const unusedVar = 42;
