import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useBreathworkOrchestration } from '../useBreathworkOrchestration';
import type { UseAssessmentResult } from '@/hooks/useAssessment';

vi.mock('@sentry/react', () => ({
  addBreadcrumb: vi.fn(),
  captureException: vi.fn(),
}));

const grantConsent = vi.fn(() => Promise.resolve());
const triggerAssessment = vi.fn(() => Promise.resolve(true));
const submitResponse = vi.fn(() => Promise.resolve(true));
const reset = vi.fn();

const createAssessment = (
  overrides: Partial<UseAssessmentResult['state']>,
  instrument: UseAssessmentResult['instrument'] = 'STAI6',
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
    hasConsent: true,
    consentDecision: 'granted',
    isConsentLoading: false,
    isFlagEnabled: true,
    isDNTEnabled: false,
    canDisplay: true,
    lastCompletedAt: undefined,
    error: null,
    ...overrides,
  },
  isEligible: true,
  start: vi.fn(),
  triggerAssessment,
  submit: vi.fn(),
  submitResponse,
  grantConsent,
  declineConsent: vi.fn(),
  reset,
});

vi.mock('@/hooks/useAssessment', () => ({
  useAssessment: vi.fn(),
}));

const { useAssessment } = await import('@/hooks/useAssessment');
const mockUseAssessment = useAssessment as unknown as ReturnType<typeof vi.fn>;

describe('useBreathworkOrchestration', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-01T20:00:00.000Z'));
    vi.clearAllMocks();
    mockUseAssessment.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('maps STAI level to long exhale profile with soft ambience and guidance', () => {
    const staiAssessment = createAssessment({
      lastComputation: {
        instrument: 'STAI6',
        locale: 'fr',
        level: 3,
        summary: 'tension présente',
        hints: [],
        generatedAt: '2024-06-01T19:00:00.000Z',
      },
      lastCompletedAt: '2024-05-31T10:00:00.000Z',
    });

    const isiAssessment = createAssessment(
      {
        lastComputation: {
          instrument: 'ISI',
          locale: 'fr',
          level: 1,
          summary: 'nuit plutôt douce',
          hints: [],
          generatedAt: '2024-05-30T10:00:00.000Z',
        },
        lastCompletedAt: '2024-05-20T10:00:00.000Z',
      },
      'ISI',
    );

    mockUseAssessment.mockImplementation((instrument: string) =>
      instrument === 'STAI6' ? staiAssessment : isiAssessment,
    );

    const { result } = renderHook(() => useBreathworkOrchestration());

    expect(result.current.profile).toBe('long_exhale_focus');
    expect(result.current.ambience).toBe('very_soft');
    expect(result.current.guidance).toBe('long_exhale');
    expect(result.current.summaryLabel).toBe('tension présente');
  });

  it('returns sleep mode during evening when ISI level is elevated', () => {
    const staiAssessment = createAssessment({
      lastCompletedAt: '2024-05-31T10:00:00.000Z',
      lastComputation: {
        instrument: 'STAI6',
        locale: 'fr',
        level: 2,
        summary: 'sommeil très perturbé 2',
        hints: [],
        generatedAt: '2024-05-31T18:00:00.000Z',
      },
    });
    const isiAssessment = createAssessment(
      {
        lastComputation: {
          instrument: 'ISI',
          locale: 'fr',
          level: 4,
          summary: 'sommeil très perturbé 2',
          hints: [],
          generatedAt: '2024-05-31T18:00:00.000Z',
        },
        lastCompletedAt: '2024-05-01T08:00:00.000Z',
      },
      'ISI',
    );

    mockUseAssessment.mockImplementation((instrument: string) =>
      instrument === 'STAI6' ? staiAssessment : isiAssessment,
    );

    const { result } = renderHook(() => useBreathworkOrchestration());

    expect(result.current.mode).toBe('sleep_preset');
    expect(result.current.summaryLabel).toBe('sommeil très perturbé');
  });

  it('marks assessments due according to intervals', () => {
    const staiAssessment = createAssessment({
      lastCompletedAt: '2024-06-01T12:00:00.000Z',
    });
    const isiAssessment = createAssessment(
      {
        lastCompletedAt: '2024-05-20T20:00:00.000Z',
      },
      'ISI',
    );

    mockUseAssessment.mockImplementation((instrument: string) =>
      instrument === 'STAI6' ? staiAssessment : isiAssessment,
    );

    const { result } = renderHook(() => useBreathworkOrchestration());

    expect(result.current.staiPreDue).toBe(true);
    expect(result.current.isiDue).toBe(true);
  });

  it('suggests more silence when STAI level decreases', () => {
    const staiAssessment = createAssessment({
      lastComputation: {
        instrument: 'STAI6',
        locale: 'fr',
        level: 3,
        summary: 'tension présente',
        hints: [],
        generatedAt: '2024-06-01T18:00:00.000Z',
      },
      lastCompletedAt: '2024-05-30T09:00:00.000Z',
    });
    const isiAssessment = createAssessment({}, 'ISI');

    mockUseAssessment.mockImplementation((instrument: string) =>
      instrument === 'STAI6' ? staiAssessment : isiAssessment,
    );

    const { result, rerender } = renderHook(() => useBreathworkOrchestration());

    expect(result.current.next).toBe('none');

    act(() => {
      staiAssessment.state.lastComputation = {
        instrument: 'STAI6',
        locale: 'fr',
        level: 1,
        summary: 'apaisement profond',
        hints: [],
        generatedAt: '2024-06-01T21:00:00.000Z',
      };
    });

    rerender();

    expect(result.current.next).toBe('offer_more_silence');
  });
});
