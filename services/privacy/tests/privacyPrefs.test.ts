import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createApp } from '../server';
import { clear, auditLog } from '../lib/db';
import type { FastifyInstance } from 'fastify';

let server: FastifyInstance;
let url: string;

beforeEach(async () => {
  clear();
  server = createApp();
  await server.listen({ port: 0 });
  const address = server.addresses()[0];
  url = `http://localhost:${address.port}`;
});

afterEach(async () => {
  await server.close();
});

describe('PUT /user/privacy', () => {
  it('updates a single flag', async () => {
    const res1 = await fetch(url + '/user/privacy', {
      method: 'PUT',
      headers: { Authorization: 'Bearer h123', 'Content-Type': 'application/json' },
      body: JSON.stringify({ mic: false })
    });
    expect(res1.status).toBe(204);

    const res2 = await fetch(url + '/user/privacy', {
      headers: { Authorization: 'Bearer h123' }
    });
    const data = await res2.json();
    expect(data.mic).toBe(false);
    expect(auditLog.length).toBe(1);
  });
});
