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

describe('GET /me/vr/weekly', () => {
  it('user fetches own VR KPI', async () => {
    insertWeekly({
      user_id_hash: hash('hashU1'),
      week_start: '2025-06-02',
      hrv_gain_median: 12,
      coherence_avg: 0.82
    });

    const res = await fetch(url + '/me/vr/weekly', {
      headers: { 'Authorization': 'Bearer hashU1' }
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });
});

describe('GET /org/:orgId/vr/weekly', () => {
  it('admin fetches org KPI', async () => {
    insertWeeklyOrg({
      org_id: 'acme',
      week_start: '2025-06-02',
      members: 10,
      org_hrv_gain: 15,
      org_coherence: 0.75,
      org_sync_idx: 0.6,
      org_team_pa: 0.8
    });

    const res = await fetch(url + '/org/acme/vr/weekly', {
      headers: { 'Authorization': 'Bearer admin:acme' }
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data[0]).toHaveProperty('members');
  });
});
