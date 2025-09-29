import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createApp } from '../server';
import * as db from '../lib/db';

let server: any;
let url: string;

beforeEach(async () => {
  db.clear();
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

describe('POST /user/export', () => {
  it('creates an export job', async () => {
    const res = await fetch(url + '/user/export', {
      method: 'POST',
      headers: { Authorization: 'Bearer hX' }
    });
    expect(res.status).toBe(202);
    const data = await res.json();
    expect(data.jobId).toMatch(/[0-9a-f-]{36}/);
  });
});
