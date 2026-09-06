import type { ErrorRequestHandler } from 'express';
import { isProduction } from '@/config/env.js';
import { logger } from '@/config/logger.js';
import { AppError } from '@/utils/appError.js';

type ErrorBody = {
  error: {
    message: string;
    status: number;
    data?: unknown;
  };
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;

  const message = isAppError || !isProduction ? (err as Error).message : 'Internal Server Error';

  if (statusCode >= 500) {
    logger.error('Unhandled request error', { err });
  }

  const body: ErrorBody = {
    error: {
      message,
      status: statusCode,
      data: isAppError ? err.data : undefined,
    },
  };

  res.status(statusCode).json(body);
};
