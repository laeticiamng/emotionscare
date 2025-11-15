# Music Unified

Service musical unifié pour EmotionsCare qui consolide 3 modules musicaux distincts en une seule API cohérente et puissante.

## 📋 Vue d'ensemble

**Music Unified** fusionne les fonctionnalités de :
- **music-therapy** : Musicothérapie avec playlists personnalisées basées sur l'humeur
- **mood-mixer** : Mélange émotionnel avec sliders et transitions progressives
- **adaptive-music** : Adaptation temps réel basée sur l'état physiologique (POMS)

### Avant (3 modules fragmentés) ❌

```typescript
// 3 imports différents
import { MusicTherapyService } from '@/modules/music-therapy';
import { MoodMixerService } from '@/modules/mood-mixer';
import { AdaptiveMusicPage } from '@/modules/adaptive-music';

// 3 APIs différentes
// 3 systèmes de types différents
// Code dupliqué et patterns incohérents
```

### Après (1 module unifié) ✅

```typescript
// 1 seul import
import { useMusicUnified } from '@/modules/music-unified';

// API unifiée avec toutes les capabilities
// Types cohérents et validés avec Zod
// Code DRY et maintenable
```

## 🚀 Installation

```typescript
import {
  useMusicUnified,           // Hook React
  musicUnifiedService,       // Service direct
  type MusicSession,         // Types
  type TherapeuticPlaylist,
  type EmotionComponent,
  type PomsState,
} from '@/modules/music-unified';
```

## 💡 Usage rapide

### Avec le Hook React (Recommandé)

```typescript
import { useMusicUnified } from '@/modules/music-unified';

function MusicTherapyPage() {
  const {
    createSession,
    generatePlaylist,
    currentSession,
    currentPlaylist,
    isLoading,
    error,
  } = useMusicUnified(userId);

  const handleStartTherapy = async () => {
    // 1. Créer une session
    const session = await createSession('therapeutic', {
      moodBefore: {
        primary: 'anxious',
        intensity: 0.7,
        energy: 0.4,
        valence: -0.5,
      },
    });

    // 2. Générer une playlist thérapeutique
    const playlist = await generatePlaylist({
      therapeutic_goal: {
        current_mood: {
          primary: 'anxious',
          intensity: 0.7,
          energy: 0.4,
          valence: -0.5,
        },
        target_mood: {
          primary: 'calm',
          intensity: 0.6,
          energy: 0.3,
          valence: 0.6,
        },
        emotional_state: 'anxious',
      },
      context: {
        time_of_day: 'evening',
        activity: 'meditation',
      },
    });

    // 3. Jouer la musique...
  };

  return <div>{/* UI */}</div>;
}
```

### Utilisation directe du service

```typescript
import { musicUnifiedService } from '@/modules/music-unified';

// Créer une session
const session = await musicUnifiedService.createSession(userId, 'therapeutic');

// Générer une playlist
const playlist = await musicUnifiedService.generateTherapeuticPlaylist(userId, config);

// Compléter la session
await musicUnifiedService.completeSession(session.id, {
  durationSeconds: 600,
  tracksPlayed: ['track1', 'track2'],
  therapeuticEffectiveness: 0.85,
  userSatisfaction: 8,
});
```

## 🎯 Les 3 Capabilities

Music Unified expose 3 "capabilities" spécialisées :

### 1. Therapeutic - Musicothérapie

Génération de playlists thérapeutiques personnalisées basées sur l'état émotionnel.

```typescript
const { generatePlaylist, getRecommendation } = useMusicUnified(userId);

// Générer une playlist
const playlist = await generatePlaylist({
  therapeutic_goal: {
    current_mood: {
      primary: 'sad',
      intensity: 0.6,
      energy: 0.3,
      valence: -0.4,
    },
    target_mood: {
      primary: 'peaceful',
      intensity: 0.7,
      energy: 0.4,
      valence: 0.5,
    },
    emotional_state: 'sad',
    intensity: 0.6,
  },
  preferences: {
    genres: ['ambient', 'classical'],
    tempo_range: { min: 60, max: 90 },
    duration_minutes: 20,
  },
  context: {
    time_of_day: 'evening',
    activity: 'meditation',
  },
});

// Ou obtenir une recommandation complète
const recommendation = await getRecommendation(
  currentMood,
  targetMood,
  'feeling stressed'
);

console.log(recommendation.reasoning);
// "Cette playlist est conçue pour élever votre humeur..."
console.log(recommendation.expected_benefits);
// ["Réduction du stress", "Amélioration de l'humeur", ...]
console.log(recommendation.optimal_timing);
// "Soirée ou avant le coucher"
```

