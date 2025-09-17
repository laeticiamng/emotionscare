import { z } from 'zod';

export const moodPlaylistRequestSchema = z.object({
  mood: z.string().min(1, 'Mood is required'),
  intensity: z.number().min(0).max(1).optional(),
  duration_minutes: z.number().int().min(5).max(180).optional(),
  preferences: z
    .object({
      energy: z.enum(['low', 'medium', 'high']).optional(),
      include_instrumental: z.boolean().optional(),
      include_vocals: z.boolean().optional(),
      instrumentation: z.array(z.string().min(1)).max(5).optional(),
    })
    .optional(),
  context: z
    .object({
      activity: z
        .enum(['relaxation', 'focus', 'commute', 'sleep', 'recovery', 'creative', 'mood-boost'])
        .optional(),
      time_of_day: z.enum(['morning', 'afternoon', 'evening', 'night']).optional(),
    })
    .optional(),
});

export type MoodPlaylistRequest = z.infer<typeof moodPlaylistRequestSchema>;

type ActivityType = 'relaxation' | 'focus' | 'commute' | 'sleep' | 'recovery' | 'creative' | 'mood-boost';

export interface AdaptiveTrackDefinition {
  id: string;
  title: string;
  artist: string;
  duration: number; // seconds
  url: string;
  mood: string;
  energy: number; // 0-1 scale
  focus: 'breathing' | 'flow' | 'release' | 'recovery' | 'uplift' | 'reset';
  instrumentation: string[];
  tags: string[];
  hasVocals: boolean;
  description: string;
}

interface AdaptivePlaylistDefinition {
  id: string;
  mood: string;
  title: string;
  description: string;
  energy: number;
  defaultDurationMinutes: number;
  tags: string[];
  recommendations: string[];
  guidance: {
    focus: string;
    breathwork: string;
    activities: string[];
  };
  curatedBy: string;
  tracks: AdaptiveTrackDefinition[];
}

export interface MoodPlaylistTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  mood: string;
  energy: number;
  focus: AdaptiveTrackDefinition['focus'];
  instrumentation: string[];
  tags: string[];
  description: string;
}

export interface MoodPlaylistAnalysisSegment {
  track_id: string;
  start: number;
  end: number;
  energy: number;
  focus: AdaptiveTrackDefinition['focus'];
}

export interface MoodPlaylistResponse {
  playlist_id: string;
  mood: string;
  requested_mood: string;
  title: string;
  description: string;
  total_duration: number;
  unit: 'seconds';
  tracks: MoodPlaylistTrack[];
  energy_profile: {
    baseline: number;
    requested: number | null;
    recommended: number;
    alignment: number;
    curve: MoodPlaylistAnalysisSegment[];
  };
  recommendations: string[];
  guidance: AdaptivePlaylistDefinition['guidance'];
  metadata: {
    curated_by: string;
    tags: string[];
    dataset_version: string;
  };
}

const ENERGY_LEVEL_MAP: Record<'low' | 'medium' | 'high', number> = {
  low: 0.25,
  medium: 0.5,
  high: 0.75,
};

