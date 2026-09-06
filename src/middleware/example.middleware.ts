import type { RequestHandler } from 'express';
import { BadRequestError } from '@/utils/appError.js';

export const requireHeader = (name: string): RequestHandler => {
  const header = name.toLowerCase();
  return (req, _res, next) => {
    const value = req.headers[header];
    if (value == null || value === '') {
      throw new BadRequestError(`Missing required header: ${name}`);
    }
    next();
  };
};
