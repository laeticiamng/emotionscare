
import { renderHook } from '@testing-library/react';
import { useMusic } from '../useMusic';
import { MusicProvider } from '@/contexts/MusicContext';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MusicProvider>{children}</MusicProvider>
);

describe('useMusic', () => {
  test('should initialize with default values', () => {
    const { result } = renderHook(() => useMusic(), { wrapper });
    
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentTrack).toBeNull();
    expect(result.current.volume).toBe(1);
  });

  test('should throw error when used outside MusicProvider', () => {
    expect(() => {
      renderHook(() => useMusic());
    }).toThrow('useMusic must be used within a MusicProvider');
  });
});
