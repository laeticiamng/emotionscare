import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../server';

const app = createApp();

describe('Full API v1', () => {
  it('login then access protected stats', async () => {
    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'user@example.com', password: 'pass' });
    expect(login.status).toBe(200);
    const token = login.body.data.token;
    expect(token).toBeDefined();

    const res = await request(app)
      .get('/api/v1/b2c/dashboard/stats')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('create journal entry', async () => {
    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'j@example.com', password: 'x' });
    const token = login.body.data.token;
    const res = await request(app)
      .post('/api/v1/journal/entry')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'hello' });
    expect(res.status).toBe(201);
    expect(res.body.data.content).toBe('hello');
  });
});
