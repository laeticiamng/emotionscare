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

describe('admin organization endpoints', () => {
  it('GET returns organization info', async () => {
    const res = await fetch(url + '/admin/organization', {
      headers: { Authorization: 'Bearer admin:org1' }
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('id');
  });

  it('PUT updates organization name', async () => {
    const res = await fetch(url + '/admin/organization', {
      method: 'PUT',
      headers: { Authorization: 'Bearer admin:org1', 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Updated Org' })
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.name).toBe('Updated Org');
  });
});
