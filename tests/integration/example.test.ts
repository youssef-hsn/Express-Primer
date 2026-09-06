import request from 'supertest';
import { afterAll, describe, expect, it } from 'vitest';
import { createApp } from '@/app.js';
import { pool } from '@/config/db.js';

const app = createApp();

afterAll(async () => {
  await pool.end();
});

describe('GET /v1/examples — query validation', () => {
  it('rejects a zero page with a 400 naming the field', async () => {
    const response = await request(app).get('/v1/examples?page=0');

    expect(response.status).toBe(400);
    expect(response.body.error.status).toBe(400);
    expect(response.body.error.message).toMatch(/page:/);
  });

  it('rejects an unknown status value', async () => {
    const response = await request(app).get('/v1/examples?status=nonsense');

    expect(response.status).toBe(400);
    expect(response.body.error.message).toMatch(/status:/);
  });
});

describe('POST /v1/examples — middleware order', () => {
  it('rejects a request missing the required header before validating the body', async () => {
    const response = await request(app).post('/v1/examples').send({ name: 'ok' });

    expect(response.status).toBe(400);
    expect(response.body.error.message).toBe('Missing required header: x-request-id');
  });

  it('rejects an invalid body once the header is present', async () => {
    const response = await request(app)
      .post('/v1/examples')
      .set('x-request-id', 'req-1')
      .send({ name: '' });

    expect(response.status).toBe(400);
    expect(response.body.error.message).toMatch(/name:/);
  });
});

describe('GET /v1/examples/:id — param validation', () => {
  it('rejects a non-uuid id', async () => {
    const response = await request(app).get('/v1/examples/not-a-uuid');

    expect(response.status).toBe(400);
    expect(response.body.error.message).toMatch(/id:/);
  });
});
