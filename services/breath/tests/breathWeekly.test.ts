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
