/**
 * useAudio ENRICHED - Hook audio complet
 * Version enrichie avec historique écoute, favoris, égaliseur, statistiques
 */

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';

// ─────────────────────────────────────────────────────────────
// LOCAL STORAGE KEYS
// ─────────────────────────────────────────────────────────────

const HISTORY_KEY = 'audio-history';
const FAVORITES_KEY = 'audio-favorites';
const PREFERENCES_KEY = 'audio-preferences';
const STATS_KEY = 'audio-stats';
const EQUALIZER_KEY = 'audio-equalizer';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface AudioHistoryEntry {
  id: string;
  src: string;
  title?: string;
  playedAt: string;
  duration: number;
  listenedDuration: number;
  completedPercentage: number;
}

interface AudioFavorite {
  id: string;
  src: string;
  title: string;
  addedAt: string;
  playCount: number;
  lastPlayedAt?: string;
}

interface AudioPreferences {
  volume: number;
  playbackRate: number;
  autoplay: boolean;
  loop: boolean;
  crossfade: boolean;
  crossfadeDuration: number;
  rememberPosition: boolean;
}

interface EqualizerPreset {
  name: string;
  bands: number[];
}

interface AudioStats {
  totalListeningTime: number;
  totalTracksPlayed: number;
  averageListeningSession: number;
  mostPlayedTrack: { src: string; title: string; count: number };
  favoriteGenre: string;
  listeningByHour: Record<number, number>;
  listeningByDay: Record<string, number>;
}

interface AudioState {
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
  playbackRate: number;
  isLooped: boolean;
  buffered: number;
}

// ─────────────────────────────────────────────────────────────
// LOCAL STORAGE HELPERS
// ─────────────────────────────────────────────────────────────

function getHistory(): AudioHistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch { return []; }
}

function saveHistory(history: AudioHistoryEntry[]): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 200)));
}

function getFavorites(): AudioFavorite[] {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
  } catch { return []; }
}

function saveFavorites(favorites: AudioFavorite[]): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function getPreferences(): AudioPreferences {
  try {
    return {
      volume: 1,
      playbackRate: 1,
      autoplay: false,
      loop: false,
      crossfade: false,
      crossfadeDuration: 3,
      rememberPosition: true,
      ...JSON.parse(localStorage.getItem(PREFERENCES_KEY) || '{}'),
    };
  } catch {
    return {
      volume: 1,
      playbackRate: 1,
      autoplay: false,
      loop: false,
      crossfade: false,
      crossfadeDuration: 3,
      rememberPosition: true,
    };
  }
}

function savePreferences(prefs: AudioPreferences): void {
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
}

function getEqualizerSettings(): number[] {
  try {
    return JSON.parse(localStorage.getItem(EQUALIZER_KEY) || '[0,0,0,0,0,0,0,0,0,0]');
  } catch {
    return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  }
}

function saveEqualizerSettings(bands: number[]): void {
  localStorage.setItem(EQUALIZER_KEY, JSON.stringify(bands));
}

function getStats(): AudioStats {
  try {
    return JSON.parse(localStorage.getItem(STATS_KEY) || '{}');
  } catch {
    return {
      totalListeningTime: 0,
      totalTracksPlayed: 0,
      averageListeningSession: 0,
      mostPlayedTrack: { src: '', title: '', count: 0 },
      favoriteGenre: '',
      listeningByHour: {},
      listeningByDay: {},
    };
  }
}

