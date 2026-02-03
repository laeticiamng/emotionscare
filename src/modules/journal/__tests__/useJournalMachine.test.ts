/**
 * Tests for useJournalMachine hook
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useJournalMachine } from '../useJournalMachine';

// Mock supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            limit: () => Promise.resolve({ data: [], error: null })
          })
        })
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ 
            data: { id: 'test-id', content: 'Test note' }, 
            error: null 
          })
        })
      }),
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: null })
      }),
      delete: () => ({
        eq: () => Promise.resolve({ data: null, error: null })
      })
    }),
    auth: {
      getUser: () => Promise.resolve({
        data: { user: { id: 'test-user' } },
        error: null
      })
    }
  }
}));

// Mock navigator.mediaDevices
Object.defineProperty(global.navigator, 'mediaDevices', {
  value: {
    getUserMedia: vi.fn(() => Promise.resolve({
      getTracks: () => [{ stop: vi.fn() }]
    }))
  },
  writable: true
});

describe('useJournalMachine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with idle state', () => {
    const { result } = renderHook(() => useJournalMachine());
    
    expect(result.current.state).toBe('idle');
    expect(result.current.isRecording).toBe(false);
    expect(result.current.recordingDuration).toBe(0);
  });

  it('provides correct data structure', () => {
    const { result } = renderHook(() => useJournalMachine());
    
    expect(result.current.data).toBeDefined();
    expect(result.current.data.entries).toEqual([]);
    expect(result.current.data.isRecording).toBe(false);
  });

  it('has recording capability check', () => {
    const { result } = renderHook(() => useJournalMachine());
    
    expect(typeof result.current.canRecord).toBe('boolean');
  });

  it('provides startRecording method', () => {
    const { result } = renderHook(() => useJournalMachine());
    
    expect(typeof result.current.startRecording).toBe('function');
  });

  it('provides stopRecording method', () => {
    const { result } = renderHook(() => useJournalMachine());
    
    expect(typeof result.current.stopRecording).toBe('function');
  });

  it('provides submitTextEntry method', () => {
    const { result } = renderHook(() => useJournalMachine());
    
    expect(typeof result.current.submitTextEntry).toBe('function');
  });

  it('provides burnEntry method', () => {
    const { result } = renderHook(() => useJournalMachine());
    
    expect(typeof result.current.burnEntry).toBe('function');
  });

  it('provides reset method', () => {
    const { result } = renderHook(() => useJournalMachine());
    
    expect(typeof result.current.reset).toBe('function');
  });

  it('accepts config callbacks', () => {
    const onEntryCreated = vi.fn();
    const onError = vi.fn();
    
    const { result } = renderHook(() => useJournalMachine({
      onEntryCreated,
      onError
    }));
    
    expect(result.current.state).toBe('idle');
  });
});
