import { chromium, FullConfig } from '@playwright/test';

const BASE_URL = process.env.PW_BASE_URL ?? 'http://localhost:3000';

async function mintTokenForRole(role: 'b2c'|'b2b_user'|'b2b_admin'): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/test-auth/mint?role=${role}`);
  const { token } = await res.json();
  return token;
}

async function writeState(file: string, role: 'b2c'|'b2b_user'|'b2b_admin') {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  const token = await mintTokenForRole(role);

  await page.addInitScript(([t]) => {
    localStorage.setItem('auth_token', t as string);
  }, [token]);

  await page.goto(BASE_URL);
  await context.storageState({ path: file });
  await browser.close();
}

export default async function globalSetup(_: FullConfig) {
  await writeState('tests/e2e/_setup/state-b2c.json', 'b2c');
  await writeState('tests/e2e/_setup/state-b2b_user.json', 'b2b_user');
  await writeState('tests/e2e/_setup/state-b2b_admin.json', 'b2b_admin');
}
