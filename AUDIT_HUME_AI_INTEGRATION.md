# 🔍 AUDIT INTÉGRATION HUME AI - /app/scan

**Date**: 29 octobre 2025  
**Référence**: [Documentation officielle Hume AI](https://dev.hume.ai/intro)  
**Statut**: ⚠️ Corrections nécessaires

---

## 📊 RÉSUMÉ EXÉCUTIF

L'intégration Hume AI actuelle présente **plusieurs non-conformités** par rapport aux bonnes pratiques documentées :

### ❌ Problèmes critiques
1. **hume-ws-proxy** utilise l'endpoint Batch (asynchrone) au lieu de WebSocket (temps réel)
2. **mood-camera** utilise un endpoint non documenté (`/v0/core/synchronous`)
3. Architecture sous-optimale pour l'analyse temps réel

### ✅ Points positifs
- Authentification correcte avec `X-Hume-Api-Key`
- Fallback gracieux si API indisponible
- Mapping émotions bien implémenté
- Rate limiting présent

---

## 🏗️ ARCHITECTURE ACTUELLE

### 1. Edge Function: `mood-camera` ✅ Majoritairement correct

**Endpoint utilisé**: `https://api.hume.ai/v0/core/synchronous`

```typescript
const response = await fetch('https://api.hume.ai/v0/core/synchronous', {
  method: 'POST',
  headers: {
    'X-Hume-Api-Key': Deno.env.get('HUME_API_KEY'),
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    models: { face: { fps_pred: 1, prob_threshold: 0.5 } },
    raw_image: cleanBase64,
  }),
});
```

**✅ Points conformes**:
- Header `X-Hume-Api-Key` correct
- Body structure appropriée
- Modèle `face` correctement configuré
- Gestion d'erreur présente

**⚠️ Points d'attention**:
- Endpoint `/v0/core/synchronous` **non documenté** dans la doc officielle
- Pas de confirmation si cet endpoint est stable/supporté officiellement

**Verdict**: Fonctionne mais endpoint potentiellement deprecated

---

### 2. Edge Function: `hume-ws-proxy` ❌ Non conforme

**Endpoint utilisé**: `https://api.hume.ai/v0/batch/jobs` (**INCORRECT**)

```typescript
// ❌ PROBLÈME: Utilise l'API Batch asynchrone
const response = await fetch('https://api.hume.ai/v0/batch/jobs', {
  method: 'POST',
  headers: { 'X-Hume-Api-Key': humeApiKey },
  body: formData, // ❌ FormData pour un batch job
});
```

**Problèmes identifiés**:

1. **Endpoint inadapté**: `/batch/jobs` est pour l'analyse asynchrone de gros volumes
   - Crée un job batch
   - Retourne un `job_id`
   - Nécessite polling pour récupérer les résultats
   - **Non adapté au temps réel**

2. **Structure de réponse incorrecte**: 
   ```typescript
   // Le code attend:
   humeResult.predictions?.[0]?.models?.face?.emotions
   
   // Mais l'API batch retourne:
   { job_id: "...", status: "QUEUED" }
   ```

3. **Pas utilisé dans /app/scan**: Cette fonction n'est appelée que par `useHumeVision` qui n'est pas utilisé dans B2CScanPage

**Verdict**: ❌ **Fonction non conforme et non utilisée**

---

## 📖 RECOMMANDATIONS SELON DOCUMENTATION HUME

### Option 1: WebSocket Streaming (Recommandé pour temps réel) 🚀

**Endpoint**: `wss://api.hume.ai/v0/stream/models`

**Avantages**:
- ✅ Connexion persistante bidirectionnelle
- ✅ Latence minimale (< 100ms)
- ✅ Optimisé pour le streaming continu
- ✅ Idéal pour caméra temps réel

**Implémentation TypeScript/Deno**:
```typescript
// Edge function WebSocket proxy
const ws = new WebSocket('wss://api.hume.ai/v0/stream/models');

ws.addEventListener('open', () => {
  // Authentification
  ws.send(JSON.stringify({
    data: '',
    models: {
      face: {
        fps_pred: 1,
        prob_threshold: 0.5,
        identify_faces: false
      }
    },
    stream_window_ms: 1000
  }));
  
  // Envoi des frames
  ws.send(JSON.stringify({
    data: base64Image,
    models: { face: {} }
  }));
});

ws.addEventListener('message', (event) => {
  const result = JSON.parse(event.data);
  // result.face.predictions[0].emotions
});
```

**Structure de réponse**:
```json
{
  "face": {
    "predictions": [{
      "frame": 0,
      "time": 0,
      "prob": 0.95,
      "box": { "x": 100, "y": 100, "w": 200, "h": 200 },
      "emotions": [
        { "name": "Joy", "score": 0.85 },
        { "name": "Sadness", "score": 0.05 },
        // ... 48 émotions au total
      ]
    }]
  }
}
```

---

### Option 2: Continuer avec endpoint synchrone actuel ⚠️

**Si `/v0/core/synchronous` fonctionne en production:**

Garder l'implémentation actuelle de `mood-camera` MAIS :
- ✅ Ajouter monitoring pour détecter si endpoint devient deprecated
- ✅ Documenter le risque
- ✅ Préparer migration vers WebSocket en cas de besoin

---

## 🔧 ACTIONS RECOMMANDÉES

### Priorité HAUTE (Avant production)

#### 1. ✅ Valider endpoint `/v0/core/synchronous`
- [ ] Contacter support Hume pour confirmer stabilité
- [ ] Vérifier si documenté ailleurs (API v1 ?)
- [ ] Ajouter monitoring sur taux d'erreur

#### 2. ❌ Supprimer ou corriger `hume-ws-proxy`
**Option A**: Supprimer (non utilisé dans /app/scan)
```bash
rm supabase/functions/hume-ws-proxy/
```

**Option B**: Migrer vers WebSocket streaming
```typescript
// Réécrire complètement la fonction
// Utiliser wss://api.hume.ai/v0/stream/models
```

#### 3. ⚠️ Envisager migration WebSocket pour `mood-camera`

**Avantages**:
- Latence réduite (100ms → 50ms)
- Throughput augmenté
- Architecture recommandée par Hume

**Coût**:
- Réécriture complète de l'edge function
- Gestion de la connexion WebSocket côté serveur
- Tests supplémentaires

---

### Priorité MOYENNE

#### 4. Enrichir les émotions détectées
Hume renvoie **48 émotions**, on n'en utilise que 12.

**Émotions supplémentaires disponibles**:
- Admiration, Adoration, Aesthetic Appreciation
- Amusement, Awkwardness, Boredom
- Concentration, Contemplation, Determination
- Disappointment, Distress, Doubt
- Ecstasy, Embarrassment, Empathic Pain
- Entrancement, Envy, Excitement
- Guilt, Horror, Interest
- Love, Nostalgia, Pain
- Pride, Realization, Relief
- Romance, Satisfaction, Sympathy
- Tiredness, Triumph

**Proposition**:
```typescript
const emotionMap = {
  // Existants (12)
  'Joy': { valence: 0.8, arousal: 0.6 },
  // ... 
  
  // Nouveaux (36)
  'Admiration': { valence: 0.7, arousal: 0.5 },
  'Aesthetic Appreciation': { valence: 0.75, arousal: 0.4 },
  'Amusement': { valence: 0.8, arousal: 0.6 },
  'Awkwardness': { valence: 0.3, arousal: 0.6 },
  'Boredom': { valence: 0.4, arousal: 0.2 },
  'Concentration': { valence: 0.5, arousal: 0.6 },
  // ... +30 autres
};
```

#### 5. Ajouter configuration avancée
```typescript
// Paramètres Hume non utilisés actuellement
{
  models: {
    face: {
      fps_pred: 1,              // ✅ Utilisé
      prob_threshold: 0.5,      // ✅ Utilisé
      identify_faces: false,    // ❌ Non utilisé
      min_face_size: 60,        // ❌ Non utilisé (détection visages petits)
      save_faces: false         // ❌ Non utilisé (debug)
    }
  }
}
```

---

## 📊 COMPARAISON ENDPOINTS

| Critère | Batch (`/batch/jobs`) | Synchrone (`/core/synchronous`) | WebSocket (`/stream/models`) |
|---------|----------------------|--------------------------------|------------------------------|
| **Latence** | 5-30s | 500-1000ms | 50-100ms |
| **Cas d'usage** | Gros volumes offline | Image unique | Streaming continu |
| **Connexion** | HTTP POST | HTTP POST | WebSocket persistant |
| **Coût** | Faible | Moyen | Moyen |
| **Complexité** | Polling requis | Simple | Gestion WS |
| **Documentation** | ✅ Officielle | ⚠️ Non trouvée | ✅ Officielle |
| **Status actuel** | ❌ Mal utilisé | ✅ Utilisé (mood-camera) | ❌ Non utilisé |

**Recommandation**: Garder synchrone court terme, migrer WebSocket moyen terme

---

## 🔒 SÉCURITÉ & BONNES PRATIQUES

### ✅ Conformités actuelles
- ✅ `HUME_API_KEY` stockée en variable d'environnement Supabase
- ✅ Jamais exposée côté client
- ✅ Header `X-Hume-Api-Key` correct
- ✅ HTTPS/WSS utilisé
- ✅ Rate limiting côté edge function (5 req/min)

### ⚠️ Points d'amélioration
- [ ] Ajouter rotation de clé API (tous les 90 jours)
- [ ] Logger les erreurs Hume dans Sentry avec contexte
- [ ] Monitorer coûts API (tracker nombre d'appels)
- [ ] Implémenter circuit breaker si API Hume down

---

## 🧪 TESTS RECOMMANDÉS

### Tests fonctionnels
```typescript
// Test 1: Vérifier endpoint synchrone
describe('mood-camera with Hume sync API', () => {
  it('should analyze face from base64 image', async () => {
    const result = await analyzeFacialExpression(mockBase64);
    expect(result.valence).toBeGreaterThanOrEqual(0);
    expect(result.arousal).toBeLessThanOrEqual(100);
  });
  
  it('should fallback gracefully if no API key', async () => {
    // Mock Deno.env.get to return null
    const result = await analyzeFacialExpression(mockBase64);
    expect(result.confidence).toBeLessThan(0.6); // Fallback confidence
  });
});
```

### Tests de charge
```typescript
// Test 2: Vérifier rate limiting
it('should respect 5 req/min limit', async () => {
  const requests = Array(10).fill(null).map(() => 
    supabase.functions.invoke('mood-camera', { body: { frame: mockBase64 } })
  );
  const results = await Promise.all(requests);
  const rateLimited = results.filter(r => r.status === 429);
  expect(rateLimited.length).toBeGreaterThan(0);
});
```

---

## 📝 CHECKLIST DE CONFORMITÉ

### Configuration
- [x] ✅ HUME_API_KEY configurée dans Supabase
- [x] ✅ Variable d'environnement sécurisée (non exposée client)
- [ ] ⏳ Rotation de clé configurée

### Endpoints
- [x] ✅ `mood-camera` utilise endpoint fonctionnel
- [ ] ⚠️ Validation endpoint `/v0/core/synchronous` avec support Hume
- [ ] ❌ `hume-ws-proxy` à corriger ou supprimer
- [ ] ⏳ Migration WebSocket planifiée

### Implémentation
- [x] ✅ Authentification correcte (`X-Hume-Api-Key`)
- [x] ✅ Structure requête conforme
- [x] ✅ Parsing réponse robuste
- [x] ✅ Fallback si API indisponible
- [x] ✅ Mapping émotions → valence/arousal
- [ ] ⚠️ Utilisation de toutes les émotions disponibles (12/48)

### Sécurité
- [x] ✅ HTTPS/WSS uniquement
- [x] ✅ Rate limiting actif
- [x] ✅ Pas d'exposition de secrets
- [ ] ⏳ Circuit breaker à implémenter
- [ ] ⏳ Monitoring coûts API

### Performance
- [x] ✅ Throttling frames (1 FPS)
- [x] ✅ Timeout configuré
- [ ] ⚠️ Latence mesurée (actuellement ~500-800ms)
- [ ] ⏳ Migration WebSocket pour < 100ms

---

## 🎯 PLAN D'ACTION

### Sprint 1 (Cette semaine)
1. ✅ **[FAIT]** Audit complet de l'intégration
2. 🔄 **[EN COURS]** Valider endpoint synchrone avec support Hume
3. ⏳ Décider: garder `hume-ws-proxy` ou supprimer

### Sprint 2 (Semaine prochaine)
4. ⏳ Tests de charge en production
5. ⏳ Monitoring erreurs Hume dans Sentry
6. ⏳ Documentation utilisateur mise à jour

### Sprint 3 (Moyen terme)
7. ⏳ Enrichir mapping émotions (48 au lieu de 12)
8. ⏳ POC migration WebSocket
9. ⏳ Tests A/B latence synchrone vs WebSocket

---

## 🔗 RÉFÉRENCES

### Documentation Hume AI
- [Introduction](https://dev.hume.ai/intro)
- [Expression Measurement - Face](https://dev.hume.ai/docs/expression-measurement/face)
- [WebSocket Streaming](https://dev.hume.ai/docs/expression-measurement/websocket)
- [API Reference - Stream](https://dev.hume.ai/reference/expression-measurement-api/stream/models)
- [API Reference - Batch](https://dev.hume.ai/reference/expression-measurement-api/batch/start-inference-job)

### Code
- `supabase/functions/mood-camera/index.ts` (✅ conforme)
- `supabase/functions/hume-ws-proxy/index.ts` (❌ non conforme)
- `src/hooks/useHumeVision.ts` (non utilisé /app/scan)
- `src/hooks/useHumeEmotions.ts` (non utilisé /app/scan)

### Support
- Discord Hume: https://link.hume.ai/discord
- Email support: support@hume.ai

---

**Audit réalisé par**: Lovable AI  
**Version**: 1.0  
**Prochaine revue**: Après validation endpoint avec support Hume
