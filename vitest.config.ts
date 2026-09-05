import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const srcDir = fileURLToPath(new URL('./src', import.meta.url));

export default defineConfig({
  resolve: {
    alias: [{ find: /^@\/(.*)\.js$/, replacement: `${srcDir}/$1.ts` }],
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    env: {
      NODE_ENV: 'dev',
      LOG_LEVEL: 'error',
      DATABASE_URL: 'postgres://primer:primer@localhost:5432/express_primer',
    },
  },
});
