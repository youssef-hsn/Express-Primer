import { z } from 'zod';

export const tokenClaims = z.object({
  sub: z.string().min(1),
  preferred_username: z.string().min(1),
  name: z.string().nullish(),
  email: z.string().nullish(),
});

export type TokenClaims = z.infer<typeof tokenClaims>;

export const decodeJwtClaims = (token: string): TokenClaims | undefined => {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return undefined;
  }

  const payload = parts[1];
  if (!payload) {
    return undefined;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    return undefined;
  }

  const result = tokenClaims.safeParse(parsed);
  return result.success ? result.data : undefined;
};
