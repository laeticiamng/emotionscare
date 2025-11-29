import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createApp } from '../server';
import type { FastifyInstance } from 'fastify';

let server: FastifyInstance;
let url: string;

beforeEach(async () => {
  server = createApp();
  await server.listen({ port: 0 });
  const address = server.addresses()[0];
  url = `http://localhost:${address.port}`;
});

afterEach(async () => {
  await server.close();
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
