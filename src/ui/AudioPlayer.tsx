"use client";
import React from "react";
import { useSound } from "@/ui/hooks/useSound";
import { clamp01 } from "@/lib/audio/utils";

export const ADAPTIVE_MUSIC_FAVORITES_EVENT = "adaptive-music:favorites-changed";
export const ADAPTIVE_MUSIC_PLAYBACK_EVENT = "adaptive-music:playback-changed";

type FavoriteEntry = {
  id: string;
  title?: string;
  src: string;
  addedAt: string;
};

export type AudioPlayerFavoriteEntry = FavoriteEntry;

type PlaybackPersistedState = {
  position: number;
  volume: number;
  wasPlaying: boolean;
  updatedAt: number;
  trackTitle?: string;
  trackSrc?: string;
};

const FAVORITES_STORAGE_KEY = "adaptive-music:favorites";

const formatTime = (totalSeconds: number) => {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return "0:00";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

type Props = {
  src: string;
  title?: string;
  trackId?: string;
  loop?: boolean;
  defaultVolume?: number; // 0..1
  haptics?: boolean;
};

export function AudioPlayer({
  src,
  title,
  trackId,
  loop,
  defaultVolume = 0.8,
  haptics = false
}: Props) {
  const safeDefaultVolume = clamp01(defaultVolume);
  const trackKey = React.useMemo(() => trackId ?? src, [trackId, src]);
  const playbackStorageKey = React.useMemo(
    () => `adaptive-music:playback:${trackKey}`,
    [trackKey]
  );
  const defaultPlaybackState = React.useMemo<PlaybackPersistedState>(
    () => ({
      position: 0,
      volume: safeDefaultVolume,
      wasPlaying: false,
      updatedAt: Date.now(),
      trackSrc: src,
      trackTitle: title,
    }),
    [safeDefaultVolume, src, title]
  );

  const {
    ready,
    play: playSound,
    pause: pauseSound,
    setVolume: setSoundVolume,
    seek,
    getTime,
    onEnded
  } = useSound(src, { loop, volume: safeDefaultVolume });

  const [playing, setPlaying] = React.useState(false);
  const [volume, setVolume] = React.useState(safeDefaultVolume);
  const [favorites, setFavorites] = React.useState<FavoriteEntry[]>([]);
  const [resumePosition, setResumePosition] = React.useState(0);

  const playbackRef = React.useRef<PlaybackPersistedState>(defaultPlaybackState);

  const applyHaptics = React.useCallback(() => {
    if (!haptics) return;
    if (typeof window === "undefined" || typeof navigator === "undefined") return;
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (!prefersReduced && "vibrate" in navigator) {
      try {
        navigator.vibrate?.(10);
      } catch (error) {
        console.warn("Haptics unavailable", error);
      }
    }
  }, [haptics]);

  const dispatchFavoritesChanged = React.useCallback((entries: FavoriteEntry[]) => {
    if (typeof window === "undefined") return;
    try {
      window.dispatchEvent(new CustomEvent(ADAPTIVE_MUSIC_FAVORITES_EVENT, { detail: entries }));
    } catch (error) {
      console.warn("Unable to broadcast favorites", error);
    }
  }, []);

  const dispatchPlaybackChanged = React.useCallback(
    (state: PlaybackPersistedState) => {
      if (typeof window === "undefined") return;
      try {
        window.dispatchEvent(
          new CustomEvent(ADAPTIVE_MUSIC_PLAYBACK_EVENT, {
            detail: {
              trackId: trackKey,
              title,
              src,
              state,
            },
          })
        );
      } catch (error) {
        console.warn("Unable to broadcast playback", error);
      }
    },
    [trackKey, title, src]
  );

  const persistPlayback = React.useCallback(
    (update: Partial<PlaybackPersistedState>, options?: { skipState?: boolean }) => {
      const nextPosition =
        typeof update.position === "number"
          ? Math.max(0, update.position)
          : playbackRef.current.position;
      const nextVolume =
        typeof update.volume === "number"
          ? clamp01(update.volume)
          : playbackRef.current.volume;
      const nextWasPlaying =
        typeof update.wasPlaying === "boolean"
          ? update.wasPlaying
          : playbackRef.current.wasPlaying;

      const nextState: PlaybackPersistedState = {
        position: nextPosition,
        volume: nextVolume,
        wasPlaying: nextWasPlaying,
        updatedAt: Date.now(),
        trackSrc: src,
        trackTitle: title,
      };

      playbackRef.current = nextState;

      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(playbackStorageKey, JSON.stringify(nextState));
        } catch (error) {
          console.warn("Unable to persist playback state", error);
        }
      }

      dispatchPlaybackChanged(nextState);

      if (!options?.skipState && typeof update.position === "number") {
        const safePosition = Math.max(0, update.position);
        setResumePosition(prev =>
          Math.abs(prev - safePosition) < 0.01 ? prev : safePosition
        );
      }
    },
    [playbackStorageKey, dispatchPlaybackChanged, src, title]
  );

  const updateFavorites = React.useCallback(
    (updater: (prev: FavoriteEntry[]) => FavoriteEntry[]) => {
      setFavorites(prev => {
        const next = updater(prev);
        if (typeof window !== "undefined") {
          try {
            window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
          } catch (error) {
            console.warn("Unable to persist favorites", error);
          }
        }
        dispatchFavoritesChanged(next);
        return next;
      });
    },
    [dispatchFavoritesChanged]
  );

  React.useEffect(() => {
    setPlaying(false);
  }, [trackKey]);

  React.useEffect(() => {
    if (typeof window === "undefined") {
      playbackRef.current = defaultPlaybackState;
      setResumePosition(defaultPlaybackState.position);
      setVolume(defaultPlaybackState.volume);
      return;
    }

    try {
      const raw = window.localStorage.getItem(playbackStorageKey);
      if (!raw) {
        playbackRef.current = defaultPlaybackState;
        setResumePosition(defaultPlaybackState.position);
        setVolume(current =>
          Math.abs(current - defaultPlaybackState.volume) < 0.001
            ? current
            : defaultPlaybackState.volume
        );
        return;
      }

      const parsed = JSON.parse(raw);
      const normalized: PlaybackPersistedState = {
        position:
          typeof parsed?.position === "number"
            ? Math.max(0, parsed.position)
            : defaultPlaybackState.position,
        volume:
          typeof parsed?.volume === "number"
            ? clamp01(parsed.volume)
            : defaultPlaybackState.volume,
        wasPlaying: typeof parsed?.wasPlaying === "boolean" ? parsed.wasPlaying : false,
        updatedAt: typeof parsed?.updatedAt === "number" ? parsed.updatedAt : Date.now(),
        trackSrc: typeof parsed?.trackSrc === "string" ? parsed.trackSrc : src,
        trackTitle: typeof parsed?.trackTitle === "string" ? parsed.trackTitle : title,
      };

      playbackRef.current = normalized;
      setResumePosition(normalized.position);
      setVolume(current =>
        Math.abs(current - normalized.volume) < 0.001 ? current : normalized.volume
      );
      dispatchPlaybackChanged(normalized);
    } catch (error) {
      console.warn("Unable to restore playback state", error);
      playbackRef.current = defaultPlaybackState;
      setResumePosition(defaultPlaybackState.position);
      setVolume(defaultPlaybackState.volume);
    }
  }, [playbackStorageKey, defaultPlaybackState, dispatchPlaybackChanged, src, title]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;

      const seen = new Set<string>();
      const entries: FavoriteEntry[] = [];

      for (const entry of parsed) {
        if (!entry || typeof entry !== "object") continue;
        const id = typeof entry.id === "string" ? entry.id : undefined;
        const storedSrc = typeof entry.src === "string" ? entry.src : undefined;
        if (!id || !storedSrc || seen.has(id)) continue;
        seen.add(id);
        entries.push({
          id,
          src: storedSrc,
          title: typeof entry.title === "string" ? entry.title : undefined,
          addedAt:
            typeof entry.addedAt === "string" ? entry.addedAt : new Date().toISOString()
        });
      }

      if (entries.length) {
        updateFavorites(() => entries.slice(-50));
      }
    } catch (error) {
      console.warn("Unable to restore favorites", error);
    }
  }, [updateFavorites]);

  React.useEffect(() => {
    setSoundVolume?.(volume);
  }, [setSoundVolume, volume]);

  React.useEffect(() => {
    if (Math.abs(playbackRef.current.volume - volume) < 0.001) return;
    persistPlayback({ volume });
  }, [volume, persistPlayback]);

  React.useEffect(() => {
    if (!onEnded) return;
    onEnded(() => {
      setPlaying(false);
      persistPlayback({ wasPlaying: false, position: 0 });
    });
  }, [onEnded, persistPlayback]);

  React.useEffect(() => {
    if (!playing) return;
    const interval = window.setInterval(() => {
      const position = getTime?.() ?? 0;
      persistPlayback({ position });
    }, 2000);
    return () => window.clearInterval(interval);
  }, [playing, getTime, persistPlayback]);

  React.useEffect(() => {
    return () => {
      const position = getTime?.() ?? 0;
      persistPlayback({ position, wasPlaying: false }, { skipState: true });
    };
  }, [getTime, persistPlayback]);

  const isFavorite = React.useMemo(
    () => favorites.some(entry => entry.id === trackKey),
    [favorites, trackKey]
  );

  const toggleFavorite = React.useCallback(() => {
    updateFavorites(prev => {
      const exists = prev.some(entry => entry.id === trackKey);
      if (exists) {
        return prev.filter(entry => entry.id !== trackKey);
      }

      const sanitized = prev.filter(entry => entry.id !== trackKey);
      const nextEntry: FavoriteEntry = {
        id: trackKey,
        title,
        src,
        addedAt: new Date().toISOString()
      };

      const next = [...sanitized, nextEntry];
      return next.slice(-50);
    });
  }, [trackKey, title, src, updateFavorites]);

  const handleResume = React.useCallback(async () => {
    if (resumePosition <= 0.01) return;
    seek?.(resumePosition);
    await playSound?.();
    setPlaying(true);
    applyHaptics();
    persistPlayback({ wasPlaying: true, position: resumePosition });
  }, [resumePosition, seek, playSound, applyHaptics, persistPlayback]);

  const hasResume = resumePosition > 0.5 && !playing;

  const onTogglePlay = React.useCallback(async () => {
    try {
      if (!playing) {
        await playSound?.();
        setPlaying(true);
        applyHaptics();
        const position = getTime?.() ?? 0;
        persistPlayback({ wasPlaying: true, position });
      } else {
        pauseSound?.();
        const position = getTime?.() ?? 0;
        setPlaying(false);
        persistPlayback({ wasPlaying: false, position });
      }
    } catch (error) {
      console.warn("Audio toggle error", error);
    }
  }, [playing, playSound, pauseSound, getTime, applyHaptics, persistPlayback]);

  return (
    <div aria-label={title ?? "Lecteur audio"} style={{ display: "grid", gap: 8 }}>
      <div style={{ display: "grid", gap: 6 }}>
        {title && <strong>{title}</strong>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          <button
            type="button"
            onClick={onTogglePlay}
            aria-pressed={playing}
            data-ui="primary-cta"
          >
            {playing ? "Pause" : "Lecture"}
          </button>
          {hasResume && (
            <button
              type="button"
              onClick={handleResume}
              disabled={!ready}
              data-ui="resume-button"
            >
              Reprendre ({formatTime(resumePosition)})
            </button>
          )}
          <button
            type="button"
            onClick={toggleFavorite}
            aria-pressed={isFavorite}
            data-ui="favorite-toggle"
          >
            {isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          </button>
        </div>
      </div>

      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        Volume
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={event => setVolume(clamp01(parseFloat(event.target.value)))}
          data-ui="volume-slider"
        />
      </label>

      {hasResume && (
        <small aria-live="polite" style={{ opacity: 0.75 }}>
          Dernière écoute sauvegardée à {formatTime(resumePosition)}.
        </small>
      )}

      {isFavorite && (
        <small style={{ opacity: 0.75 }}>
          Sauvegardé dans vos favoris locaux.
        </small>
      )}
    </div>
  );
}

export default AudioPlayer;
