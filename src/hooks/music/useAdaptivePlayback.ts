import { useCallback, useEffect, useMemo, useState } from "react";

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

const STORAGE_KEY = "adaptive-music:persisted-session";

const readState = (): PlaybackState | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.trackId || typeof parsed.trackId !== "string") return null;
    return {
      trackId: parsed.trackId,
      position: typeof parsed.position === "number" ? Math.max(0, parsed.position) : 0,
      volume: typeof parsed.volume === "number" ? Math.min(Math.max(parsed.volume, 0), 1) : 0.6,
      presetId: typeof parsed.presetId === "string" ? parsed.presetId : "ambient_soft",
      updatedAt: typeof parsed.updatedAt === "number" ? parsed.updatedAt : Date.now(),
      title: typeof parsed.title === "string" ? parsed.title : undefined,
      url: typeof parsed.url === "string" ? parsed.url : undefined,
      wasPlaying: typeof parsed.wasPlaying === "boolean" ? parsed.wasPlaying : false,
    } satisfies PlaybackState;
  } catch (error) {
    console.warn("[useAdaptivePlayback] unable to restore state", error);
    return null;
  }
};

const writeState = (snapshot: PlaybackState | null) => {
  if (typeof window === "undefined") return;
  try {
    if (!snapshot) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch (error) {
    console.warn("[useAdaptivePlayback] unable to persist state", error);
  }
};

export const useAdaptivePlayback = () => {
  const [snapshot, setSnapshot] = useState<PlaybackState | null>(() => readState());

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

      writeState(merged);
      return merged;
    });
  }, []);

  const clear = useCallback(() => {
    writeState(null);
    setSnapshot(null);
  }, []);

  const refresh = useCallback(() => {
    setSnapshot(readState());
  }, []);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        refresh();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [refresh]);

  const hasResume = useMemo(() => {
    if (!snapshot) return false;
    return snapshot.position > 1;
  }, [snapshot]);

  return {
    snapshot,
    hasResume,
    update,
    clear,
    refresh,
  };
};

export default useAdaptivePlayback;
