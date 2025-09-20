import { afterEach, describe, expect, it, vi } from 'vitest';

import { submitAssessment } from '../../src/features/assess/api';

describe('submitAssessment helper', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns summary payload on success', async () => {
    const summaryResponse = { status: 'ok', summary: 'bonne forme' };
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(JSON.stringify(summaryResponse), { status: 200 }));

    const result = await submitAssessment('WHO5', { '1': 4, '2': 5 });
    expect(result).toEqual(summaryResponse);
    expect(globalThis.fetch).toHaveBeenCalledWith('/functions/v1/assess-submit', expect.objectContaining({ method: 'POST' }));
  });

  it('throws the API error message when provided', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ error: 'optin_required' }), { status: 403 }),
    );

    await expect(submitAssessment('WHO5', { '1': 2 })).rejects.toThrow('optin_required');
  });

  it('falls back to a generic error when payload is not JSON', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response('oops', { status: 500 }));

    await expect(submitAssessment('WHO5', { '1': 3 })).rejects.toThrow('assess_submit_failed');
  });
});
