import type { Request } from 'express';
import { UnauthorizedError } from '@/utils/appError.js';
import { decodeJwtClaims, type TokenClaims } from '@/utils/jwt.js';

declare global {
  namespace Express {
    interface Request {
      claims?: TokenClaims;
    }
  }
}

type RequestWithClaims = Pick<Request, 'headers' | 'claims'>;

const extractBearerToken = (req: Pick<Request, 'headers'>): string | undefined => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return undefined;
  }
  return header.slice('Bearer '.length);
};

export const getRequestClaims = (req: RequestWithClaims): TokenClaims => {
  if (req.claims) return req.claims;
  const token = extractBearerToken(req);
  const claims = token ? decodeJwtClaims(token) : undefined;
  if (!claims) throw new UnauthorizedError();
  req.claims = claims;
  return req.claims;
};
