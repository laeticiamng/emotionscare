import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import NyveeFlowController from '@/features/nyvee/NyveeFlowController';
import {
  resolveSceneProfile,
  resolveGuidance,
  sanitizeSummaryLabel,
} from '@/features/orchestration/useStai6Orchestration';

vi.mock('@sentry/react', () => ({
  addBreadcrumb: vi.fn(),
}));

describe('useStai6Orchestration helpers', () => {
  it('maps calmer levels to silent anchor profile with grounding guidance', () => {
    expect(resolveSceneProfile(0)).toBe('silent_anchor');
    expect(resolveSceneProfile(1)).toBe('silent_anchor');
    expect(resolveGuidance(1)).toBe('grounding_soft');
  });

  it('maps level two to soft guided profile', () => {
    expect(resolveSceneProfile(2)).toBe('soft_guided');
    expect(resolveGuidance(2)).toBe('breath_long_exhale');
  });

  it('maps elevated levels to standard profile with long exhale guidance', () => {
    expect(resolveSceneProfile(3)).toBe('standard');
    expect(resolveSceneProfile(4)).toBe('standard');
    expect(resolveGuidance(3)).toBe('breath_long_exhale');
  });

  it('sanitizes summary labels to remove digits', () => {
    const result = sanitizeSummaryLabel('niveau 3 — tension', 3);
    expect(result).toBe('niveau — tension');
    expect(/\d/.test(result)).toBe(false);
  });
});

describe('NyveeFlowController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('respects reduced motion preference', () => {
    render(
      <NyveeFlowController
        sceneProfile="silent_anchor"
        guidance="grounding_soft"
        prefersReducedMotion
        summaryLabel="calme profond"
      >
        <div data-testid="content">contenu</div>
      </NyveeFlowController>,
    );

    const section = screen.getByRole('region', { name: /scène nyvée/i });
    expect(section.className).toContain('motion-reduce:transition-none');
  });
});
