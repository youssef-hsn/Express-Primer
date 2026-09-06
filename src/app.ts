import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { isProduction } from '@/config/env.js';
import { morganStream } from '@/config/logger.js';
import { errorHandler } from '@/middleware/errorHandler.js';
import { notFoundHandler } from '@/middleware/notFound.js';
import { rootRouter } from '@/routes/index.js';

export const createApp = (): Express => {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(morgan(isProduction ? 'combined' : 'dev', { stream: morganStream }));

  app.use(rootRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
