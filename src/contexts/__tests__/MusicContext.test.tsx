// @ts-nocheck

import React from 'react';
import { render, act, waitFor, renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MusicProvider, useMusic, Track } from '@/contexts/MusicContext';
import { createPlaylist } from '../../../tests/utils/musicMock';

// Mock Audio API
const mockAudio = {
  play: vi.fn().mockResolvedValue(undefined),
  pause: vi.fn(),
  load: vi.fn(),
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

const mockTrack: Track = {
  id: 'test-track-1',
  title: 'Test Track',
  artist: 'Test Artist',
  url: 'test.mp3'
};

const TestComponent = () => {
  const music = useMusic();
  return (
    <div>
      <button onClick={() => music.play(mockTrack)}>Play</button>
      <button onClick={music.pause}>Pause</button>
      <button onClick={music.nextTrack}>Next</button>
      <span data-testid="is-playing">{music.isPlaying.toString()}</span>
      <span data-testid="current-track">{music.currentTrack?.title || 'None'}</span>
    </div>
  );
};

describe('MusicContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MusicProvider>{children}</MusicProvider>
  );

  it('devrait fournir le contexte musical', () => {
    const { result } = renderHook(() => useMusic(), {
      wrapper,
    });

    expect(result.current).toBeDefined();
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentTrack).toBeNull();
    expect(result.current.playlist).toEqual([]);
  });

  it('devrait jouer une piste', async () => {
    const { result } = renderHook(() => useMusic(), { wrapper });

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
    const { result } = renderHook(() => useMusic(), { wrapper });

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
    const playlist = createPlaylist(2);

    const { result } = renderHook(() => useMusic(), { wrapper });

    act(() => {
      result.current.setPlaylist(playlist);
    });

    await act(async () => {
      result.current.play(playlist[0]);
    });

    act(() => {
      result.current.nextTrack();
    });

    await waitFor(() => {
      expect(result.current.currentTrack?.id).toBe('track-2');
    });
  });

  it('devrait gérer le contrôle du volume', () => {
    const { result } = renderHook(() => useMusic(), { wrapper });

    act(() => {
      result.current.setVolume(0.5);
    });

    expect(result.current.volume).toBe(0.5);
    expect(mockAudio.volume).toBe(0.5);
  });

  it('devrait charger une playlist pour une émotion', async () => {
    const { result } = renderHook(() => useMusic(), { wrapper });

    await act(async () => {
      await result.current.loadPlaylistForEmotion('calm');
    });

    expect(result.current.playlist).toHaveLength(1);
    expect(result.current.currentTrack).not.toBeNull();
  });

  it('devrait lancer une erreur si utilisé hors du provider', () => {
    expect(() => {
      renderHook(() => useMusic());
    }).toThrow('useMusic must be used within a MusicProvider');
  });
});
