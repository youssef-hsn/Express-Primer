import { Router } from 'express';
import { checkHealth } from '@/controllers/health.controller.js';

export const healthRouter = Router();

healthRouter.get('/', checkHealth);
