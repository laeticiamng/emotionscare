# Audit et recommandations du module musique

## Structure actuelle

- Deux providers `MusicContext` coexistent (`src/contexts/MusicContext.tsx` et `src/contexts/music.tsx`).
- Deux composants `MusicDrawer` sont présents (`src/components/music/MusicDrawer.tsx` et `src/components/music/player/MusicDrawer.tsx`).
- Les types sont dupliqués entre `src/types/music.ts` et `src/types/music.d.ts`.

## Problèmes identifiés

1. **Duplication de contexte** : la présence de deux providers entraine des risques d'état incohérent.
2. **Duplication de composant** : deux implémentations de `MusicDrawer` compliquent la maintenance.
3. **Typage éclaté** : plusieurs définitions des mêmes interfaces augmentent le risque d'erreur.
4. **Tests limités** : peu de tests unitaires couvrent la logique du player.

## Recommandations principales

- Conserver uniquement `src/contexts/MusicContext.tsx` comme source unique de vérité.
- Exporter le hook `useMusic` depuis `src/hooks/useMusic.ts` et supprimer les autres variantes.
- Uniformiser `MusicDrawer` en fusionnant les fonctionnalités nécessaires dans un composant unique.
- Centraliser tous les types musique dans `src/types/music.ts` et utiliser `export * from './music'` dans `music.d.ts` pour compatibilité.
- Ajouter des interfaces supplémentaires (`MusicPreferences`, `MusicSession`, `MusicMood`) pour préparer l'extension du module.
- Mettre en place des tests unitaires sur la navigation des pistes, la gestion du volume et la génération de playlists.

## Schéma simplifié du contexte musique

```mermaid
flowchart TD
    A[User Action] -->|play/pause| B(\"useMusic\")
    B --> C{MusicContext}
    C -->|update state| D[Player callbacks]
    C -->|open/close| E(MusicDrawer)
    D --> B
```


