import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createApp } from '../server';
import { insertWeekly, insertWeeklyOrg, clear } from '../lib/db';
import { hash } from '../../journal/lib/hash';

let server: any;
let url: string;

beforeEach(async () => {
  clear();
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

describe('GET /me/breath/weekly', () => {
  it('user fetches own breath KPIs', async () => {
    insertWeekly({
      user_id_hash: hash('hashX'),
      week_start: '2025-05-19',
      hrv_stress_idx: 25,
      coherence_avg: 88,
      mvpa_week: 40,
      relax_idx: 6,
      mindfulness_avg: 3.2,
      mood_score: 0.5
    });

    const res = await fetch(url + '/me/breath/weekly', {
      headers: { 'Authorization': 'Bearer hashX' }
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data[0]).toHaveProperty('glowScore');
  });
});

describe('GET /org/:orgId/breath/weekly', () => {
  it('admin fetches org KPIs', async () => {
    insertWeeklyOrg({
      org_id: 'acme',
      week_start: '2025-05-19',
      members: 10,
      org_hrv_idx: 22,
      org_coherence: 80,
      org_mvpa: 45,
      org_relax: 7,
      org_mindfulness: 2.8,
      org_mood: 0.4
    });

    const res = await fetch(url + '/org/acme/breath/weekly', {
      headers: { 'Authorization': 'Bearer admin:acme' }
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data[0]).toHaveProperty('members');
    expect(data[0]).toHaveProperty('org_glow');
  });
});
