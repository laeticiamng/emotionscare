// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useJournalSettings } from '../useJournalSettings';
import { journalPromptsService } from '@/services/journalPrompts';

vi.mock('@/services/journalPrompts');
vi.mock('@/hooks/useJournalPrompts', () => ({
  useJournalPrompts: () => ({
    prompts: [],
    getRandomPrompt: vi.fn(),
    incrementUsage: vi.fn(),
  }),
}));

vi.mock('@/hooks/useJournalReminders', () => ({
  useJournalReminders: () => ({
    reminders: [],
    createReminder: vi.fn(),
    updateReminder: vi.fn(),
    toggleReminder: vi.fn(),
    deleteReminder: vi.fn(),
  }),
}));

describe('useJournalSettings', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('initialise avec les paramètres par défaut', () => {
    const { result } = renderHook(() => useJournalSettings());

    expect(result.current.settings).toEqual({
      showPrompts: true,
      promptCategory: 'all',
      autoSuggestPrompt: false,
      enableReminders: true,
    });
  });

  it('charge les paramètres depuis localStorage', () => {
    const savedSettings = {
      showPrompts: false,
      promptCategory: 'gratitude',
      autoSuggestPrompt: true,
      enableReminders: false,
    };
    localStorage.setItem('journal-settings', JSON.stringify(savedSettings));

    const { result } = renderHook(() => useJournalSettings());

    expect(result.current.settings.showPrompts).toBe(false);
    expect(result.current.settings.promptCategory).toBe('gratitude');
  });

  it('met à jour les paramètres et persiste dans localStorage', () => {
    const { result } = renderHook(() => useJournalSettings());

    act(() => {
      result.current.updateSettings({ showPrompts: false });
    });

    expect(result.current.settings.showPrompts).toBe(false);
    
    const stored = JSON.parse(localStorage.getItem('journal-settings') || '{}');
    expect(stored.showPrompts).toBe(false);
  });

  it('détecte les rappels actifs', () => {
    const mockReminders = [
      { id: '1', is_active: false },
      { id: '2', is_active: true },
    ];

    vi.mocked(useJournalReminders).mockReturnValue({
      reminders: mockReminders,
      createReminder: vi.fn(),
      updateReminder: vi.fn(),
      toggleReminder: vi.fn(),
      deleteReminder: vi.fn(),
    } as any);

    const { result } = renderHook(() => useJournalSettings());

    expect(result.current.hasActiveReminders).toBe(true);
  });

  it('gère le merge partiel des paramètres', () => {
    const { result } = renderHook(() => useJournalSettings());

    act(() => {
      result.current.updateSettings({ promptCategory: 'emotions' });
    });

    expect(result.current.settings.promptCategory).toBe('emotions');
    expect(result.current.settings.showPrompts).toBe(true); // inchangé
  });
});
