'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import * as Sentry from '@sentry/react';

import { useFlags } from '@/core/flags';
import { useToast } from '@/components/ui/use-toast';
import { useCurrentMood } from '@/hooks/useCurrentMood';

import { computeMixerActions, type MixerAction } from '@/features/orchestration/moodMixer.orchestrator';
import type { MixerParams } from '../audio/engine';
import * as engine from '../audio/engine';

type SliderLevel = 0 | 1 | 2 | 3 | 4;

type UiHintKey = Extract<MixerAction, { action: 'ui_hint' }>['key'];

type MicroGestureKey = Extract<MixerAction, { action: 'micro_gesture' }>['key'];

type MoodMixerIntent = 'valence_up' | 'valence_hold' | 'arousal_down' | 'arousal_up';

type MoodMixerEventMap = {
  'sam.target.updated': { valenceLevel: SliderLevel; arousalLevel: SliderLevel };
  'mixer.params.applied': { params: MixerParams; crossfadeMs: number };
};

type MoodMixerListener<K extends keyof MoodMixerEventMap> = (payload: MoodMixerEventMap[K]) => void;

const listeners: { [K in keyof MoodMixerEventMap]?: Set<MoodMixerListener<K>> } = {};

const emit = <K extends keyof MoodMixerEventMap>(event: K, payload: MoodMixerEventMap[K]) => {
  const bucket = listeners[event];
  if (!bucket) return;

  if (event === 'sam.target.updated') {
    Sentry.addBreadcrumb({
      category: 'mixer',
      message: 'mixer.sam.target.updated',
      level: 'info',
      data: payload,
    });
  }

  if (event === 'mixer.params.applied') {
    Sentry.addBreadcrumb({
      category: 'mixer',
      message: 'mixer.params.applied',
      level: 'info',
      data: {
        warmth: payload.params.warmth,
        brightness: payload.params.brightness,
        tempo: payload.params.tempo,
        rhythm: payload.params.rhythm,
        dynamics: payload.params.dynamics,
        reverb: payload.params.reverb,
        crossfadeMs: payload.crossfadeMs,
      },
    });
  }

  bucket.forEach((listener) => {
    try {
      listener(payload);
    } catch (error) {
      Sentry.captureException(error);
    }
  });
};

export const moodMixerBus = {
  on<K extends keyof MoodMixerEventMap>(event: K, listener: MoodMixerListener<K>) {
    const bucket = (listeners[event] ??= new Set<MoodMixerListener<K>>()) as Set<MoodMixerListener<K>>;
    bucket.add(listener);
    return () => {
      bucket.delete(listener);
    };
  },
};

const HINT_COPY: Record<UiHintKey, string> = {
  plus_doux: 'Plus doux',
  plus_clair: 'Plus clair',
  plus_posé: 'Plus posé',
  plus_energique: 'Plus énergique',
};

const MICRO_GESTURE_COPY: Record<MicroGestureKey, string> = {
  long_exhale: 'Expiration longue',
  soft_breath: 'Souffle feutré',
  none: 'Respiration libre',
};

const VALENCE_TRACK: Array<{ level: SliderLevel; label: string; aria: string }> = [
  { level: 0, label: 'Velours paisible', aria: 'plus doux' },
  { level: 1, label: 'Brume réconfortante', aria: 'plus doux' },
  { level: 2, label: 'Équilibre soyeux', aria: 'équilibré' },
  { level: 3, label: 'Clarté chaleureuse', aria: 'plus clair' },
  { level: 4, label: 'Rayon scintillant', aria: 'plus clair' },
];

const AROUSAL_TRACK: Array<{ level: SliderLevel; label: string; aria: string }> = [
  { level: 0, label: 'Tempo suspendu', aria: 'plus posé' },
  { level: 1, label: 'Onde tranquille', aria: 'plus posé' },
  { level: 2, label: 'Cadence souple', aria: 'équilibré' },
  { level: 3, label: 'Rythme tonique', aria: 'plus énergique' },
  { level: 4, label: 'Éclat vibrant', aria: 'plus énergique' },
];