const PLAYLIST_LIBRARY: Record<string, AdaptivePlaylistDefinition> = {
  calm_relax: {
    id: 'calm_relax',
    mood: 'calm',
    title: 'Calm Relaxation Flow',
    description: 'Textures ambient, nappes aériennes et sons naturels pour apaiser le système nerveux.',
    energy: 0.2,
    defaultDurationMinutes: 18,
    tags: ['calm', 'relax', 'soothing', 'adaptive'],
    recommendations: [
      'Synchronisez votre respiration 4-7-8 avec la première piste.',
      'Relâchez progressivement les épaules et la mâchoire durant la deuxième piste.',
      'Terminez la session en visualisant un lieu sûr et réconfortant.',
    ],
    guidance: {
      focus: 'Stabiliser le rythme cardiaque et induire une relaxation profonde.',
      breathwork: 'Respiration diaphragmatique lente, 4 secondes d’inspiration / 6 secondes d’expiration.',
      activities: ['Écriture d’un journal apaisant', 'Étirements doux', 'Hydratation consciente'],
    },
    curatedBy: 'EmotionsCare Adaptive Engine',
    tracks: [
      {
        id: 'calm_relax_1',
        title: 'Forest Haze',
        artist: 'EmotionsCare Ensemble',
        duration: 240,
        url: '/audio/adaptive/calm-forest-haze.mp3',
        mood: 'calm',
        energy: 0.15,
        focus: 'breathing',
        instrumentation: ['pads', 'field-recordings', 'soft piano'],
        tags: ['ambient', 'nature', 'slow'],
        hasVocals: false,
        description: 'Bruits de forêt combinés à des nappes synthétiques très douces.',
      },
      {
        id: 'calm_relax_2',
        title: 'Gentle Currents',
        artist: 'Aurora Lines',
        duration: 360,
        url: '/audio/adaptive/calm-gentle-currents.mp3',
        mood: 'calm',
        energy: 0.2,
        focus: 'release',
        instrumentation: ['synth', 'warm strings'],
        tags: ['soothing', 'warm', 'floating'],
        hasVocals: false,
        description: 'Arpèges lents et cordes veloutées pour relâcher les tensions.',
      },
      {
        id: 'calm_relax_3',
        title: 'Moonlit Breaths',
        artist: 'Lumen Tide',
        duration: 300,
        url: '/audio/adaptive/calm-moonlit-breaths.mp3',
        mood: 'calm',
        energy: 0.25,
        focus: 'recovery',
        instrumentation: ['piano', 'glass harmonics'],
        tags: ['meditative', 'reflective'],
        hasVocals: false,
        description: 'Piano minimaliste et textures cristallines pour clôturer la relaxation.',
      },
    ],
  },
  focus_flow: {
    id: 'focus_flow',
    mood: 'focus',
    title: 'Deep Focus Flow',
    description: 'Sélection progressive pour favoriser la concentration soutenue et la pensée claire.',
    energy: 0.45,
    defaultDurationMinutes: 25,
    tags: ['focus', 'productivity', 'instrumental'],
    recommendations: [
      'Commencez par une respiration carrée 4-4-4-4 pour calibrer l’attention.',
      'Utilisez la deuxième piste pour entrer dans un état de flow en tâche cognitive.',
      'Effectuez une courte pause active entre les pistes deux et trois si nécessaire.',
    ],
    guidance: {
      focus: 'Accroître la clarté mentale et la capacité de traitement.',
      breathwork: 'Respiration carrée pour aligner l’énergie et la vigilance.',
      activities: ['Session de deep work', 'Lecture analytique', 'Planification stratégique'],
    },
    curatedBy: 'EmotionsCare Adaptive Engine',
    tracks: [
      {
        id: 'focus_flow_1',
        title: 'Neural Pathways',
        artist: 'Cerebral Keys',
        duration: 330,
        url: '/audio/adaptive/focus-neural-pathways.mp3',
        mood: 'focus',
        energy: 0.4,
        focus: 'flow',
        instrumentation: ['piano', 'subtle percussion'],
        tags: ['minimal', 'pulsing'],
        hasVocals: false,
        description: 'Motifs répétitifs et subtils pour stabiliser l’attention.',
      },
      {
        id: 'focus_flow_2',
        title: 'Vector Lights',
        artist: 'Precision Lab',
        duration: 360,
        url: '/audio/adaptive/focus-vector-lights.mp3',
        mood: 'focus',
        energy: 0.5,
        focus: 'flow',
        instrumentation: ['synth', 'granular textures'],
        tags: ['steady', 'analytical'],
        hasVocals: false,
        description: 'Pulsations régulières et textures granulaires pour maintenir la productivité.',
      },
      {
        id: 'focus_flow_3',
        title: 'Cognitive Drift',
        artist: 'Mindframe',
        duration: 420,
        url: '/audio/adaptive/focus-cognitive-drift.mp3',
        mood: 'focus',
        energy: 0.55,
        focus: 'flow',
        instrumentation: ['synth', 'percussion light'],
        tags: ['deep work', 'flow'],
        hasVocals: false,
        description: 'Texture évolutive qui soutient les tâches longues sans distraction.',
      },
    ],
  },
  energize_drive: {
    id: 'energize_drive',
    mood: 'energize',
    title: 'Energize & Drive',
    description: 'Pistes dynamiques et motivantes pour recharger l’organisme et stimuler la motivation.',
    energy: 0.75,
    defaultDurationMinutes: 20,
    tags: ['energize', 'motivational', 'uplifting'],
    recommendations: [
      'Commencez par une respiration active (inspiration rapide, expiration énergique).',
      'Utilisez la deuxième piste pour synchroniser vos mouvements si vous êtes en marche ou en échauffement.',
      'Canalisez l’excédent d’énergie dans une action concrète durant la dernière piste.',
    ],
    guidance: {
      focus: 'Augmenter l’énergie disponible et l’enthousiasme.',
      breathwork: 'Cohérence cardiaque dynamique 3-3 pour activer le système sympathique.',
      activities: ['Échauffement sportif', 'Marche rapide', 'Préparation d’une présentation'],
    },
    curatedBy: 'EmotionsCare Adaptive Engine',
    tracks: [
      {
        id: 'energize_drive_1',
        title: 'Ignition Lines',
        artist: 'Pulse Reactor',
        duration: 270,
        url: '/audio/adaptive/energize-ignition-lines.mp3',
        mood: 'energize',
        energy: 0.7,
        focus: 'uplift',
        instrumentation: ['synth', 'drums'],
        tags: ['dynamic', 'pulse'],
        hasVocals: false,
        description: 'Percussions énergétiques et synthés expansifs pour lancer la dynamique.',
      },
      {
        id: 'energize_drive_2',
        title: 'Momentum Shift',
        artist: 'Kinetic Aura',
        duration: 330,
        url: '/audio/adaptive/energize-momentum-shift.mp3',
        mood: 'energize',
        energy: 0.78,
        focus: 'uplift',
        instrumentation: ['synth', 'bass', 'drums'],
        tags: ['motivational', 'bright'],
        hasVocals: true,
        description: 'Voix légères et basses entraînantes pour maintenir la motivation.',
      },
      {
        id: 'energize_drive_3',
        title: 'Radiant Sprint',
        artist: 'Voltage Twin',
        duration: 300,
        url: '/audio/adaptive/energize-radiant-sprint.mp3',
        mood: 'energize',
        energy: 0.82,
        focus: 'uplift',
        instrumentation: ['guitars', 'drums'],
        tags: ['optimistic', 'fast'],
        hasVocals: true,
        description: 'Guitares brillantes et rythme rapide pour terminer avec une charge positive.',
      },
    ],
  },
  uplift_radiance: {
    id: 'uplift_radiance',
    mood: 'uplift',
    title: 'Radiant Uplift',
    description: 'Ambiances lumineuses et harmonies majoritaires pour cultiver la joie.',
    energy: 0.6,
    defaultDurationMinutes: 22,
    tags: ['uplift', 'joy', 'bright'],
    recommendations: [
      'Souriez volontairement durant la première piste pour activer la boucle de rétroaction positive.',
      'Ancrez un souvenir heureux pendant la deuxième piste.',
      'Partagez une intention positive ou un message bienveillant pendant la dernière piste.',
    ],
    guidance: {
      focus: 'Amplifier la valence positive et l’ouverture émotionnelle.',
      breathwork: 'Respiration cohérente 5-5 pour stabiliser l’humeur positive.',
      activities: ['Visualisation positive', 'Marche légère', 'Création artistique spontanée'],
    },
    curatedBy: 'EmotionsCare Adaptive Engine',
    tracks: [
      {
        id: 'uplift_radiance_1',
        title: 'Golden Skyline',
        artist: 'Sky Bloom',
        duration: 300,
        url: '/audio/adaptive/uplift-golden-skyline.mp3',
        mood: 'uplift',
        energy: 0.55,
        focus: 'uplift',
        instrumentation: ['piano', 'strings', 'light vocals'],
        tags: ['hopeful', 'bright'],
        hasVocals: true,
        description: 'Voix éthérées et piano lumineux pour initier la joie.',
      },
      {
        id: 'uplift_radiance_2',
        title: 'Aurora Bloom',
        artist: 'Helios Choir',
        duration: 330,
        url: '/audio/adaptive/uplift-aurora-bloom.mp3',
        mood: 'uplift',
        energy: 0.62,
        focus: 'uplift',
        instrumentation: ['choir', 'percussion soft'],
        tags: ['radiant', 'harmonic'],
        hasVocals: true,
        description: 'Chœurs légers et percussions douces pour amplifier l’énergie positive.',
      },
      {
        id: 'uplift_radiance_3',
        title: 'Bright Horizons',
        artist: 'Morning Tones',
        duration: 360,
        url: '/audio/adaptive/uplift-bright-horizons.mp3',
        mood: 'uplift',
        energy: 0.65,
        focus: 'uplift',
        instrumentation: ['guitars', 'handclaps'],
        tags: ['celebration', 'sunny'],
        hasVocals: true,
        description: 'Guitares scintillantes et handclaps pour conclure dans l’optimisme.',
      },
    ],
  },
  soothe_release: {
    id: 'soothe_release',
    mood: 'soothe',
    title: 'Soothe & Release',
    description: 'Progression calmante pour traverser les émotions denses et alléger la charge mentale.',
    energy: 0.3,
    defaultDurationMinutes: 24,
    tags: ['soothe', 'emotional release', 'grounding'],
    recommendations: [
      'Commencez par noter votre émotion dominante avant la première piste.',
      'Laissez émerger les pensées sans jugement pendant la deuxième piste.',
      'Complétez par un geste d’auto-compassion ou une affirmation apaisante.',
    ],
    guidance: {
      focus: 'Diminuer la charge émotionnelle et favoriser l’acceptation.',
      breathwork: 'Respiration cohérente 5-6 axée sur l’allongement de l’expiration.',
      activities: ['Écriture expressive', 'Auto-massage', 'Lecture réconfortante'],
    },
    curatedBy: 'EmotionsCare Adaptive Engine',
    tracks: [
      {
        id: 'soothe_release_1',
        title: 'Safe Harbour',
        artist: 'Inner Compass',
        duration: 360,
        url: '/audio/adaptive/soothe-safe-harbour.mp3',
        mood: 'soothe',
        energy: 0.28,
        focus: 'breathing',
        instrumentation: ['piano', 'atmospheric pads'],
        tags: ['grounding', 'warm'],
        hasVocals: false,
        description: 'Ancrage doux et constant pour poser les émotions.',
      },
      {
        id: 'soothe_release_2',
        title: 'Gentle Resolve',
        artist: 'Auric Bloom',
        duration: 420,
        url: '/audio/adaptive/soothe-gentle-resolve.mp3',
        mood: 'soothe',
        energy: 0.3,
        focus: 'release',
        instrumentation: ['strings', 'soft percussion'],
        tags: ['emotional', 'release'],
        hasVocals: false,
        description: 'Cordes chaleureuses avec progression lente pour laisser circuler les émotions.',
      },
      {
        id: 'soothe_release_3',
        title: 'Light Afterglow',
        artist: 'Elysian Frame',
        duration: 360,
        url: '/audio/adaptive/soothe-light-afterglow.mp3',
        mood: 'soothe',
        energy: 0.32,
        focus: 'recovery',
        instrumentation: ['synth', 'choir'],
        tags: ['hopeful', 'gentle'],
        hasVocals: true,
        description: 'Chœur apaisant et textures lumineuses pour retrouver la stabilité.',
      },
    ],
  },
  rest_restore: {
    id: 'rest_restore',
    mood: 'rest',
    title: 'Rest & Restore',
    description: 'Sons enveloppants et berceuses minimalistes pour préparer le sommeil ou la récupération.',
    energy: 0.15,
    defaultDurationMinutes: 30,
    tags: ['rest', 'sleep', 'night'],
    recommendations: [
      'Diminuez l’intensité lumineuse avant de lancer la première piste.',
      'Placez une main sur le cœur et une sur le ventre pour la deuxième piste.',
      'Pratiquez une gratitude douce avant de vous endormir.',
    ],
    guidance: {
      focus: 'Préparer le corps et l’esprit à un repos profond.',
      breathwork: 'Respiration 5-7 avec temps d’arrêt après l’expiration.',
      activities: ['Étirements yin', 'Lecture légère', 'Méditation guidée courte'],
    },
    curatedBy: 'EmotionsCare Adaptive Engine',
    tracks: [
      {
        id: 'rest_restore_1',
        title: 'Evening Embers',
        artist: 'Nocturne Bloom',
        duration: 420,
        url: '/audio/adaptive/rest-evening-embers.mp3',
        mood: 'rest',
        energy: 0.12,
        focus: 'recovery',
        instrumentation: ['piano', 'cello'],
        tags: ['night', 'warm'],
        hasVocals: false,
        description: 'Mélodie piano-cello douce pour enclencher la détente nocturne.',
      },
      {
        id: 'rest_restore_2',
        title: 'Soft Lanterns',
        artist: 'Dream Weavers',
        duration: 480,
        url: '/audio/adaptive/rest-soft-lanterns.mp3',
        mood: 'rest',
        energy: 0.14,
        focus: 'reset',
        instrumentation: ['synth', 'wind chimes'],
        tags: ['lullaby', 'slow'],
        hasVocals: false,
        description: 'Carillons lents et synthés veloutés pour ralentir progressivement.',
      },
      {
        id: 'rest_restore_3',
        title: 'Night Bloom',
        artist: 'Somnus Field',
        duration: 540,
        url: '/audio/adaptive/rest-night-bloom.mp3',
        mood: 'rest',
        energy: 0.16,
        focus: 'reset',
        instrumentation: ['pads', 'ambient guitar'],
        tags: ['deep sleep', 'restorative'],
        hasVocals: false,
        description: 'Texture aérienne continue pour prolonger la phase d’endormissement.',
      },
    ],
  },
};

