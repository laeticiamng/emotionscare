import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useBreathworkOrchestration } from '@/features/orchestration/useBreathworkOrchestration';
import type { UseAssessmentResult } from '@/hooks/useAssessment';

vi.mock('@sentry/react', () => ({
  addBreadcrumb: vi.fn(),
  captureException: vi.fn(),
}));

vi.mock('@/hooks/useAssessment', () => ({
  useAssessment: vi.fn(),
}));

const { useAssessment } = await import('@/hooks/useAssessment');
const mockUseAssessment = useAssessment as unknown as ReturnType<typeof vi.fn>;

const mkAssessment = (
  state: Partial<UseAssessmentResult['state']>,
  instrument: UseAssessmentResult['instrument'],
): UseAssessmentResult => ({
  instrument,
  state: {
    instrument,
    locale: 'fr',
    catalog: undefined,
    lastComputation: undefined,
    currentInstrument: null,
    isActive: false,
    isStarting: false,
    isSubmitting: false,
    hasConsent: state.hasConsent ?? instrument !== 'STAI6',
    consentDecision: state.consentDecision ?? (instrument !== 'STAI6' ? 'granted' : 'declined'),
    isConsentLoading: false,
    isFlagEnabled: true,
    isDNTEnabled: false,
    canDisplay: state.canDisplay ?? true,
    lastCompletedAt: state.lastCompletedAt,
    error: null,
    ...state,
  },
  isEligible: true,
  start: vi.fn(),
  triggerAssessment: vi.fn(),
  submit: vi.fn(),
  submitResponse: vi.fn(),
  grantConsent: vi.fn(),
  declineConsent: vi.fn(),
  reset: vi.fn(),
});

describe('breathwork orchestration scenarios', () => {
  beforeEach(() => {
    mockUseAssessment.mockReset();
  });

  it('keeps default calm profile when consent is missing', () => {
    const staiAssessment = mkAssessment({ canDisplay: false }, 'STAI6');
    const isiAssessment = mkAssessment({}, 'ISI');
    mockUseAssessment.mockImplementation((instrument: string) =>
      instrument === 'STAI6' ? staiAssessment : isiAssessment,
    );

    const { result } = renderHook(() => useBreathworkOrchestration());

    expect(result.current.profile).toBe('calm_soft');
    expect(result.current.staiPreDue).toBe(false);
  });

  it('activates long exhale profile when STAI level is high', () => {
    const staiAssessment = mkAssessment(
      {
        canDisplay: true,
        lastComputation: {
          instrument: 'STAI6',
          locale: 'fr',
          level: 4,
          summary: 'tension présente',
          hints: [],
          generatedAt: '2024-06-01T18:00:00.000Z',
        },
        lastCompletedAt: '2024-05-31T10:00:00.000Z',
      },
      'STAI6',
    );
    const isiAssessment = mkAssessment({}, 'ISI');

    mockUseAssessment.mockImplementation((instrument: string) =>
      instrument === 'STAI6' ? staiAssessment : isiAssessment,
    );

    const { result } = renderHook(() => useBreathworkOrchestration());

    expect(result.current.profile).toBe('long_exhale_focus');
    expect(result.current.ambience).toBe('very_soft');
  });

  it('switches to sleep preset when ISI level is elevated in the evening', () => {
    vi.setSystemTime(new Date('2024-06-01T21:00:00.000Z'));
    const staiAssessment = mkAssessment(
      {
        lastComputation: {
          instrument: 'STAI6',
          locale: 'fr',
          level: 2,
          summary: 'nuit fragile 3',
          hints: [],
          generatedAt: '2024-06-01T19:00:00.000Z',
        },
      },
      'STAI6',
    );
    const isiAssessment = mkAssessment(
      {
        lastComputation: {
          instrument: 'ISI',
          locale: 'fr',
          level: 3,
          summary: 'nuit fragile',
          hints: [],
          generatedAt: '2024-06-01T19:00:00.000Z',
        },
        lastCompletedAt: '2024-05-15T09:00:00.000Z',
      },
      'ISI',
    );

    mockUseAssessment.mockImplementation((instrument: string) =>
      instrument === 'STAI6' ? staiAssessment : isiAssessment,
    );

    const { result } = renderHook(() => useBreathworkOrchestration());

    expect(result.current.mode).toBe('sleep_preset');
    expect(result.current.summaryLabel).toBe('nuit fragile');
  });
});
