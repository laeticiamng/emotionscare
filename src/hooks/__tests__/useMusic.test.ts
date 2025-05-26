
import { renderHookWithMusicProvider } from '@/tests/utils';
import { useMusic } from '../useMusic';

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
