/**
 * Tests pour useJournalAutoSave
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useJournalAutoSave } from '../useJournalAutoSave';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useJournalAutoSave', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with no autosave', () => {
    const { result } = renderHook(() =>
      useJournalAutoSave({ text: '', tags: [] })
    );

    expect(result.current.hasAutoSave).toBe(false);
    expect(result.current.lastSavedAt).toBeNull();
    expect(result.current.isSaving).toBe(false);
  });

  it('should detect existing autosave on mount', () => {
    const savedData = {
      text: 'Test brouillon',
      tags: ['test'],
      savedAt: new Date().toISOString(),
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedData));

    const onRestore = vi.fn();
    const { result } = renderHook(() =>
      useJournalAutoSave({ text: '', tags: [], onRestore })
    );

    expect(result.current.hasAutoSave).toBe(true);
    expect(onRestore).toHaveBeenCalledWith(savedData);
  });

  it('should save text after interval', () => {
    const { result, rerender } = renderHook(
      ({ text, tags }) => useJournalAutoSave({ text, tags }),
      { initialProps: { text: 'Mon journal', tags: ['emotion'] } }
    );

    // Avancer de 30 secondes
    act(() => {
      vi.advanceTimersByTime(30_000);
    });

    expect(localStorageMock.setItem).toHaveBeenCalled();
    expect(result.current.hasAutoSave).toBe(true);
  });

  it('should not save empty text', () => {
    const { result } = renderHook(() =>
      useJournalAutoSave({ text: '', tags: [] })
    );

    act(() => {
      vi.advanceTimersByTime(30_000);
    });

    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });

  it('should clear autosave', () => {
    const savedData = {
      text: 'Test',
      tags: [],
      savedAt: new Date().toISOString(),
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedData));

    const { result } = renderHook(() =>
      useJournalAutoSave({ text: '', tags: [] })
    );

    act(() => {
      result.current.clear();
    });

    expect(localStorageMock.removeItem).toHaveBeenCalled();
    expect(result.current.hasAutoSave).toBe(false);
  });

  it('should restore autosave data', () => {
    const savedData = {
      text: 'Restauré',
      tags: ['restored'],
      savedAt: new Date().toISOString(),
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedData));

    const { result } = renderHook(() =>
      useJournalAutoSave({ text: '', tags: [] })
    );

    const restored = result.current.restore();
    expect(restored).toEqual(savedData);
  });
});
