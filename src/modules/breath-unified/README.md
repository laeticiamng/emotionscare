# Breath Unified

Service de respiration unifié qui consolide 4 modules en une API cohérente.

## 📋 Consolidation (4→1)

**Breath Unified** fusionne :
- **breath** : Protocoles respiratoires de base (4-7-8, cohérence, box)
- **bubble-beat** : Jeu ludique de respiration avec bulles
- **breath-constellation** : Visualisation artistique de type constellation
- **breathing-vr** : Expérience immersive VR/AR avec biofeedback

## 🚀 Usage rapide

```typescript
import { useBreathUnified } from '@/modules/breath-unified';

function BreathingPage() {
  const {
    createSession,
    startSession,
    generateProtocol,
    getRecommendation,
    completeSession,
  } = useBreathUnified(userId);

  const handleStart = async () => {
    // 1. Obtenir recommandation
    const recommendation = await getRecommendation(8, 3);  // stress 8→3

    // 2. Créer session
    const session = await createSession('basic', {
      protocolConfig: recommendation.protocol_config,
    });

    // 3. Générer protocole
    const steps = generateProtocol(recommendation.protocol_config);

    // 4. Démarrer
    await startSession(session.id);

    // 5. Compléter après exercice
    await completeSession({
      durationSeconds: 300,
      breathsCompleted: 20,
      completionRate: 1.0,
      stressLevelAfter: 3,
    });
  };

  return <button onClick={handleStart}>Commencer</button>;
}
```

## 🎯 Les 4 Types de sessions

### 1. Basic - Protocoles classiques

```typescript
const session = await createSession('basic', {
  protocolConfig: {
    protocol: '478',  // ou 'coherence', 'box', 'relax'
    duration_minutes: 10,
  },
});

const steps = generateProtocol({ protocol: '478', duration_minutes: 10 });
// [
//   { kind: 'in', duration_ms: 4000 },
//   { kind: 'hold', duration_ms: 7000 },
//   { kind: 'out', duration_ms: 8000 },
//   ...
// ]
```

**Protocoles disponibles :**
- `478` : Respiration 4-7-8 (inhale 4s, hold 7s, exhale 8s)
- `coherence` : Cohérence cardiaque (5s in, 5s out)
- `box` : Respiration en carré (4s chaque phase)
- `relax` : Relaxation (4s in, 6s out)

### 2. Gamified - Jeux de respiration

```typescript
const session = await createSession('gamified', {
  gameDifficulty: 'medium',  // 'easy' | 'medium' | 'hard' | 'expert'
  gameMood: 'calm',          // 'calm' | 'energetic' | 'focus' | 'relax'
});

// Compléter avec stats de jeu
await completeSession({
  durationSeconds: 180,
  breathsCompleted: 15,
  completionRate: 1.0,
  gameStats: {
    score: 850,
    items_completed: 42,  // bubbles popped
    accuracy: 0.92,
    combo_max: 12,
  },
});
```

### 3. Visual - Visualisations artistiques

```typescript
const session = await createSession('visual', {
  visualConfig: {
    style: 'constellation',  // 'constellation' | 'waves' | 'particles' | 'mandala' | 'aurora'
    color_scheme: 'cool',    // 'warm' | 'cool' | 'rainbow' | 'monochrome'
    intensity: 0.7,
    complexity: 0.5,
    animation_speed: 1.0,
  },
});
```

### 4. Immersive - VR/AR avec biofeedback

```typescript
const { recordBiofeedback } = useBreathUnified(userId);

const session = await createSession('immersive', {
  immersiveConfig: {
    environment: 'forest',  // 'forest' | 'beach' | 'mountain' | 'space' | 'underwater' | 'zen_garden'
    vr_enabled: true,
    audio_ambient: true,
    haptic_feedback: true,
    biofeedback_enabled: true,
  },
});

// Enregistrer données biométriques
recordBiofeedback({
  heart_rate: 72,
  hrv: 45,  // Heart Rate Variability (ms)
  respiration_rate: 12,  // breaths/min
  oxygen_saturation: 98,  // SpO2 %
  timestamp: new Date().toISOString(),
});
```

## 📊 Recommandations intelligentes

```typescript
const recommendation = await getRecommendation(
  8,  // Stress actuel (0-10)
  3,  // Stress cible (0-10)
  {
    timeOfDay: 'evening',
    availableMinutes: 15,
  }
);

console.log(recommendation);
// {
//   protocol: '478',
//   session_type: 'immersive',
//   duration_minutes: 15,
//   protocol_config: { protocol: '478', duration_minutes: 15 },
//   reasoning: "Le protocole 4-7-8 est recommandé pour gérer un stress élevé...",
//   expected_benefits: ["Réduction rapide de l'anxiété", "Amélioration du sommeil", ...],
//   optimal_timing: "Avant le coucher",
//   confidence_score: 0.85
// }
```

