import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { BadRequestError } from '@/utils/appError.js';

type ValidationTarget = 'body' | 'query' | 'params';

export function validate<T>(
  schema: ZodType<T>,
  target: 'query',
): RequestHandler<Record<string, string>, unknown, unknown, T>;

export function validate<T>(
  schema: ZodType<T>,
  target: 'params',
): RequestHandler<T, unknown, unknown, unknown>;

export function validate<T>(
  schema: ZodType<T>,
  target?: 'body',
): RequestHandler<Record<string, string>, unknown, T>;

export function validate<T>(schema: ZodType<T>, target: ValidationTarget = 'body'): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      const message = result.error.issues
        .map((issue) => `${issue.path.join('.') || target}: ${issue.message}`)
        .join('; ');
      throw new BadRequestError(message);
    }

    switch (target) {
      case 'query':
        Object.defineProperty(req, 'query', {
          value: result.data,
          writable: true,
          configurable: true,
          enumerable: true,
        });
        break;
      case 'body':
        req.body = result.data;
        break;
      case 'params':
        Object.assign(req.params, result.data);
        break;
      default:
        throw new Error(`Invalid target: ${target}`);
    }
    next();
  };
}
