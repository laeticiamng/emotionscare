# Audio Cookbook

## AudioPlayer vs useSound
- **AudioPlayer**: UI component for basic playback controls, volume and looping.
- **useSound**: Hook for lower-level control when building custom interfaces.

## Activer `new-audio-engine`
- Feature flag `new-audio-engine` dans `src/lib/flags/flags.json`.
- Utiliser `ff('new-audio-engine')` pour basculer vers la nouvelle pile module par module.

## Bonnes pratiques
- Précharger les sources statiques avec `<link rel="preload" as="audio" href="/audio/..." />`.
- Volumes de départ homogènes entre `0.7` et `0.85`.
- Haptics seulement sur mobile et après vérification de `prefers-reduced-motion`.

## Accessibilité
- Boutons et sliders possèdent des labels explicites.
- Navigation clavier supportée.
- Respect de `prefers-reduced-motion` pour désactiver les retours haptiques.

## Limites navigateurs
- L'autoplay est souvent bloqué sans interaction utilisateur.
- iOS nécessite une action de l'utilisateur avant de débloquer l'audio.
