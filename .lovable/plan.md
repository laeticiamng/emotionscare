

# Audit complet des erreurs de build - EmotionsCare

## Diagnostic : 13 fichiers avec erreurs TypeScript

L'application ne compile pas. Voici les erreurs classees par priorite et le plan de correction pour chacune.

---

## Erreur 1 : `UnifiedHomePage.tsx` - Variables supprimees mais encore utilisees

**Lignes 218-220** : `setCurrentTestimonial` et `testimonials` ont ete supprimes (commentaire ligne 88 : "removed") mais le `useEffect` ligne 218-222 les utilise encore.

**Fix** : Supprimer le bloc `useEffect` lignes 217-223 (auto-rotate testimonials) qui reference des variables inexistantes.

---

## Erreur 2 : `HomeB2CPage.tsx` - Import `Star` manquant

**Ligne 68** : `Star` est utilise dans le tableau `stats` mais n'est pas importe depuis lucide-react.

**Fix** : Ajouter `Star` a l'import lucide-react ligne 7-24.

---

## Erreur 3 : `TestimonialsSection.tsx` - Type `Icon` non appelable comme JSX

**Ligne 117** : `const Icon = module.icon` (type `React.ElementType`) n'est pas reconnu comme composant JSX valide. C'est un probleme de compatibilite de types React 18 / lucide-react.

**Fix** : Caster explicitement : `const Icon = module.icon as React.FC<{ className?: string }>`.

---

## Erreur 4 : `NotificationsSettingsTab.tsx` - Meme probleme `Icon` (3 occurrences)

**Lignes 358, 521, 607** : `category.icon` (type `React.ElementType`) et `category?.icon || Bell` ne sont pas reconnus comme JSX.

**Fix** : Typer `icon` comme `React.FC<{ className?: string }>` dans l'interface `NotificationCategory`, ou caster a chaque usage.

---

## Erreur 5 : `AccountSettings.tsx` - `User` non exporte depuis `@/types`

**Ligne 5** : `import { User } from '@/types'` echoue car `User` est dans `@/types/auth.ts` mais pas reexporte par `@/types/index.ts`.

**Fix** : Changer l'import en `import { User } from '@/types/auth'`.

---

## Erreur 6 : `FontSettings.tsx` - `FontFamily`, `FontSize` non exportes depuis `@/types`

**Ligne 5** : Ces types sont dans `@/types/preferences.ts` ou `@/types/theme.d.ts`, pas dans `@/types/index.ts`.

**Fix** : Changer l'import en `import { FontFamily, FontSize } from '@/types/preferences'`.

---

## Erreur 7 : `ExportPanel.tsx` - Destructuration incompatible avec `useExportJob`

**Lignes 20-25** : Le composant attend `lastExport, startExport, checkExportStatus, isExporting, isReady, hasError` mais le hook retourne `job, start, poll, cancel, loading, error, downloadAndTrack, reset`.

**Fix** : Aligner la destructuration avec le hook :
- `lastExport` -> `job`
- `startExport` -> `start`
- `checkExportStatus` -> `poll`
- `isExporting` -> `loading`
- `isReady` -> `job?.status === 'completed'`
- `hasError` -> `!!error`

---

## Erreur 8 : `DisplayPreferences.tsx` - `useUserPreferences` retourne `{}`

**Ligne 10** : Le hook a `@ts-nocheck` et retourne un contexte potentiellement non type. Le composant attend `{ preferences, updatePreferences }`.

**Fix** : Retirer `@ts-nocheck` du hook `useUserPreferences.ts` et typer le retour correctement avec `UserPreferencesContextType`.

---

## Erreur 9 : `PrivacyPreferences.tsx` - Proprietes inexistantes sur `PrivacyPreferences`

**Lignes 16-104** : Le composant utilise `shareData`, `dataSharing`, `anonymizeReports` qui n'existent pas dans le type `PrivacyPreferences` (qui a `profileVisibility`, `dataCollection`, `analytics`, `marketing`).

**Fix** : Aligner les proprietes du composant avec le type `PrivacyPreferences` de `@/types/preferences.ts`. Remplacer `shareData`/`dataSharing` par `dataCollection`, et supprimer `anonymizeReports`.

---

## Erreur 10 : `UserSettings.tsx` - `string` non assignable a `Theme`

**Ligne 120** : `setTheme(newTheme)` ou `newTheme` est type `ThemeName` (string via legacy-components.d.ts) mais `setTheme` attend `Theme` ('light' | 'dark' | 'system').

**Fix** : Caster `setTheme(newTheme as Theme)` ou importer `Theme` depuis `@/providers/theme/ThemeProvider` et typer correctement.

---

## Erreur 11 : `JournalNewPage.tsx` - Types `SpeechRecognition` incompatibles

**Lignes 29, 126, 138** : Conflit entre les types Web Speech API du navigateur et les declarations TypeScript.

**Fix** : Ajouter des declarations de type dans le fichier ou utiliser `any` pour les handlers, et remplacer `SpeechRecognition` par `typeof window.SpeechRecognition extends undefined ? never : SpeechRecognition` ou ajouter un cast.

---

## Erreur 12 : `pushManager` inexistant sur `ServiceWorkerRegistration` (4 fichiers)

**Fichiers** : `pushManager.ts`, `pushNotificationService.ts`, `pushService.ts`, `pushNotifications.ts`

**Fix** : Ajouter une declaration de type globale dans `src/global.d.ts` :
```typescript
interface ServiceWorkerRegistration {
  pushManager: PushManager;
}
```

---

## Erreur 13 : Erreur Deno/Edge Function (non bloquante pour le front)

L'erreur `@supabase/realtime-js` est un probleme d'environnement Deno des edge functions, pas du build front-end. Ignorable dans cet audit front-end.

---

## Resume

| # | Fichier | Severite | Type de fix |
|---|---------|----------|-------------|
| 1 | UnifiedHomePage.tsx | Bloquant | Supprimer code mort |
| 2 | HomeB2CPage.tsx | Bloquant | Ajouter import |
| 3 | TestimonialsSection.tsx | Bloquant | Cast type |
| 4 | NotificationsSettingsTab.tsx | Bloquant | Cast type (x3) |
| 5 | AccountSettings.tsx | Bloquant | Corriger import |
| 6 | FontSettings.tsx | Bloquant | Corriger import |
| 7 | ExportPanel.tsx | Bloquant | Aligner destructuration |
| 8 | DisplayPreferences.tsx / useUserPreferences.ts | Bloquant | Typer hook |
| 9 | PrivacyPreferences.tsx | Bloquant | Aligner avec type |
| 10 | UserSettings.tsx | Bloquant | Cast Theme |
| 11 | JournalNewPage.tsx | Bloquant | Declarations Speech API |
| 12 | 4 fichiers push | Bloquant | Declaration globale |
| 13 | Edge function Deno | Non bloquant | Ignorer |

**12 corrections a appliquer sur 15 fichiers** pour debloquer le build.

