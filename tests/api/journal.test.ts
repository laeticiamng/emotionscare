import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createHash } from 'crypto';
import request from 'supertest';
import type { FastifyInstance } from 'fastify';

const computeHash = () => createHash('sha256').update('user42' + 'pepper').digest('hex');

const feedEntries = [
  { type: 'voice', id: 'voice-123', ts: '2024-01-01T00:00:00.000Z', summary: 'summary' },
  { type: 'text', id: 'text-456', ts: '2024-01-02T00:00:00.000Z', preview: 'preview' },
];

describe('journal api', () => {
  let app: FastifyInstance;
  const listFeedMock = vi.fn(async () => feedEntries);
  const validToken = 'valid-token';

  beforeEach(async () => {
    vi.resetModules();
    process.env.JWT_SECRETS = 'test-secret';
    process.env.HASH_PEPPER = 'pepper';

    const jwtModule = await import('../../services/lib/jwt');
    vi.spyOn(jwtModule, 'verifyJwt').mockImplementation(async token => {
      if (token === validToken) {
        return { sub: 'user42', role: 'b2c', aud: 'test' } as any;
      }
      throw new Error('invalid token');
    });

    const { createApp } = await import('../../services/api/server');
    listFeedMock.mockClear();
    app = createApp({
      journalDb: {
        listFeed: listFeedMock,
      },
    });
    app.addHook('preHandler', (req: any, _reply: any, done: any) => {
      if (req.headers.authorization === `Bearer ${validToken}`) {
        (req as any).user = { sub: 'user42', role: 'b2c', aud: 'test' };
      }
      done();
    });
    await app.ready();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it('returns the journal feed for the authenticated user', async () => {
    const response = await request(app.server)
      .get('/api/v1/me/journal')
      .set('Authorization', `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(listFeedMock).toHaveBeenCalledTimes(1);
    expect(listFeedMock).toHaveBeenCalledWith(computeHash());
    expect(response.body).toEqual({ ok: true, data: { entries: feedEntries, weekly: [] } });
  });

  it('rejects requests without authentication', async () => {
    const response = await request(app.server).get('/api/v1/me/journal');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      ok: false,
      error: { code: 'unauthorized', message: 'Unauthorized' },
    });
  });
});
