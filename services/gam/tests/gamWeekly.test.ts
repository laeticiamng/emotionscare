import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createApp } from '../server';
import { insertWeekly, insertWeeklyOrg, clear } from '../lib/db';
import { hash } from '../../journal/lib/hash';
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

describe('GET /me/gam/weekly', () => {
  it('returns personal weekly KPIs', async () => {
    insertWeekly({
      user_id_hash: hash('hashX'),
      week_start: '2025-05-19',
      pa_avg: 0.42,
      laugh_genuine_ratio: 0.3,
      conn_depth_avg: 1.7,
      shares_total: 6,
      mvpa_min: 155,
      streak_ratio: 0.66
    });

    const res = await fetch(url + '/me/gam/weekly', {
      headers: { 'Authorization': 'Bearer hashX' }
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });
});

describe('GET /org/:orgId/gam/weekly', () => {
  it('admin fetches org KPIs', async () => {
    insertWeeklyOrg({
      org_id: 'acme',
      week_start: '2025-05-19',
      n_members: 123,
      pa_avg: 0.42,
      laugh_genuine_ratio: 0.3,
      conn_depth_avg: 1.7,
      shares_total: 6,
      mvpa_min: 155,
      streak_ratio: 0.66
    });

    const res = await fetch(url + '/org/acme/gam/weekly', {
      headers: { 'Authorization': 'Bearer admin:acme' }
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data[0]).toHaveProperty('n_members');
  });
});
