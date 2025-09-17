import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useFlashGlowMachine } from '@/modules/flash-glow/useFlashGlowMachine';
import { flashGlowService } from '@/modules/flash-glow/flash-glowService';
import { createFlashGlowJournalEntry } from '@/modules/flash-glow/journal';
import { toast } from '@/hooks/use-toast';

vi.mock('@/modules/flash-glow/flash-glowService', () => ({
  flashGlowService: {
    startSession: vi.fn().mockResolvedValue({ sessionId: 'fg_1' }),
    endSession: vi.fn().mockResolvedValue({ success: true, message: 'ok' }),
    getStats: vi.fn().mockResolvedValue({ total_sessions: 3, avg_duration: 80, recent_sessions: [] }),
    getRecommendation: vi.fn().mockReturnValue('Recommandation test'),
    triggerHapticFeedback: vi.fn()
  }
}));

vi.mock('@/modules/flash-glow/journal', () => ({
  createFlashGlowJournalEntry: vi.fn().mockResolvedValue({
    id: 'journal-1',
    content: 'entry',
    summary: 'Flash Glow Ultra - Gain ressenti',
    tone: 'positive',
    ephemeral: false,
    created_at: new Date(),
    duration: 90
  })
}));

vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn()
}));

describe('useFlashGlowMachine - auto journalisation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('crée une entrée de journal et enrichit les métadonnées lors de la complétion', async () => {
    const { result } = renderHook(() => useFlashGlowMachine());

    act(() => {
      result.current.setConfig({ duration: 1 });
    });

    await act(async () => {
      const promise = result.current.startSession({ moodBaseline: 40 });
      vi.runAllTimers();
      await promise;
    });

    await act(async () => {
      await result.current.onSessionComplete({ label: 'gain', moodAfter: 76 });
    });

    expect(createFlashGlowJournalEntry).toHaveBeenCalledTimes(1);
    expect(createFlashGlowJournalEntry).toHaveBeenCalledWith(expect.objectContaining({
      label: 'gain',
      context: 'Flash Glow Ultra',
      recommendation: 'Recommandation test',
      moodBefore: 40,
      moodAfter: 76,
      moodDelta: 36
    }));

    expect(flashGlowService.endSession).toHaveBeenCalledWith(expect.objectContaining({
      metadata: expect.objectContaining({
        moodBefore: 40,
        moodAfter: 76,
        moodDelta: 36,
        autoJournal: true,
        journalEntryId: 'journal-1',
        journalSummary: 'Flash Glow Ultra - Gain ressenti',
        journalTone: 'positive'
      })
    }));

    expect(toast).toHaveBeenCalledWith(expect.objectContaining({
      description: expect.stringContaining('Votre expérience a été ajoutée automatiquement au journal')
    }));
  });
});