**Fonctionnalités clés :**
- Génération IA via Edge Functions
- Analyse des patterns d'écoute
- Personnalisation basée sur l'historique
- Playlists avec propriétés thérapeutiques (BPM, mode, etc.)

### 2. Blending - Mélange émotionnel

Création de mélanges émotionnels avec transitions progressives (de mood-mixer).

```typescript
const { createMix, updateBlend, slidersToComponents } = useMusicUnified(userId);

// Créer un mix personnalisé
const mix = await createMix({
  currentEmotions: ['anxious', 'stressed'],
  targetEmotion: 'calm',
  intensity: 0.7,
  therapeuticGoal: 'stress_relief',
});

console.log(mix.name);
// "Transition vers calm"
console.log(mix.strategy);
// { algorithm: 'gradual', transition_time: 300, ... }

// Mettre à jour le blend en temps réel
updateBlend(elapsedSeconds); // Appeler régulièrement

// Ou utiliser les sliders émotionnels
const sliders = {
  energy: 30,
  calm: 70,
  focus: 50,
  light: 60,
};
const components = slidersToComponents(sliders);

// Générer un gradient CSS visuel
const gradient = musicUnifiedService.generateEmotionalGradient(components);
// "linear-gradient(135deg, #87CEEB 0%, #FFD700 100%)"
```

**Algorithmes de mélange disponibles :**
- `gradual` : Transition linéaire douce
- `instant` : Changement brusque à mi-parcours
- `oscillating` : Va-et-vient entre émotions
- `layered` : Superposition progressive

**Sliders émotionnels (0-100) :**
- `energy` : Niveau d'énergie
- `calm` : Niveau de calme
- `focus` : Niveau de concentration
- `light` : Niveau de lumière/positivité

### 3. Adaptive - Adaptation temps réel

Adaptation intelligente basée sur l'état physiologique POMS (de adaptive-music).

```typescript
const { analyzePoms, checkAdaptation, recordAdaptation } = useMusicUnified(userId);

// Analyser l'état POMS de l'utilisateur
const pomsState = {
  tension: 'vigilant',  // 'relaxed' | 'open' | 'vigilant'
  fatigue: 'heavy',     // 'resourced' | 'stable' | 'heavy'
  timestamp: new Date().toISOString(),
};

const analysis = analyzePoms(pomsState);
console.log(analysis.preset);
// "deep-rest"
console.log(analysis.reasoning);
// "Tension élevée : encore un peu de tension à relâcher. Fatigue présente : besoin de repos."

// Vérifier si une adaptation est nécessaire
const adaptationCheck = checkAdaptation('balanced', pomsState);
if (adaptationCheck.should) {
  console.log('Adaptation recommandée:', adaptationCheck.newPreset);
  console.log('Raison:', adaptationCheck.reason);

  // Enregistrer l'adaptation
  const adaptation = musicUnifiedService.createAdaptation(
    'balanced',
    adaptationCheck.newPreset!,
    pomsState,
    adaptationCheck.reason!
  );
  recordAdaptation(adaptation);
}

// Suggérer des ajustements musicaux
const adjustments = musicUnifiedService.suggestMusicAdjustments(pomsState);
console.log(adjustments);
// {
//   tempo_adjustment: -15,
//   volume_adjustment: -5,
//   complexity_adjustment: -0.2,
//   reasoning: "Tempo ralenti et musique simplifiée pour réduire la tension. ..."
// }

// Prédire l'évolution optimale
const evolution = musicUnifiedService.predictOptimalPomsEvolution(pomsState, 20);
// Retourne les étapes POMS tous les 5 minutes
```

**POMS (Profile of Mood States) :**
- **Tension** : 'relaxed' (épaules souples) → 'open' (tonus tranquille) → 'vigilant' (tension élevée)
- **Fatigue** : 'resourced' (énergie disponible) → 'stable' (confortable) → 'heavy' (besoin de repos)

## 📊 Sessions unifiées

