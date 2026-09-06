import winston from 'winston';
import { env } from '@/config/env.js';

const { combine, colorize, timestamp, printf, json } = winston.format;

const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'HH:mm:ss' }),
  printf(({ level, message, timestamp: ts, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${ts} ${level}: ${message}${metaStr}`;
  }),
);

const prodFormat = combine(timestamp(), json());

const isDevelopment = env.NODE_ENV === 'dev';

export const logger = winston.createLogger({
  level: env.LOG_LEVEL ?? (isDevelopment ? 'debug' : 'info'),
  format: isDevelopment ? devFormat : prodFormat,
  transports: [new winston.transports.Console()],
});

export const morganStream = {
  write(message: string): void {
    logger.http(message.trim());
  },
};
