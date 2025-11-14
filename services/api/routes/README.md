# API Routes Documentation

Ce dossier contient les routes API modulaires pour la plateforme EmotionsCare.

## Structure

Chaque module expose un ensemble d'endpoints REST standardisés pour gérer une fonctionnalité spécifique de la plateforme.

### Modules Disponibles

#### 1. Assessments (`assessments.ts`)
Gestion des évaluations psychométriques (WHO-5, PHQ-9, etc.)

**Endpoints**:
- `POST /api/v1/assessments` - Créer une nouvelle évaluation
- `GET /api/v1/assessments` - Liste des évaluations (avec filtres)
- `GET /api/v1/assessments/:id` - Détails d'une évaluation
- `POST /api/v1/assessments/:id/submit` - Soumettre les réponses
- `GET /api/v1/assessments/active` - Évaluation en cours
- `GET /api/v1/assessments/instruments` - Instruments disponibles

#### 2. Emotion Scans (`scans.ts`)
Gestion des scans émotionnels multi-modaux

**Endpoints**:
- `POST /api/v1/scans` - Créer un nouveau scan émotionnel
- `GET /api/v1/scans` - Liste des scans (avec filtres date, type)
- `GET /api/v1/scans/:id` - Détails d'un scan
- `DELETE /api/v1/scans/:id` - Supprimer un scan
- `GET /api/v1/scans/stats` - Statistiques globales (période configurable)
- `GET /api/v1/scans/trends` - Tendances émotionnelles (30 derniers jours)

#### 3. AI Coach (`coach.ts`)
Gestion des sessions de coaching et conversations

**Endpoints**:
- `POST /api/v1/coach/sessions` - Créer une session de coaching
- `GET /api/v1/coach/sessions` - Liste des sessions
- `GET /api/v1/coach/sessions/:id` - Détails d'une session
- `PATCH /api/v1/coach/sessions/:id` - Mettre à jour une session
- `DELETE /api/v1/coach/sessions/:id` - Supprimer une session
- `POST /api/v1/coach/messages` - Envoyer un message
- `GET /api/v1/coach/sessions/:sessionId/messages` - Messages d'une session
- `GET /api/v1/coach/programs` - Programmes disponibles
- `GET /api/v1/coach/insights` - Insights générés

#### 4. Goals (`goals.ts`)
Gestion des objectifs personnels et bien-être

**Endpoints**:
- `POST /api/v1/goals` - Créer un nouvel objectif
- `GET /api/v1/goals` - Liste des objectifs
- `GET /api/v1/goals/:id` - Détails d'un objectif
- `PATCH /api/v1/goals/:id` - Mettre à jour un objectif
- `DELETE /api/v1/goals/:id` - Supprimer un objectif
- `POST /api/v1/goals/:id/complete` - Marquer comme terminé
- `POST /api/v1/goals/:id/progress` - Mettre à jour la progression
- `GET /api/v1/goals/active` - Objectifs actifs
- `GET /api/v1/goals/completed` - Objectifs terminés
- `GET /api/v1/goals/stats` - Statistiques des objectifs

## Authentification

Toutes les routes nécessitent une authentification via Supabase Auth. Le JWT doit être fourni dans l'en-tête `Authorization: Bearer <token>`.

## Format des Réponses

### Succès
```json
{
  "ok": true,
  "data": { ... }
}
```

### Erreur
```json
{
  "ok": false,
  "error": {
    "code": "error_code",
    "message": "Description de l'erreur",
    "details": { ... } // Optionnel
  }
}
```

## Codes d'Erreur

- `401` - Non autorisé (token manquant ou invalide)
- `404` - Ressource non trouvée
- `422` - Validation échouée (données invalides)
- `429` - Trop de requêtes (rate limiting)
- `500` - Erreur serveur interne

## Sécurité

- **RLS (Row Level Security)**: Toutes les requêtes utilisent RLS de Supabase pour garantir l'isolation des données
- **Validation**: Tous les inputs sont validés avec Zod
- **Rate Limiting**: Implémenté au niveau du serveur Fastify
- **CORS**: Configuration stricte des origines autorisées

## Exemples d'Usage

### Créer un scan émotionnel
```typescript
const response = await fetch('/api/v1/scans', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    emotions: { joy: 0.8, calm: 0.6, excited: 0.4 },
    dominant_emotion: 'joy',
    confidence_score: 0.85,
    scan_type: 'facial',
  })
});
```

### Récupérer les statistiques de scans
```typescript
const response = await fetch('/api/v1/scans/stats?period=weekly', {
  headers: {
    'Authorization': `Bearer ${token}`,
  }
});
```

### Créer un objectif
```typescript
const response = await fetch('/api/v1/goals', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Méditer 10 minutes par jour',
    description: 'Pratiquer la méditation quotidienne',
    category: 'mindfulness',
    target_date: '2025-12-31',
    target_value: 365,
    current_value: 0,
    unit: 'sessions',
  })
});
```

## Tests

Les tests pour chaque module sont disponibles dans `services/api/tests/`.

Pour exécuter les tests:
```bash
npm test
```

## Roadmap

### Phase 2 (À venir)
- API Music Sessions
- API VR Sessions
- API Community (posts, comments)

### Phase 3 (Futur)
- API Gamification (achievements, challenges)
- API Analytics (unified)
- GraphQL layer (optionnel)

## Contribution

Pour ajouter un nouveau module de routes:

1. Créer un fichier `routes/<module>.ts`
2. Implémenter les endpoints avec le pattern existant
3. Enregistrer les routes dans `server.ts`:
   ```typescript
   import { registerModuleRoutes } from './routes/module';
   // ...
   registerModuleRoutes(app);
   ```
4. Ajouter les tests dans `tests/<module>.test.ts`
5. Documenter dans ce README

## Support

Pour toute question ou problème, veuillez ouvrir une issue sur GitHub.
