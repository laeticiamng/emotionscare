

# Audit C-Suite Iteration 6 - Execution definitive

Toutes les tentatives precedentes (5 iterations) ont echoue a modifier le code. Les problemes sont identiques. Ce plan re-execute les memes corrections.

---

## Lot 1 : Securite - 3 fichiers

**src/lib/config.ts (lignes 7-13)** : Remplacer le bloc `TEST_MODE` mutable par :
```typescript
export const TEST_MODE = Object.freeze({
  BYPASS_AUTH: false,
  MOCK_USER: null,
} as const);
```

**src/contexts/AuthContext.tsx (ligne 75)** : Supprimer la ligne `console.warn(...)` car `logger.warn` ligne 74 la remplace deja.

**src/contexts/music/MusicContext.tsx (lignes 96-102)** : Remplacer le bloc `console.error('Audio error details:', {...})` par :
```typescript
logger.error('Audio error details', new Error(`Code ${errorCode}, src: ${audioElement.src}, networkState: ${audioElement.networkState}, readyState: ${audioElement.readyState}`), 'MUSIC');
```

---

## Lot 2 : Dependencies mortes - package.json

Supprimer 18 packages non utilises dans src/ :
`express`, `fastify`, `@fastify/cors`, `@fastify/helmet`, `@fastify/rate-limit`, `pg`, `kysely`, `sharp`, `dotenv`, `node-fetch`, `jose`, `glob`, `globby`, `esbuild`, `tsx`, `cross-env`, `imagemin-avif`, `imagemin-webp`

---

## Lot 3 : Retirer @ts-nocheck - 7 fichiers

| Fichier | Action supplementaire |
|---|---|
| `src/routerV2/routes.ts` | Retirer ligne 1 |
| `src/guards/RoleProtectedRoute.tsx` | Retirer ligne 1 |
| `src/utils/productionAudit.ts` | Retirer lignes 1-2 |
| `src/lib/env.ts` | Retirer ligne 1, supprimer Firebase (Lot 6) |
| `src/integrations/supabase/client.ts` | Retirer ligne 1, ajouter `Database` type |
| `src/hooks/useEmotionalMusicAI.ts` | Retirer ligne 1 |
| `src/lib/supabase-client.ts` | Retirer ligne 1 |

Pour `client.ts`, le code devient :
```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { SUPABASE_URL, SUPABASE_ANON_KEY, IS_DEV } from '@/lib/env';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
```

---

## Lot 4 : console.error/warn vers logger - 10 fichiers

Pour chaque fichier, ajouter `import { logger } from '@/lib/logger'` si absent, puis remplacer chaque appel.

| Fichier | Occurrences | Type |
|---|---|---|
| `src/pages/settings/DashboardSettingsPage.tsx` | 3 | console.error |
| `src/hooks/useBreathingHistory.ts` | 3 | console.error |
| `src/hooks/useGoals.ts` | 4 | console.error |
| `src/hooks/useSubscription.ts` | 3 | console.error |
| `src/hooks/useElevenLabs.ts` | 1 | console.error |
| `src/hooks/useHumeStream.ts` | 2 | console.error |
| `src/hooks/useVRGalaxyPersistence.ts` | 4 | console.error |
| `src/hooks/useScannerHistory.ts` | 3 | console.error |
| `src/components/dashboard/widgets/NotificationsWidget.tsx` | 2 | console.warn |
| `src/components/dashboard/widgets/GoalsProgressWidget.tsx` | 2 | console.error |
| `src/components/dashboard/widgets/AIRecommendationsWidget.tsx` | 1 | console.warn |

Pattern de remplacement :
- `console.error('msg', err)` devient `logger.error('msg', err instanceof Error ? err : new Error(String(err)), 'CONTEXT')`
- `console.warn('msg')` devient `logger.warn('msg', undefined, 'CONTEXT')`

---

## Lot 5 : catch(error: any) vers catch(error: unknown) - 10 fichiers

| Fichier | Occurrences |
|---|---|
| `src/components/admin/RoleAuditLogsViewer.tsx` | 1 (+ retirer @ts-nocheck) |
| `src/components/admin/ReportManualTrigger.tsx` | 2 |
| `src/services/emotionAnalysis.service.ts` | 4 (+ retirer @ts-nocheck) |
| `src/hooks/useCamera.ts` | 1 (+ retirer @ts-nocheck) |
| `src/components/meditation/GuidedMeditationEnhanced.tsx` | 1 |
| `src/hooks/useInAppNotifications.ts` | 1 |
| `src/hooks/useEmotionalMusicAI.ts` | 3 |
| `src/components/gdpr/ReportValidation.tsx` | 1 |
| `src/components/notifications/NotificationCenter.tsx` | 1 (+ retirer @ts-nocheck) |
| `src/components/music/AdaptiveMusicDashboard.tsx` | 1 |

Pattern : `catch (error: any)` devient `catch (error: unknown)`, avec `error instanceof Error ? error.message : 'Erreur inconnue'` pour acceder au message.

---

## Lot 6 : Nettoyage Firebase dans env.ts

Supprimer de `rawEnv` les 7 variables `VITE_FIREBASE_*` (lignes 42-49), supprimer les champs correspondants dans `envSchema`, supprimer le bloc `FIREBASE_CONFIG`, et retirer les references Firebase dans `ENV_VALIDATION`. Recrire le fichier complet sans `@ts-nocheck`.

---

## Section technique - Strategie d'execution

L'implementation procede par fichier, en utilisant `lov-line-replace` pour les modifications chirurgicales et `lov-write` pour les fichiers necessitant une reecriture significative (env.ts). Les suppressions de dependances utilisent `lov-remove-dependency`. Toutes les modifications independantes sont executees en parallele.

