
import { renderHookWithMusicProvider, renderHook } from '@/tests/utils';
import { useMusic } from '../useMusic';
import { vi } from 'vitest';

const mockAudio = {
  play: vi.fn().mockResolvedValue(undefined),
  pause: vi.fn(),
  load: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  volume: 0.7,
};

Object.defineProperty(window, 'Audio', {
  writable: true,
  value: vi.fn().mockImplementation(() => mockAudio),
});

describe('useMusic', () => {
  test('should initialize with default values', () => {
    const { result } = renderHookWithMusicProvider(() => useMusic());
    
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentTrack).toBeNull();
    expect(result.current.volume).toBe(0.7);
  });

  test('should throw error when used outside MusicProvider', () => {
    expect(() => {
      renderHook(() => useMusic());
    }).toThrow('useMusic must be used within a MusicProvider');
  });
});