Music Unified utilise un système de session qui supporte les 3 types d'usage :

```typescript
const { createSession, startSession, completeSession, recordEmotionalPoint } =
  useMusicUnified(userId);

// 1. Session thérapeutique
const therapeuticSession = await createSession('therapeutic', {
  moodBefore: { primary: 'anxious', intensity: 0.7, energy: 0.4, valence: -0.5 },
});

// 2. Session de mélange émotionnel
const blendingSession = await createSession('mood_blending', {
  initialEmotions: [
    { emotion: 'anxious', intensity: 0.7, color: '#FF6B6B', therapeutic_value: 0.6 },
    { emotion: 'stressed', intensity: 0.5, color: '#FF8C00', therapeutic_value: 0.5 },
  ],
  targetEmotion: 'calm',
});

// 3. Session adaptive
const adaptiveSession = await createSession('adaptive', {
  pomsBefore: { tension: 'vigilant', fatigue: 'heavy', timestamp: new Date().toISOString() },
});

// Démarrer la session
await startSession(therapeuticSession.id);

// Enregistrer des points émotionnels pendant la session
recordEmotionalPoint({
  mood: 5,
  energy: 6,
  track_id: 'track-123',
  user_interaction: 'like',
});

// Compléter la session
await completeSession({
  durationSeconds: 900,
  tracksPlayed: ['track1', 'track2', 'track3'],
  moodAfter: { primary: 'calm', intensity: 0.6, energy: 0.5, valence: 0.4 },
  therapeuticEffectiveness: 0.8,
  userSatisfaction: 8,
});
```

## 📈 Statistiques et Analytics

```typescript
const { getStatistics } = useMusicUnified(userId);

const stats = await getStatistics(
  new Date('2025-01-01'),
  new Date('2025-01-31')
);

console.log(stats);
// {
//   total_sessions: 42,
//   total_duration_seconds: 25200,  // 7 heures
//   average_duration_seconds: 600,
//   sessions_by_type: {
//     therapeutic: 20,
//     mood_blending: 15,
//     adaptive: 7
//   },
//   average_effectiveness: 0.82,
//   average_satisfaction: 7.8,
//   average_mood_improvement: 2.5,
//   listening_patterns: {
//     favorite_genres: ['ambient', 'classical'],
//     preferred_tempo_range: { min: 60, max: 100 },
//     mood_improvement_average: 2.5
//   }
// }
```

## 🎨 Presets utilisateur

```typescript
const { createPreset, getUserPresets } = useMusicUnified(userId);

// Créer un preset de sliders
const preset = await createPreset(
  'Méditation du soir',
  { energy: 20, calm: 90, focus: 40, light: 50 },
  playlistId
);

// Récupérer tous les presets
const presets = await getUserPresets();
```

## 🔄 Migration depuis les anciens modules

### De music-therapy vers music-unified

**Avant :**
```typescript
import { MusicTherapyService } from '@/modules/music-therapy';

const playlist = await MusicTherapyService.generatePlaylist(userId, 'calm', preferences);
const session = await MusicTherapyService.createSession(userId, playlistId, moodBefore);
await MusicTherapyService.completeSession(sessionId, duration, tracks, moodAfter);
```

**Après :**
```typescript
import { useMusicUnified } from '@/modules/music-unified';

const { generatePlaylist, createSession, completeSession } = useMusicUnified(userId);

const playlist = await generatePlaylist({
  therapeutic_goal: {
    current_mood: currentMood,
    target_mood: targetMood,
    emotional_state: 'calm',
  },
});

const session = await createSession('therapeutic', {
  playlistId: playlist.id,
  moodBefore: currentMood,
});

await completeSession({
  durationSeconds: duration,
  tracksPlayed: tracks,
  moodAfter: targetMood,
});
```

### De mood-mixer vers music-unified

**Avant :**
```typescript
import { MoodMixerService } from '@/modules/mood-mixer';

const session = await MoodMixerService.createSession(userId, moodBefore);
await MoodMixerService.addActivity(sessionId, 'meditation');
await MoodMixerService.completeSession(sessionId, duration, moodAfter, satisfaction);
```

