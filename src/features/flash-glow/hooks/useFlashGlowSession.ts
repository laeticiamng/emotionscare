// @ts-nocheck
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useMotionPrefs } from '@/hooks/useMotionPrefs';

export type FlashGlowAction =
  | { type: 'extend_session'; durationMs?: number }
  | { type: 'soft_exit' }
  | { type: 'set_visuals_intensity'; intensity: 'lowered' | 'medium' }
  | { type: 'set_breath_pattern'; pattern: 'exhale_longer' | 'neutral' }
  | { type: 'set_audio_fade'; profile: 'slow' | 'normal' }
  | { type: 'set_haptics'; mode: 'calm' | 'off' }
  | { type: 'post_cta'; target: 'screen_silk' | 'none' };

export type Runtime = {
  apply(actions: FlashGlowAction[]): void;
  extend(ms: number): Promise<void>;
  softExit(): Promise<void>;
  state: {
    visuals: 'lowered' | 'medium';
    breath: 'exhale_longer' | 'neutral';
    audioFade: 'slow' | 'normal';
    haptics: 'calm' | 'off';
    extendedMs: number;
  };
};

const EXTEND_RESET_FALLBACK_MS = 90_000;
const SOFT_EXIT_TRANSITION_MS = 1_200;

const applyDataAttribute = (name: string, value: string) => {
  if (typeof document === 'undefined') {
    return;
  }
  document.documentElement.dataset[name as 'flashGlowVisuals'] = value;
};

const removeDataAttribute = (name: string) => {
  if (typeof document === 'undefined') {
    return;
  }
  delete document.documentElement.dataset[name as 'flashGlowVisuals'];
};

const createCalmVibrationPattern = () => [0, 40, 120, 40];

const ensureVibrationStopped = () => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(0);
    } catch {
      // ignore
    }
  }
};

