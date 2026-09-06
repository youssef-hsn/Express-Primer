import { describe, expect, it } from 'vitest';
import { decodeJwtClaims } from '@/utils/jwt.js';

const encode = (value: unknown): string =>
  Buffer.from(JSON.stringify(value), 'utf8').toString('base64url');

const sign = (payload: unknown): string => `${encode({ alg: 'none' })}.${encode(payload)}.`;

const validClaims = {
  sub: 'local-dev-user',
  preferred_username: 'dev',
  name: 'Dev User',
  email: 'dev@local.test',
};

describe('decodeJwtClaims', () => {
  it('decodes a well-formed token', () => {
    expect(decodeJwtClaims(sign(validClaims))).toEqual(validClaims);
  });

  it('accepts a token with only the required claims', () => {
    const minimal = { sub: 'u1', preferred_username: 'dev' };
    expect(decodeJwtClaims(sign(minimal))).toEqual(minimal);
  });

  it('returns undefined when the token is not three segments', () => {
    expect(decodeJwtClaims('not.a-token')).toBeUndefined();
    expect(decodeJwtClaims('')).toBeUndefined();
  });

  it('returns undefined when the payload is not JSON', () => {
    expect(decodeJwtClaims(`${encode({ alg: 'none' })}.bm90LWpzb24.`)).toBeUndefined();
  });

  it('returns undefined when required claims are missing', () => {
    expect(decodeJwtClaims(sign({ preferred_username: 'dev' }))).toBeUndefined();
    expect(decodeJwtClaims(sign({ sub: '', preferred_username: 'dev' }))).toBeUndefined();
  });
});
