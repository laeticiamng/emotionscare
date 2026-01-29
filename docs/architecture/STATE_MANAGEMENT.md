# Gestion de l'état et audit des contextes

## Constat actuel

L'application utilise principalement **React Context API** pour gérer l'état global. On retrouve plus d'une quinzaine de fichiers dans `src/contexts/` (ex. `AuthContext`, `ThemeContext`, `MusicContext`, `SegmentContext`, etc.). Chaque contexte expose son provider et son hook dédié.

Cette approche fonctionne pour des besoins simples mais devient difficile à maintenir à mesure que l'application grandit :

- Multiplication des providers imbriqués dans `App.tsx`.
- Duplication potentielle de logique (ex. gestion du chargement, stockage local).
- Difficulté à partager des données entre contextes sans créer de dépendances croisées.

## Recommandations

1. **Centraliser la création des providers** : créer un composant `AppProviders` qui regroupe l'ensemble des contextes nécessaires. Cela permet de garder `main.tsx` ou `App.tsx` lisibles.
2. **Organiser les contextes par domaine** : regrouper dans des sous‑dossiers (`contexts/auth`, `contexts/music`, `contexts/ui`…) avec un index par domaine pour faciliter l'import.
3. **Adopter un store unique pour l'état complexe** : pour les données partagées à grande échelle (authentification, préférences utilisateur, musique), utiliser un gestionnaire d'état comme **Redux Toolkit** ou **Zustand**. On peut conserver certains contextes légers pour des cas isolés (ex. thème).
4. **Slices ou stores modulaires** : si Redux Toolkit est choisi, créer un dossier `src/store/` contenant des _slices_ par domaine (`authSlice.ts`, `musicSlice.ts`, `preferencesSlice.ts`). Chaque slice expose ses actions et sélecteurs. Les composants accèdent au store via `useAppDispatch` et `useAppSelector`.
5. **Typage strict** : définir les types d'état et d'actions dans `src/types/` afin de conserver la cohérence avec le reste du projet.
6. **Tests unitaires** : ajouter des tests sur les reducers ou les stores pour garantir la stabilité lors de l'évolution du code.

## Exemple de structure proposée

```text
src/
├── store/
│   ├── index.ts        # Configuration du store Redux/Zustand
│   ├── authSlice.ts    # Gestion des données utilisateur
│   ├── musicSlice.ts   # Lecture et playlist
│   └── preferencesSlice.ts
├── contexts/           # Conserve les contextes légers (thème, layout…)
│   └── ui/
│       └── ThemeContext.tsx
```

Avec cette organisation, l'état critique est centralisé dans `store/` tandis que les contextes restent dédiés aux besoins localisés. Cela facilite l'évolutivité et limite l'imbrication de providers.
