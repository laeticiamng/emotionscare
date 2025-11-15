# EmotionOrchestrator

Système d'orchestration intelligente des modules basé sur l'état émotionnel de l'utilisateur. Ce module connecte le scan émotionnel aux recommandations automatiques de modules, éliminant le gap d'intégration identifié dans l'audit (60% des modules non connectés).

## 📋 Vue d'ensemble

L'EmotionOrchestrator analyse l'état émotionnel de l'utilisateur (détecté via scan multimodal, Hume AI, etc.) et génère des recommandations intelligentes de modules à utiliser, avec configuration automatique et personnalisation basée sur le contexte.

### Fonctionnalités principales

- **Analyse émotionnelle multimodale** : Texte, voix, facial
- **Recommandations intelligentes** : Basées sur état émotionnel + contexte utilisateur
- **Configuration automatique** : Chaque module est configuré automatiquement
- **Apprentissage adaptatif** : Le système apprend des feedbacks utilisateur
- **Insights émotionnels** : Tendances, patterns, niveau de risque
- **Actions immédiates** : Suggestions d'actions rapides
- **Stratégies long terme** : Plans de bien-être personnalisés

## 🚀 Installation

```typescript
import {
  emotionOrchestrator,
  useEmotionOrchestrator,
  type EmotionalState,
  type UserContext
} from '@/modules/emotion-orchestrator';
```

## 💡 Usage

### Avec le Hook React

```typescript
import { useEmotionOrchestrator } from '@/modules/emotion-orchestrator';
import type { EmotionalState, UserContext } from '@/modules/emotion-orchestrator';

function EmotionScanPage() {
  const {
    getRecommendations,
    currentResponse,
    isLoading,
    error
  } = useEmotionOrchestrator();

  const handleScanComplete = async (scanResult: EmotionalState) => {
    const context: UserContext = {
      user_id: currentUser.id,
      time_of_day: 'morning',
      recent_activities: ['meditation', 'exercise'],
      preferences: {
        preferred_modules: ['breath', 'music-therapy'],
        difficulty_level: 'intermediate',
        session_duration_preference: 'medium'
      },
      current_goals: ['reduce stress', 'improve mood'],
    };

    const response = await getRecommendations(scanResult, context);

    if (response) {
      // Afficher les recommandations
      console.log('Recommandations:', response.recommendations);
      console.log('Actions immédiates:', response.immediate_actions);
      console.log('Insights:', response.insights);
    }
  };

  return (
    <div>
      {isLoading && <Spinner />}
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {currentResponse && (
        <RecommendationsList
          recommendations={currentResponse.recommendations}
        />
      )}
    </div>
  );
}
```

### Utilisation directe du service

```typescript
import { emotionOrchestrator } from '@/modules/emotion-orchestrator';

// Générer des recommandations
const response = await emotionOrchestrator.generateRecommendations(
  emotionalState,
  userContext
);

// Les recommandations sont triées par pertinence
const topRecommendation = response.recommendations[0];

console.log('Module recommandé:', topRecommendation.module);
console.log('Configuration:', topRecommendation.suggested_config);
console.log('Durée suggérée:', topRecommendation.suggested_duration, 'min');
console.log('Bénéfices attendus:', topRecommendation.expected_benefits);

// Soumettre du feedback
await emotionOrchestrator.submitFeedback({
  recommendation_id: topRecommendation.id,
  user_id: currentUser.id,
  was_followed: true,
  satisfaction_rating: 5,
  perceived_benefit: 'excellent',
  actual_duration: 12,
  timestamp: new Date().toISOString(),
});
```

## 🎯 Exemples d'usage

### Exemple 1: Utilisateur anxieux le soir

```typescript
const emotionalState: EmotionalState = {
  dominant: {
    emotion: 'anxious',
    intensity: 0.75,
    confidence: 0.88,
  },
  emotions: [
    { emotion: 'anxious', probability: 0.75, intensity: 0.75 },
    { emotion: 'stressed', probability: 0.15, intensity: 0.60 },
    { emotion: 'calm', probability: 0.10, intensity: 0.20 },
  ],
  sentiment: 'negative',
  intensityScore: 0.70,
  timestamp: new Date().toISOString(),
  source: 'voice',
};

const context: UserContext = {
  user_id: 'user-123',
  time_of_day: 'evening',
};

const response = await emotionOrchestrator.generateRecommendations(
  emotionalState,
  context
);

// Résultat attendu:
// 1. breath (pertinence: 0.92) - Respiration profonde pour anxiété
// 2. bubble-beat (pertinence: 0.87) - Exercice ludique de respiration
// 3. adaptive-music (pertinence: 0.81) - Musique apaisante
// 4. screen-silk (pertinence: 0.76) - Patterns visuels relaxants
```

### Exemple 2: Utilisateur heureux le matin

