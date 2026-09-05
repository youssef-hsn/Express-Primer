import { describe, expect, it } from 'vitest';
import { buildMeta, paginationSchema } from '@/utils/pagination.js';

describe('paginationSchema', () => {
  it('defaults to the first page of ten', () => {
    expect(paginationSchema.parse({})).toEqual({ page: 1, pageSize: 10 });
  });

  it('coerces the string values a query string actually delivers', () => {
    expect(paginationSchema.parse({ page: '3', pageSize: '25' })).toEqual({
      page: 3,
      pageSize: 25,
    });
  });

  it('rejects a zero or negative page', () => {
    expect(paginationSchema.safeParse({ page: '0' }).success).toBe(false);
    expect(paginationSchema.safeParse({ page: '-1' }).success).toBe(false);
  });

  it('caps pageSize at 100', () => {
    expect(paginationSchema.safeParse({ pageSize: '100' }).success).toBe(true);
    expect(paginationSchema.safeParse({ pageSize: '101' }).success).toBe(false);
  });

  it('rejects a non-integer page', () => {
    expect(paginationSchema.safeParse({ page: '1.5' }).success).toBe(false);
  });
});

describe('buildMeta', () => {
  it('rounds the page count up', () => {
    expect(buildMeta(1, 10, 42)).toEqual({ page: 1, pageSize: 10, total: 42, totalPages: 5 });
  });

  it('reports zero pages for an empty result set', () => {
    expect(buildMeta(1, 10, 0)).toEqual({ page: 1, pageSize: 10, total: 0, totalPages: 0 });
  });

  it('reports one page when the total fits exactly', () => {
    expect(buildMeta(1, 10, 10).totalPages).toBe(1);
  });
});
