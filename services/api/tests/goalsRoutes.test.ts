import { describe, expect, it, vi } from 'vitest';

import { registerGoalRoutes, type GoalRepository } from '../routes/goals';
import { buildTestApp } from './helpers';

const baseGoal = {
  id: 'goal-1',
  title: 'Goal',
  current_value: 0,
  completed: false,
};

const createRepository = (overrides: Partial<GoalRepository> = {}): GoalRepository => ({
  createGoal: vi.fn(async () => baseGoal),
  listGoals: vi.fn(async () => [baseGoal]),
  getGoal: vi.fn(async () => baseGoal),
  updateGoal: vi.fn(async () => baseGoal),
  deleteGoal: vi.fn(async () => undefined),
  completeGoal: vi.fn(async () => ({ ...baseGoal, completed: true })),
  updateProgress: vi.fn(async () => ({ ...baseGoal, current_value: 5 })),
  listActiveGoals: vi.fn(async () => [baseGoal]),
  listCompletedGoals: vi.fn(async () => [{ ...baseGoal, id: 'goal-2', completed: true }]),
  listAllGoals: vi.fn(async () => [baseGoal, { ...baseGoal, id: 'goal-2', completed: true }]),
  ...overrides,
});

describe('goal routes', () => {
  it('creates a goal entry', async () => {
    const repo = createRepository({
      createGoal: vi.fn(async (_userId, payload) => ({ ...baseGoal, ...payload })),
    });
    const app = buildTestApp(app => registerGoalRoutes(app, { repository: repo }));
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/goals',
      payload: { title: 'Goal' },
    });

    expect(response.statusCode).toBe(201);
    expect(repo.createGoal).toHaveBeenCalledWith('user_test', { title: 'Goal' });
    await app.close();
  });

  it('updates goal progress using repository', async () => {
    const repo = createRepository();
    const app = buildTestApp(app => registerGoalRoutes(app, { repository: repo }));
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/goals/goal-1/progress',
      payload: { current_value: 5 },
    });

    expect(response.statusCode).toBe(200);
    expect(repo.updateProgress).toHaveBeenCalledWith('goal-1', 'user_test', { current_value: 5 });
    await app.close();
  });

  it('computes stats from repository payload', async () => {
    const repo = createRepository();
    const app = buildTestApp(app => registerGoalRoutes(app, { repository: repo }));
    const response = await app.inject({ method: 'GET', url: '/api/v1/goals/stats' });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.data.total).toBe(2);
    expect(body.data.completed).toBe(1);
    await app.close();
  });
});