type PlaylistKey = keyof typeof PLAYLIST_LIBRARY;

const MOOD_ALIASES: Record<string, PlaylistKey> = {
  calm: 'calm_relax',
  peaceful: 'calm_relax',
  relaxed: 'calm_relax',
  anxiety: 'soothe_release',
  anxious: 'soothe_release',
  stressed: 'soothe_release',
  overwhelmed: 'soothe_release',
  sad: 'soothe_release',
  focus: 'focus_flow',
  focused: 'focus_flow',
  productivity: 'focus_flow',
  work: 'focus_flow',
  study: 'focus_flow',
  energetic: 'energize_drive',
  energy: 'energize_drive',
  motivate: 'energize_drive',
  motivated: 'energize_drive',
  workout: 'energize_drive',
  happy: 'uplift_radiance',
  joyful: 'uplift_radiance',
  celebrate: 'uplift_radiance',
  evening: 'rest_restore',
  sleep: 'rest_restore',
  tired: 'rest_restore',
  unwind: 'rest_restore',
};

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function resolvePlaylistDefinition(mood: string): AdaptivePlaylistDefinition {
  const playlistKeys = Object.keys(PLAYLIST_LIBRARY) as PlaylistKey[];
  const normalized = mood as PlaylistKey;
  const key = MOOD_ALIASES[mood] || (playlistKeys.includes(normalized) ? normalized : 'calm_relax');
  return PLAYLIST_LIBRARY[key];
}

