import { FullConfig } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

export default async function globalSetup(config: FullConfig) {
  async function login(role: 'b2c' | 'b2b_user' | 'b2b_admin', file: string) {
    const token = `${role}-test-token`;
    const storage = {
      origins: [
        {
          origin: 'http://localhost:3000',
          localStorage: [{ name: 'auth_token', value: token }],
        },
      ],
    };
    await writeFile(file, JSON.stringify(storage));
  }

  await login('b2c', 'tests/e2e/_setup/state-b2c.json');
  await login('b2b_user', 'tests/e2e/_setup/state-b2b_user.json');
  await login('b2b_admin', 'tests/e2e/_setup/state-b2b_admin.json');
}
