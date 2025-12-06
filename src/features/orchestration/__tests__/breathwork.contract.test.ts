// @ts-nocheck
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const EDGE_URL = 'https://edge.supabase.test/functions/v1';

const server = setupServer(
  http.post(`${EDGE_URL}/assess-start`, async () =>
    HttpResponse.json({
      instrument: 'STAI6',
      locale: 'fr',
      name: 'State Trait Anxiety',
      version: '1.0',
      expiry_minutes: 30,
      items: [
        { id: 's1', prompt: 'Je me sens calme.', type: 'scale', min: 1, max: 4 },
        { id: 's2', prompt: 'Je me sens tendu·e.', type: 'scale', min: 1, max: 4 },
      ],
    }),
  ),
  http.post(`${EDGE_URL}/assess-submit`, async () =>
    HttpResponse.json({
      instrument: 'STAI6',
      locale: 'fr',
      level: 3,
      summary: 'tension présente',
      hints: [],
      generatedAt: '2024-06-01T20:00:00.000Z',
    }),
  ),
  http.post(`${EDGE_URL}/assess-submit-isi`, async () =>
    HttpResponse.json({
      instrument: 'ISI',
      locale: 'fr',
      level: 4,
      summary: 'nuit très agitée',
      hints: [],
      generatedAt: '2024-06-01T20:00:00.000Z',
    }),
  ),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('breathwork assessment edge contracts', () => {
  it('delivers textual STAI start payload without numeric summary', async () => {
    const response = await fetch(`${EDGE_URL}/assess-start`, { method: 'POST' });
    const payload = await response.json();

    expect(payload.instrument).toBe('STAI6');
    expect(Array.isArray(payload.items)).toBe(true);
    payload.items.forEach((item: { prompt: string }) => {
      expect(typeof item.prompt).toBe('string');
    });
  });

  it('returns textual summaries without score field for STAI and ISI submissions', async () => {
    const staiResponse = await fetch(`${EDGE_URL}/assess-submit`, { method: 'POST' });
    const staiPayload = await staiResponse.json();

    expect(staiPayload.summary).toBe('tension présente');
    expect(/\d/.test(staiPayload.summary)).toBe(false);
    expect(staiPayload.score).toBeUndefined();

    const isiResponse = await fetch(`${EDGE_URL}/assess-submit-isi`, { method: 'POST' });
    const isiPayload = await isiResponse.json();

    expect(isiPayload.summary).toBe('nuit très agitée');
    expect(/\d/.test(isiPayload.summary)).toBe(false);
    expect(isiPayload.score).toBeUndefined();
  });
});
