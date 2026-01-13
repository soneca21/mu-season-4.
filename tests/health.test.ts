import request from 'supertest';
import app from '../src/app';

describe('GET /health', () => {
  it('returns status 200 and valid JSON body', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);

    expect(res.body).toHaveProperty('status', 'ok');
    expect(typeof res.body.uptime).toBe('number');
    expect(typeof res.body.timestamp).toBe('string');

    // timestamp should be valid ISO string
    expect(() => new Date(res.body.timestamp).toISOString()).not.toThrow();
  });
});
