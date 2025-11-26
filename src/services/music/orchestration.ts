import { supabase } from '@/integrations/supabase/client';
import type { ClinicalSignal } from '@/services/clinicalOrchestration';
import { logger } from '@/lib/logger';

const normalizeError = (error: unknown): Error => (
  error instanceof Error
    ? error
    : new Error(typeof error === 'object' && error !== null && 'message' in error
      ? String((error as { message?: unknown }).message ?? 'Unknown error')
      : 'Unknown error')
);

export type MusicOrchestrationPresetId = 'ambient_soft' | 'focus' | 'bright';

export interface MusicOrchestrationPreset {
  id: MusicOrchestrationPresetId;
  label: string;
  description: string;
  texture: 'soft' | 'focused' | 'radiant';
  intensity: 'low' | 'medium' | 'high';
  volume: number;
  playbackRate: number;
  crossfadeMs: number;
  source: 'resume' | 'clinical' | 'mood';
  hints: string[];
  reason: string;
}

interface MoodVector {
  valence: number;
  arousal: number;
  timestamp: string;
}

interface PresetEvaluation {
  preset: MusicOrchestrationPreset;
  changed: boolean;
}

const STORAGE_KEY = 'emotionscare.music.lastPreset';

const PRESET_CATALOG: Record<MusicOrchestrationPresetId, Omit<MusicOrchestrationPreset, 'id' | 'source' | 'hints' | 'reason'>> = {
  ambient_soft: {
    label: 'Ambient Soft',
    description: 'Texture feutrée et chaleureuse, idéale pour les phases de récupération ou de tension.',
    texture: 'soft',
    intensity: 'low',
    volume: 0.45,
    playbackRate: 0.96,
    crossfadeMs: 2600,
  },
  focus: {
    label: 'Focus Layer',
    description: 'Plan sonore équilibré et précis pour soutenir la concentration.',
    texture: 'focused',
    intensity: 'medium',
    volume: 0.6,
    playbackRate: 1,
    crossfadeMs: 1800,
  },
  bright: {
    label: 'Bright Bloom',
    description: 'Textures lumineuses et dynamiques pour prolonger l’élan positif.',
    texture: 'radiant',
    intensity: 'high',
    volume: 0.72,
    playbackRate: 1.06,
    crossfadeMs: 1200,
  },
};

