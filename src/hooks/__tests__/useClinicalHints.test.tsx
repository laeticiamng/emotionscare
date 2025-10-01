// @ts-nocheck
import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { clinicalOrchestration } from '@/services/clinicalOrchestration';

import { useClinicalHints } from '../useClinicalHints';

type MockedOrchestration = typeof clinicalOrchestration & {
  getActiveSignals: ReturnType<typeof vi.fn>;
};

vi.mock('@/services/clinicalOrchestration', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/services/clinicalOrchestration')>();
  return {
    ...actual,
    clinicalOrchestration: {
      ...actual.clinicalOrchestration,
      getActiveSignals: vi.fn(),
    },
  } satisfies Partial<typeof actual>;
});

describe('useClinicalHints', () => {
  const orchestration = clinicalOrchestration as MockedOrchestration;

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('maps orchestration metadata to unique hint actions', async () => {
    orchestration.getActiveSignals.mockResolvedValue([
      {
        id: 'signal-1',
        source_instrument: 'WHO5',
        domain: 'wellbeing',
        level: 3,
        module_context: 'dashboard',
        metadata: {
          hints: ['gentle_tone', { action: 'increase_support' }],
        },
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 60_000).toISOString(),
      },
      {
        id: 'signal-2',
        source_instrument: 'STAI6',
        domain: 'anxiety',
        level: 4,
        module_context: 'dashboard',
        metadata: {
          actions: [{ action: 'gentle_tone' }, 'reduce_intensity'],
        },
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 120_000).toISOString(),
      },
    ]);

    const { result } = renderHook(() => useClinicalHints('dashboard'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hints).toEqual(['gentle_tone', 'increase_support', 'reduce_intensity']);
    expect(result.current.error).toBeNull();
    expect(orchestration.getActiveSignals).toHaveBeenCalledWith('dashboard');
  });

  it('captures orchestration errors and exposes them to the caller', async () => {
    orchestration.getActiveSignals.mockRejectedValue(new Error('network_failure'));

    const { result } = renderHook(() => useClinicalHints('music'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hints).toEqual([]);
    expect(result.current.error).toBe('network_failure');

    orchestration.getActiveSignals.mockResolvedValue([]);

    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.error).toBeNull();
  });
});
