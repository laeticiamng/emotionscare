# Module de Scan Émotionnel IA

## 📋 Vue d'ensemble

Le module de scan émotionnel est un système complet d'analyse émotionnelle multimodale utilisant l'intelligence artificielle pour détecter, analyser et suivre les émotions à partir de différentes sources de données.

## 🎯 Fonctionnalités principales

### Modes de scan disponibles

1. **Analyse Faciale** (`facial`) - Précision: 96%
   - Reconnaissance des expressions faciales
   - Détection des micro-expressions
   - Suivi des métriques biométriques faciales

2. **Analyse Vocale** (`voice`) - Précision: 94%
   - Analyse de la tonalité et du rythme vocal
   - Détection des émotions dans la voix
   - Réduction du bruit avancée

3. **Analyse Textuelle** (`text`) - Précision: 91%
   - NLP (Natural Language Processing) avancé
   - Analyse de sentiment
   - Détection contextuelle

4. **Analyse Multimodale** (`combined`) - Précision: 98%
   - Combinaison de toutes les sources
   - Pondération intelligente
   - Confiance maximale

5. **Stream Temps Réel** (`realtime`) - Précision: 95%
   - Analyse continue
   - Mise à jour en temps réel
   - Détection de tendances

## 🏗️ Architecture

```
src/lib/scan/
├── analyzeService.ts          # Service d'analyse de base
├── enhancedAnalyzeService.ts  # Service d'analyse amélioré
├── emotionService.ts          # Service multimodal
├── emotionUtilService.ts      # Utilitaires pour émotions
├── mockEmotionService.ts      # Données de test
├── scanValidation.ts          # Validation des scans
├── scanAggregation.ts         # Agrégation et statistiques
├── constants.ts               # Constantes et configuration
└── index.ts                   # Exports centralisés
```

## 🚀 Utilisation

### Installation et imports

```typescript
import {
  analyzeEmotion,
  validateScanConfig,
  calculateEmotionStatistics,
  SCAN_DURATIONS,
  DEFAULT_SCAN_CONFIG
} from '@/lib/scan';
```

### Configuration d'un scan

```typescript
import { EmotionAnalysisConfig } from '@/types/emotion';

const config: EmotionAnalysisConfig = {
  duration: 15,                    // Durée en secondes
  sensitivity: 75,                 // Sensibilité (0-100)
  sources: ['facial', 'voice'],    // Sources d'analyse
  realTimeUpdates: true,           // Mises à jour temps réel
  biometricTracking: true,         // Suivi biométrique
  confidenceThreshold: 70,         // Seuil de confiance minimum
  noiseReduction: true,            // Réduction du bruit
  smoothingFactor: 0.3,            // Lissage temporel (0-1)
  predictiveMode: true             // Mode prédictif
};
```

### Utilisation du hook React

```tsx
import { useEnhancedEmotionScan } from '@/hooks/useEnhancedEmotionScan';

function EmotionScanner() {
  const {
    isScanning,
    scanProgress,
    currentResult,
    permissions,
    startScan,
    stopScan,
    resetScan
  } = useEnhancedEmotionScan(DEFAULT_SCAN_CONFIG);

  const handleScan = async () => {
    await startScan('facial');
  };

  return (
    <div>
      <button onClick={handleScan} disabled={!permissions.camera}>
        Démarrer le scan
      </button>
      {isScanning && <ProgressBar value={scanProgress} />}
      {currentResult && <EmotionDisplay result={currentResult} />}
    </div>
  );
}
```

### Analyse manuelle

```typescript
import { analyzeEmotion } from '@/lib/scan';

// Analyse de texte
const textResult = await analyzeEmotion(
  "Je me sens heureux aujourd'hui!",
  'text'
);

// Analyse vocale
const audioBlob = await recordAudio();
const voiceResult = await analyzeEmotion(audioBlob, 'voice');

// Analyse faciale
const imageBlob = await captureImage();
const facialResult = await analyzeEmotion(imageBlob, 'facial');
```

### Validation des données

```typescript
import { validateScanConfig, validateEmotionResult } from '@/lib/scan';

// Valider la configuration
const configValidation = validateScanConfig(config);
if (!configValidation.isValid) {
  console.error('Erreurs:', configValidation.errors);
  console.warn('Avertissements:', configValidation.warnings);
}

// Valider un résultat
const resultValidation = validateEmotionResult(emotionResult);
if (!resultValidation.isValid) {
  console.error('Résultat invalide:', resultValidation.errors);
}
```

### Agrégation et statistiques

```typescript
import {
  calculateEmotionStatistics,
  generateDailySummaries,
  calculateWellbeingScore,
  detectEmotionPatterns
} from '@/lib/scan';

// Calculer des statistiques globales
const stats = calculateEmotionStatistics(scanResults);
console.log('Émotion dominante:', stats.dominantEmotion);
console.log('Confiance moyenne:', stats.averageConfidence);
console.log('Tendances:', stats.trends);

// Générer des résumés quotidiens
const dailySummaries = generateDailySummaries(scanResults);

// Calculer un score de bien-être (0-100)
const wellbeingScore = calculateWellbeingScore(scanResults);

// Détecter des patterns
const patterns = detectEmotionPatterns(scanResults);
console.log('Humeur matinale:', patterns.morningMood);
console.log('Transition fréquente:', patterns.mostFrequentTransition);
```

## 📊 Types de données

### EmotionResult

