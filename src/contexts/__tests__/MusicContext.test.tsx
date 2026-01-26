// @ts-nocheck

import React from 'react';
import { render, act, waitFor, renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MusicProvider, useMusic, MusicTrack } from '@/contexts/MusicContext';

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

const mockTrack: MusicTrack = {
  id: 'test-track-1',
  title: 'Test Track',
  artist: 'Test Artist',
  url: 'test.mp3',
  audioUrl: 'test.mp3',
  duration: 180
};

const createPlaylist = (count: number): MusicTrack[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `track-${i + 1}`,
    title: `Track ${i + 1}`,
    artist: `Artist ${i + 1}`,
    url: `track-${i + 1}.mp3`,
    audioUrl: `track-${i + 1}.mp3`,
    duration: 180
  }));
};

describe('MusicContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MusicProvider>{children}</MusicProvider>
  );

  it('devrait fournir le contexte musical avec state', () => {
    const { result } = renderHook(() => useMusic(), {
      wrapper,
    });

    expect(result.current).toBeDefined();
    expect(result.current.state).toBeDefined();
    expect(result.current.state.isPlaying).toBe(false);
    expect(result.current.state.currentTrack).toBeNull();
    expect(result.current.state.playlist).toEqual([]);
  });

  it('devrait avoir les fonctions de contrôle', () => {
    const { result } = renderHook(() => useMusic(), { wrapper });

    expect(typeof result.current.play).toBe('function');
    expect(typeof result.current.pause).toBe('function');
    expect(typeof result.current.next).toBe('function');
    expect(typeof result.current.previous).toBe('function');
    expect(typeof result.current.setVolume).toBe('function');
    expect(typeof result.current.setPlaylist).toBe('function');
  });

  it('devrait gérer le contrôle du volume', () => {
    const { result } = renderHook(() => useMusic(), { wrapper });

    act(() => {
      result.current.setVolume(0.5);
    });

    expect(result.current.state.volume).toBe(0.5);
  });

  it('devrait gérer la playlist', () => {
    const playlist = createPlaylist(3);
    const { result } = renderHook(() => useMusic(), { wrapper });

    act(() => {
      result.current.setPlaylist(playlist);
    });

    expect(result.current.state.playlist).toHaveLength(3);
    expect(result.current.state.playlist[0].id).toBe('track-1');
  });

  it('devrait avoir le mode thérapeutique', () => {
    const { result } = renderHook(() => useMusic(), { wrapper });

    expect(result.current.state.therapeuticMode).toBe(false);
    expect(typeof result.current.enableTherapeuticMode).toBe('function');
    expect(typeof result.current.disableTherapeuticMode).toBe('function');
  });

  it('devrait gérer les favoris', () => {
    const { result } = renderHook(() => useMusic(), { wrapper });

    expect(result.current.state.favorites).toEqual([]);
    expect(typeof result.current.toggleFavorite).toBe('function');
  });

  it('devrait lancer une erreur si utilisé hors du provider', () => {
    expect(() => {
      renderHook(() => useMusic());
    }).toThrow('useMusic must be used within a MusicProvider');
  });
});
