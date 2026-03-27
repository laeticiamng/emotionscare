// @ts-nocheck
/**
 * Feature: Mood Mixer
 * Création et mixage d'ambiances sonores personnalisées
 */

// ============================================================================
// RE-EXPORTS FROM MODULES
// ============================================================================
export {
  // View
  MoodMixerView,
  // Hooks
  useMoodMixer,
  useMoodMixerEnriched,
  // Service
  MoodMixerService,
  moodMixerService,
  // Types
  type MoodMixerSession,
  type EmotionComponent,
  type MixingStrategy,
  type BlendingStep,
  type EmotionBlend,
  type PersonalizedMix,
  type MoodMixerStats,
  type Sliders,
  type PresetDraft,
  type PresetInsert,
  type PresetRecord,
  type PresetUpdate,
  type Preset,
  type MoodComponent,
  type MoodPreset,
  type UseMoodMixerEnrichedReturn,
} from '@/modules/mood-mixer';

// ============================================================================
// LOCAL COMPONENTS
// ============================================================================
export { SoundLayerCard, type SoundLayer } from './components/SoundLayerCard';
export { SoundLibrary, type Sound } from './components/SoundLibrary';

// ============================================================================
// LOCAL HOOKS
// ============================================================================
export { useMoodMixerSession } from './hooks/useMoodMixerSession';

// ============================================================================
// ADDITIONAL TYPES
// ============================================================================
export interface MoodMixerLayer {
  id: string;
  sound_id: string;
  volume: number;
  pan?: number;
  pitch?: number;
  enabled: boolean;
}

export type MoodMixerCategory = 
  | 'nature'
  | 'urban'
  | 'meditation'
  | 'focus'
  | 'sleep'
  | 'energy'
  | 'custom';

// ============================================================================
// DEFAULT PRESETS
// ============================================================================
export const DEFAULT_MOOD_MIXER_PRESETS = [
  {
    id: 'rain-cafe',
    name: 'Café Pluvieux',
    description: 'Ambiance café avec pluie douce en arrière-plan',
    icon: '☕',
    category: 'focus' as MoodMixerCategory,
  },
  {
    id: 'forest-morning',
    name: 'Forêt au Matin',
    description: 'Réveil naturel avec oiseaux et ruisseau',
    icon: '🌲',
    category: 'nature' as MoodMixerCategory,
  },
  {
    id: 'deep-sleep',
    name: 'Sommeil Profond',
    description: 'Sons apaisants pour un endormissement facile',
    icon: '🌙',
    category: 'sleep' as MoodMixerCategory,
  },
];