const clampLevel = (value: number): SliderLevel => {
  if (value <= 0) return 0;
  if (value >= 4) return 4;
  return value as SliderLevel;
};

const deriveValenceLevel = (valence: number | null): SliderLevel => {
  if (typeof valence !== 'number') {
    return 2;
  }
  const normalized = Math.round(((valence + 100) / 200) * 4);
  return clampLevel(normalized);
};

const deriveArousalLevel = (arousal: number | null): SliderLevel => {
  if (typeof arousal !== 'number') {
    return 2;
  }
  const normalized = Math.round((arousal / 100) * 4);
  return clampLevel(normalized);
};

const toIntent = (
  target: { valence: SliderLevel; arousal: SliderLevel },
  reference: { valence: SliderLevel; arousal: SliderLevel },
): MoodMixerIntent => {
  if (target.arousal < reference.arousal) return 'arousal_down';
  if (target.arousal > reference.arousal) return 'arousal_up';
  if (target.valence > reference.valence) return 'valence_up';
  return 'valence_hold';
};

const reduceActions = (actions: MixerAction[]) => {
  const params: Partial<MixerParams> = {};
  const hints = new Set<UiHintKey>();
  let crossfadeMs = 200;
  let microGesture: MicroGestureKey = 'none';

  actions.forEach((action) => {
    switch (action.action) {
      case 'set_warmth':
        params.warmth = action.key;
        break;
      case 'set_brightness':
        params.brightness = action.key;
        break;
      case 'set_tempo':
        params.tempo = action.key;
        break;
      case 'set_rhythm_density':
        params.rhythm = action.key;
        break;
      case 'set_dynamics':
        params.dynamics = action.key;
        break;
      case 'set_reverb':
        params.reverb = action.key;
        break;
      case 'crossfade_preview':
        crossfadeMs = Math.min(action.ms, 250);
        break;
      case 'ui_hint':
        hints.add(action.key);
        break;
      case 'micro_gesture':
        microGesture = action.key;
        break;
      default:
        break;
    }
  });

  return { params, hints: Array.from(hints), microGesture, crossfadeMs };
};

async function persistSession(intent: MoodMixerIntent, params: MixerParams) {
  try {
    const response = await fetch('/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        module: 'mood_mixer',
        metadata: {
          intent,
          params: {
            warmth: params.warmth,
            brightness: params.brightness,
            tempo: params.tempo,
            rhythm: params.rhythm,
            dynamics: params.dynamics,
            reverb: params.reverb,
          },
          notes: 'guidage sliders appliqué',
        },
      }),
    });

    if (!response.ok) {
      throw new Error('persist_failed');
    }
  } catch (error) {
    Sentry.captureException(error);
  }
}

export interface MoodMixerSessionState {
  valenceLevel: SliderLevel;
  arousalLevel: SliderLevel;
  valenceTrack: typeof VALENCE_TRACK;
  arousalTrack: typeof AROUSAL_TRACK;
  badges: string[];
  microGesture: string;
  microGestureKey: MicroGestureKey;
  isApplying: boolean;
  updateValence: (value: SliderLevel) => void;
  commitValence: (value: SliderLevel) => Promise<void>;
  updateArousal: (value: SliderLevel) => void;
  commitArousal: (value: SliderLevel) => Promise<void>;
  applyTarget: () => Promise<void>;
  prefersReducedMotion: boolean;
  enabled: boolean;
}

