import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createApp } from '../server';

let server: any;
let url: string;

beforeEach(async () => {
  await new Promise<void>(resolve => {
    server = createApp().listen(0, () => {
      const { port } = server.address();
      url = `http://localhost:${port}`;
      resolve();
    });
  });
});

afterEach(() => {
  server.close();
});

const body = {
  audio_url: 'https://storage.supabase.co/u123/cap.webm',
  text_raw: 'hello',
  summary_120: 'hi',
  valence: 0.3,
  emo_vec: [0,0,0,0,0,0,0,0],
  pitch_avg: 200,
  crystal_meta: { form: 'gem', palette: ['#fff','#000'], mesh_url: 'https://x.com/a.glb' }
};

describe('POST /journal_voice', () => {
  it('returns 201', async () => {
    const res = await fetch(url + '/journal_voice', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer user42', 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data).toHaveProperty('id');
  });
});
