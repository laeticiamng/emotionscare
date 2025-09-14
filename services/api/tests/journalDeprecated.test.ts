import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createApp } from '../server';

let app: any;
let url: string;

beforeEach(async () => {
  app = createApp();
  await app.listen({ port: 0 });
  const address = app.server.address();
  const port = typeof address === 'object' && address ? address.port : 0;
  url = `http://127.0.0.1:${port}`;
});

afterEach(async () => {
  await app.close();
});

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

describe('deprecated journal endpoints', () => {
  it('POST /journal_voice', async () => {
    const res = await fetch(url + '/journal_voice', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer user42', 'Content-Type': 'application/json' },
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
      headers: { 'Authorization': 'Bearer user42', 'Content-Type': 'application/json' },
      body: JSON.stringify(textBody)
    });
    expect(res.status).toBe(201);
    expect(res.headers.get('X-Deprecated-Endpoint')).toBe('true');
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.data).toHaveProperty('id');
  });
});
