import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createApp } from '../server';
import * as db from '../lib/db';
import type { FastifyInstance } from 'fastify';

let server: FastifyInstance;
let url: string;

beforeEach(async () => {
  db.clear();
  server = createApp();
  await server.listen({ port: 0 });
  const address = server.addresses()[0];
  url = `http://localhost:${address.port}`;
});

afterEach(async () => {
  await server.close();
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