**Après :**
```typescript
import { useMusicUnified } from '@/modules/music-unified';

const { createSession, createMix, completeSession } = useMusicUnified(userId);

const mix = await createMix({
  currentEmotions: ['anxious'],
  targetEmotion: 'calm',
});

const session = await createSession('mood_blending', {
  initialEmotions: mix.emotions,
  targetEmotion: 'calm',
});

await completeSession({
  durationSeconds: duration,
  tracksPlayed: [],
  finalBlend: currentBlend,
  userSatisfaction: satisfaction,
});
```

### De adaptive-music vers music-unified

**Avant :**
```typescript
// Code directement dans AdaptiveMusicPage.tsx
const [pomsState, setPomsState] = useState(...)
// Pas de service réutilisable
```

**Après :**
```typescript
import { useMusicUnified } from '@/modules/music-unified';

const {
  createSession,
  analyzePoms,
  checkAdaptation,
  recordAdaptation,
} = useMusicUnified(userId);

const session = await createSession('adaptive', {
  pomsBefore: pomsState,
});

const analysis = analyzePoms(pomsState);
const adaptCheck = checkAdaptation(currentPreset, pomsState);

if (adaptCheck.should) {
  const adaptation = musicUnifiedService.createAdaptation(
    currentPreset,
    adaptCheck.newPreset!,
    pomsState,
    adaptCheck.reason!
  );
  recordAdaptation(adaptation);
}
```

## 🏗️ Architecture

```
music-unified/
├── types.ts                         # Types Zod unifiés (500+ lignes)
├── musicUnifiedService.ts          # Service principal orchestrateur
├── useMusicUnified.ts              # Hook React
├── capabilities/
│   ├── therapeutic.ts              # Musicothérapie
│   ├── blending.ts                 # Mélange émotionnel
│   └── adaptive.ts                 # Adaptation temps réel
├── index.ts                         # Exports
└── README.md                        # Documentation (ce fichier)
```

## 🎓 Exemples complets

### Exemple 1: Session thérapeutique complète

```typescript
function TherapeuticSessionExample() {
  const userId = 'user-123';
  const {
    createSession,
    startSession,
    generatePlaylist,
    recordEmotionalPoint,
    completeSession,
  } = useMusicUnified(userId);

  const runTherapeuticSession = async () => {
    // 1. Définir l'objectif thérapeutique
    const currentMood = {
      primary: 'stressed',
      intensity: 0.8,
      energy: 0.7,
      valence: -0.6,
    };

    const targetMood = {
      primary: 'calm',
      intensity: 0.6,
      energy: 0.3,
      valence: 0.5,
    };

    // 2. Générer playlist
    const playlist = await generatePlaylist({
      therapeutic_goal: {
        current_mood: currentMood,
        target_mood: targetMood,
        emotional_state: 'stressed',
        intensity: 0.8,
      },
      preferences: {
        genres: ['ambient', 'nature sounds'],
        tempo_range: { min: 60, max: 80 },
        duration_minutes: 15,
      },
      context: {
        time_of_day: 'evening',
        activity: 'wind-down',
      },
    });

    // 3. Créer et démarrer session
    const session = await createSession('therapeutic', {
      playlistId: playlist.id,
      moodBefore: currentMood,
    });
    await startSession(session.id);

    // 4. Jouer la musique et enregistrer points émotionnels
    playlist.tracks.forEach((track, index) => {
      setTimeout(() => {
        recordEmotionalPoint({
          mood: 5 + index, // Amélioration progressive
          energy: 7 - index,
          track_id: track.id,
        });
      }, index * 5000);
    });

    // 5. Compléter la session après 15 minutes
    setTimeout(async () => {
      await completeSession({
        durationSeconds: 900,
        tracksPlayed: playlist.tracks.map((t) => t.id),
        moodAfter: targetMood,
        therapeuticEffectiveness: 0.85,
        userSatisfaction: 9,
      });
    }, 900000);
  };

  return <button onClick={runTherapeuticSession}>Start Therapy Session</button>;
}
```

### Exemple 2: Mélange émotionnel avec visualisation

