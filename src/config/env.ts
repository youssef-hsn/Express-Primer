import 'dotenv/config';
import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

const logLevels = ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'] as const;

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['dev', 'prod', 'stg']).default('dev'),
    PORT: z.coerce.number().int().positive().max(65_535).default(3000),
    DATABASE_URL: z.string().min(1),
    LOG_LEVEL: z.enum(logLevels).optional(),
    EXAMPLE_FEATURE_ENABLED: z.stringbool().optional(),
  },

  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

export const isProduction = env.NODE_ENV === 'prod';
