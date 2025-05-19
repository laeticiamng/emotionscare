
# Changelog
Toutes les modifications notables apportées à ce projet seront documentées dans ce fichier.

## [1.1.5] - 2025-05-23

### Ajouté
- Documentation `docs/shell-navigation-premium-audit.md` décrivant la structure du Shell et les recommandations premium.

### Modifié
- Mise à jour de `README.md` pour préciser l'ordre d'injection des contextes.
- Mise à jour de `docs/layout-shell-audit.md` avec la suppression de l'ancien Shell et le rappel de la hiérarchie des providers.

### Supprimé
- Fichier obsolète `src/components/Shell.tsx`.

## [1.1.4] - 2025-05-22

### Corrigé
- Redirection automatique des utilisateurs authentifiés sur la page `/b2b/selection` vers leur tableau de bord respectif.
- Documentation QA `docs/b2b-selection-qa.md` détaillant le problème et la solution.

## [1.1.3] - 2025-05-21

### Ajouté
- Types `TeamSummary`, `AdminAccessLog` et `DashboardWidget` dans `types/dashboard.ts`.
- Types `AnonymizedEmotion`, `TeamAnalytics` et `KpiMetric` dans `types/analytics.ts`.
- Documentation `dashboard-rh-audit.md` et `dashboard-rh-flow.md`.

### Modifié
- Réexport des nouveaux types dans `src/types.ts`.

## [1.1.2] - 2025-05-19

### Modifié
- Centralisation du typage des préférences utilisateur.
- Ajout d'`AccessibilityPreferences` et uniformisation des imports.
- Ajout d'une documentation d'audit du module de préférences utilisateur.

## [1.1.1] - 2025-05-19

### Corrigé
- Export manquant `DEFAULT_PREFERENCES` rétabli dans `src/types/preferences.ts`.

## [1.1.2] - 2025-05-20

### Ajouté
- Centralisation des types du coach et du chat (`src/types/coach.ts`, `src/types/chat.ts`).
- Documentation `COACH_CHAT_MODULE.md` décrivant le contexte et le flux principal.
- Test unitaire minimal pour les exports du `CoachContext`.

### Modifié
- Normalisation du `CoachContext` pour utiliser les nouveaux types.
## [1.1.3] - 2025-05-21

### Ajouté
- Documentation d'audit du module B2B (`docs/b2b-module-audit.md`).
- Réexport des types utilisateurs et dashboard dans `types/`.


## [1.1.3] - 2025-05-21

### Ajouté
- Documentation `docs/b2c_auth_flow.md` détaillant le flux de connexion B2C.
- Tests unitaires de base sur `AuthContext` et `auth-service`.

### Modifié
- Suppression du hook `useAuth` obsolète et réexport depuis `AuthContext`.
- Enrichissement des types `User` et `AuthContextType`.

## [1.1.3] - 2025-05-21

### Ajouté
- Composant `AppProviders` regroupant les providers globaux.
- Types de layout centralisés dans `src/types/layout.ts`.
- Documentation `docs/layout-shell-audit.md` sur la structure du Shell.

### Modifié
- `App.tsx` utilise désormais `AppProviders` pour simplifier l'arbre React.
- `Shell` et `LayoutContext` importent les nouveaux types.

## [1.1.0] - 2025-05-18

### Ajouté
- Module d'intelligence prédictive avec page dédiée `/predictive`
- Lien de navigation "Prédictif" accessible à tous les rôles

## [1.0.0] - 2025-05-17

### Ajouté
- Architecture de base et structure du projet complète
- Système d'authentification avec rôles utilisateurs (B2B, B2C, admin)
- Système de thème (clair, sombre, système)
- Interface utilisateur responsive avec Tailwind et composants shadcn/ui
- Analyse émotionnelle par texte, voix et expressions faciales
- Thérapie musicale avec recommandations basées sur l'émotion
- Journal émotionnel avec visualisations et statistiques
- Système de gamification (badges, défis, points)
- Sessions de relaxation en réalité virtuelle
- Cocoon social pour le partage d'expériences
- Tableau de bord utilisateur personnalisable
- Tableau de bord administrateur avec statistiques et gestion des utilisateurs
- Intégration des APIs OpenAI, HumeAI et MusicGen
- Documentation technique complète

### Optimisé
- Build de production optimisé
- Chargement différé des composants lourds
- Structure de code modulaire et maintenable
- Gestion des erreurs robuste
- Notifications et feedback utilisateur

### Corrigé
- Problèmes d'audio sur certains navigateurs mobiles
- Compatibilité des API vocales sur Safari
- Problèmes de persistence des préférences utilisateur
- Gestion des erreurs d'API externes
- Performance des visualisations graphiques sur mobile

## [0.9.0] - 2025-04-15

### Ajouté
- Version beta du système de thérapie musicale
- Première version du système de badges et défis
- Interface d'administration basique

### Optimisé
- Performance générale de l'application
- Temps de chargement des pages principales

### Corrigé
- Bugs d'authentification
- Problèmes de compatibilité mobile

## [0.9.1] - 2025-05-18

### Ajouté
- Documentation du routage (`docs/home-routing-audit.md`, `docs/RoutingFlow.md`)
- Test unitaire de vérification de la route d'accueil
- Propriété `landing` dans `src/types/navigation.ts`

### Corrigé
- Conventions d'accès public à la page d'accueil

## [0.8.0] - 2025-03-01

### Ajouté
- Système d'analyse émotionnelle basique
- Journal émotionnel version Alpha
- Intégration initiale des APIs OpenAI

## [0.7.0] - 2025-02-01

### Ajouté
- Structure de l'application
- Système d'authentification de base
- Design System initial
