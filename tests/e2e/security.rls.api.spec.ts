import { test, expect, request } from '@playwright/test';

test('RLS: un user ne voit pas les lignes d’un autre', async ({ baseURL }) => {
  const ctxA = await request.newContext({ baseURL });
  const ctxB = await request.newContext({ baseURL });

  await ctxA.get('/api/test-auth/mint?role=b2c&user=alice');
  await ctxB.get('/api/test-auth/mint?role=b2c&user=bob');

  let r = await ctxA.post('/api/v1/journal/entries', { data: { text: 'Privé Alice' } });
  expect(r.status()).toBe(200);

  r = await ctxB.get('/api/v1/journal/entries');
  const list = await r.json();
  expect(JSON.stringify(list)).not.toContain('Privé Alice');
});
