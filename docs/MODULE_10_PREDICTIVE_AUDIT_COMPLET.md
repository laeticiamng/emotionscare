# 🔮 Module 10 - Audit Complet : Predictive & Personnalisation

**Date:** 2025-01-XX  
**Statut:** ✅ **AUDIT COMPLET - 100%**  
**Criticité:** 🟡 MOYENNE (IA non critique, mais impact UX élevé)

---

## 📋 Vue d'ensemble

### Description
Système de personnalisation prédictive utilisant l'IA pour :
- Prédire les états émotionnels futurs
- Générer des recommandations adaptatives
- Personnaliser l'expérience utilisateur
- Adapter contenu et interface selon prédictions

### Chemins principaux
- `/b2c/dashboard` - Prédictions B2C
- `/b2b/admin/dashboard` - Analytics prédictives admin
- Contexte global : `PredictiveAnalyticsContext`

---

## 1. ✅ Architecture & Code

### Contexte principal
**Fichier:** `src/contexts/PredictiveAnalyticsContext.tsx` (384 lignes)

```typescript
interface PredictiveAnalyticsContextType {
  isLoading: boolean;
  error: string | null;
  currentPredictions: Prediction | null;
  generatePrediction: () => Promise<void>;
  resetPredictions: () => void;
  isEnabled: boolean;
  setEnabled: (enabled: boolean) => void;
  predictionEnabled: boolean;
  setPredictionEnabled: (enabled: boolean) => void;
  availableFeatures: PredictiveFeature[];
  recommendations: PredictionRecommendation[];
  generatePredictions: () => Promise<void>;
}
```

**✅ Points forts:**
- Architecture React Context complète
- Types TypeScript stricts
- 5 features prédictives configurables
- Recommendations personnalisées par émotion
- Persistance localStorage pour opt-in/out

**⚠️ Limitations critiques:**

#### 1.1 Algorithme simulé (pas de vraie IA)

**Code actuel (lignes 154-202):**
```typescript
const generatePrediction = async () => {
  // ❌ Simulation basique
  const emotions = ['calm', 'focused', 'stressed', 'tired', 'energetic', 'creative'];
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  const randomConfidence = Math.random() * 0.5 + 0.5;
  
  const prediction: Prediction = {
    emotion: randomEmotion,
    confidence: parseFloat(randomConfidence.toFixed(2)),
    timestamp: new Date().toISOString(),
    source: 'pattern-analysis', // ❌ Faux, c'est du random
    context: 'user-activity'
  };
  
  setCurrentPredictions(prediction);
}
```

**❌ Problèmes:**
- **Aucun modèle ML réel** : valeurs aléatoires
- **Pas d'historique utilisé** : ignore données passées
- **Pas d'API IA** : OpenAI/HumeAI non appelées
- **Pas de features engineering** : aucune variable d'entrée

#### 1.2 Recommendations hardcodées

**Code (lignes 205-340):**
```typescript
const recommendationsByEmotion: Record<string, PredictionRecommendation[]> = {
  'calm': [
    {
      id: 'calm-1',
      title: 'Maintenir votre sérénité',
      description: 'Profitez de votre état de calme...',
      // ❌ Hardcodé
    }
  ],
  // ...
};
```

**❌ Problèmes:**
- Recommendations **statiques** (6 émotions × 2-3 recs)
- Pas d'adaptation selon historique utilisateur
- Pas de score de pertinence dynamique
- Pas de A/B testing

---

## 2. ⚠️ État actuel - Limitations

### 2.1 Pas d'API backend IA

**Actuel:**
```typescript
// ❌ Simulation locale
await new Promise(resolve => setTimeout(resolve, 1000)); // Fake delay
const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
```

**✅ Solution attendue - Modèle ML réel:**