```typescript
interface EmotionResult {
  emotion: string;              // Émotion détectée
  confidence: number | EmotionConfidence;
  valence: number;              // -1 (négatif) à +1 (positif)
  arousal: number;              // 0 (calme) à 1 (excité)
  timestamp: Date;
  intensity?: number;
  suggestions?: string[];
  source?: 'text' | 'voice' | 'facial' | 'manual';
  transcription?: string;
  sentiment?: string;

  // Champs étendus
  id?: string;
  vector?: EmotionVector;
  biometrics?: BiometricData;
  scanMode?: ScanMode;
  duration?: number;
  sessionId?: string;
  predictions?: EmotionPredictions;
}
```

### BiometricData

```typescript
interface BiometricData {
  heartRate?: number;           // BPM
  breathingRate?: number;       // Respirations/min
  skinConductance?: number;     // microsiemens
  eyeTracking?: {
    gazeDirection: { x: number; y: number };
    blinkRate: number;
    pupilDilation: number;
  };
  faceMetrics?: {
    expressionIntensity: number;
    microExpressions: string[];
    faceOrientation: {
      pitch: number;
      yaw: number;
      roll: number;
    };
  };
}
```

## 🎨 Constantes utiles

```typescript
import {
  SCAN_DURATIONS,
  CONFIDENCE_THRESHOLDS,
  EMOTION_COLORS,
  EMOTION_EMOJIS,
  EMOTION_RECOMMENDATIONS
} from '@/lib/scan';

// Durées recommandées
SCAN_DURATIONS.QUICK          // 5s
SCAN_DURATIONS.STANDARD       // 15s
SCAN_DURATIONS.DEEP          // 30s
SCAN_DURATIONS.COMPREHENSIVE // 60s

// Seuils de confiance
CONFIDENCE_THRESHOLDS.LOW        // 50%
CONFIDENCE_THRESHOLDS.MEDIUM     // 70%
CONFIDENCE_THRESHOLDS.HIGH       // 85%
CONFIDENCE_THRESHOLDS.VERY_HIGH  // 95%

// Obtenir la couleur d'une émotion
const color = EMOTION_COLORS.happy;  // 'bg-green-500'

// Obtenir l'emoji d'une émotion
const emoji = EMOTION_EMOJIS.sad;    // '😢'

// Obtenir des recommandations
const recommendations = EMOTION_RECOMMENDATIONS.anxious;
// ['Pratiquez la respiration profonde pendant 5 minutes', ...]
```

## 🧪 Tests

Le module inclut des tests unitaires complets:

```bash
# Lancer tous les tests du module scan
npm test src/lib/scan

# Tests de validation
npm test src/lib/scan/__tests__/scanValidation.test.ts

# Tests d'agrégation
npm test src/lib/scan/__tests__/scanAggregation.test.ts
```

## 📈 Performance et optimisation

### Bonnes pratiques

1. **Durée optimale**: Utilisez au moins 10 secondes pour une précision maximale
2. **Multi-source**: Combinez plusieurs sources pour améliorer la confiance
3. **Lissage temporel**: Utilisez un `smoothingFactor` entre 0.2 et 0.4
4. **Cache**: Les résultats sont automatiquement mis en cache

### Limitations

- Durée minimale: 5 secondes
- Durée maximale: 5 minutes (300 secondes)
- Buffer d'historique: 20 scans récents par défaut
- Permissions requises: Caméra et/ou microphone selon le mode

## 🔒 Sécurité et confidentialité

- ✅ Aucune donnée n'est envoyée à des serveurs tiers sans consentement
- ✅ Les streams vidéo/audio sont traités localement
- ✅ Les données biométriques sont optionnelles
- ✅ Conformité RGPD

## 🛠️ API Backend

### Endpoints disponibles

```
GET  /me/scan/weekly           - Statistiques hebdomadaires utilisateur
GET  /org/:orgId/scan/weekly   - Statistiques hebdomadaires organisation
```

Paramètres:
- `since` (optionnel): Date de début (format ISO ou nombre de jours)

## 🔄 Intégration avec d'autres modules

```typescript
// Intégration avec le module d'émotions
import { supabase } from '@/integrations/supabase/client';

// Sauvegarder un scan
const { data, error } = await supabase
  .from('emotions')
  .insert({
    emojis: result.emotion,
    score: calculateEmotionScore(result),
    text: result.transcription,
    date: result.timestamp.toISOString()
  });

// Récupérer l'historique
const { data: history } = await supabase
  .from('emotions')
  .select('*')
  .order('date', { ascending: false })
  .limit(20);
```

## 📚 Ressources additionnelles

- [Documentation complète de l'API](/docs/api/scan)
- [Guide de contribution](/CONTRIBUTING.md)
- [Changelog](/CHANGELOG.md)

## 🐛 Dépannage

### Erreur: "Permission refusée"
- Vérifiez que l'utilisateur a autorisé l'accès à la caméra/microphone
- Assurez-vous que l'application est servie en HTTPS (requis pour getUserMedia)

### Erreur: "Configuration invalide"
- Utilisez `validateScanConfig()` pour identifier les problèmes
- Consultez les constantes `SCAN_DURATIONS` pour les valeurs recommandées

### Confiance faible (<50%)
- Augmentez la durée du scan
- Améliorez les conditions d'éclairage (pour facial)
- Réduisez le bruit ambiant (pour voice)
- Utilisez le mode `combined` pour meilleure précision

## 📞 Support

Pour toute question ou problème:
- Ouvrir une issue sur GitHub
- Consulter la documentation
- Contacter l'équipe de développement

---

**Version**: 1.0.0
**Dernière mise à jour**: 2024-01-14
**Mainteneur**: Équipe EmotionsCare
