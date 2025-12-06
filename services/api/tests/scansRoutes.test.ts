import { describe, expect, it, vi } from 'vitest';

import { registerScanRoutes, type ScanRepository } from '../routes/scans';
import { buildTestApp } from './helpers';

const baseScan = {
  id: 'scan-1',
  user_id: 'user_test',
  dominant_emotion: 'joy',
  confidence_score: 0.8,
  scan_type: 'facial',
  emotions: { joy: 0.8 },
  created_at: new Date().toISOString(),
};

const createRepository = (overrides: Partial<ScanRepository> = {}): ScanRepository => ({
  createScan: vi.fn(async () => baseScan),
  listScans: vi.fn(async () => [baseScan]),
  getScan: vi.fn(async () => baseScan),
  deleteScan: vi.fn(async () => undefined),
  listScansSince: vi.fn(async () => [baseScan]),
  listRecentScans: vi.fn(async () => [baseScan]),
  ...overrides,
});

describe('scan routes', () => {
  it('persists a new scan payload', async () => {
    const repo = createRepository({
      createScan: vi.fn(async (_userId, payload) => ({ ...baseScan, ...payload })),
    });
    const app = buildTestApp(app => registerScanRoutes(app, { repository: repo }));

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/scans',
      payload: {
        emotions: { joy: 0.8 },
        dominant_emotion: 'joy',
        confidence_score: 0.82,
        scan_type: 'facial',
      },
    });

    expect(response.statusCode).toBe(201);
    expect(repo.createScan).toHaveBeenCalled();
    await app.close();
  });

  it('aggregates stats over returned scans', async () => {
    const repo = createRepository({
      listScansSince: vi.fn(async () => [
        baseScan,
        { ...baseScan, id: 'scan-2', dominant_emotion: 'calm', confidence_score: 0.6 },
      ]),
    });
    const app = buildTestApp(app => registerScanRoutes(app, { repository: repo }));
    const response = await app.inject({ method: 'GET', url: '/api/v1/scans/stats?period=daily' });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.ok).toBe(true);
    expect(body.data.total_scans).toBe(2);
    expect(body.data.emotion_distribution.joy).toBe(1);
    await app.close();
  });

  it('returns 404 when scan is missing', async () => {
    const repo = createRepository({ getScan: vi.fn(async () => null) });
    const app = buildTestApp(app => registerScanRoutes(app, { repository: repo }));
    const response = await app.inject({ method: 'GET', url: '/api/v1/scans/missing' });

    expect(response.statusCode).toBe(404);
    await app.close();
  });
});
