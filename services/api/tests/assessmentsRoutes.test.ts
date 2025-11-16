import { describe, expect, it, vi } from 'vitest';

import { registerAssessmentRoutes, type AssessmentRepository } from '../routes/assessments';
import { buildTestApp } from './helpers';

const baseAssessment = {
  id: 'assessment-1',
  instrument: 'phq-9',
  score_json: {},
  submitted_at: null,
};

const createRepository = (overrides: Partial<AssessmentRepository> = {}): AssessmentRepository => ({
  createAssessment: vi.fn(async () => baseAssessment),
  listAssessments: vi.fn(async () => [baseAssessment]),
  getAssessment: vi.fn(async () => baseAssessment),
  submitAssessment: vi.fn(async () => ({ ...baseAssessment, submitted_at: new Date().toISOString() })),
  getActiveAssessment: vi.fn(async () => baseAssessment),
  listInstruments: vi.fn(async () => [{ id: 'phq-9', name: 'PHQ-9' }]),
  ...overrides,
});

describe('assessment routes', () => {
  it('creates a new assessment', async () => {
    const repo = createRepository({
      createAssessment: vi.fn(async (_userId, payload) => ({ ...baseAssessment, ...payload })),
    });

    const app = buildTestApp(app => registerAssessmentRoutes(app, { repository: repo }));
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/assessments',
      payload: { instrument: 'phq-9' },
    });

    expect(response.statusCode).toBe(201);
    expect(repo.createAssessment).toHaveBeenCalledWith('user_test', {
      instrument: 'phq-9',
    });
    await app.close();
  });

  it('validates payload before creating assessments', async () => {
    const app = buildTestApp(app => registerAssessmentRoutes(app, { repository: createRepository() }));
    const response = await app.inject({ method: 'POST', url: '/api/v1/assessments', payload: {} });

    expect(response.statusCode).toBe(422);
    await app.close();
  });

  it('returns 404 when assessment is not found', async () => {
    const repo = createRepository({ getAssessment: vi.fn(async () => null) });
    const app = buildTestApp(app => registerAssessmentRoutes(app, { repository: repo }));
    const response = await app.inject({ method: 'GET', url: '/api/v1/assessments/missing' });

    expect(response.statusCode).toBe(404);
    await app.close();
  });
});