```typescript
// src/services/ai/emotionPredictionService.ts
import OpenAI from 'openai';

interface EmotionPredictionInput {
  userId: string;
  recentScans: ScanData[];
  journalEntries: JournalEntry[];
  musicHistory: MusicGeneration[];
  timeOfDay: string;
  dayOfWeek: string;
}

export const predictEmotion = async (
  input: EmotionPredictionInput
): Promise<Prediction> => {
  // 1. Feature engineering
  const features = {
    avg_valence_7d: calculateAvgValence(input.recentScans),
    scan_frequency: input.recentScans.length / 7,
    journal_sentiment: analyzeSentiment(input.journalEntries),
    music_mood_avg: calculateMusicMood(input.musicHistory),
    time_factor: getTimeFactor(input.timeOfDay),
    day_factor: getDayFactor(input.dayOfWeek)
  };
  
  // 2. Appel OpenAI (ou modèle custom)
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  const prompt = `
    Given the following user emotional features, predict the most likely emotional state in the next 24 hours:
    
    - Average valence (7 days): ${features.avg_valence_7d}
    - Scan frequency: ${features.scan_frequency}
    - Journal sentiment: ${features.journal_sentiment}
    - Music mood average: ${features.music_mood_avg}
    - Time of day: ${input.timeOfDay}
    - Day of week: ${input.dayOfWeek}
    
    Return JSON: { "emotion": string, "confidence": number (0-1), "reasoning": string }
  `;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' }
  });
  
  const result = JSON.parse(response.choices[0].message.content);
  
  // 3. Log prediction pour A/B testing
  await supabase.from('prediction_logs').insert({
    user_id: input.userId,
    prediction: result.emotion,
    confidence: result.confidence,
    features: features,
    model_version: 'gpt-4o-v1',
    timestamp: new Date().toISOString()
  });
  
  return {
    emotion: result.emotion,
    confidence: result.confidence,
    timestamp: new Date().toISOString(),
    source: 'ml-model',
    context: result.reasoning
  };
};
```

### 2.2 Pas de persistance DB

**Problème:**
```typescript
// ❌ Prédictions non sauvegardées
setCurrentPredictions(prediction);
// Perdu au refresh page
```

**✅ Solution - Persistance Supabase:**

```sql
-- Table: public.prediction_logs
CREATE TABLE public.prediction_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  prediction TEXT NOT NULL, -- 'calm', 'stressed', etc.
  confidence NUMERIC(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  features JSONB, -- Features utilisées pour prédiction
  model_version TEXT NOT NULL, -- 'gpt-4o-v1', 'custom-ml-v2', etc.
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actual_emotion TEXT, -- Rempli après vérification (feedback loop)
  accuracy_score NUMERIC(3,2) -- Calculé si actual_emotion présent
);

CREATE INDEX idx_prediction_logs_user_ts ON prediction_logs(user_id, timestamp DESC);
CREATE INDEX idx_prediction_logs_model ON prediction_logs(model_version);

-- RLS
ALTER TABLE public.prediction_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own predictions"
ON public.prediction_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Service role inserts predictions"
ON public.prediction_logs FOR INSERT
WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- Table: public.recommendation_logs
CREATE TABLE public.recommendation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  prediction_id UUID REFERENCES prediction_logs(id),
  recommendation_id TEXT NOT NULL,
  recommendation_type TEXT NOT NULL, -- 'activity', 'content', 'insight'
  priority INTEGER NOT NULL,
  shown_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  clicked BOOLEAN DEFAULT FALSE,
  clicked_at TIMESTAMPTZ,
  dismissed BOOLEAN DEFAULT FALSE,
  dismissed_at TIMESTAMPTZ
);

CREATE INDEX idx_recommendation_logs_user ON recommendation_logs(user_id);

-- RLS
ALTER TABLE public.recommendation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own recommendation logs"
ON public.recommendation_logs FOR ALL
USING (auth.uid() = user_id);
```

### 2.3 Pas de tests E2E

**✅ Tests E2E à créer:**

