import { request } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
const TEST_DB_SECRET = process.env.TEST_DB_SECRET || '';

/**
 * Fetch a journal entry from the database using a test-only endpoint.
 * The endpoint must be protected and available only in test environments.
 */
export async function readJournalEntry(id: string) {
  const ctx = await request.newContext({
    baseURL: BASE_URL,
    extraHTTPHeaders: { 'x-test-secret': TEST_DB_SECRET },
  });
  const res = await ctx.get(`/api/test/db/read-journal?id=${id}`);
  if (res.status() !== 200) {
    throw new Error(`DB read failed for journal ${id}: ${res.status()}`);
  }
  const data = await res.json();
  await ctx.dispose();
  return data;
}
