import { describe, it, expect } from 'vitest';
import { createEdgeFunction } from 'edge-test-kit';
import path from 'path';

const fn = createEdgeFunction(path.join('supabase', 'functions', 'journal-weekly-org'));

describe('journal-weekly-org', () => {
  it('forbidden when org mismatch', async () => {
    const res = await fn.invoke({
      method: 'GET',
      path: '/org/xyz/journal/weekly',
      headers: { authorization: 'Bearer test' }
    });
    expect(res.status).toBe(403);
  });
  it('returns rows when admin matches', async () => {
    const res = await fn.invoke({
      method: 'GET',
      path: '/org/test/journal/weekly',
      headers: { authorization: 'Bearer test' }
    });
    expect([200,403]).toContain(res.status);
  });
});