function computeTargetEnergy(
  definition: AdaptivePlaylistDefinition,
  request: MoodPlaylistRequest,
): number {
  const requested = typeof request.intensity === 'number' ? request.intensity : null;
  const preference = request.preferences?.energy ? ENERGY_LEVEL_MAP[request.preferences.energy] : null;

  let target = preference ?? requested ?? definition.energy;

  if (request.context?.activity) {
    const activityAdjustments: Partial<Record<ActivityType, number>> = {
      relaxation: -0.05,
      focus: 0.05,
      commute: 0.1,
      sleep: -0.1,
      recovery: -0.08,
      creative: 0.03,
      'mood-boost': 0.12,
    };
    const adjustment = activityAdjustments[request.context.activity];
    if (typeof adjustment === 'number') {
      target += adjustment;
    }
  }

  return clamp(Number(target.toFixed(2)));
}

function filterTracks(
  tracks: AdaptiveTrackDefinition[],
  request: MoodPlaylistRequest,
): AdaptiveTrackDefinition[] {
  let filtered = tracks;

  if (request.preferences?.include_instrumental === false) {
    filtered = filtered.filter(track => track.hasVocals);
  }

  if (request.preferences?.include_vocals === false) {
    filtered = filtered.filter(track => !track.hasVocals);
  }

  if (filtered.length === 0) {
    filtered = tracks;
  }

  if (request.preferences?.instrumentation && request.preferences.instrumentation.length > 0) {
    const preferred = request.preferences.instrumentation.map(instr => instr.toLowerCase());
    filtered = filtered
      .map(track => ({
        track,
        score: preferred.reduce(
          (score, pref) => (track.instrumentation.some(instr => instr.toLowerCase() === pref) ? score + 0.15 : score),
          1,
        ),
      }))
      .sort((a, b) => b.score - a.score)
      .map(entry => entry.track);
  }

  return filtered;
}