```typescript
// e2e/predictive.spec.ts
import { expect, test } from '@playwright/test';

test.describe('Predictive Analytics', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/b2c/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.waitForURL('**/b2c/dashboard');
  });

  test('user can generate emotion prediction', async ({ page }) => {
    // 1. Navigate to predictive section
    await page.goto('/b2c/dashboard');
    
    // 2. Click "Generate Prediction" button
    await page.click('text=Générer une prédiction');
    
    // 3. Wait for prediction result
    await page.waitForSelector('[data-testid="prediction-result"]');
    
    // 4. Verify emotion is displayed
    const emotionText = await page.locator('[data-testid="predicted-emotion"]').innerText();
    expect(['calm', 'focused', 'stressed', 'tired', 'energetic', 'creative']).toContain(emotionText.toLowerCase());
    
    // 5. Verify confidence score
    const confidence = await page.locator('[data-testid="prediction-confidence"]').innerText();
    expect(parseFloat(confidence)).toBeGreaterThan(0);
    expect(parseFloat(confidence)).toBeLessThanOrEqual(1);
  });

  test('recommendations are displayed after prediction', async ({ page }) => {
    await page.goto('/b2c/dashboard');
    await page.click('text=Générer une prédiction');
    
    await page.waitForSelector('[data-testid="recommendations-list"]');
    
    const recsCount = await page.locator('[data-testid="recommendation-card"]').count();
    expect(recsCount).toBeGreaterThan(0);
    
    // Click first recommendation
    await page.locator('[data-testid="recommendation-card"]').first().click();
    
    // Should navigate to action URL
    await page.waitForURL(/\/(meditation|journal|music|coach-chat)/);
  });

  test('user can toggle predictive analytics', async ({ page }) => {
    await page.goto('/settings');
    
    const toggle = page.locator('[data-testid="predictive-analytics-toggle"]');
    await toggle.click();
    
    // Verify disabled state
    await page.goto('/b2c/dashboard');
    const predictionButton = page.locator('text=Générer une prédiction');
    await expect(predictionButton).toBeDisabled();
  });

  test('admin can view prediction analytics', async ({ page }) => {
    // Login as admin
    await page.goto('/b2b/login');
    await page.fill('[name="email"]', 'admin@example.com');
    await page.fill('[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    await page.goto('/b2b/admin/dashboard');
    
    // Navigate to predictive analytics section
    await page.click('text=Analytiques prédictives');
    
    // Verify charts/metrics are visible
    await expect(page.locator('[data-testid="prediction-accuracy-chart"]')).toBeVisible();
    await expect(page.locator('[data-testid="model-performance-metrics"]')).toBeVisible();
  });
});
```

---

## 3. 📊 Performance & Scalabilité

### 3.1 Pas de cache

**Problème:**
```typescript
// ❌ Chaque appel régénère une prédiction
const generatePrediction = async () => {
  // Pas de cache des prédictions récentes
}
```

**✅ Solution - Cache intelligent:**

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const usePrediction = (userId: string) => {
  const queryClient = useQueryClient();
  
  // Cache 1h pour prédictions
  const { data: prediction, isLoading } = useQuery({
    queryKey: ['prediction', userId],
    queryFn: () => fetchPrediction(userId),
    staleTime: 60 * 60 * 1000, // 1 heure
    cacheTime: 24 * 60 * 60 * 1000, // 24h en mémoire
  });
  
  const generateMutation = useMutation({
    mutationFn: () => generateNewPrediction(userId),
    onSuccess: (newPrediction) => {
      queryClient.setQueryData(['prediction', userId], newPrediction);
    }
  });
  
  return {
    prediction,
    isLoading,
    generate: generateMutation.mutate
  };
};
```

### 3.2 Pas de rate limiting

**Problème:**
```typescript
// ❌ Utilisateur peut spammer generatePrediction()
const generatePrediction = async () => {
  // Pas de limite
}
```

**✅ Solution - Throttling:**

```typescript
import { useCallback } from 'react';
import { debounce } from 'lodash';

const usePredictiveAnalytics = () => {
  // Limiter à 1 génération / 5 minutes
  const generatePrediction = useCallback(
    debounce(async () => {
      // ...
    }, 5 * 60 * 1000, { leading: true, trailing: false }),
    []
  );
  
  return { generatePrediction };
};
```

**Backend rate limit:**
```typescript
// supabase/functions/generate-prediction/index.ts
import { createClient } from '@supabase/supabase-js';

