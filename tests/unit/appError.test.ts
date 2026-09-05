import { describe, expect, it } from 'vitest';
import {
  AppError,
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '@/utils/appError.js';

describe('AppError', () => {
  it('defaults to a 500 operational error', () => {
    const error = new AppError('boom');
    expect(error.statusCode).toBe(500);
    expect(error.isOperational).toBe(true);
    expect(error.data).toBeUndefined();
  });

  it('names itself after the concrete subclass', () => {
    expect(new NotFoundError().name).toBe('NotFoundError');
    expect(new AppError('boom').name).toBe('AppError');
  });

  it('keeps subclasses assignable to Error and AppError', () => {
    const error = new ConflictError('taken');
    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('taken');
  });
});

describe('AppError subclasses', () => {
  it('maps each subclass to its status code', () => {
    expect(new BadRequestError().statusCode).toBe(400);
    expect(new UnauthorizedError().statusCode).toBe(401);
    expect(new NotFoundError().statusCode).toBe(404);
    expect(new ConflictError().statusCode).toBe(409);
  });

  it('carries structured data on BadRequestError', () => {
    const issues = [{ path: 'name', message: 'Required' }];
    expect(new BadRequestError('invalid', issues).data).toEqual(issues);
  });

  it('provides a default message per subclass', () => {
    expect(new NotFoundError().message).toBe('Resource not found');
    expect(new UnauthorizedError().message).toBe('Unauthorized');
  });
});