function rankTracks(
  tracks: AdaptiveTrackDefinition[],
  targetEnergy: number,
): AdaptiveTrackDefinition[] {
  return tracks
    .map(track => ({
      track,
      score: 1 - Math.abs(track.energy - targetEnergy),
    }))
    .sort((a, b) => b.score - a.score)
    .map(entry => entry.track);
}

function selectTracks(
  tracks: AdaptiveTrackDefinition[],
  targetDuration: number,
  targetEnergy: number,
): AdaptiveTrackDefinition[] {
  if (tracks.length === 0) return tracks;

  const ranked = rankTracks(tracks, targetEnergy);
  const selected: AdaptiveTrackDefinition[] = [];
  let accumulated = 0;

  for (const track of ranked) {
    selected.push(track);
    accumulated += track.duration;
    if (accumulated >= targetDuration) {
      break;
    }
  }

  if (selected.length === 0) {
    selected.push(ranked[0]);
  }

  return selected;
}

function buildEnergyCurve(tracks: AdaptiveTrackDefinition[]): MoodPlaylistAnalysisSegment[] {
  let cursor = 0;
  return tracks.map(track => {
    const start = cursor;
    const end = cursor + track.duration;
    cursor = end;
    return {
      track_id: track.id,
      start,
      end,
      energy: Number(track.energy.toFixed(2)),
      focus: track.focus,
    };
  });
}

