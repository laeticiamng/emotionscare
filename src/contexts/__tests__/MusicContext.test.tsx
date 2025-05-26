
import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import { renderHookWithMusicProvider } from '../../tests/utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MusicProvider, useMusic } from '@/contexts/MusicContext';
import { AudioTrack } from '@/types/audio';

// Mock Audio API
const mockAudio = {
  play: vi.fn().mockResolvedValue(undefined),
  pause: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  src: '',
  ended: false
};

Object.defineProperty(window, 'Audio', {
  writable: true,
  value: vi.fn().mockImplementation(() => mockAudio)
});

const mockTrack: AudioTrack = {
  id: 'test-track-1',
  title: 'Test Track',
  artist: 'Test Artist',
  duration: 180,
  url: 'test.mp3'
};

const TestComponent = () => {
  const music = useMusic();
  return (
    <div>
      <button onClick={() => music.play(mockTrack)}>Play</button>
      <button onClick={music.pause}>Pause</button>
      <button onClick={music.next}>Next</button>
      <span data-testid="is-playing">{music.isPlaying.toString()}</span>
      <span data-testid="current-track">{music.currentTrack?.title || 'None'}</span>
    </div>
  );
};

describe('MusicContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait fournir le contexte musical', () => {
    const { result } = renderHookWithMusicProvider(() => useMusic());

    expect(result.current).toBeDefined();
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentTrack).toBeNull();
    expect(result.current.playlist).toEqual([]);
  });

  it('devrait jouer une piste', async () => {
    const { result } = renderHookWithMusicProvider(() => useMusic());

    await act(async () => {
      result.current.play(mockTrack);
    });

    await waitFor(() => {
      expect(result.current.currentTrack).toEqual(mockTrack);
      expect(result.current.isPlaying).toBe(true);
      expect(mockAudio.play).toHaveBeenCalled();
    });
  });

  it('devrait mettre en pause la lecture', async () => {
    const { result } = renderHookWithMusicProvider(() => useMusic());

    await act(async () => {
      result.current.play(mockTrack);
    });

    act(() => {
      result.current.pause();
    });

    await waitFor(() => {
      expect(result.current.isPlaying).toBe(false);
      expect(mockAudio.pause).toHaveBeenCalled();
    });
  });

  it('devrait passer à la piste suivante', async () => {
    const playlist = [
      mockTrack,
      { id: 'track-2', title: 'Track 2', artist: 'Artist 2', duration: 200, url: 'track2.mp3' }
    ];

    const { result } = renderHookWithMusicProvider(() => useMusic());

    act(() => {
      result.current.setPlaylist(playlist);
    });

    await act(async () => {
      result.current.play(playlist[0]);
    });

    act(() => {
      result.current.next();
    });

    await waitFor(() => {
      expect(result.current.currentTrack?.id).toBe('track-2');
    });
  });

  it('devrait gérer le contrôle du volume', () => {
    const { result } = renderHookWithMusicProvider(() => useMusic());

    act(() => {
      result.current.setVolume(0.5);
    });

    expect(result.current.volume).toBe(0.5);
    expect(mockAudio.volume).toBe(0.5);
  });

  it('devrait générer de la musique émotionnelle', async () => {
    const { result } = renderHookWithMusicProvider(() => useMusic());

    await act(async () => {
      const tracks = await result.current.generateEmotionalMusic('calm');
      expect(tracks).toHaveLength(2);
      expect(tracks[0].emotion).toBe('calm');
    });
  });

  it('devrait lancer une erreur si utilisé hors du provider', () => {
    expect(() => {
      renderHook(() => useMusic());
    }).toThrow('useMusic must be used within a MusicProvider');
  });
});