export function useMoodMixerSession(): MoodMixerSessionState {
  const { flags } = useFlags();
  const { toast } = useToast();
  const currentMood = useCurrentMood();
  const prefersReducedMotion = useReducedMotion();

  const currentValenceLevel = useMemo(
    () => deriveValenceLevel(currentMood.valence),
    [currentMood.valence],
  );
  const currentArousalLevel = useMemo(
    () => deriveArousalLevel(currentMood.arousal),
    [currentMood.arousal],
  );

  const [valenceLevel, setValenceLevel] = useState<SliderLevel>(currentValenceLevel);
  const [arousalLevel, setArousalLevel] = useState<SliderLevel>(currentArousalLevel);
  const [badges, setBadges] = useState<string[]>([]);
  const [microGesture, setMicroGesture] = useState<MicroGestureKey>('none');
  const [isApplying, setIsApplying] = useState(false);
  const lastTargetRef = useRef<{ valence: SliderLevel; arousal: SliderLevel }>({
    valence: valenceLevel,
    arousal: arousalLevel,
  });

  const enabled = Boolean(flags.FF_ORCH_MIXER);

  const runOrchestration = useCallback(
    async (target: { valence: SliderLevel; arousal: SliderLevel }, commit: boolean) => {
      if (!enabled) {
        setValenceLevel(target.valence);
        setArousalLevel(target.arousal);
        return;
      }

      const actions = computeMixerActions({
        targetValence: target.valence,
        targetArousal: target.arousal,
        currentValence: currentValenceLevel,
        prm: Boolean(prefersReducedMotion),
      });

      const { params, hints, microGesture: gesture, crossfadeMs } = reduceActions(actions);
      const nextParams: MixerParams = { ...engine.getCurrentParams(), ...params };

      setBadges(hints.map((hint) => HINT_COPY[hint]));
      setMicroGesture(gesture);
      lastTargetRef.current = target;

      if (!commit) {
        engine.preview(params, crossfadeMs);
        return;
      }

      emit('sam.target.updated', {
        valenceLevel: target.valence,
        arousalLevel: target.arousal,
      });

      setIsApplying(true);
      try {
        await engine.apply(nextParams, crossfadeMs);
        emit('mixer.params.applied', { params: nextParams, crossfadeMs });
        const intent = toIntent(target, {
          valence: currentValenceLevel,
          arousal: currentArousalLevel,
        });
        await persistSession(intent, nextParams);
        toast({
          title: 'Ambiance ajustée',
          description: 'Le mix sonore suit maintenant ton ressenti.',
        });
      } catch (error) {
        Sentry.captureException(error);
        toast({
          title: 'Synchronisation sonore indisponible',
          description: 'Le moteur audio n’a pas pu suivre les curseurs pour le moment.',
          variant: 'destructive',
        });
      } finally {
        setIsApplying(false);
      }
    },
    [
      currentArousalLevel,
      currentValenceLevel,
      enabled,
      prefersReducedMotion,
      toast,
    ],
  );

  const updateValence = useCallback(
    (value: SliderLevel) => {
      const next = clampLevel(value);
      setValenceLevel(next);
      void runOrchestration({ valence: next, arousal: arousalLevel }, false);
    },
    [arousalLevel, runOrchestration],
  );

  const commitValence = useCallback(
    async (value: SliderLevel) => {
      const next = clampLevel(value);
      setValenceLevel(next);
      await runOrchestration({ valence: next, arousal: arousalLevel }, true);
    },
    [arousalLevel, runOrchestration],
  );

  const updateArousal = useCallback(
    (value: SliderLevel) => {
      const next = clampLevel(value);
      setArousalLevel(next);
      void runOrchestration({ valence: valenceLevel, arousal: next }, false);
    },
    [runOrchestration, valenceLevel],
  );

  const commitArousal = useCallback(
    async (value: SliderLevel) => {
      const next = clampLevel(value);
      setArousalLevel(next);
      await runOrchestration({ valence: valenceLevel, arousal: next }, true);
    },
    [runOrchestration, valenceLevel],
  );

  const applyTarget = useCallback(async () => {
    await runOrchestration(lastTargetRef.current, true);
  }, [runOrchestration]);

  return {
    valenceLevel,
    arousalLevel,
    valenceTrack: VALENCE_TRACK,
    arousalTrack: AROUSAL_TRACK,
    badges,
    microGesture: MICRO_GESTURE_COPY[microGesture],
    microGestureKey: microGesture,
    isApplying,
    updateValence,
    commitValence,
    updateArousal,
    commitArousal,
    applyTarget,
    prefersReducedMotion: Boolean(prefersReducedMotion),
    enabled,
  };
}