export function buildMoodPlaylistResponse(request: MoodPlaylistRequest): MoodPlaylistResponse {
  const normalizedMood = request.mood.trim().toLowerCase();
  const definition = resolvePlaylistDefinition(normalizedMood);
  const targetDuration = Math.round(
    (request.duration_minutes ?? definition.defaultDurationMinutes) * 60,
  );
  const targetEnergy = computeTargetEnergy(definition, request);
  const candidateTracks = filterTracks(definition.tracks, request);
  const selectedTracks = selectTracks(candidateTracks, targetDuration, targetEnergy);
  const totalDuration = selectedTracks.reduce((total, track) => total + track.duration, 0);
  const energyCurve = buildEnergyCurve(selectedTracks);
  const alignment = Number((1 - Math.min(1, Math.abs(targetEnergy - definition.energy))).toFixed(2));

  return {
    playlist_id: definition.id,
    mood: definition.mood,
    requested_mood: normalizedMood,
    title: definition.title,
    description: definition.description,
    total_duration: totalDuration,
    unit: 'seconds',
    tracks: selectedTracks.map(track => ({
      id: track.id,
      title: track.title,
      artist: track.artist,
      url: track.url,
      duration: track.duration,
      mood: track.mood,
      energy: Number(track.energy.toFixed(2)),
      focus: track.focus,
      instrumentation: track.instrumentation,
      tags: track.tags,
      description: track.description,
    })),
    energy_profile: {
      baseline: Number(definition.energy.toFixed(2)),
      requested: request.intensity ?? null,
      recommended: targetEnergy,
      alignment,
      curve: energyCurve,
    },
    recommendations: definition.recommendations,
    guidance: definition.guidance,
    metadata: {
      curated_by: definition.curatedBy,
      tags: definition.tags,
      dataset_version: '2024.06-adaptive',
    },
  };
}

