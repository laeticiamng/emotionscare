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

// TODO: Réactiver après implémentation complète Supabase
describe.skip('GET /me/breath/weekly', () => {
  it('user fetches own breath KPIs', async () => {
    // Breath metrics maintenant dans Supabase
    const res = await fetch(url + '/me/breath/weekly', {
      headers: { 'Authorization': 'Bearer hashX' }
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data[0]).toHaveProperty('glowScore');
  });
});

describe.skip('GET /org/:orgId/breath/weekly', () => {
  it('admin fetches org KPIs', async () => {
    // Breath org metrics maintenant dans Supabase
    const res = await fetch(url + '/org/acme/breath/weekly', {
      headers: { 'Authorization': 'Bearer admin:acme' }
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data[0]).toHaveProperty('members');
    expect(data[0]).toHaveProperty('org_glow');
  });
});
