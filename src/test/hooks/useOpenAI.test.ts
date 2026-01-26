// @ts-nocheck
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import useOpenAI from '@/hooks/api/useOpenAI';

describe('useOpenAI', () => {
  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useOpenAI());
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.generateResponse).toBe('function');
  });

  it('should handle successful response generation', async () => {
    const { result } = renderHook(() => useOpenAI());
    
    const response = await result.current.generateResponse({ prompt: 'test prompt' });
    
    await waitFor(() => {
      expect(response).toBe('test response');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  it('should handle loading state', async () => {
    const { result } = renderHook(() => useOpenAI());
    
    const promise = result.current.generateResponse({ prompt: 'test prompt' });
    
    // Check loading state is set
    expect(result.current.isLoading).toBe(true);
    
    await promise;
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });
});