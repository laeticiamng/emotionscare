import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as jwt from '../../lib/jwt';

let app: any;
let url: string;

beforeEach(async () => {
  process.env.HASH_PEPPER = 'pepper';
  vi.spyOn(jwt, 'verifyJwt').mockImplementation(async token => {
    if (token === 'valid-token') {
      return { sub: 'user42', role: 'b2c', aud: 'test' } as jwt.TokenPayload;
    }
    throw new Error('invalid token');
  });
  const serverModule = await import('../server');
  app = serverModule.createApp();
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
}, 15000);

afterEach(async () => {
  if (app) {
    await app.close().catch(() => {});
  }
  vi.restoreAllMocks();
}, 15000);

const voiceBody = {
  audio_url: 'https://storage.supabase.co/u123/cap.webm',
  text_raw: 'hello',
  summary_120: 'hi',
  valence: 0.3,
  emo_vec: [0,0,0,0,0,0,0,0],
  pitch_avg: 200,
  crystal_meta: { form: 'gem', palette: ['#fff','#000'], mesh_url: 'https://x.com/a.glb' }
};

const textBody = {
  text_raw: 'text entry',
  styled_html: '<p>text</p>',
  preview: 'text',
  valence: 0.1,
  emo_vec: [0,0,0,0,0,0,0,0]
};

describe.skip('deprecated journal endpoints', () => {
  it('POST /journal_voice', async () => {
      const res = await fetch(url + '/journal_voice', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer valid-token', 'Content-Type': 'application/json' },
        body: JSON.stringify(voiceBody)
      });
    expect(res.status).toBe(201);
    expect(res.headers.get('X-Deprecated-Endpoint')).toBe('true');
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.data).toHaveProperty('id');
  });

  it('POST /journal_text', async () => {
      const res = await fetch(url + '/journal_text', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer valid-token', 'Content-Type': 'application/json' },
        body: JSON.stringify(textBody)
      });
    expect(res.status).toBe(201);
    expect(res.headers.get('X-Deprecated-Endpoint')).toBe('true');
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.data).toHaveProperty('id');
  });
});
