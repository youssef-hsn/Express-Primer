import { fileURLToPath } from 'node:url';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, pool } from '@/config/db.js';
import { logger } from '@/config/logger.js';

const migrationsFolder = fileURLToPath(new URL('../drizzle', import.meta.url));

try {
  await migrate(db, { migrationsFolder });
  logger.info('Database migrations up to date', { migrationsFolder });
} catch (err) {
  logger.error('Database migration failed', { err });
  await pool.end().catch(() => undefined);
  process.exit(1);
}

await pool.end();
