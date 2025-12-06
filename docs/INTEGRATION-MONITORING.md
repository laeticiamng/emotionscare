# 🔍 Guide d'intégration Monitoring (Sentry)

## ✅ État actuel

Le monitoring Sentry est **déjà intégré** dans le projet via :
- `src/lib/obs/sentry.web.ts` - Configuration centralisée
- `src/lib/obs/redact.ts` - Redaction automatique PII
- `src/main.tsx` - Initialisation au démarrage

## 🚀 Configuration production

### 1. Variables d'environnement

Copier `.env.example` vers `.env` et configurer :

```bash
# Obligatoire pour Sentry
VITE_SENTRY_DSN=https://your-key@o123456.ingest.sentry.io/7890123

# Recommandé
VITE_SENTRY_ENVIRONMENT=production
VITE_SENTRY_TRACES_SAMPLE_RATE=0.1        # 10% des transactions
VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE=0.1  # 10% des sessions
VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE=1.0 # 100% des erreurs
```

### 2. Créer projet Sentry

1. Aller sur [sentry.io](https://sentry.io)
2. Créer un nouveau projet React
3. Copier le DSN dans `.env`
4. Activer Session Replay dans les settings

### 3. Déploiement

```bash
# Build production avec sourcemaps
npm run build

# Upload sourcemaps (optionnel)
npm run sentry:upload-sourcemaps
```

## 📊 Utilisation dans le code

### Analytics scan (déjà intégré)

```typescript
import { scanAnalytics } from '@/lib/analytics/scanEvents';

// Toutes ces fonctions envoient automatiquement à Sentry
scanAnalytics.scanSubmitted('camera', valence, arousal, true);
scanAnalytics.cameraPermissionDenied();
scanAnalytics.feedbackShown('toast', 3000);
```

Les événements sont envoyés avec :
- Level: `info`
- Category: `analytics`
- Tags: `event_category: scan`, `event_name: X`
- Extra: properties de l'événement

### Erreurs personnalisées

```typescript
import { Sentry } from '@/lib/obs/sentry.web';

// Capturer exception
try {
  await dangerousOperation();
} catch (error) {
  Sentry.captureException(error, {
    tags: { module: 'scan', action: 'camera_init' },
    contexts: { 
      device: { 
        hasCamera: true,
        permissions: 'granted' 
      } 
    },
  });
}

// Message personnalisé
Sentry.captureMessage('Edge function rate limited', {
  level: 'warning',
  tags: { function: 'mood-camera' },
});
```

### Breadcrumbs manuels

```typescript
import { Sentry } from '@/lib/obs/sentry.web';

Sentry.addBreadcrumb({
  category: 'scan',
  message: 'User started camera analysis',
  level: 'info',
  data: {
    mode: 'camera',
    timestamp: Date.now(),
  },
});
```

## 🔒 Sécurité et PII

Le système `redact.ts` filtre automatiquement :
- Emails
- Tokens (Bearer, JWT)
- IDs utilisateurs dans certains contextes
- Mots de passe
- Données sensibles courantes

**Configuration dans `beforeSend` et `beforeBreadcrumb`** :
```typescript
// Déjà configuré dans sentry.web.ts
beforeSend(event) {
  return redact(event);
}
```

## 📈 Dashboards recommandés

### 1. Scan Module Health

**Métriques** :
- Taux de soumission scan (succès/échec)
- Latence edge functions (`mood-camera`, `assess-submit`)
- Erreurs caméra (permission denied, device unavailable)

**Requête exemple** :
```
event.tags.event_category:scan AND event.level:error
```

### 2. Performance

**Métriques** :
- P50/P95/P99 durée soumission
- Taux d'erreur edge functions
- Session replay des erreurs

**Alertes** :
- P95 > 3s sur soumission → Warning
- Taux erreur > 5% → Critical
- Permission denied > 20% sessions → Warning

## 🧪 Tests avec Sentry

Les tests utilisent des mocks automatiques :

```typescript
// Déjà configuré dans vitest.config.ts
vi.mock('@sentry/react', () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  addBreadcrumb: vi.fn(),
}));
```

## 🔗 Liens utiles

- [Documentation Sentry React](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Session Replay](https://docs.sentry.io/platforms/javascript/session-replay/)
- [Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Release Tracking](https://docs.sentry.io/product/releases/)

## ✅ Checklist production

- [ ] VITE_SENTRY_DSN configuré
- [ ] Environment tags corrects
- [ ] Session Replay activé (10% sessions)
- [ ] Alertes configurées (> 5% erreurs)
- [ ] Dashboard scan créé
- [ ] Releases configurées (git tags)
- [ ] Sourcemaps uploadées (optionnel)
- [ ] Test en staging validé
