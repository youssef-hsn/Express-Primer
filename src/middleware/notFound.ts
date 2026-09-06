import type { RequestHandler } from 'express';
import { NotFoundError } from '@/utils/appError.js';

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new NotFoundError(`Cannot ${req.method} ${req.originalUrl}`));
};