function saveStats(stats: AudioStats): void {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

// ─────────────────────────────────────────────────────────────
// EQUALIZER PRESETS
// ─────────────────────────────────────────────────────────────

const EQUALIZER_PRESETS: EqualizerPreset[] = [
  { name: 'Flat', bands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { name: 'Bass Boost', bands: [6, 5, 4, 2, 0, 0, 0, 0, 0, 0] },
  { name: 'Treble Boost', bands: [0, 0, 0, 0, 0, 2, 4, 5, 6, 6] },
  { name: 'Vocal', bands: [-2, -1, 0, 2, 4, 4, 2, 0, -1, -2] },
  { name: 'Rock', bands: [4, 3, 2, 0, -1, 0, 2, 3, 4, 4] },
  { name: 'Jazz', bands: [3, 2, 1, 2, -1, -1, 0, 1, 2, 3] },
  { name: 'Classical', bands: [4, 3, 2, 1, 0, 0, 0, 1, 2, 3] },
  { name: 'Electronic', bands: [4, 3, 0, -1, -2, 0, 2, 3, 4, 4] },
  { name: 'Relaxation', bands: [2, 3, 2, 0, 1, 2, 3, 2, 1, 0] },
];

// ─────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────

const useAudioEnriched = (src?: string, title?: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const _audioContextRef = useRef<AudioContext | null>(null);
  const _gainNodeRef = useRef<GainNode | null>(null);
  const _analyserRef = useRef<AnalyserNode | null>(null);
  const _equalizerNodesRef = useRef<BiquadFilterNode[]>([]);
  const sessionStartRef = useRef<number>(0);

  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    duration: 0,
    currentTime: 0,
    volume: getPreferences().volume,
    isMuted: false,
    isLoading: false,
    playbackRate: getPreferences().playbackRate,
    isLooped: getPreferences().loop,
    buffered: 0,
  });

  const [history, setHistory] = useState<AudioHistoryEntry[]>(() => getHistory());
  const [favorites, setFavorites] = useState<AudioFavorite[]>(() => getFavorites());
  const [preferences, setPreferences] = useState<AudioPreferences>(() => getPreferences());
  const [equalizerBands, setEqualizerBands] = useState<number[]>(() => getEqualizerSettings());
  const [stats, setStats] = useState<AudioStats>(() => getStats());
  const [frequencyData, setFrequencyData] = useState<Uint8Array>(new Uint8Array(64));

  // Check if current track is favorite
  const isFavorite = useMemo(() => 
    src ? favorites.some(f => f.src === src) : false,
  [src, favorites]);

  // Initialize audio
  useEffect(() => {
    if (src) {
      audioRef.current = new Audio(src);
      const audio = audioRef.current;
      audio.volume = state.volume;
      audio.playbackRate = state.playbackRate;
      audio.loop = state.isLooped;

      const setAudioData = () => {
        setState(prev => ({
          ...prev,
          duration: audio.duration || 0,
          isLoading: false,
        }));
      };

      const setAudioTime = () => {
        setState(prev => ({
          ...prev,
          currentTime: audio.currentTime,
          buffered: audio.buffered.length > 0 
            ? (audio.buffered.end(audio.buffered.length - 1) / audio.duration) * 100
            : 0,
        }));
      };

      const handleEnded = () => {
        setState(prev => ({ ...prev, isPlaying: false }));
        recordListeningSession();
      };

      audio.addEventListener('loadeddata', setAudioData);
      audio.addEventListener('timeupdate', setAudioTime);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('loadstart', () => setState(prev => ({ ...prev, isLoading: true })));

      return () => {
        audio.removeEventListener('loadeddata', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
        audio.removeEventListener('ended', handleEnded);
        audio.pause();
      };
    }
  }, [src]);

  // Record listening session
  const recordListeningSession = useCallback(() => {
    if (!src || !audioRef.current) return;

    const listenedDuration = audioRef.current.currentTime;
    const completedPercentage = state.duration > 0 
      ? Math.round((listenedDuration / state.duration) * 100)
      : 0;

    const entry: AudioHistoryEntry = {
      id: crypto.randomUUID(),
      src,
      title,
      playedAt: new Date().toISOString(),
      duration: state.duration,
      listenedDuration,
      completedPercentage,
    };

    const newHistory = [entry, ...history];
    setHistory(newHistory);
    saveHistory(newHistory);

    // Update stats
    const newStats = { ...stats };
    newStats.totalListeningTime += listenedDuration;
    newStats.totalTracksPlayed += 1;
    newStats.averageListeningSession = newStats.totalListeningTime / newStats.totalTracksPlayed;

    const hour = new Date().getHours();
    newStats.listeningByHour[hour] = (newStats.listeningByHour[hour] || 0) + listenedDuration;

    const day = new Date().toISOString().split('T')[0];
    newStats.listeningByDay[day] = (newStats.listeningByDay[day] || 0) + listenedDuration;

    setStats(newStats);
    saveStats(newStats);

    // Update favorite play count
    if (isFavorite) {
      const updatedFavorites = favorites.map(f =>
        f.src === src ? { ...f, playCount: f.playCount + 1, lastPlayedAt: new Date().toISOString() } : f
      );
      setFavorites(updatedFavorites);
      saveFavorites(updatedFavorites);
    }
  }, [src, title, state.duration, history, stats, isFavorite, favorites]);

  // Playback controls
  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
      sessionStartRef.current = Date.now();
      setState(prev => ({ ...prev, isPlaying: true }));
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
    }
  }, []);

  const toggle = useCallback(() => {
    state.isPlaying ? pause() : play();
  }, [state.isPlaying, play, pause]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      setState(prev => ({ ...prev, volume, isMuted: volume === 0 }));
      setPreferences(prev => {
        const updated = { ...prev, volume };
        savePreferences(updated);
        return updated;
      });
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      const newMuted = !state.isMuted;
      audioRef.current.muted = newMuted;
      setState(prev => ({ ...prev, isMuted: newMuted }));
    }
  }, [state.isMuted]);

  const setPlaybackRate = useCallback((rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      setState(prev => ({ ...prev, playbackRate: rate }));
      setPreferences(prev => {
        const updated = { ...prev, playbackRate: rate };
        savePreferences(updated);
        return updated;
      });
    }
  }, []);

  const toggleLoop = useCallback(() => {
    if (audioRef.current) {
      const newLoop = !state.isLooped;
      audioRef.current.loop = newLoop;
      setState(prev => ({ ...prev, isLooped: newLoop }));
      setPreferences(prev => {
        const updated = { ...prev, loop: newLoop };
        savePreferences(updated);
        return updated;
      });
    }
  }, [state.isLooped]);

  // Favorites
  const addToFavorites = useCallback(() => {
    if (!src) return;
    
    const favorite: AudioFavorite = {
      id: crypto.randomUUID(),
      src,
      title: title || 'Unknown',
      addedAt: new Date().toISOString(),
      playCount: 0,
    };
    
    const newFavorites = [favorite, ...favorites];
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  }, [src, title, favorites]);

  const removeFromFavorites = useCallback(() => {
    if (!src) return;
    const newFavorites = favorites.filter(f => f.src !== src);
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  }, [src, favorites]);

  const toggleFavorite = useCallback(() => {
    isFavorite ? removeFromFavorites() : addToFavorites();
  }, [isFavorite, addToFavorites, removeFromFavorites]);

  // Equalizer
  const setEqualizerBand = useCallback((index: number, value: number) => {
    const newBands = [...equalizerBands];
    newBands[index] = value;
    setEqualizerBands(newBands);
    saveEqualizerSettings(newBands);
  }, [equalizerBands]);

  const applyEqualizerPreset = useCallback((preset: EqualizerPreset) => {
    setEqualizerBands(preset.bands);
    saveEqualizerSettings(preset.bands);
  }, []);

  // Export
  const exportData = useCallback(() => ({
    history,
    favorites,
    stats,
    preferences,
    equalizer: equalizerBands,
    exportedAt: new Date().toISOString(),
  }), [history, favorites, stats, preferences, equalizerBands]);

  const downloadExport = useCallback(() => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audio-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [exportData]);

  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
  }, []);

  return {
    // State
    ...state,
    
    // Controls
    play,
    pause,
    toggle,
    seek,
    setVolume,
    toggleMute,
    setPlaybackRate,
    toggleLoop,
    
    // Favorites
    favorites,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    
    // History
    history,
    clearHistory,
    
    // Equalizer
    equalizerBands,
    setEqualizerBand,
    applyEqualizerPreset,
    equalizerPresets: EQUALIZER_PRESETS,
    
    // Stats
    stats,
    
    // Preferences
    preferences,
    
    // Visualization
    frequencyData,
    
    // Export
    exportData,
    downloadExport,
  };
};

export default useAudioEnriched;
