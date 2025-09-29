import { request } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

type Role = 'b2c' | 'b2b_user' | 'b2b_admin';

function credsFor(role: Role) {
  const email = process.env[`PW_${role.toUpperCase()}_EMAIL`];
  const password = process.env[`PW_${role.toUpperCase()}_PASSWORD`];
  if (!email || !password) {
    throw new Error(`Missing credentials for ${role}`);
  }
  return { email, password };
}

/**
 * Perform a real login via the HTTP API and persist the resulting storage state.
 * Credentials are provided via env vars (PW_B2C_EMAIL, PW_B2C_PASSWORD, ...).
 */
export async function loginAndSaveState(role: Role, file: string) {
  const ctx = await request.newContext({ baseURL: BASE_URL });
  const res = await ctx.post('/api/auth/login', { data: credsFor(role) });
  if (res.status() !== 200) {
    throw new Error(`Login failed for ${role}: ${res.status()}`);
  }
  await ctx.storageState({ path: file });
  await ctx.dispose();
}
