import type { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { validate } from '@/middleware/validate.js';
import { BadRequestError } from '@/utils/appError.js';

const bodySchema = z.object({ name: z.string().min(1) });
const querySchema = z.object({ page: z.coerce.number().int().min(1).default(1) });
const paramsSchema = z.object({ id: z.uuid() });

const fakeRequest = (init: Record<string, unknown>): Request<never, unknown, never, never> =>
  ({ body: {}, query: {}, params: {}, ...init }) as unknown as Request<
    never,
    unknown,
    never,
    never
  >;

const noopResponse = {} as Response;

describe('validate — body', () => {
  it('calls next and replaces the body with the parsed value', () => {
    const req = fakeRequest({ body: { name: 'primer', extra: 'dropped' } });
    const next = vi.fn();

    validate(bodySchema)(req, noopResponse, next);

    expect(next).toHaveBeenCalledOnce();
    expect(req.body).toEqual({ name: 'primer' });
  });

  it('throws BadRequestError naming the offending path', () => {
    const req = fakeRequest({ body: { name: '' } });

    expect(() => validate(bodySchema)(req, noopResponse, vi.fn())).toThrowError(BadRequestError);
    expect(() => validate(bodySchema)(req, noopResponse, vi.fn())).toThrowError(/name:/);
  });

  it('joins multiple issues with a semicolon', () => {
    const schema = z.object({ a: z.string(), b: z.string() });
    const req = fakeRequest({ body: {} });

    expect(() => validate(schema)(req, noopResponse, vi.fn())).toThrowError(/a:.*;.*b:/s);
  });
});

describe('validate — query', () => {
  it('writes the coerced query back onto the request', () => {
    const req = fakeRequest({ query: { page: '4' } });
    const next = vi.fn();

    validate(querySchema, 'query')(req, noopResponse, next);

    expect(next).toHaveBeenCalledOnce();
    expect(req.query).toEqual({ page: 4 });
  });

  it('applies schema defaults for absent params', () => {
    const req = fakeRequest({ query: {} });

    validate(querySchema, 'query')(req, noopResponse, vi.fn());

    expect(req.query).toEqual({ page: 1 });
  });
});

describe('validate — params', () => {
  it('accepts a well-formed uuid', () => {
    const req = fakeRequest({ params: { id: '3f2504e0-4f89-41d3-9a0c-0305e82c3301' } });
    const next = vi.fn();

    validate(paramsSchema, 'params')(req, noopResponse, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it('rejects a malformed uuid', () => {
    const req = fakeRequest({ params: { id: 'not-a-uuid' } });

    expect(() => validate(paramsSchema, 'params')(req, noopResponse, vi.fn())).toThrowError(
      BadRequestError,
    );
  });
});
