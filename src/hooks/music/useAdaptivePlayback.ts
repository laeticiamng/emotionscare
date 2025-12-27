// @ts-nocheck
import { useCallback, useMemo } from "react";
import { useMusicSettings } from '@/hooks/music/useMusicSettings';

export interface PlaybackState {
  trackId: string;
  position: number;
  volume: number;
  presetId: string;
  updatedAt: number;
  title?: string;
  url?: string;
  wasPlaying?: boolean;
}

export const useAdaptivePlayback = () => {
  const { value: snapshot, setValue: setSnapshot, isLoading } = useMusicSettings<PlaybackState | null>({
    key: 'music:adaptive-playback',
    defaultValue: null,
    debounceMs: 300
  });

  const update = useCallback((state: Partial<PlaybackState> & { trackId: string }) => {
    setSnapshot(prev => {
      const base: PlaybackState = prev ?? {
        trackId: state.trackId,
        position: 0,
        volume: 0.6,
        presetId: state.presetId ?? "ambient_soft",
        updatedAt: Date.now(),
      };

      const merged: PlaybackState = {
        ...base,
        ...state,
        position:
          typeof state.position === "number"
            ? Math.max(0, state.position)
            : base.position,
        volume:
          typeof state.volume === "number"
            ? Math.min(Math.max(state.volume, 0), 1)
            : base.volume,
        updatedAt: Date.now(),
      };

      return merged;
    });
  }, [setSnapshot]);

  const clear = useCallback(() => {
    setSnapshot(null);
  }, [setSnapshot]);

  const hasResume = useMemo(() => {
    if (!snapshot) return false;
    return snapshot.position > 1;
  }, [snapshot]);

  return {
    snapshot,
    hasResume,
    update,
    clear,
    refresh: () => {}, // No-op, Supabase sync handles this
    isLoading
  };
};

export default useAdaptivePlayback;
