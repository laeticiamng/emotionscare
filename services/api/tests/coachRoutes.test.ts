import { describe, expect, it, vi } from 'vitest';

import { registerCoachRoutes, type CoachRepository } from '../routes/coach';
import { buildTestApp } from './helpers';

const baseSession = {
  id: 'session-1',
  title: 'Session',
  coach_mode: 'empathetic',
  mood_before: 4,
  mood_after: 7,
};

const baseMessage = {
  id: 'message-1',
  session_id: 'session-1',
  content: 'hello',
  sender: 'user',
};

const createRepository = (overrides: Partial<CoachRepository> = {}): CoachRepository => ({
  createSession: vi.fn(async () => baseSession),
  listSessions: vi.fn(async () => [baseSession]),
  getSession: vi.fn(async () => baseSession),
  updateSession: vi.fn(async () => baseSession),
  deleteSession: vi.fn(async () => undefined),
  verifySessionOwnership: vi.fn(async () => true),
  createMessage: vi.fn(async () => baseMessage),
  listMessages: vi.fn(async () => [baseMessage]),
  listSessionsWithMood: vi.fn(async () => [baseSession]),
  ...overrides,
});

describe('coach routes', () => {
  it('creates a session with defaults', async () => {
    const repo = createRepository({
      createSession: vi.fn(async (_userId, payload) => ({ ...baseSession, ...payload })),
    });
    const app = buildTestApp(app => registerCoachRoutes(app, { repository: repo }));
    const response = await app.inject({ method: 'POST', url: '/api/v1/coach/sessions', payload: {} });

    expect(response.statusCode).toBe(201);
    expect(repo.createSession).toHaveBeenCalledWith('user_test', {});
    await app.close();
  });

  it('prevents message creation when session is missing', async () => {
    const repo = createRepository({ verifySessionOwnership: vi.fn(async () => false) });
    const app = buildTestApp(app => registerCoachRoutes(app, { repository: repo }));

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/coach/messages',
      payload: { session_id: 'unknown', content: 'hi', sender: 'user' },
    });

    expect(response.statusCode).toBe(404);
    await app.close();
  });

  it('builds insights from sessions', async () => {
    const repo = createRepository({
      listSessionsWithMood: vi.fn(async () => [
        { ...baseSession, mood_before: 4, mood_after: 7 },
        { ...baseSession, id: 'session-2', mood_before: 5, mood_after: 8 },
      ]),
    });
    const app = buildTestApp(app => registerCoachRoutes(app, { repository: repo }));
    const response = await app.inject({ method: 'GET', url: '/api/v1/coach/insights' });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.data[0].type).toBe('mood_improvement');
    await app.close();
  });
});