```typescript
const emotionalState: EmotionalState = {
  dominant: {
    emotion: 'happy',
    intensity: 0.82,
    confidence: 0.91,
  },
  emotions: [
    { emotion: 'happy', probability: 0.82, intensity: 0.82 },
    { emotion: 'excited', probability: 0.12, intensity: 0.70 },
    { emotion: 'calm', probability: 0.06, intensity: 0.50 },
  ],
  sentiment: 'positive',
  intensityScore: 0.76,
  timestamp: new Date().toISOString(),
  source: 'facial',
};

const context: UserContext = {
  user_id: 'user-123',
  time_of_day: 'morning',
  current_goals: ['achieve personal goals', 'stay motivated'],
};

const response = await emotionOrchestrator.generateRecommendations(
  emotionalState,
  context
);

// Résultat attendu:
// 1. ambition (pertinence: 0.89) - Mode arcade pour capitaliser sur l'énergie
// 2. community (pertinence: 0.84) - Partager la positivité
// 3. mood-mixer (pertinence: 0.79) - Playlist énergisante
// 4. ambition-arcade (pertinence: 0.76) - Défis gamifiés
```

### Exemple 3: Avec préférences utilisateur

```typescript
const context: UserContext = {
  user_id: 'user-123',
  time_of_day: 'afternoon',
  recent_modules_used: ['breath', 'bubble-beat'], // Éviter la répétition
  preferences: {
    preferred_modules: ['music-therapy', 'ai-coach'],
    avoided_modules: ['breathing-vr'], // N'aime pas la VR
    difficulty_level: 'advanced',
    session_duration_preference: 'long',
  },
  current_goals: ['reduce stress', 'improve focus'],
};

// Le système va:
// - Favoriser music-therapy et ai-coach (préférés)
// - Éviter breathing-vr (évité)
// - Réduire priorité de breath et bubble-beat (utilisés récemment)
// - Suggérer durée de 15-20 min (préférence long)
// - Adapter difficulté au niveau advanced
```

## 📊 Mapping Émotion → Modules

| Émotion | Modules recommandés |
|---------|---------------------|
| **Anxiété/Stress** | breath, bubble-beat, adaptive-music, screen-silk |
| **Tristesse** | music-therapy, mood-mixer, ai-coach, community |
| **Colère** | breath, bubble-beat, screen-silk, bounce-back |
| **Frustration** | breath-constellation, ai-coach, ambition, boss-grit |
| **Calme** | journal, mood-mixer, ar-filters, achievements |
| **Joie** | community, mood-mixer, ambition-arcade, achievements |
| **Excitation** | ambition, boss-grit, audio-studio, ar-filters |
| **Neutralité** | dashboard, ambition, activities, community |

## 🎨 Types de raisons

Chaque recommandation inclut une ou plusieurs raisons:

- **emotional_match** : Correspond à l'état émotionnel (poids: 35%)
- **therapeutic_benefit** : Bénéfice thérapeutique prouvé (poids: 25%)
- **user_preference** : Préférence utilisateur (poids: 20%)
- **contextual_fit** : Adapté au contexte (poids: 10%)
- **goal_alignment** : Aligné avec objectifs (poids: 5%)
- **pattern_based** : Basé sur patterns historiques (poids: 3%)
- **diversity** : Pour varier l'expérience (poids: 2%)

## 🧠 Catégories thérapeutiques

Les modules sont organisés en catégories thérapeutiques:

- **Gestion du stress** : breath, breath-constellation, breathing-vr, bubble-beat
- **Amélioration de l'humeur** : music-therapy, mood-mixer, adaptive-music, audio-studio
- **Support émotionnel** : ai-coach, coach, community, journal
- **Engagement** : ambition, ambition-arcade, boss-grit, bounce-back
- **Bien-être** : screen-silk, flash-glow, ar-filters, activities

## 📈 Insights générés

L'orchestrateur génère des insights sur l'état émotionnel:

```typescript
interface Insights {
  emotional_pattern?: string;  // "Tendance négative persistante"
  trend?: 'improving' | 'stable' | 'declining';
  risk_level?: 'low' | 'medium' | 'high';
  notes?: string[];  // ["Intensité émotionnelle élevée détectée"]
}
```

## 🔄 Feedback et apprentissage

Le système apprend des retours utilisateur:

```typescript
// Soumettre du feedback après utilisation
await emotionOrchestrator.submitFeedback({
  recommendation_id: 'rec-uuid',
  user_id: 'user-123',
  was_followed: true,
  satisfaction_rating: 4,
  perceived_benefit: 'significant',
  actual_duration: 12,
  comments: 'Très utile pour me calmer',
  timestamp: new Date().toISOString(),
});

// Obtenir les statistiques d'efficacité
const stats = await emotionOrchestrator.getStats(
  'user-123',
  'breath',
  new Date('2025-01-01'),
  new Date('2025-01-31')
);

console.log('Taux de suivi:', stats.follow_through_rate);
console.log('Satisfaction moyenne:', stats.average_satisfaction);
```

## 🎯 Configuration automatique des modules

Chaque recommandation inclut une configuration suggérée adaptée au module:

### Modules de respiration
```typescript
{
  breathing_pattern: 'deep' | 'balanced',
  pace: 'slow' | 'moderate',
  duration: 15, // minutes
}
```

### Modules de musique
```typescript
{
  mood: 'anxious',
  intensity: 0.75,
  target_mood: 'calm',
  duration: 10,
}
```

