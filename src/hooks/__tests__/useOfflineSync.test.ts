/**
 * Tests pour useOfflineSync hook
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useOfflineSync } from '../useOfflineSync';

// Mock navigator.serviceWorker
const mockController = {
  postMessage: vi.fn(),
};

const mockServiceWorker = {
  controller: mockController,
  ready: Promise.resolve({
    sync: {
      register: vi.fn(),
    },
  }),
};

describe('useOfflineSync', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock navigator
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      writable: true,
      configurable: true,
    });
    
    Object.defineProperty(navigator, 'serviceWorker', {
      value: mockServiceWorker,
      writable: true,
      configurable: true,
    });
    
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(() => '[]'),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initialise avec le statut en ligne correct', () => {
    const { result } = renderHook(() => useOfflineSync());
    
    expect(result.current.state.isOnline).toBe(true);
    expect(result.current.state.pendingJournalDrafts).toBe(0);
    expect(result.current.state.pendingBreathSessions).toBe(0);
  });

  it('détecte le passage hors ligne', async () => {
    const { result } = renderHook(() => useOfflineSync());
    
    act(() => {
      Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
      window.dispatchEvent(new Event('offline'));
    });
    
    await waitFor(() => {
      expect(result.current.state.isOnline).toBe(false);
    });
  });

  it('détecte le retour en ligne', async () => {
    Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
    
    const { result } = renderHook(() => useOfflineSync());
    
    act(() => {
      Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
      window.dispatchEvent(new Event('online'));
    });
    
    await waitFor(() => {
      expect(result.current.state.isOnline).toBe(true);
    });
  });

  it('retourne les patterns de respiration par défaut si SW indisponible', async () => {
    Object.defineProperty(navigator, 'serviceWorker', { 
      value: { controller: null }, 
      configurable: true 
    });
    
    const { result } = renderHook(() => useOfflineSync());
    
    let patterns: Record<string, unknown> = {};
    await act(async () => {
      patterns = await result.current.getBreathPatterns();
    });
    
    expect(patterns['4-7-8']).toBeDefined();
    expect(patterns['4-7-8']).toHaveProperty('name', 'Relaxation');
  });

  it('sauvegarde les brouillons journal en localStorage si SW indisponible', async () => {
    Object.defineProperty(navigator, 'serviceWorker', { 
      value: { controller: null }, 
      configurable: true 
    });
    
    const { result } = renderHook(() => useOfflineSync());
    
    const draft = {
      content: 'Test journal entry',
      mood: 'happy',
      createdAt: new Date().toISOString(),
    };
    
    let success = false;
    await act(async () => {
      success = await result.current.saveJournalDraft(draft);
    });
    
    expect(success).toBe(true);
    expect(window.localStorage.setItem).toHaveBeenCalled();
  });

  it('sauvegarde les sessions respiration en localStorage si SW indisponible', async () => {
    Object.defineProperty(navigator, 'serviceWorker', { 
      value: { controller: null }, 
      configurable: true 
    });
    
    const { result } = renderHook(() => useOfflineSync());
    
    const session = {
      pattern: '4-7-8',
      duration: 300,
      completedAt: new Date().toISOString(),
      cycles: 5,
    };
    
    let success = false;
    await act(async () => {
      success = await result.current.saveBreathSession(session);
    });
    
    expect(success).toBe(true);
    expect(window.localStorage.setItem).toHaveBeenCalled();
  });

  it('expose les fonctions nécessaires', () => {
    const { result } = renderHook(() => useOfflineSync());
    
    expect(typeof result.current.saveJournalDraft).toBe('function');
    expect(typeof result.current.saveBreathSession).toBe('function');
    expect(typeof result.current.getBreathPatterns).toBe('function');
    expect(typeof result.current.requestSync).toBe('function');
  });
});
