// @ts-nocheck
"use client";

import React from "react";
import { Sentry } from "@/lib/errors/sentry-compat";

import { useMotionPrefs } from "@/hooks/useMotionPrefs";
import { clamp01 } from "@/lib/audio/utils";
import { useSound } from "@/ui/hooks/useSound";
import { logger } from '@/lib/logger';

export type FavoriteControls = {
  active: boolean;
  onToggle: () => Promise<void> | void;
  busy?: boolean;
  addLabel?: string;
  removeLabel?: string;
};

export type ResumeControls = {
  position: number;
  onResume: () => Promise<void> | void;
  label?: string;
  allow?: boolean;
};

export interface PlaybackSnapshot {
  trackId: string;
  position: number;
  volume: number;
  wasPlaying: boolean;
  updatedAt: number;
  presetId?: string;
  title?: string;
  src: string;
}

type AudioPlayerProps = {
  src: string;
  title?: string;
  trackId?: string;
  loop?: boolean;
  defaultVolume?: number;
  presetId?: string;
  crossfadeMs?: number;
  favorite?: FavoriteControls;
  resume?: ResumeControls;
  onProgress?: (snapshot: PlaybackSnapshot) => void;
  onPause?: () => void;
};

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function AudioPlayer({
  src,
  title,
  trackId,
  loop,
  defaultVolume = 0.75,
  presetId,
  crossfadeMs,
  favorite,
  resume,
  onProgress,
  onPause,
}: AudioPlayerProps) {
  const trackKey = React.useMemo(() => trackId ?? src, [trackId, src]);
  const safeDefaultVolume = clamp01(defaultVolume);
  const { prefersReducedMotion } = useMotionPrefs();

  const {
    ready,
    play: playSound,
    pause: pauseSound,
    setVolume: setSoundVolume,
    seek,
    getTime,
    onEnded,
  } = useSound(src, { loop, volume: safeDefaultVolume });

  const [playing, setPlaying] = React.useState(false);
  const [volume, setVolume] = React.useState(safeDefaultVolume);
  const [statusMessage, setStatusMessage] = React.useState("Lecteur prêt à diffuser ta bulle sonore.");

  const fadingRef = React.useRef(false);
  const currentVolumeRef = React.useRef(safeDefaultVolume);

  const updateAudioVolume = React.useCallback(
    (next: number) => {
      const clamped = clamp01(next);
      currentVolumeRef.current = clamped;
      setSoundVolume?.(clamped);
    },
    [setSoundVolume],
  );

  React.useEffect(() => {
    if (fadingRef.current) return;
    updateAudioVolume(volume);
  }, [volume, updateAudioVolume]);

  const fadeToVolume = React.useCallback(
    async (target: number, durationMs: number) => {
      if (!setSoundVolume || durationMs <= 0) {
        updateAudioVolume(target);
        return;
      }

      fadingRef.current = true;
      const start = currentVolumeRef.current;
      const duration = Math.max(80, durationMs);
      const steps = Math.max(1, Math.round(duration / 80));
      for (let index = 1; index <= steps; index += 1) {
        const ratio = index / steps;
        const value = start + (target - start) * ratio;
        updateAudioVolume(value);
        await wait(duration / steps);
      }
      updateAudioVolume(target);
      fadingRef.current = false;
    },
    [setSoundVolume, updateAudioVolume],
  );

  const logBreadcrumb = React.useCallback(
    (message: string, data?: Record<string, unknown>) => {
      const client = Sentry.getCurrentHub().getClient();
      if (!client) return;
      Sentry.addBreadcrumb({
        category: "music",
        level: "info",
        message,
        data: { trackId: trackKey, presetId, ...(data ?? {}) },
      });
    },
    [trackKey, presetId],
  );

  const persist = React.useCallback(
    (update: Partial<PlaybackSnapshot>) => {
      const payload: PlaybackSnapshot = {
        trackId: trackKey,
        position: typeof update.position === "number" ? Math.max(0, update.position) : getTime?.() ?? 0,
        volume: typeof update.volume === "number" ? clamp01(update.volume) : volume,
        wasPlaying: typeof update.wasPlaying === "boolean" ? update.wasPlaying : playing,
        updatedAt: Date.now(),
        presetId,
        title,
        src,
      };

      onProgress?.(payload);
    },
    [getTime, onProgress, playing, presetId, src, title, trackKey, volume],
  );

  const applyHaptics = React.useCallback(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined") return;
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (!prefersReduced && "vibrate" in navigator) {
      try {
        navigator.vibrate?.(10);
      } catch (error) {
        logger.warn("Haptics unavailable", error, 'UI');
      }
    }
  }, []);

  const startPlayback = React.useCallback(
    async (targetPosition?: number) => {
      if (typeof targetPosition === "number") {
        seek?.(targetPosition);
      }

      await playSound?.();
      setPlaying(true);
      applyHaptics();
      logBreadcrumb("music:play", { resume: targetPosition ?? 0 });

      const fadeDuration = prefersReducedMotion ? 0 : crossfadeMs ?? 0;
      if (fadeDuration > 0) {
        updateAudioVolume(0);
        await fadeToVolume(volume, fadeDuration);
      } else {
        updateAudioVolume(volume);
      }

      const position = typeof targetPosition === "number" ? targetPosition : getTime?.() ?? 0;
      persist({ wasPlaying: true, position });
      setStatusMessage("Lecture en cours, laisse-toi envelopper.");
    },
    [applyHaptics, crossfadeMs, fadeToVolume, getTime, logBreadcrumb, persist, playSound, prefersReducedMotion, seek, updateAudioVolume, volume],
  );

  const stopPlayback = React.useCallback(async () => {
    const fadeDuration = prefersReducedMotion ? 0 : (crossfadeMs ?? 0) * 0.6;
    if (fadeDuration > 0 && playing) {
      await fadeToVolume(0, fadeDuration);
    }

    pauseSound?.();
    setPlaying(false);
    logBreadcrumb("music:pause");

    updateAudioVolume(volume);
    const position = getTime?.() ?? 0;
    persist({ wasPlaying: false, position });
    onPause?.();
    setStatusMessage("Lecture en pause, la bulle reste disponible.");
  }, [crossfadeMs, fadeToVolume, getTime, logBreadcrumb, onPause, pauseSound, persist, playing, prefersReducedMotion, updateAudioVolume, volume]);

  const onTogglePlay = React.useCallback(async () => {
    try {
      if (!playing) {
        await startPlayback();
      } else {
        await stopPlayback();
      }
    } catch (error) {
      logger.warn("Audio toggle error", error, 'UI');
      Sentry.captureException(error);
    }
  }, [playing, startPlayback, stopPlayback]);

  const handleResume = React.useCallback(async () => {
    if (!resume || resume.position <= 0 || resume.allow === false) return;
    await startPlayback(resume.position);
    await resume.onResume?.();
    setStatusMessage("Reprise au bon endroit, respire à ton rythme.");
  }, [resume, startPlayback]);

  React.useEffect(() => {
    if (!onEnded) return;
    onEnded(() => {
      setPlaying(false);
      persist({ wasPlaying: false, position: 0 });
      if (loop) {
        logBreadcrumb("music:loop_restart");
      }
    });
  }, [loop, onEnded, persist, logBreadcrumb]);

  React.useEffect(() => {
    if (!playing) return;
    const interval = window.setInterval(() => {
      const position = getTime?.() ?? 0;
      persist({ position, wasPlaying: true });
    }, 2000);
    return () => window.clearInterval(interval);
  }, [getTime, persist, playing]);

  React.useEffect(() => {
    return () => {
      const position = getTime?.() ?? 0;
      persist({ position, wasPlaying: false });
    };
  }, [getTime, persist]);

  const hasResume = resume && resume.allow !== false && resume.position > 1 && !playing;
  const resumeButtonLabel = resume?.label ?? "Reprendre";

  const favoriteActive = favorite?.active ?? false;
  const favoriteAdd = favorite?.addLabel ?? "Ajouter aux favoris";
  const favoriteRemove = favorite?.removeLabel ?? "Retirer des favoris";

  React.useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target) {
        const tagName = target.tagName;
        if (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(tagName)) {
          return;
        }
      }

      const key = event.key;
      if (key === " " || key === "Spacebar" || key.toLowerCase() === "k") {
        event.preventDefault();
        onTogglePlay();
        return;
      }

      if (key === "ArrowUp") {
        event.preventDefault();
        setVolume(current => clamp01(current + 0.05));
        setStatusMessage("Volume un peu plus présent, toujours en douceur.");
        return;
      }

      if (key === "ArrowDown") {
        event.preventDefault();
        setVolume(current => clamp01(current - 0.05));
        setStatusMessage("Volume encore plus feutré.");
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [onTogglePlay]);

  React.useEffect(() => {
    if (!hasResume) return;
    setStatusMessage("Reprise disponible exactement là où tu t'étais arrêtée.");
  }, [hasResume]);

  return (
    <div aria-label={title ?? "Lecteur audio"} className="grid gap-3" role="group">
      <div aria-live="polite" className="sr-only">
        {statusMessage}
      </div>
      <div className="grid gap-2">
        {title && <strong className="text-base font-semibold">{title}</strong>}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onTogglePlay}
            aria-pressed={playing}
            className="rounded-full bg-primary px-4 py-2 text-primary-foreground"
            data-ui="primary-toggle"
          >
            {playing ? "Pause" : ready ? "Lecture" : "Chargement"}
          </button>

          {hasResume && (
            <button
              type="button"
              onClick={handleResume}
              className="rounded-full border border-primary/40 px-3 py-2 text-sm"
              data-ui="resume-button"
            >
              {resumeButtonLabel}
            </button>
          )}

          <button
            type="button"
            onClick={async () => {
              if (favorite?.busy) return;
              try {
                await favorite?.onToggle?.();
              } catch (error) {
                logger.warn("Favorite toggle failed", error, 'UI');
              }
            }}
            aria-pressed={favoriteActive}
            className="rounded-full border border-muted px-3 py-2 text-sm"
            disabled={!favorite}
            data-ui="favorite-toggle"
          >
            {favoriteActive ? `★ ${favoriteRemove}` : `☆ ${favoriteAdd}`}
          </button>
        </div>
      </div>

      <label className="flex items-center gap-3 text-sm" htmlFor={`${trackKey}-volume`}>
        Volume
        <input
          id={`${trackKey}-volume`}
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={event => setVolume(clamp01(parseFloat(event.target.value)))}
        />
      </label>

      {hasResume && (
        <small className="text-sm text-muted-foreground">
          Dernière écoute sauvegardée, prête à reprendre quand tu le souhaites.
        </small>
      )}

      <p className="text-xs text-muted-foreground" role="note">
        Astuce clavier : barre espace ou lettre K pour lecture ou pause, flèches haut et bas pour doser le volume.
      </p>

      <audio
        aria-hidden
        src={src}
        preload="auto"
        className="hidden"
        data-playing={playing}
      />
    </div>
  );
}

export default AudioPlayer;
