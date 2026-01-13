import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import config from '../src/config/index';

const VALID_API_KEY = config.API_KEY;
const INVALID_API_KEY = 'invalid-api-key';

describe('Auth Middleware', () => {
  // Test POST /tasks without API key
  it('should return 401 when creating task without API key', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({
        title: 'Test Task',
      });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
    expect(res.body.error.message).toBe('Invalid or missing API key');
  });

  // Test POST /tasks with invalid API key
  it('should return 401 when creating task with invalid API key', async () => {
    const res = await request(app)
      .post('/tasks')
      .set('x-api-key', INVALID_API_KEY)
      .send({
        title: 'Test Task',
      });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
    expect(res.body.error.message).toBe('Invalid or missing API key');
  });

  // Test POST /tasks with valid API key
  it('should return 400 (validation error) when creating task with valid API key but invalid body', async () => {
    const res = await request(app)
      .post('/tasks')
      .set('x-api-key', VALID_API_KEY)
      .send({
        description: 'Missing title',
      });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  // Test GET /tasks without API key
  it('should return 401 when listing tasks without API key', async () => {
    const res = await request(app).get('/tasks');

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  // Test GET /tasks with invalid API key
  it('should return 401 when listing tasks with invalid API key', async () => {
    const res = await request(app)
      .get('/tasks')
      .set('x-api-key', INVALID_API_KEY);

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  // Test GET /health - should NOT require API key
  it('should return 200 for GET /health without API key', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  // Test GET /health - should work with API key too (not rejected)
  it('should return 200 for GET /health with API key', async () => {
    const res = await request(app)
      .get('/health')
      .set('x-api-key', VALID_API_KEY);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
