import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createHash } from 'crypto';
import * as jwt from '../../lib/jwt';

const voiceBody = {
  audio_url: 'https://storage.supabase.co/u123/cap.webm',
  text_raw: 'hello',
  summary_120: 'hi',
  valence: 0.3,
  emo_vec: [0, 0, 0, 0, 0, 0, 0, 0],
  pitch_avg: 200,
  crystal_meta: { form: 'gem', palette: ['#fff', '#000'], mesh_url: 'https://x.com/a.glb' },
};

const textBody = {
  text_raw: 'text entry',
  styled_html: '<p>text</p>',
  preview: 'text',
  valence: 0.1,
  emo_vec: [0, 0, 0, 0, 0, 0, 0, 0],
};

const computeHash = () => createHash('sha256').update('user42' + 'pepper').digest('hex');

describe('journal api', () => {
  let app: any;
  let url: string;
  const voiceResponse = { id: 'voice-123', ts: '2024-01-01T00:00:00.000Z' };
  const textResponse = { id: 'text-456', ts: '2024-01-02T00:00:00.000Z' };

  const insertVoiceMock = vi.fn(async (data: any) => ({ ...voiceResponse, ...data }));
  const insertTextMock = vi.fn(async (data: any) => ({ ...textResponse, ...data }));
  const listFeedMock = vi.fn(async () => [
    { type: 'voice', id: 'voice-123', ts: '2024-01-01T00:00:00.000Z', summary: 'summary' },
    { type: 'text', id: 'text-456', ts: '2024-01-02T00:00:00.000Z', preview: 'preview' },
  ]);

  beforeEach(async () => {
    process.env.JWT_SECRETS = 'test-secret';
    process.env.HASH_PEPPER = 'pepper';
    insertVoiceMock.mockClear();
    insertTextMock.mockClear();
    listFeedMock.mockClear();
    vi.spyOn(jwt, 'verifyJwt').mockImplementation(async token => {
      if (token === 'valid-token') {
        return { sub: 'user42', role: 'b2c', aud: 'test' } as jwt.TokenPayload;
      }
      throw new Error('invalid token');
    });
    const serverModule = await import('../server');
    app = serverModule.createApp({
      journalDb: {
        insertVoice: insertVoiceMock,
        insertText: insertTextMock,
        listFeed: listFeedMock,
      },
    });
    app.addHook('preHandler', (req: any, _reply: any, done: any) => {
      if (req.headers.authorization === 'Bearer valid-token') {
        (req as any).user = { sub: 'user42', role: 'b2c', aud: 'test' };
      }
      done();
    });
    await app.listen({ port: 0 });
    const address = app.server.address();
    const port = typeof address === 'object' && address ? address.port : 0;
    url = `http://127.0.0.1:${port}`;
  });

  afterEach(async () => {
    await app.close();
    vi.restoreAllMocks();
  });

  it('creates voice journal entry with hashed user id', async () => {
    const res = await fetch(url + '/api/v1/journal/voice', {
      method: 'POST',
      headers: { Authorization: 'Bearer valid-token', 'Content-Type': 'application/json' },
      body: JSON.stringify(voiceBody),
    });

    expect(res.status).toBe(201);
    expect(insertVoiceMock).toHaveBeenCalledTimes(1);
    expect(insertVoiceMock).toHaveBeenCalledWith({ ...voiceBody, user_hash: computeHash() });
    const data = await res.json();
    expect(data).toEqual({ ok: true, data: voiceResponse });
  });

  it('creates text journal entry with hashed user id', async () => {
    const res = await fetch(url + '/api/v1/journal/text', {
      method: 'POST',
      headers: { Authorization: 'Bearer valid-token', 'Content-Type': 'application/json' },
      body: JSON.stringify(textBody),
    });

    expect(res.status).toBe(201);
    expect(insertTextMock).toHaveBeenCalledTimes(1);
    expect(insertTextMock).toHaveBeenCalledWith({ ...textBody, user_hash: computeHash() });
    const data = await res.json();
    expect(data).toEqual({ ok: true, data: textResponse });
  });

  it('returns journal feed from dependency', async () => {
    const res = await fetch(url + '/api/v1/me/journal', {
      headers: { Authorization: 'Bearer valid-token' },
    });

    expect(res.status).toBe(200);
    expect(listFeedMock).toHaveBeenCalledTimes(1);
    expect(listFeedMock).toHaveBeenCalledWith(computeHash());
    const data = await res.json();
    const entries = await listFeedMock.mock.results[0].value;
    expect(data).toEqual({ ok: true, data: { entries, weekly: [] } });
  });
});
