
# Audit C-Suite Iteration 5 - Corrections effectives

Les 3 iterations precedentes de corrections n'ont PAS ete appliquees dans le code. Tous les problemes identifies restent presents. Ce plan consolide et execute toutes les corrections en une seule passe.

---

## Bilan : ce qui reste a corriger

### Lot 1 : Securite (CISO) - 3 fichiers
- `src/lib/config.ts` : `TEST_MODE` mutable, risque d'activation accidentelle
- `src/contexts/AuthContext.tsx` ligne 75 : `console.warn` duplique exposant l'email mock
- `src/contexts/music/MusicContext.tsx` ligne 96 : `console.error` au lieu de `logger.error`

### Lot 2 : Dependencies mortes (CTO) - package.json
16 packages backend/inutiles dans les dependencies frontend :
`express`, `fastify`, `@fastify/cors`, `@fastify/helmet`, `@fastify/rate-limit`, `pg`, `kysely`, `sharp`, `dotenv`, `node-fetch`, `jose`, `glob`, `globby`, `esbuild`, `tsx`, `cross-env`, `imagemin-avif`, `imagemin-webp`

Aucun de ces packages n'est importe dans `src/`. Ils peuvent etre supprimes sans casser le build.

### Lot 3 : @ts-nocheck sur 5 fichiers critiques
- `src/routerV2/routes.ts`
- `src/guards/RoleProtectedRoute.tsx`
- `src/utils/productionAudit.ts`
- `src/lib/env.ts` (+ nettoyage Firebase)
- `src/integrations/supabase/client.ts`

### Lot 4 : console.error/warn restants - 10 fichiers prioritaires

**Pages (1):**
- `src/pages/settings/DashboardSettingsPage.tsx` : 3x console.error

**Hooks (7):**
- `src/hooks/useBreathingHistory.ts` : 3x console.error
- `src/hooks/useGoals.ts` : 4x console.error
- `src/hooks/useSubscription.ts` : 3x console.error
- `src/hooks/useElevenLabs.ts` : 1x console.error
- `src/hooks/useHumeStream.ts` : 2x console.error
- `src/hooks/useVRGalaxyPersistence.ts` : 4x console.error
- `src/hooks/useScannerHistory.ts` : 3x console.error

**Composants (3):**
- `src/components/dashboard/widgets/NotificationsWidget.tsx` : 2x console.warn
- `src/components/dashboard/widgets/GoalsProgressWidget.tsx` : 2x console.error
- `src/components/dashboard/widgets/AIRecommendationsWidget.tsx` : 1x console.warn

### Lot 5 : catch(error: any) - 10 fichiers prioritaires restants
- `src/components/admin/RoleAuditLogsViewer.tsx`
- `src/components/admin/ReportManualTrigger.tsx`
- `src/services/emotionAnalysis.service.ts`
- `src/hooks/useCamera.ts`
- `src/components/meditation/GuidedMeditationEnhanced.tsx`
- `src/hooks/useInAppNotifications.ts`
- `src/hooks/useEmotionalMusicAI.ts`
- `src/components/gdpr/ReportValidation.tsx`
- `src/components/notifications/NotificationCenter.tsx`
- `src/components/music/AdaptiveMusicDashboard.tsx`

### Lot 6 : Nettoyage Firebase dans env.ts
Supprimer les 7 variables `VITE_FIREBASE_*` du schema rawEnv et envSchema, le bloc `FIREBASE_CONFIG`, et les references dans `ENV_VALIDATION`. Firebase n'est utilise que dans `push-notification-service.ts` qui a sa propre config locale.

---

## Section technique

**Lot 1 - config.ts** : Remplacer le `TEST_MODE` mutable par `Object.freeze({ BYPASS_AUTH: false, MOCK_USER: null } as const)`.

**Lot 1 - AuthContext.tsx** : Supprimer la ligne 75 (`console.warn(...)`) car le `logger.warn` ligne 74 la remplace deja.

**Lot 1 - MusicContext.tsx** : Remplacer `console.error('Audio error details:', {...})` par `logger.error('Audio error details', new Error(...), 'MUSIC')`.

**Lot 2 - package.json** : Retirer les 18 dependances listees. Aucune n'est importee dans `src/`.

**Lot 3** : Pour chaque fichier, retirer `// @ts-nocheck` et corriger les erreurs TS revelees. Pour `RoleProtectedRoute.tsx`, typer `allowedRoles` comme `UserRole[]`. Pour `client.ts`, ajouter le type `Database` au `createClient`. Pour `env.ts`, supprimer Firebase et retirer @ts-nocheck. Pour `productionAudit.ts`, retirer @ts-nocheck et typer correctement.

**Lot 4** : Pour chaque fichier, ajouter `import { logger } from '@/lib/logger'` si absent, puis remplacer `console.error(msg, err)` par `logger.error(msg, err instanceof Error ? err : new Error(String(err)), 'CONTEXT')` et `console.warn(msg)` par `logger.warn(msg, undefined, 'CONTEXT')`.

**Lot 5** : Pour chaque fichier, remplacer `catch (error: any)` par `catch (error: unknown)` et utiliser `error instanceof Error ? error.message : 'Erreur inconnue'`.
