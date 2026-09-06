import { Router } from 'express';
import { exampleRouter } from '@/routes/v1/example.routes.js';
import { healthRouter } from '@/routes/v1/health.routes.js';

export const v1Router = Router();

v1Router.use('/health', healthRouter);
v1Router.use('/examples', exampleRouter);