```typescript
function EmotionalBlendingExample() {
  const userId = 'user-123';
  const {
    createMix,
    createSession,
    updateBlend,
    currentBlend,
  } = useMusicUnified(userId);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
      updateBlend(elapsedSeconds);
    }, 1000);

    return () => clearInterval(interval);
  }, [elapsedSeconds, updateBlend]);

  const startBlending = async () => {
    const mix = await createMix({
      currentEmotions: ['anxious', 'frustrated'],
      targetEmotion: 'peaceful',
      intensity: 0.7,
      therapeuticGoal: 'emotional_balance',
    });

    await createSession('mood_blending', {
      initialEmotions: mix.emotions,
      targetEmotion: 'peaceful',
      mixingStrategy: mix.strategy,
    });

    // Générer visualisation
    const gradient = musicUnifiedService.generateEmotionalGradient(mix.emotions);
    document.body.style.background = gradient;
  };

  return (
    <div>
      <button onClick={startBlending}>Start Blending</button>
      {currentBlend && (
        <div>
          <p>Dominant: {currentBlend.dominant_emotion}</p>
          <p>Intensity: {(currentBlend.intensity_level * 100).toFixed(0)}%</p>
          <p>Stability: {(currentBlend.stability_score * 100).toFixed(0)}%</p>
        </div>
      )}
    </div>
  );
}
```

### Exemple 3: Adaptation temps réel POMS

```typescript
function AdaptiveMusicExample() {
  const userId = 'user-123';
  const {
    createSession,
    analyzePoms,
    checkAdaptation,
    recordAdaptation,
  } = useMusicUnified(userId);
  const [currentPreset, setCurrentPreset] = useState('balanced');
  const [pomsState, setPomsState] = useState<PomsState>({
    tension: 'open',
    fatigue: 'stable',
    timestamp: new Date().toISOString(),
  });

  useEffect(() => {
    // Check adaptation toutes les 30 secondes
    const interval = setInterval(() => {
      const adaptCheck = checkAdaptation(currentPreset, pomsState);

      if (adaptCheck.should && adaptCheck.newPreset) {
        console.log('Adaptation nécessaire:', adaptCheck.reason);

        const adaptation = musicUnifiedService.createAdaptation(
          currentPreset,
          adaptCheck.newPreset,
          pomsState,
          adaptCheck.reason!
        );

        recordAdaptation(adaptation);
        setCurrentPreset(adaptCheck.newPreset);

        // Appliquer les ajustements
        const adjustments = musicUnifiedService.suggestMusicAdjustments(pomsState);
        applyMusicAdjustments(adjustments);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [currentPreset, pomsState, checkAdaptation, recordAdaptation]);

  const updatePoms = (tension: PomsState['tension'], fatigue: PomsState['fatigue']) => {
    setPomsState({
      tension,
      fatigue,
      timestamp: new Date().toISOString(),
    });
  };

  const analysis = analyzePoms(pomsState);

  return (
    <div>
      <p>Current preset: {currentPreset}</p>
      <p>Recommended: {analysis.preset}</p>
      <p>Reasoning: {analysis.reasoning}</p>

      <button onClick={() => updatePoms('vigilant', 'heavy')}>
        High Tension & Fatigue
      </button>
      <button onClick={() => updatePoms('relaxed', 'resourced')}>
        Relaxed & Energized
      </button>
    </div>
  );
}
```

## 🔍 Types complets

Tous les types sont validés avec Zod et exportés :

```typescript
import type {
  // Sessions
  MusicSession,
  MusicSessionType, // 'therapeutic' | 'mood_blending' | 'adaptive' | 'freestyle'

  // Moods
  MusicalMood,      // { primary, secondary?, intensity, energy, valence }

  // Playlists
  TherapeuticPlaylist,
  MusicTrack,
  TherapeuticProperties,

  // Blending
  EmotionComponent,
  MixingStrategy,   // { algorithm, transition_time, blending_ratio, therapeutic_focus }
  EmotionBlend,
  EmotionalSliders, // { energy, calm, focus, light }

  // Adaptive
  PomsState,        // { tension, fatigue, timestamp }
  PomsTrend,        // { tension_trend, fatigue_trend, note, completed }
  PlaybackAdaptation,

  // Analytics
  SessionStatistics,
  ListeningPatterns,

  // Presets
  MusicPreset,
} from '@/modules/music-unified';
```

## 📄 License

MIT License - EmotionsCare Platform

---

**Note:** Ce module consolide music-therapy, mood-mixer, et adaptive-music en une seule API unifiée. Les anciens modules restent disponibles pour compatibilité, mais tous les nouveaux développements devraient utiliser music-unified.
