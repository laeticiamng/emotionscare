# Monitoring & Observability

## Configuration Sentry

### Initialisation

Dans `src/main.tsx` ou point d'entrée de l'app:

```typescript
import { initSentry, setSentryUser } from '@/lib/monitoring/sentry-config';

// Au démarrage de l'app
initSentry();

// Après authentification
setSentryUser(user.id, 'consumer');

// À la déconnexion
clearSentryUser();
```

### Variables d'environnement

Ajouter dans `.env`:

```bash
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
VITE_APP_VERSION=1.0.0
```

## Tracking des erreurs

### Erreurs scan spécifiques

```typescript
import { trackScanError } from '@/lib/monitoring/sentry-config';

try {
  await analyzeFacialExpression(frame);
} catch (error) {
  trackScanError(error, {
    mode: 'camera',
    source: 'facial_analysis',
    hasConsent: true,
  });
}
```

### Performance tracking

```typescript
import { trackScanPerformance } from '@/lib/monitoring/sentry-config';

const start = Date.now();
await submitScanData(data);
const duration = Date.now() - start;

trackScanPerformance('submit_scan', duration, {
  mode: 'sliders',
  hasConsent: true,
});
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
