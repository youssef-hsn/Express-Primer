import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from '@/config/env.js';
import * as schema from '@/repositories/schema/index.js';

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  options: '-c timezone=UTC',
});

export const db = drizzle(pool, { schema });

export type Database = typeof db;
