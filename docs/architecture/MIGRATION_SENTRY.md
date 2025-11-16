# Migration Sentry → AI Monitoring

## État de la migration

✅ **Imports remplacés**: 31 fichiers (modules, pages, lib)
✅ **Edge functions email**: 3 fonctions Resend créées  
✅ **Services frontend**: logger et monitoring migrés
🔄 **En cours**: Remplacements des appels Sentry.*

## Fichiers migrés

### Core (✅ Complet)
- src/lib/logger.ts
- src/lib/monitoring.ts
- src/lib/ai-monitoring.ts (nouveau)
- src/lib/errors/sentry.ts
- src/lib/obs/sentry.web.ts
- src/lib/sentry-config.ts
- src/lib/webVitals.ts

### Components (✅ Complet)
- src/components/error/RootErrorBoundary.tsx
- src/components/ui/CriticalErrorBoundary.tsx
- src/contexts/ErrorBoundary.tsx

### Features (✅ Imports)
- src/features/assess/useAssessment.ts
- src/features/b2b/reports/ExportButton.tsx
- src/features/clinical-optin/ConsentProvider.tsx
- src/features/coach/engine/coachLLM.ts
- src/features/community/EmpathicRepliesPanel.tsx
- src/features/flash-glow/hooks/useFlashGlowSession.ts
- src/features/mood-mixer/hooks/useMoodMixerSession.ts
- src/features/mood/useMoodPublisher.ts
- src/features/music/useMusicEngine.ts
- src/features/nyvee/* (4 fichiers)
- src/features/orchestration/* (4 fichiers)
- src/features/scores/ExportButton.tsx
- src/features/session/persistSession.ts
- src/features/social-cocon/* (3 fichiers)
- src/features/vr/useVRTier.ts

### Modules (✅ Imports)
- src/modules/ai-coach/aiCoachService.ts
- src/modules/ambition-arcade/ambitionArcadeService.ts
- src/modules/bounce-back/bounceBackService.ts
- src/modules/breath-constellation/BreathConstellationPage.tsx
- src/modules/breath/logging.ts
- src/modules/bubble-beat/bubbleBeatService.ts
- src/modules/coach/CoachView.tsx
- src/modules/flash-glow/useFlashGlowMachine.ts
- src/modules/meditation/meditationService.ts
- src/modules/mood-mixer/MoodMixerView.tsx
- src/modules/nyvee/nyveeService.ts
- src/modules/screen-silk/* (2 fichiers)
- src/modules/story-synth/storySynthService.ts
- src/modules/vr-nebula/vrNebulaService.ts

### Pages (✅ Imports)
- src/pages/B2BReportDetailPage.tsx
- src/pages/B2BReportsPage.tsx
- src/pages/B2CAICoachPage.tsx
- src/pages/B2CCommunautePage.tsx
- src/pages/B2CScanPage.tsx
- src/pages/B2CSocialCoconPage.tsx
- src/pages/B2CVRGalaxyPage.tsx
- src/pages/VoiceScanPage.tsx
- src/pages/b2b/reports/index.tsx
- src/pages/breath/index.tsx
- src/pages/flash-glow/index.tsx

## Actions restantes

### 🔄 Remplacements de code
115+ occurrences de `Sentry.addBreadcrumb()` à remplacer par `logger.*()` 
50+ occurrences de `Sentry.captureException()` à remplacer par `captureException()`
30+ occurrences de `Sentry.withScope()` à simplifier

### Script automatisé
Exécuter: `node scripts/migrate-sentry-to-ai-monitoring.js`

Ce script remplace automatiquement:
- ✅ `Sentry.addBreadcrumb()` → `logger.*()`
- ✅ `Sentry.captureException()` → `captureException()`
- ✅ `Sentry.captureMessage()` → `aiMonitoring.captureMessage()`
- ✅ `Sentry.setContext()` → `aiMonitoring.setContext()`
- ✅ `Sentry.setTag()` → `aiMonitoring.setTags()`
- ✅ `Sentry.withScope()` → commentaires
- ✅ Ajoute les imports manquants

## Avantages du nouveau système

### Intelligence OpenAI
- ✅ Analyse automatique des erreurs
- ✅ Suggestions de fix intelligentes
- ✅ Catégorisation automatique
- ✅ Détection des erreurs connues
- ✅ Prioritisation basée sur l'impact

### Performance
- ✅ Queue asynchrone avec batch processing
- ✅ Envoi différé pour erreurs non-critiques
- ✅ Envoi immédiat pour erreurs critiques
- ✅ Pas de blocage du thread principal

### Sécurité
- ✅ Scrubbing PII automatique (logger intégré)
- ✅ Redaction des tokens/secrets
- ✅ Pas de données sensibles dans les logs
- ✅ RGPD compliant

### Coût
- ✅ Pas de licence Sentry à payer
- ✅ Utilisation d'OpenAI uniquement sur erreurs
- ✅ Queue limite à 10 événements max
- ✅ Analyse intelligente vs volume brut

## Tests de migration

```bash
# 1. Vérifier les imports
npm run typecheck

# 2. Tester en dev
npm run dev

# 3. Déclencher des erreurs test
# - Générer erreur critique
# - Vérifier logs console
# - Vérifier edge function ai-monitoring

# 4. Vérifier la queue
# - Plusieurs erreurs successives
# - Queue respecte maxQueueSize = 10
```

## Rollback

Si besoin de revenir en arrière:
```bash
git revert <commit-sha>
npm install @sentry/react@latest
```

## Documentation

- [AI Monitoring Edge Function](../supabase/functions/ai-monitoring/index.ts)
- [Frontend Service](../src/lib/ai-monitoring.ts)
- [Logger avec PII scrubbing](../src/lib/logger.ts)
