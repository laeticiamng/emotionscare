# Monitoring & Observability

## Configuration Sentry

Le projet utilise le système Sentry centralisé dans `src/lib/obs/sentry.web.ts`.

### Initialisation

Sentry est automatiquement initialisé dans `src/main.tsx` :

```typescript
import { ensureSentryClient } from '@/lib/obs/sentry.web';

// Au démarrage de l'app
ensureSentryClient();
```

Le système gère automatiquement :
- ✅ Redaction des données sensibles
- ✅ Configuration des sample rates
- ✅ Breadcrumbs sécurisés
- ✅ Tags release et environment

### Variables d'environnement

Voir `.env.example` pour la configuration complète :

```bash
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
VITE_SENTRY_ENVIRONMENT=production
VITE_SENTRY_TRACES_SAMPLE_RATE=0.1
VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE=0.1
VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE=1.0
```

## Tracking des erreurs

### Erreurs avec contexte

```typescript
import { Sentry } from '@/lib/obs/sentry.web';

try {
  await analyzeFacialExpression(frame);
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      feature: 'scan',
      mode: 'camera',
      source: 'facial_analysis',
    },
    contexts: {
      scan: {
        hasConsent: true,
      },
    },
  });
}
```

### Événements avec analytics

Les événements scan utilisent déjà Sentry via `src/lib/analytics/scanEvents.ts` :

```typescript
import { scanAnalytics } from '@/lib/analytics/scanEvents';

// Automatiquement envoyé à Sentry avec contexte
scanAnalytics.cameraAnalysisStarted();
```

## Métriques clés

### Scan Module
- `scan.camera_analysis` - Durée analyse faciale
- `scan.submit_scan` - Durée soumission totale
- `scan.history_load` - Temps chargement historique

### Alertes recommandées
1. **Taux d'erreur > 5%** sur edge functions
2. **P95 latency > 3s** pour camera analysis
3. **Rate limit hits > 100/h** par utilisateur

## Dashboard Sentry

Créer des dashboards pour:
- Erreurs par mode (camera vs sliders)
- Taux de consentement
- Performance edge functions
- Erreurs réseau (API calls)

## Logs Supabase

Accessible via:
- [Edge Functions Logs](https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/functions)
- [Database Logs](https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/logs/postgres-logs)
- [Auth Logs](https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/logs/auth-logs)

## Filtres PII

Le système filtre automatiquement:
- Email utilisateurs
- IDs utilisateurs dans contexte scan
- Données faciales brutes

Configuré dans `sentry-config.ts` via `beforeSend`.
