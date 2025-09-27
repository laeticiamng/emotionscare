
# Architecture du projet EmotionsCare

## Vue d'ensemble

EmotionsCare est structuré autour d'une architecture orientée composants, avec séparation des préoccupations et un état global géré par le Context API de React. La structure des dossiers suit une approche par domaine, où les composants, hooks et contextes liés à une même fonctionnalité sont regroupés.

## Principes architecturaux

1. **Modularité** : Chaque composant est conçu pour être autonome et réutilisable.
2. **Séparation des préoccupations** : Logique et présentation sont séparées.
3. **Props Down, Events Up** : Les données descendent via les props, les événements remontent via les callbacks.
4. **Contextes globaux** : Pour l'état partagé entre composants éloignés.
5. **Lazy Loading** : Chargement différé pour optimiser les performances.

## Structure des dossiers

```
src/
├── assets/              # Images et fichiers statiques
├── components/          # Composants React
│   ├── ui/              # Composants UI de base (shadcn/ui)
│   ├── layout/          # Composants de mise en page
│   ├── dashboard/       # Composants spécifiques au dashboard
│   ├── scan/            # Composants d'analyse émotionnelle
│   ├── music/           # Composants liés à la musique
│   ├── journal/         # Composants du journal émotionnel
│   ├── vr/              # Composants de réalité virtuelle
│   └── ...
├── config/              # Fichiers de configuration
├── constants/           # Valeurs et énumérations globales
├── contexts/            # Contextes React pour l'état global
├── providers/           # Providers globaux (auth, thème…)
├── hooks/               # Hooks personnalisés
├── integrations/        # Clients et adaptateurs d'APIs externes
├── layouts/             # Layouts applicatifs
├── pages/               # Composants de page
├── themes/              # Définition des thèmes
├── types/               # Définitions TypeScript
├── utils/               # Fonctions utilitaires
├── services/            # Services d'API et logique métier
├── lib/                 # Bibliothèques et helpers partagés
├── scripts/             # Scripts de maintenance
├── tests/               # Tests unitaires et d'intégration
└── docs/                # Documentation technique
```

## Flux de données

```
API External -> Services -> Hooks -> Contextes -> Composants -> UI
```

1. Les données externes sont récupérées via des services API.
2. Les hooks utilisent ces services et gèrent l'état local.
3. Les contextes distribuent l'état global à travers l'application.
4. Les composants consomment les contextes et les hooks.
5. L'UI est rendue en fonction des données reçues.

## Système de thème

Le système de thème est basé sur Tailwind CSS avec des variables CSS personnalisées. Il est géré par le ThemeContext qui:

1. Détecte les préférences système.
2. Applique le thème choisi par l'utilisateur.
3. Persiste les préférences dans le localStorage.
4. Fournit des utilitaires pour basculer entre les thèmes.

## Gestion de l'authentification

L'authentification utilise Supabase Auth avec:

1. Flux de connexion/inscription standard.
2. Persistance de session.
3. Protection des routes via HOC et composants.
4. Gestion des rôles et permissions.

## Système de routes

Les routes sont organisées de manière hiérarchique avec React Router:

1. Routes publiques (accueil, connexion, inscription)
2. Routes protégées (dashboard, journal, scan)
3. Routes administratives (admin dashboard)

## Intégrations API

Les API externes sont intégrées via des services dédiés:

1. **OpenAI** : Pour les fonctionnalités de génération de texte, DALL-E et Whisper.
2. **HumeAI** : Pour l'analyse émotionnelle avancée.
3. **MusicGen** : Pour la génération de musique basée sur les émotions.

## Performance et optimisation

1. **Code splitting** : Chargement de code à la demande.
2. **Lazy loading** : Chargement différé des images et composants.
3. **Memoization** : Utilisation de useMemo et useCallback pour éviter les rendus inutiles.
4. **Virtualisation** : Pour les listes longues.
5. **Optimisation des assets** : Images optimisées, fonts preloading.

## Tests

1. **Tests unitaires** : Pour les fonctions et hooks utilitaires.
2. **Tests de composants** : Pour les composants UI isolés.
3. **Tests d'intégration** : Pour les fonctionnalités complexes.
4. **E2E** : Pour les parcours utilisateur critiques.

## Déploiement

Le processus de déploiement utilise:

1. **CI/CD** : Intégration et déploiement continus.
2. **Builds optimisés** : Minification, tree-shaking, code splitting.
3. **Monitoring** : Suivi des performances et des erreurs en production.
4. **Rollback** : Possibilité de revenir à une version précédente en cas de problème.
