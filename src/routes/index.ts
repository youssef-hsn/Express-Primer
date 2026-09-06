import { Router } from 'express';
import { v1Router } from '@/routes/v1/index.js';

export const rootRouter = Router();

rootRouter.use('/v1', v1Router);