### Modules de coaching
```typescript
{
  focus_area: 'emotional_support' | 'motivation',
  session_type: 'guided',
  duration: 15,
}
```

### Modules visuels (screen-silk, flash-glow)
```typescript
{
  pattern_complexity: 'simple' | 'moderate' | 'complex',
  therapeutic_intensity: 0.7,
  duration: 10,
}
```

### Modules d'ambition
```typescript
{
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  mode: 'standard' | 'arcade',
  duration: 20,
}
```

## 🔧 Personnalisation avancée

### Durée suggérée basée sur l'intensité

| Intensité | Durée |
|-----------|-------|
| Faible (< 0.3) | 5 min |
| Moyenne (0.3-0.6) | 10 min |
| Élevée (0.6-0.8) | 15 min |
| Extrême (> 0.8) | 20 min |

### Contexte temporel

Le système adapte les recommandations selon l'heure:

- **Matin** : Modules énergisants (ambition, boss-grit, activities)
- **Après-midi** : Modules équilibrés (mixed)
- **Soir** : Modules relaxants (breath, breathing-vr, screen-silk)
- **Nuit** : Modules apaisants pour le sommeil

## 📝 Schéma de données

### EmotionalState
```typescript
{
  dominant: {
    emotion: string,
    intensity: number,      // 0-1
    confidence: number      // 0-1
  },
  emotions: Array<{
    emotion: string,
    probability: number,    // 0-1
    intensity: number       // 0-1
  }>,
  sentiment: 'positive' | 'negative' | 'neutral',
  intensityScore: number,   // 0-1
  timestamp: string,        // ISO datetime
  source?: 'text' | 'voice' | 'facial' | 'combined',
  metadata?: Record<string, unknown>
}
```

### ModuleRecommendation
```typescript
{
  id: string,               // UUID
  module: ModuleType,
  priority: number,         // 0 = highest
  relevance_score: number,  // 0-1
  reasons: Array<RecommendationReason>,
  suggested_duration: number, // minutes
  suggested_config: Record<string, unknown>,
  expected_benefits: string[],
  timestamp: string,
  metadata?: Record<string, unknown>
}
```

## 🚦 Intégration avec le reste de la plateforme

### Connexion avec le scan émotionnel

```typescript
// Dans le composant de scan
import { useEmotionAnalysis } from '@/hooks/emotion/useEmotionAnalysis';
import { useEmotionOrchestrator } from '@/modules/emotion-orchestrator';

function EmotionScanPage() {
  const { analyzeMultiModal } = useEmotionAnalysis();
  const { getRecommendations } = useEmotionOrchestrator();

  const handleScan = async (input: { text?: string; audio?: File }) => {
    // 1. Analyser l'émotion
    const scanResult = await analyzeMultiModal(input);

    // 2. Obtenir les recommandations
    if (scanResult.success && scanResult.data.emotions) {
      const emotionalState = {
        dominant: scanResult.data.emotions[0],
        emotions: scanResult.data.emotions,
        sentiment: scanResult.data.sentiment,
        intensityScore: scanResult.data.intensityScore,
        timestamp: new Date().toISOString(),
      };

      const recommendations = await getRecommendations(emotionalState, context);

      // 3. Naviguer vers le module recommandé
      if (recommendations) {
        const topModule = recommendations.recommendations[0];
        navigateToModule(topModule.module, topModule.suggested_config);
      }
    }
  };
}
```

### Connexion avec les modules

Chaque module peut accepter la configuration suggérée:

```typescript
// Module breath
function BreathPage({ config }: { config?: Record<string, unknown> }) {
  const pattern = config?.breathing_pattern || 'balanced';
  const pace = config?.pace || 'moderate';
  const duration = config?.duration || 10;

  // Utiliser la configuration
}
```

## 🎓 Best Practices

1. **Toujours fournir le contexte utilisateur** pour des recommandations personnalisées
2. **Collecter le feedback** après chaque session pour améliorer l'apprentissage
3. **Respecter les préférences utilisateur** (modules évités, durée préférée)
4. **Utiliser les insights** pour identifier les patterns émotionnels
5. **Implémenter les actions immédiates** en tant que micro-interactions
6. **Afficher les raisons** pour la transparence et l'engagement

## 📦 Structure des fichiers

```
emotion-orchestrator/
├── types.ts                      # Types et schémas Zod
├── emotionOrchestrator.ts       # Service principal
├── useEmotionOrchestrator.ts    # Hook React
├── index.ts                      # Exports
└── README.md                     # Documentation
```

## 🔮 Évolution future (v2)

- **Machine Learning** : Modèles prédictifs personnalisés
- **Intégration temps réel** : WebSocket pour recommandations continues
- **A/B Testing** : Tester différentes stratégies de recommandation
- **Analyse prédictive** : Anticiper les besoins émotionnels
- **Recommandations proactives** : Alertes avant détérioration émotionnelle
- **Intégration wearables** : Données biométriques (fréquence cardiaque, etc.)

## 📄 License

MIT License - EmotionsCare Platform
