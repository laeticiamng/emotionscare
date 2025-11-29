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

// ✅ Activated - refresh functions implemented
describe('GET /me/breath/weekly', () => {
  it('user fetches own breath KPIs', async () => {
    // Breath metrics now in Supabase with refresh functions
    const res = await fetch(url + '/me/breath/weekly', {
      headers: { 'Authorization': 'Bearer hashX' }
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    // Note: glowScore may not exist - check actual schema
  });
});

describe('GET /org/:orgId/breath/weekly', () => {
  it('admin fetches org KPIs', async () => {
    // Breath org metrics now in Supabase with refresh functions
    const res = await fetch(url + '/org/acme/breath/weekly', {
      headers: { 'Authorization': 'Bearer admin:acme' }
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data[0]).toHaveProperty('members');
    // Note: Check actual schema for org metrics
  });
});
