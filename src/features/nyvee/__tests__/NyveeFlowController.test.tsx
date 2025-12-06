// @ts-nocheck
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import NyveeFlowController from '@/features/nyvee/NyveeFlowController';

const deltaMock = vi.fn();
const snapshots = {
  pre: { level: 2, summary: 'pre', generatedAt: new Date().toISOString() },
  post: { level: 2, summary: 'post', generatedAt: new Date().toISOString() },
};

vi.mock('@sentry/react', () => ({
  addBreadcrumb: vi.fn(),
  captureException: vi.fn(),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

const persistNyveeSessionMock = vi.fn(() => Promise.resolve());
vi.mock('@/features/session/persistSession', () => ({
  persistNyveeSession: (...args: unknown[]) => persistNyveeSessionMock(...args),
}));

vi.mock('@/features/orchestration/useStai6Orchestration', () => ({
  useStai6Orchestration: () => ({
    snapshots,
    register: vi.fn(),
    delta: deltaMock,
    reset: vi.fn(),
  }),
}));

describe('NyveeFlowController', () => {
  beforeEach(() => {
    deltaMock.mockReset();
    persistNyveeSessionMock.mockClear();
    snapshots.pre = { level: 2, summary: 'pre', generatedAt: new Date().toISOString() };
    snapshots.post = { level: 2, summary: 'post', generatedAt: new Date().toISOString() };
  });

  it('suggests a silent anchor when delta decreases and triggers a soft exit', async () => {
    deltaMock.mockReturnValue('down');

    const view = render(<NyveeFlowController profile="silent_anchor" anchorDurationMs={20} />);

    expect(await screen.findByText('Transition paisible')).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: 'Aller vers la douceur' }));

    await Promise.resolve();

    expect(persistNyveeSessionMock).toHaveBeenCalledWith('nyvee', {
      profile: 'silent_anchor',
      next: 'anchor',
      exit: 'soft',
      notes: 'verbal_toast',
    });

    expect(view.container.querySelector('[data-testid="nyvee-soft-exit"]')).toBeInTheDocument();
  });

  it('shows the grounding card when delta is flat and records persistence', async () => {
    deltaMock.mockReturnValue('flat');

    render(<NyveeFlowController profile="silent_anchor" anchorDurationMs={20} />);

    expect(await screen.findByText('Exploration sensorielle')).toBeVisible();
    expect(screen.getByTestId('grounding-progress').textContent).toContain('Étape une');
    expect(screen.getByTestId('grounding-instruction').textContent).not.toMatch(/\d/);

    fireEvent.click(screen.getByRole('button', { name: 'Continuer' }));
    fireEvent.click(screen.getByRole('button', { name: 'Continuer' }));
    fireEvent.click(screen.getByRole('button', { name: 'Continuer' }));
    fireEvent.click(screen.getByRole('button', { name: 'Continuer' }));
    fireEvent.click(screen.getByRole('button', { name: 'Terminer' }));

    await Promise.resolve();

    expect(persistNyveeSessionMock).toHaveBeenCalledWith('nyvee', {
      profile: 'silent_anchor',
      next: '54321',
      exit: 'soft',
      notes: 'verbal_toast',
    });
  });
});
