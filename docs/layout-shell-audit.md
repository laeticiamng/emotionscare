# Audit du Shell et du layout global

Ce rapport résume l'analyse du composant `Shell`, de la navigation et de la gestion du contexte global.

## Points observés
- Deux implémentations de `Shell` existaient (`src/Shell.tsx` et `src/components/Shell.tsx`). La première est utilisée par les pages via l'alias `@/Shell`.
- `App.tsx` imbriquait plus de huit providers, rendant la lecture difficile.
- Le `LayoutContext` définissait son type directement dans le fichier.

## Actions réalisées
- Création d'un composant `AppProviders` (`src/providers/AppProviders.tsx`) qui regroupe les providers globaux dans un seul arbre.
- Centralisation des types de layout dans `src/types/layout.ts` et utilisation dans `Shell` et `LayoutContext`.
- Mise à jour de `App.tsx` pour utiliser `AppProviders`, simplifiant la structure du composant racine.
- Export des nouveaux types via `src/types/index.ts`.

## Hiérarchie des providers
```
<AppProviders>
  ThemeProvider
    AuthProvider
      UserPreferencesProvider
        UserModeProvider
          MusicProvider
            OptimizationProvider
              ExtensionsProvider
                OrchestrationProvider
                  {children}
```

## Recommandations
- Supprimer l'ancienne implémentation `src/components/Shell.tsx` si elle n'est plus utilisée.
- Ajouter des tests pour vérifier la disponibilité des contextes dans `Shell`.
- Documenter les routes principales à l'aide des types présents dans `src/types/navigation.ts`.
## Mise à jour 2025-05-23
- L'ancienne implémentation `src/components/Shell.tsx` a été supprimée car aucun fichier ne l'importait encore.
- Le fichier `App.tsx` continuera d'utiliser `AppProviders` pour injecter les contextes globaux dans l'ordre suivant :

```text
<AppProviders>
  ThemeProvider
    AuthProvider
      UserPreferencesProvider
        UserModeProvider
          MusicProvider
            OptimizationProvider
              ExtensionsProvider
                OrchestrationProvider
                  {children}
```

- La hiérarchie ci‑dessus doit être référencée dans la documentation pour garantir une injection cohérente.
- Le routage principal reste défini dans `src/router.tsx` et importé via `AppRouter`. Toutes les pages passent par `Shell` pour bénéficier du header, du menu et du footer unifiés.
- Les chemins critiques sont typés dans `src/types/navigation.ts` pour prévenir les erreurs de chaînes.
