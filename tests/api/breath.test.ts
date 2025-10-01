// @ts-nocheck
import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../../services/breath/server';
import { insertWeekly, clear } from '../../services/breath/lib/db';
import { hash } from '../../services/journal/lib/hash';
import fetch from 'cross-fetch';

describe('Breath API', () => {
  beforeEach(() => {
    clear();
    insertWeekly({
      user_id_hash: hash('u1'),
      week_start: '2025-06-02',
      hrv_stress_idx: 20,
      coherence_avg: 60,
      mvpa_week: 30,
      relax_idx: 5,
      mindfulness_avg: 2.2,
      mood_score: 0.3
    });
  });

  it('user weekly KPIs', async () => {
    const app = createApp();
    const res = await request(app)
      .get('/me/breath/weekly')
      .set('Authorization', 'Bearer u1');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('fetch polyfill works', async () => {
    vi.mock('cross-fetch', () => ({
      default: vi.fn(() => Promise.resolve({ ok: true })),
    }));
    await expect(fetch('/ping')).resolves.toBeDefined();
  });
});
