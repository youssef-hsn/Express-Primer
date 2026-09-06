import request from 'supertest';
import { afterAll, describe, expect, it } from 'vitest';
import { createApp } from '@/app.js';
import { pool } from '@/config/db.js';

const app = createApp();

afterAll(async () => {
  await pool.end();
});

describe('GET /v1/health', () => {
  it('reports the process as up', async () => {
    const response = await request(app).get('/v1/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(typeof response.body.uptime).toBe('number');
    expect(Date.parse(response.body.timestamp)).not.toBeNaN();
  });

  it('needs no bearer token', async () => {
    const response = await request(app).get('/v1/health').set('Authorization', '');
    expect(response.status).toBe(200);
  });
});

describe('unmatched routes', () => {
  it('answers 404 in the shared error envelope', async () => {
    const response = await request(app).get('/v1/nothing-here');

    expect(response.status).toBe(404);
    expect(response.body.error.status).toBe(404);
    expect(response.body.error.message).toBe('Cannot GET /v1/nothing-here');
  });

  it('answers 404 for an unversioned path', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(404);
  });
});
