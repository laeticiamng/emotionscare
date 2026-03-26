// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createFlashGlowJournalEntry } from '@/modules/flash-glow/journal';
import { journalService } from '@/modules/journal/journalService';

vi.mock('@/modules/journal/journalService', () => {
  return {
    journalService: {
      saveEntry: vi.fn()
    }
  };
});

describe('createFlashGlowJournalEntry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('enregistre une entrée structurée avec tonalité et résumé', async () => {
    const now = new Date();
    const mockedEntry = {
      id: 'entry-1',
      content: 'mocked',
      summary: 'Flash Glow Ultra - Gain ressenti',
      tone: 'positive' as const,
      ephemeral: false,
      created_at: now,
      duration: 95
    };

    vi.mocked(journalService.saveEntry).mockResolvedValue(mockedEntry as any);

    const entry = await createFlashGlowJournalEntry({
      label: 'gain',
      duration: 95,
      intensity: 82,
      glowType: 'energy',
      recommendation: 'Continuez sur cette lancée ✨',
      context: 'Flash Glow Ultra',
      moodBefore: 40,
      moodAfter: 72
    });

    expect(journalService.saveEntry).toHaveBeenCalledTimes(1);
    expect(journalService.saveEntry).toHaveBeenCalledWith(
      expect.objectContaining({
        tone: 'positive',
        summary: expect.stringContaining('Flash Glow Ultra'),
        content: expect.stringContaining('Gain ressenti'),
        duration: 95,
        ephemeral: false,
        metadata: {
          mood_before: 40,
          mood_after: 72,
          mood_delta: 32
        }
      })
    );

    expect(entry).toEqual(mockedEntry);
  });

  it('retourne null si la journalisation échoue', async () => {
    vi.mocked(journalService.saveEntry).mockRejectedValue(new Error('storage error'));

    const entry = await createFlashGlowJournalEntry({
      duration: 60,
      intensity: 70,
      glowType: 'calm',
      recommendation: 'Respirez profondément.'
    });

    expect(entry).toBeNull();
  });
});
