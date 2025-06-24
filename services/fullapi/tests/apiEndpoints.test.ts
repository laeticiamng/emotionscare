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

  it('b2b user profile and preferences', async () => {
    const reg = await request(app)
      .post('/api/v1/auth/b2b/user/register')
      .send({ email: 'corp@acme.com', password: 'x' });
    expect(reg.status).toBe(201);
    const token = reg.body.data.token;

    const update = await request(app)
      .put('/api/v1/auth/b2b/user/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Corp User' });
    expect(update.status).toBe(200);
    expect(update.body.data.name).toBe('Corp User');

    const pref = await request(app)
      .put('/api/v1/user/preferences')
      .set('Authorization', `Bearer ${token}`)
      .send({ theme: 'dark' });
    expect(pref.status).toBe(200);
    expect(pref.body.data.theme).toBe('dark');
  });

  it('user profile and activity summary', async () => {
    const reg = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'alice@example.com', password: '123' });
    expect(reg.status).toBe(201);
    const token = reg.body.data.token;

    const update = await request(app)
      .put('/api/v1/auth/user/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Alice' });
    expect(update.status).toBe(200);

    const profile = await request(app)
      .get('/api/v1/auth/user/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(profile.body.data.name).toBe('Alice');

    await request(app)
      .post('/api/v1/journal/entries')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'hi' });

    const summary = await request(app)
      .get('/api/v1/user/activity-summary')
      .set('Authorization', `Bearer ${token}`);
    expect(summary.body.data.journalEntries).toBe(1);

    const feedback = await request(app)
      .post('/api/v1/user/feedback')
      .set('Authorization', `Bearer ${token}`)
      .send({ message: 'nice' });
    expect(feedback.status).toBe(201);

    const stats = await request(app)
      .get('/api/v1/user/dashboard-stats')
      .set('Authorization', `Bearer ${token}`);
    expect(stats.status).toBe(200);
    expect(stats.body.success).toBe(true);
  });
});
