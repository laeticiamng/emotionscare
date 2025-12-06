// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { createEdgeFunction } from 'edge-test-kit';
import path from 'path';

const fn = createEdgeFunction(path.join('supabase', 'functions', 'journal-weekly-user'));

describe('journal-weekly-user', () => {
  it('returns rows for valid user', async () => {
    const res = await fn.invoke({
      method: 'GET',
      headers: { authorization: 'Bearer test' }
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });
});