export const useFlashGlowSession = (): Runtime => {
  const { prefersReducedMotion } = useMotionPrefs();

  const [state, setState] = useState<Runtime['state']>(() => ({
    visuals: prefersReducedMotion ? 'lowered' : 'medium',
    breath: 'neutral',
    audioFade: 'normal',
    haptics: prefersReducedMotion ? 'off' : 'calm',
    extendedMs: 0,
  }));

  const extendTimerRef = useRef<number | null>(null);
  const exitTimerRef = useRef<number | null>(null);

  const applyVisuals = useCallback((intensity: 'lowered' | 'medium') => {
    setState((current) => {
      if (current.visuals === intensity) {
        return current;
      }
      return { ...current, visuals: intensity };
    });
    applyDataAttribute('flashGlowVisuals', intensity);
  }, []);

  const applyBreath = useCallback((pattern: 'exhale_longer' | 'neutral') => {
    setState((current) => {
      if (current.breath === pattern) {
        return current;
      }
      return { ...current, breath: pattern };
    });
    applyDataAttribute('flashGlowBreath', pattern);
  }, []);

  const applyAudioFade = useCallback((profile: 'slow' | 'normal') => {
    setState((current) => {
      if (current.audioFade === profile) {
        return current;
      }
      return { ...current, audioFade: profile };
    });
    applyDataAttribute('flashGlowAudio', profile);
  }, []);

  const applyHaptics = useCallback((mode: 'calm' | 'off') => {
    setState((current) => {
      if (current.haptics === mode) {
        return current;
      }
      return { ...current, haptics: mode };
    });
    applyDataAttribute('flashGlowHaptics', mode);

    if (typeof navigator === 'undefined' || !('vibrate' in navigator)) {
      return;
    }

    if (mode === 'calm' && !prefersReducedMotion) {
      try {
        navigator.vibrate(createCalmVibrationPattern());
      } catch {
        // ignore vibration errors
      }
      return;
    }

    ensureVibrationStopped();
  }, [prefersReducedMotion]);

  const extend = useCallback(async (ms: number) => {
    const safeDuration = Number.isFinite(ms) && ms > 0 ? Math.floor(ms) : 60_000;

    if (extendTimerRef.current) {
      window.clearTimeout(extendTimerRef.current);
      extendTimerRef.current = null;
    }

    logger.info(`flash:extend:${safeDuration}`, { duration_ms: safeDuration }, 'FLASH');

    setState((current) => ({ ...current, extendedMs: current.extendedMs + safeDuration }));

    extendTimerRef.current = window.setTimeout(() => {
      setState((current) => ({ ...current, extendedMs: Math.max(0, current.extendedMs - safeDuration) }));
      extendTimerRef.current = null;
    }, safeDuration || EXTEND_RESET_FALLBACK_MS);

    return Promise.resolve();
  }, []);

  const softExit = useCallback(async () => {
    if (exitTimerRef.current) {
      window.clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }

    logger.info('flash:soft_exit', undefined, 'FLASH');

    applyAudioFade('slow');
    applyVisuals('lowered');
    applyHaptics('off');

    if (typeof document === 'undefined') {
      await new Promise<void>((resolve) => {
        exitTimerRef.current = window.setTimeout(() => {
          exitTimerRef.current = null;
          resolve();
        }, SOFT_EXIT_TRANSITION_MS);
      });
      return;
    }

    document.documentElement.classList.add('flash-glow-soft-exit');

    await new Promise<void>((resolve) => {
      exitTimerRef.current = window.setTimeout(() => {
        document.documentElement.classList.remove('flash-glow-soft-exit');
        exitTimerRef.current = null;
        resolve();
      }, SOFT_EXIT_TRANSITION_MS);
    });
  }, [applyAudioFade, applyHaptics, applyVisuals]);

  const runtimeState = useMemo<Runtime['state']>(
    () => ({
      visuals: state.visuals,
      breath: state.breath,
      audioFade: state.audioFade,
      haptics: state.haptics,
      extendedMs: state.extendedMs,
    }),
    [state.audioFade, state.breath, state.extendedMs, state.haptics, state.visuals],
  );

  const apply = useCallback(
    (actions: FlashGlowAction[]) => {
      if (!Array.isArray(actions) || actions.length === 0) {
        return;
      }

      const normalized = prefersReducedMotion
        ? actions.map((action) => {
            if (action.type === 'set_visuals_intensity') {
              return { ...action, intensity: 'lowered' } as FlashGlowAction;
            }
            if (action.type === 'set_haptics') {
              return { ...action, mode: 'off' } as FlashGlowAction;
            }
            return action;
          })
        : actions;

      Sentry.addBreadcrumb({
        category: 'flash',
        level: 'info',
        message: 'flash:runtime:apply',
        data: { actions: normalized.map((action) => action.type) },
      });

      normalized.forEach((action) => {
        switch (action.type) {
          case 'set_visuals_intensity':
            applyVisuals(action.intensity);
            break;
          case 'set_breath_pattern':
            applyBreath(action.pattern);
            break;
          case 'set_audio_fade':
            applyAudioFade(action.profile);
            break;
          case 'set_haptics':
            applyHaptics(action.mode);
            break;
          case 'post_cta':
          case 'extend_session':
          case 'soft_exit':
          default:
            break;
        }
      });
    },
    [applyAudioFade, applyBreath, applyHaptics, applyVisuals, prefersReducedMotion],
  );

  useEffect(() => {
    if (prefersReducedMotion) {
      applyVisuals('lowered');
      applyHaptics('off');
    }
  }, [applyHaptics, applyVisuals, prefersReducedMotion]);

  useEffect(
    () => () => {
      if (extendTimerRef.current) {
        window.clearTimeout(extendTimerRef.current);
      }
      if (exitTimerRef.current) {
        window.clearTimeout(exitTimerRef.current);
      }
      ensureVibrationStopped();
      removeDataAttribute('flashGlowVisuals');
      removeDataAttribute('flashGlowBreath');
      removeDataAttribute('flashGlowAudio');
      removeDataAttribute('flashGlowHaptics');
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('flash-glow-soft-exit');
      }
    },
    [],
  );

  return {
    apply,
    extend,
    softExit,
    state: runtimeState,
  };
};

export type { FlashGlowAction as FlashGlowActions };
