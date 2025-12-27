/**
 * useHapticFeedback - Hook pour feedback haptique
 * Vibrations sur actions musicales (mobile)
 */

import { useCallback, useState } from 'react';

type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';

interface HapticOptions {
  enabled?: boolean;
  intensity?: number; // 0-100
}

const PATTERNS: Record<HapticPattern, number[]> = {
  light: [10],
  medium: [25],
  heavy: [50],
  success: [15, 50, 15],
  warning: [30, 30, 30],
  error: [50, 100, 50],
  selection: [5],
};

export const useHapticFeedback = (options: HapticOptions = {}) => {
  const { enabled = true, intensity = 100 } = options;
  const [isSupported] = useState(() => 
    typeof navigator !== 'undefined' && 'vibrate' in navigator
  );

  const vibrate = useCallback((pattern: number | number[]) => {
    if (!enabled || !isSupported) return false;

    try {
      // Scale pattern by intensity
      const scaledPattern = Array.isArray(pattern)
        ? pattern.map(d => Math.round(d * (intensity / 100)))
        : Math.round(pattern * (intensity / 100));
      
      return navigator.vibrate(scaledPattern);
    } catch {
      return false;
    }
  }, [enabled, isSupported, intensity]);

  const trigger = useCallback((type: HapticPattern = 'light') => {
    const pattern = PATTERNS[type] || PATTERNS.light;
    return vibrate(pattern);
  }, [vibrate]);

  // Specific actions for music player
  const onPlay = useCallback(() => trigger('light'), [trigger]);
  const onPause = useCallback(() => trigger('light'), [trigger]);
  const onNext = useCallback(() => trigger('medium'), [trigger]);
  const onPrevious = useCallback(() => trigger('medium'), [trigger]);
  const onLike = useCallback(() => trigger('success'), [trigger]);
  const onUnlike = useCallback(() => trigger('selection'), [trigger]);
  const onError = useCallback(() => trigger('error'), [trigger]);
  const onVolumeChange = useCallback(() => trigger('selection'), [trigger]);
  const onSeek = useCallback(() => trigger('selection'), [trigger]);
  const onPlaylistChange = useCallback(() => trigger('medium'), [trigger]);
  const onDownloadComplete = useCallback(() => trigger('success'), [trigger]);

  const stop = useCallback(() => {
    if (isSupported) {
      navigator.vibrate(0);
    }
  }, [isSupported]);

  return {
    isSupported,
    enabled,
    trigger,
    vibrate,
    stop,
    // Music-specific actions
    onPlay,
    onPause,
    onNext,
    onPrevious,
    onLike,
    onUnlike,
    onError,
    onVolumeChange,
    onSeek,
    onPlaylistChange,
    onDownloadComplete,
  };
};

export default useHapticFeedback;