serve(async (req) => {
  const userId = req.headers.get('user-id');
  
  // Check rate limit (max 1 req / 5 min)
  const { data: recentPredictions } = await supabase
    .from('prediction_logs')
    .select('id')
    .eq('user_id', userId)
    .gte('timestamp', new Date(Date.now() - 5 * 60 * 1000).toISOString());
  
  if (recentPredictions && recentPredictions.length > 0) {
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded. Please wait 5 minutes.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  // Generate prediction...
});
```

---

## 4. 🧪 Tests & Qualité

### État actuel: ❌ INSUFFISANT

**Tests existants:**
- ❌ 0 test E2E pour module predictive
- ❌ 0 test unitaire pour PredictiveAnalyticsContext
- ❌ 0 test d'intégration API

### Tests à ajouter

#### 4.1 Tests unitaires du contexte

```typescript
// src/contexts/__tests__/PredictiveAnalyticsContext.test.tsx
import { renderHook, act, waitFor } from '@testing-library/react';
import { PredictiveAnalyticsProvider, usePredictiveAnalytics } from '../PredictiveAnalyticsContext';

describe('PredictiveAnalyticsContext', () => {
  it('generates prediction with valid data', async () => {
    const { result } = renderHook(() => usePredictiveAnalytics(), {
      wrapper: PredictiveAnalyticsProvider
    });
    
    await act(async () => {
      await result.current.generatePrediction();
    });
    
    expect(result.current.currentPredictions).not.toBeNull();
    expect(result.current.currentPredictions.emotion).toBeDefined();
    expect(result.current.currentPredictions.confidence).toBeGreaterThan(0);
  });
  
  it('generates recommendations after prediction', async () => {
    const { result } = renderHook(() => usePredictiveAnalytics(), {
      wrapper: PredictiveAnalyticsProvider
    });
    
    await act(async () => {
      await result.current.generatePrediction();
    });
    
    await waitFor(() => {
      expect(result.current.recommendations.length).toBeGreaterThan(0);
    });
  });
  
  it('respects opt-out preference', () => {
    const { result } = renderHook(() => usePredictiveAnalytics(), {
      wrapper: PredictiveAnalyticsProvider
    });
    
    act(() => {
      result.current.setEnabled(false);
    });
    
    expect(result.current.isEnabled).toBe(false);
    expect(localStorage.getItem('predictiveAnalyticsEnabled')).toBe('false');
  });
});
```

#### 4.2 Tests algorithme ML

```typescript
// src/services/ai/__tests__/emotionPredictionService.test.ts
describe('emotionPredictionService', () => {
  it('predicts calm emotion for positive scans', async () => {
    const input = {
      userId: 'test-user',
      recentScans: [
        { valence: 0.8, arousal: 0.3 },
        { valence: 0.9, arousal: 0.2 }
      ],
      journalEntries: [
        { sentiment: 'positive', content: 'Great day!' }
      ],
      musicHistory: [
        { mood: 'calm', genre: 'ambient' }
      ],
      timeOfDay: 'evening',
      dayOfWeek: 'sunday'
    };
    
    const prediction = await predictEmotion(input);
    
    expect(prediction.emotion).toBe('calm');
    expect(prediction.confidence).toBeGreaterThan(0.7);
  });
  
  it('predicts stressed emotion for negative patterns', async () => {
    const input = {
      userId: 'test-user',
      recentScans: [
        { valence: 0.3, arousal: 0.8 },
        { valence: 0.2, arousal: 0.9 }
      ],
      journalEntries: [
        { sentiment: 'negative', content: 'Overwhelmed' }
      ],
      musicHistory: [
        { mood: 'energetic', genre: 'rock' }
      ],
      timeOfDay: 'morning',
      dayOfWeek: 'monday'
    };
    
    const prediction = await predictEmotion(input);
    
    expect(prediction.emotion).toBe('stressed');
  });
});
```

---

## 5. 🔐 RGPD & Privacy

### État actuel: ⚠️ PARTIEL

**✅ Points positifs:**
- Opt-in/out via `isEnabled` (localStorage)
- Pas de partage données tiers actuellement

**❌ Manques:**

#### 5.1 Pas de log des prédictions

```typescript
// ❌ Aucune traçabilité
const prediction = generatePrediction();
// Prédiction non stockée → impossible de l'exporter/supprimer
```

**✅ Solution - Logging conforme RGPD:**

```typescript
// Edge function with RGPD compliance
const generatePrediction = async (userId: string) => {
  const prediction = await predictEmotion(input);
  
  // Log avec consentement
  await supabase.from('prediction_logs').insert({
    user_id: userId,
    prediction: prediction.emotion,
    confidence: prediction.confidence,
    // ✅ Métadonnées pour RGPD
    consent_version: '1.0',
    processing_purpose: 'personalization',
    retention_days: 365 // Suppression auto après 1 an
  });
  
  return prediction;
};
```

#### 5.2 Export de données

```typescript
// supabase/functions/export-predictions/index.ts
export const exportUserPredictions = async (userId: string) => {
  const { data: predictions } = await supabase
    .from('prediction_logs')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false });
  
  const { data: recommendations } = await supabase
    .from('recommendation_logs')
    .select('*')
    .eq('user_id', userId)
    .order('shown_at', { ascending: false });
  
  return {
    predictions,
    recommendations,
    exported_at: new Date().toISOString(),
    format_version: '1.0'
  };
};
```

#### 5.3 Suppression de données

```typescript
// DELETE /api/predictions
export const deleteUserPredictions = async (userId: string) => {
  // 1. Supprimer prédictions
  await supabase
    .from('prediction_logs')
    .delete()
    .eq('user_id', userId);
  
  // 2. Supprimer recommendations
  await supabase
    .from('recommendation_logs')
    .delete()
    .eq('user_id', userId);
  
  // 3. Réinitialiser localStorage
  localStorage.removeItem('predictiveAnalyticsEnabled');
  localStorage.removeItem('predictionEnabled');
  
  return { deleted: true, timestamp: new Date().toISOString() };
};
```

---

## 6. 📝 Checklist complète

### Architecture ✅ COMPLÉTÉ
- [x] Context PredictiveAnalyticsContext créé
- [x] Types TypeScript stricts
- [x] Hook usePredictiveAnalytics exporté
- [x] 5 features prédictives définies
- [x] Recommendations par émotion

### Algorithme ML ❌ CRITIQUE
- [ ] Remplacer random par modèle ML réel
- [ ] Feature engineering (valence, arousal, etc.)
- [ ] Intégration OpenAI/HumeAI
- [ ] Logging prédictions en DB
- [ ] Feedback loop (actual_emotion)

### Tests ❌ À FAIRE
- [ ] Tests unitaires contexte (5 tests)
- [ ] Tests algorithme ML (10 tests)
- [ ] Tests E2E (4 scenarios)
- [ ] Tests performance (latence < 2s)

### Performance ❌ À FAIRE
- [ ] Cache React Query (1h)
- [ ] Rate limiting (1 req / 5 min)
- [ ] Optimisation re-renders
- [ ] Lazy loading recommendations

### RGPD ❌ À FAIRE
- [ ] Logging avec consentement
- [ ] Endpoint export prédictions
- [ ] Endpoint suppression données
- [ ] Rétention automatique (12 mois)
- [ ] Documentation conformité

---

## 7. 🎯 Plan d'action (Priorité)

### Phase 1 - Algorithme ML critique (6-8h)
1. ✅ Créer service emotionPredictionService.ts
2. ✅ Feature engineering (valence, arousal, scan frequency)
3. ✅ Intégration OpenAI API
4. ✅ Tests unitaires algorithme

### Phase 2 - Persistance & RGPD (3-4h)
5. ✅ Créer tables prediction_logs + recommendation_logs
6. ✅ Migrer contexte vers Supabase
7. ✅ Endpoints export/suppression
8. ✅ Tests RGPD compliance

### Phase 3 - Tests & Performance (2-3h)
9. ✅ Tests E2E (4 scenarios)
10. ✅ Cache React Query
11. ✅ Rate limiting
12. ✅ Monitoring accuracy

---

## 8. 📊 Métriques finales

| Critère | Avant | Après (cible) | Statut |
|---------|-------|---------------|--------|
| Algorithme ML | Random | OpenAI GPT-4o | ❌ 0% |
| Persistance DB | ❌ | ✅ Supabase | ❌ 0% |
| Tests E2E | 0 | 4 | ❌ 0% |
| Tests unitaires | 0 | 15 | ❌ 0% |
| RGPD | Partiel | Complet | ❌ 30% |
| Performance | No cache | React Query + rate limit | ❌ 0% |
| Accuracy ML | N/A | > 70% | ❌ N/A |

**Statut global Module 10:** ⚠️ **30% opérationnel** (architecture OK, ML KO)

---

## ✅ Conclusion

### Points forts
- ✅ Architecture React solide et extensible
- ✅ Types TypeScript complets
- ✅ Opt-in/out fonctionnel
- ✅ Recommendations bien structurées

### Points critiques
- ❌ **Algorithme simulé** (pas de vraie IA)
- ❌ **Pas de persistance** (prédictions perdues)
- ❌ **Pas de tests** (E2E + unitaires manquants)
- ❌ **RGPD incomplet** (export/suppression manquants)

**Recommandation:** Module **non production-ready**. Nécessite 11-15h de développement pour implémenter ML réel, persistance DB et conformité RGPD.

**Priorité:** MOYENNE (module optionnel, mais impact UX élevé si activé).

---

**Document généré:** 2025-01-XX  
**Auteur:** Audit technique EmotionsCare  
**Prochaine révision:** Post-implémentation ML
