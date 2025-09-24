# 🪴 Providers Racine

Tous les providers React sont centralisés dans `src/providers/index.tsx` via le composant **`RootProvider`**.
Ce guide résume l'empilement, les responsabilités et la marche à suivre pour ajouter/enlever un provider.

## 🌳 Composition du RootProvider
```
<HelmetProvider>
  <ErrorBoundary>
    <QueryClientProvider>
      <ErrorProvider>
        <SimpleAuthProvider>
          <AuthProvider>
            <UserModeProvider>
              <I18nBootstrap>
                <ThemeProvider>
                  <AccessibilityProvider>
                    <NotificationProvider>
                      <TooltipProvider>
                        <UnifiedProvider>
                          <MoodProvider>
                            <MusicProvider>
                              {children}
                              <Toaster ... />
```

### Détails par bloc
- **HelmetProvider** (`react-helmet-async`) : SEO côté client + meta dynamiques.
- **ErrorBoundary** (`src/contexts/ErrorBoundary.tsx`) : catch global, fallback accessible.
- **QueryClientProvider** : cache TanStack Query (staleTime 5 min, retry 1) – à utiliser pour toutes les requêtes HTTP.
- **ErrorProvider** alias `useError` (`src/contexts/ErrorContext.tsx`) : expose `handleError`, `reportError` et l'alias re-exporté dans `src/contexts/index.ts`.
- **SimpleAuthProvider** + **AuthProvider** : wrapper Supabase Auth (session, refresh) + compat legacy.
- **UserModeProvider** : garde la distinction `consumer | employee | manager` (B2B/B2C switch).
- **I18nBootstrap** : attend `i18n.isInitialized` avant de rendre quoi que ce soit → éviter les flashes de langue.
- **ThemeProvider** (`src/providers/ThemeProvider.tsx`) : next-themes wrapper, stockage `localStorage` (`emotions-care-theme`).
- **AccessibilityProvider** : gère focus ring, skip links, high-contrast (cf. `src/components/common/AccessibilityProvider.tsx`).
- **NotificationProvider** + **Toaster** (Sonner) : notifications homogènes, toasts globaux.
- **TooltipProvider** : delay & skip delay (200/100 ms).
- **UnifiedProvider** (`src/core/UnifiedStateManager`) : connecte flags, health monitor, global interceptors.
- **MoodProvider** / **MusicProvider** : contexte d'humeur (dashboard) + bus audio partagé.

## 🧭 Règles d'initialisation
1. **i18n avant render** : ne jamais consommer `useI18n` hors `I18nBootstrap`. Pour ajouter une nouvelle locale, mettre à jour `src/lib/i18n/index.ts`.
2. **Providers UI** (Theme, Accessibility, Tooltip, Toaster) restent sous l'i18n pour bénéficier des traductions.
3. **ErrorBoundary** doit rester tout en haut pour capturer les erreurs de providers descendants (sauf Helmet qui doit précéder pour SSR). `ErrorProvider` fournit l'API `useError` utilisée par les composants.
4. **QueryClient** : si un provider a besoin de requêtes (ex : Feature Flags), le placer sous `QueryClientProvider`.

## 🚦 Ajout / retrait d'un provider
- Ajouter le provider dans `RootProvider` **et** documenter la dépendance dans ce fichier.
- Vérifier les ordres suivants :
  - Auth dépend de QueryClient (`useQuery`), donc doit être en-dessous.
  - Providers UI (Theme, Tooltip, Toaster) n'ont pas besoin d'auth → garder proches de l'arbre UI.
  - Tout provider qui lit la locale doit être après `I18nBootstrap`.
- Penser à exposer l'API depuis `src/providers/index.tsx` ou un fichier dédié si nécessaire.
- Mettre à jour les tests snapshot/renderer (`src/__tests__/AppProviders.test.tsx`) s'ils existent.

## 🧯 ErrorBoundary global
- `ErrorBoundary` enveloppe l'application et affiche une page accessible en cas de crash runtime.
- Pour remonter une erreur contrôlée depuis un module, utiliser `const { reportError } = useError();` (alias exporté via `src/contexts/index.ts`).
- Les erreurs envoyées à Sentry sont nettoyées par `src/lib/sentry-config.ts` (pas de PII).

## 🔐 Feature flags & modes
- `UserModeProvider` lit la session Supabase et expose `mode` (`consumer`, `employee`, `manager`).
- `UnifiedProvider` charge `/me/feature_flags` et stocke les defaults (`src/core/flags.ts`).
- Le RootProvider garantit que ces hooks sont disponibles dans toutes les pages (B2C/B2B) sans reconfigurer à la main.

> _Modifier l'ordre des providers impacte l'onboarding (<15 min). Toute évolution doit être documentée ici et testée via `npm run lint` + QA rapide (auth, toasts, i18n)._ 
