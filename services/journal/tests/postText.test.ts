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
  text_raw: 'text entry',
  styled_html: '<p>text</p>',
  preview: 'text',
  valence: 0.1,
  emo_vec: [0,0,0,0,0,0,0,0]
};

describe('POST /journal_text', () => {
  it('returns 201', async () => {
    const res = await fetch(url + '/journal_text', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer user42', 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data).toHaveProperty('id');
  });
});