function isPresetId(value: unknown): value is MusicOrchestrationPresetId {
  return value === 'ambient_soft' || value === 'focus' || value === 'bright';
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function extractHints(signals: ClinicalSignal[]): string[] {
  const hints = new Set<string>();

  signals.forEach(signal => {
    const metadata = signal.metadata ?? {};

    const rawHints = (metadata.hints ?? metadata.actions) as unknown;
    if (Array.isArray(rawHints)) {
      rawHints.forEach(item => {
        if (!item) return;
        if (typeof item === 'string') {
          hints.add(item);
          return;
        }
        if (typeof item === 'object' && 'action' in item && typeof (item as any).action === 'string') {
          hints.add((item as any).action);
        }
      });
    }
  });

  return Array.from(hints);
}

function extractSamVector(signals: ClinicalSignal[]): MoodVector | null {
  const samSignal = signals.find(signal => signal.source_instrument === 'SAM');
  if (!samSignal) {
    return null;
  }

  const metadata = samSignal.metadata ?? {};
  const scoresSource = (metadata.scores ?? metadata) as Record<string, any>;

  const valence = Number(scoresSource?.valence ?? scoresSource?.valence_score);
  const arousal = Number(scoresSource?.arousal ?? scoresSource?.arousal_score);

  if (!Number.isFinite(valence) || !Number.isFinite(arousal)) {
    return null;
  }

  return {
    valence: clamp(valence, 0, 100),
    arousal: clamp(arousal, 0, 100),
    timestamp: samSignal.created_at,
  };
}

function buildPreset(
  id: MusicOrchestrationPresetId,
  source: MusicOrchestrationPreset['source'],
  hints: string[],
  reason: string
): MusicOrchestrationPreset {
  const base = PRESET_CATALOG[id];
  return {
    id,
    source,
    hints,
    reason,
    ...base,
  };
}

class MusicOrchestrationService {
  private currentPresetId: MusicOrchestrationPresetId;
  private lastMood: MoodVector | null = null;
  private cachedSignals: ClinicalSignal[] = [];
  private lastSource: MusicOrchestrationPreset['source'] = 'resume';

  constructor() {
    this.currentPresetId = this.loadPresetFromStorage();
  }

  getActivePreset(): MusicOrchestrationPreset {
    return buildPreset(this.currentPresetId, this.lastSource, extractHints(this.cachedSignals), 'Reprise du profil précédent');
  }

  async refreshFromClinicalSignals(): Promise<PresetEvaluation> {
    try {
      const { data, error } = await supabase
        .from('clinical_signals')
        .select('*')
        .in('source_instrument', ['WHO5', 'SAM'])
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) {
        logger.error('Failed to fetch clinical signals for music orchestration', normalizeError(error), 'MUSIC');
        return { preset: this.getActivePreset(), changed: false };
      }

      this.cachedSignals = (data ?? []) as ClinicalSignal[];
    } catch (err) {
      logger.error('Unexpected error while fetching clinical signals', normalizeError(err), 'MUSIC');
      this.cachedSignals = [];
    }

    const evaluation = this.evaluatePreset('clinical');
    return evaluation;
  }

  handleMoodUpdate(mood: MoodVector): PresetEvaluation {
    this.lastMood = mood;
    return this.evaluatePreset('mood');
  }

  private evaluatePreset(source: MusicOrchestrationPreset['source']): PresetEvaluation {
    const hints = extractHints(this.cachedSignals);
    const samVector = extractSamVector(this.cachedSignals);
    const moodVector = this.lastMood ?? samVector ?? null;

    const targetPresetId = this.selectPresetId(this.cachedSignals, hints, moodVector);
    const changed = targetPresetId !== this.currentPresetId || source !== this.lastSource;

    if (changed) {
      this.currentPresetId = targetPresetId;
      this.lastSource = source;
      this.persistPreset(targetPresetId);
    }

    const reason = this.buildReason(targetPresetId, hints, moodVector, source);
    const preset = buildPreset(targetPresetId, source, hints, reason);

    return { preset, changed };
  }

  private selectPresetId(
    signals: ClinicalSignal[],
    hints: string[],
    mood: MoodVector | null
  ): MusicOrchestrationPresetId {
    const hasGentleTone = hints.includes('gentle_tone');
    const hasReduceIntensity = hints.includes('reduce_intensity');
    const hasPreferSilence = hints.includes('prefer_silence');
    const hasEncourageMovement = hints.includes('encourage_movement');

    const anxietySignal = signals.find(signal => signal.domain === 'anxiety' && signal.level >= 3);
    const lowWellbeing = signals.find(signal => signal.source_instrument === 'WHO5' && signal.level <= 1);

    if (hasGentleTone || hasReduceIntensity || hasPreferSilence || anxietySignal || lowWellbeing) {
      return 'ambient_soft';
    }

    if (hasEncourageMovement) {
      return 'bright';
    }

    if (mood) {
      const { valence, arousal } = mood;

      if (arousal <= 35 || (valence < 40 && arousal > 70)) {
        return 'ambient_soft';
      }

      if (valence >= 65 && arousal >= 55) {
        return 'bright';
      }

      if (arousal >= 65) {
        return 'focus';
      }

      if (valence >= 55) {
        return 'bright';
      }
    }

    return 'focus';
  }

  private buildReason(
    presetId: MusicOrchestrationPresetId,
    hints: string[],
    mood: MoodVector | null,
    source: MusicOrchestrationPreset['source']
  ): string {
    if (source === 'resume') {
      return 'Reprise du dernier profil sonore.';
    }

    if (hints.length > 0) {
      return `Adaptation clinique (${hints.join(', ')}).`;
    }

    if (mood) {
      const valence = Math.round(mood.valence);
      const arousal = Math.round(mood.arousal);
      return `SAM/Mood → valence ${valence} / activation ${arousal}.`;
    }

    switch (presetId) {
      case 'ambient_soft':
        return 'Profil par défaut apaisé.';
      case 'bright':
        return 'Profil tonique par défaut.';
      default:
        return 'Profil équilibré.';
    }
  }

  private loadPresetFromStorage(): MusicOrchestrationPresetId {
    if (typeof window === 'undefined') {
      return 'ambient_soft';
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && isPresetId(stored)) {
      return stored;
    }

    return 'ambient_soft';
  }

  private persistPreset(presetId: MusicOrchestrationPresetId) {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, presetId);
    } catch (error) {
      logger.warn('Unable to persist music preset', error, 'MUSIC');
    }
  }
}

export const musicOrchestrationService = new MusicOrchestrationService();
