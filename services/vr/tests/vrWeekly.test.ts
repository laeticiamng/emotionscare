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

// ✅ Activated - materialized views implemented
describe('GET /me/vr/weekly', () => {
  it('user fetches own VR KPI', async () => {
    // Weekly aggregates now using materialized views
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
    // Weekly aggregates now using materialized views
    const res = await fetch(url + '/org/acme/vr/weekly', {
      headers: { 'Authorization': 'Bearer admin:acme' }
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data[0]).toHaveProperty('members');
  });
});
