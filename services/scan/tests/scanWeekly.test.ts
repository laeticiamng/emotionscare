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

describe('GET /me/scan/weekly', () => {
  it('user fetches own KPIs', async () => {
    insertWeekly({
      user_id_hash: hash('hashU'),
      week_start: '2025-05-26',
      valence_face_avg: 0.24,
      arousal_sd_face: 0.12,
      joy_face_avg: 0.48,
      valence_voice_avg: 0.31,
      lexical_sentiment_avg: 0.29,
      n_face_sessions: 3,
      n_voice_sessions: 2
    });

    const res = await fetch(url + '/me/scan/weekly', {
      headers: { 'Authorization': 'Bearer hashU' }
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data[0]).toHaveProperty('week_start');
  });
});

describe('GET /org/:orgId/scan/weekly', () => {
  it('admin fetches org KPIs', async () => {
    insertWeeklyOrg({
      org_id: 'acme',
      week_start: '2025-05-26',
      members: 17,
      org_valence_face: 0.21,
      org_arousal_sd: 0.14,
      org_joy_face: 0.45,
      org_valence_voice: 0.28,
      org_lexical_sentiment: 0.26
    });

    const res = await fetch(url + '/org/acme/scan/weekly', {
      headers: { 'Authorization': 'Bearer admin:acme' }
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data[0]).toHaveProperty('members');
  });
});
