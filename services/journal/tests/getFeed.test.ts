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

describe('GET /me/journal', () => {
  it('returns feed array', async () => {
    // seed one entry
    await fetch(url + '/journal_text', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer user42', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text_raw: 'text entry', styled_html: '<p>text</p>', preview: 'text', valence: 0.1,
        emo_vec: [0,0,0,0,0,0,0,0]
      })
    });

    const res = await fetch(url + '/me/journal', {
      headers: { 'Authorization': 'Bearer user42' }
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data.entries)).toBe(true);
    expect(data.entries.length).toBeGreaterThan(0);
  });
});