## 📈 Statistiques

```typescript
const { getStatistics } = useBreathUnified(userId);

const stats = await getStatistics(
  new Date('2025-01-01'),
  new Date('2025-01-31')
);

console.log(stats);
// {
//   total_sessions: 45,
//   total_duration_seconds: 13500,  // 3.75 heures
//   total_breaths: 900,
//   sessions_by_type: { basic: 20, gamified: 15, visual: 7, immersive: 3 },
//   average_completion_rate: 0.92,
//   average_consistency: 0.88,
//   average_stress_reduction: 3.5,  // Réduction moyenne de 3.5 points
//   ...
// }
```

## 🔄 Migration des anciens modules

### De breath vers breath-unified

**Avant :**
```typescript
import { breathProtocols, logBreathingSession } from '@/modules/breath';

const protocol = breathProtocols.makeProtocol('478', 10);
await logBreathingSession({ userId, protocol, duration: 600 });
```

**Après :**
```typescript
import { useBreathUnified } from '@/modules/breath-unified';

const { createSession, generateProtocol, completeSession } = useBreathUnified(userId);

const session = await createSession('basic', {
  protocolConfig: { protocol: '478', duration_minutes: 10 },
});
const steps = generateProtocol({ protocol: '478', duration_minutes: 10 });
await completeSession({ durationSeconds: 600, breathsCompleted: 30, completionRate: 1.0 });
```

### De bubble-beat vers breath-unified

**Avant :**
```typescript
import { createSession, completeSession } from '@/modules/bubble-beat/bubbleBeatService';

const session = await createSession({ difficulty: 'medium', mood: 'calm' });
await completeSession({ session_id: session.id, score: 850, bubbles_popped: 42, duration_seconds: 180 });
```

**Après :**
```typescript
import { useBreathUnified } from '@/modules/breath-unified';

const { createSession, completeSession } = useBreathUnified(userId);

const session = await createSession('gamified', {
  gameDifficulty: 'medium',
  gameMood: 'calm',
});

await completeSession({
  durationSeconds: 180,
  breathsCompleted: 15,
  completionRate: 1.0,
  gameStats: { score: 850, items_completed: 42, accuracy: 0.92, combo_max: 12 },
});
```

## 🏗️ Architecture

```
breath-unified/
├── types.ts                    # Types Zod unifiés (450+ lignes)
├── breathUnifiedService.ts     # Service principal (350+ lignes)
├── useBreathUnified.ts         # Hook React (220+ lignes)
├── index.ts                     # Exports
└── README.md                    # Documentation
```

## 📦 Types complets

```typescript
import type {
  // Sessions
  BreathSession,
  BreathSessionType,  // 'basic' | 'gamified' | 'visual' | 'immersive'

  // Protocols
  BreathProtocol,     // '478' | 'coherence' | 'box' | 'relax'
  BreathStep,         // { kind, duration_ms }
  ProtocolConfig,

  // Gamified
  GameDifficulty,     // 'easy' | 'medium' | 'hard' | 'expert'
  GameMood,           // 'calm' | 'energetic' | 'focus' | 'relax'
  GameStats,

  // Visual
  VisualStyle,        // 'constellation' | 'waves' | 'particles' | 'mandala' | 'aurora'
  VisualConfig,

  // Immersive
  ImmersiveEnvironment,  // 'forest' | 'beach' | 'mountain' | 'space' | 'underwater' | 'zen_garden'
  ImmersiveConfig,
  BiofeedbackData,

  // Analytics
  SessionStatistics,
  ProtocolRecommendation,

  // Gamification
  Achievement,
  Challenge,
} from '@/modules/breath-unified';
```

## 🎯 Bénéfices par protocole

| Protocole | Bénéfices principaux |
|-----------|---------------------|
| **4-7-8** | Réduction rapide de l'anxiété, Amélioration du sommeil, Activation parasympathique |
| **Cohérence** | Équilibre du système nerveux, Régulation émotionnelle, Amélioration HRV |
| **Box** | Concentration accrue, Réduction du stress, Équilibre mental |
| **Relax** | Détente profonde, Calme mental, Relaxation musculaire |

## 📄 License

MIT License - EmotionsCare Platform

---

**Note:** Ce module consolide breath, bubble-beat, breath-constellation, et breathing-vr en une seule API unifiée. Les anciens modules restent disponibles pour compatibilité.
