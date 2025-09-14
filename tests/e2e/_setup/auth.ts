import { Page } from '@playwright/test';

export async function loginAs(page: Page, role: 'b2c' | 'b2b_user' | 'b2b_admin') {
  const token = `${role}-test-token`;
  await page.addInitScript(([token]) => {
    window.localStorage.setItem('auth_token', token);
  }, token);
}
