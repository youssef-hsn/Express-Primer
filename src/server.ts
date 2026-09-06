import type { Server } from 'node:http';
import { createApp } from '@/app.js';
import { pool } from '@/config/db.js';
import { env } from '@/config/env.js';
import { logger } from '@/config/logger.js';

const app = createApp();

const server: Server = app.listen(env.PORT, () => {
  logger.info('Server listening', { port: env.PORT, env: env.NODE_ENV });
  logger.debug(`Server URL: http://localhost:${env.PORT}`);
});

const shutdown = (signal: NodeJS.Signals): void => {
  logger.info(`${signal} received — shutting down gracefully`);

  const forceExit = setTimeout(() => {
    logger.error('Could not close connections in time — forcing shutdown');
    process.exit(1);
  }, 10_000);
  forceExit.unref();

  server.close(async (err) => {
    if (err) {
      logger.error('Error during shutdown', { err });
      process.exit(1);
    }
    try {
      await pool.end();
      logger.info('Server closed');
      process.exit(0);
    } catch (poolErr) {
      logger.error('Error closing database pool', { err: poolErr });
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
