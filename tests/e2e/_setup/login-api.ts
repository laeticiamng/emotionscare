import { request } from '@playwright/test';

const BASE_URL = process.env.PW_BASE_URL ?? 'http://localhost:3000';

type Role = 'b2c' | 'b2b_user' | 'b2b_admin';

/**
 * Perform a real login via the HTTP API and persist the resulting storage state.
 * The credentials for each role are expected to be provided via environment variables
 * (PW_B2C_EMAIL, PW_B2C_PASSWORD, etc.).
 */
export async function loginAndSaveState(role: Role, file: string) {
  const context = await request.newContext({ baseURL: BASE_URL });
  await context.post('/api/test-auth/login', {
    data: {
      role,
      email: process.env[`PW_${role.toUpperCase()}_EMAIL`],
      password: process.env[`PW_${role.toUpperCase()}_PASSWORD`],
    },
  });
  await context.storageState({ path: file });
  await context.dispose();
}
