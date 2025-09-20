
# Changelog

## [1.2.0] - 2025-06-07

### Added
- ECC-910: Publication des notes de version produit dans [`RELEASE_NOTES.md`](RELEASE_NOTES.md) pour aligner produit, support et tech.

### Changed
- ECC-912: Endpoint `/health` enrichi avec version, runtime, uptime et heartbeat Sentry pour la surveillance post-déploiement ([`docs/MODULES_LISTING.md`](docs/MODULES_LISTING.md)).
- ECC-915: CTAs landing ajoutent automatiquement `?utm_source=landing&utm_campaign=launch` et `/app` nettoie ces paramètres avant l'authentification.

### Fixed
- B2B-588: Store marketing ne conserve plus les paramètres UTM non pris en charge, évitant les propagations indésirables après connexion.

### Security
- SEC-274: Réponses `/health` signées couvrant les nouveaux métadonnées sans exposer de secrets et journalisation des échecs heartbeat Sentry.

## [1.1.17] - 2025-06-06

### Ajouté
- 12 nouveaux tests unitaires ciblant les stores Zustand (journal, glow) et le client `requestMoodPlaylist`, portant le total QA stores/mappers/clients à 26 cas.
- Sélection de scénarios Playwright stabilisée : login, dashboard, scan → historique, Mood Mixer CRUD, Flash Glow, Journal feed, Coach IA et favoris Adaptive Music.

### Documenté
- Mise à jour des listings `docs/PAGES_LISTING.md` et `docs/MODULES_LISTING.md` avec le statut QA 06/2025 pour chaque parcours critique.
- Enrichissement de `CONTRIBUTING.md` (barrels d'exports, interdiction `node:*`, conventions sélecteurs Zustand) et `.env.example` (clés Supabase publiques, modèles IA).

### QA
- Lint, type-check, tests unitaires Vitest et scénarios Playwright headless validés localement.

## [1.1.16] - 2025-06-05

### Ajouté
- Initialisation Sentry basée sur l'environnement avec tag de release et configuration des taux d'échantillonnage.
- Endpoint `/health` enrichi avec mesures de latence, état des dépendances et validation Zod côté serveur.
- Optimisations front : skip links globaux, focus visible forcé et lazy-load automatique des images.
- Pipeline Vite amélioré avec compression WebP/AVIF et rapport bundle optionnel via `ANALYZE=true`.

## [1.1.14] - 2025-06-05

### Ajouté
- Intégration des modules interactifs restants (Adaptive Music, Boss Grit, Breath Constellation, Bubble Beat, Coach, Emotion Scan, Flash Glow Ultra, Journal, Mood Mixer, Scan, Story Synth) avec routes, pages et tests.


Toutes les modifications notables apportées à ce projet seront documentées dans ce fichier.


## [1.1.15] - 2025-06-05

### Ajouté
- Nouvelle page `/app/heatmap` affichant le tableau de bord Scores & Heatmap (Recharts, export PNG, test e2e visuel Playwright).

## [1.1.13] - 2025-06-04

### Ajouté
- Endpoints KPIs gamification hebdomadaires (/me/gam/weekly et /org/:orgId/gam/weekly)

## [1.1.12] - 2025-06-03

### Ajouté
- metrics_weekly_journal materialized view + pg_cron job.
## [1.1.12] - 2025-06-02

### Ajouté
- Tables `journal_voice` et `journal_text` avec triggers et politiques RLS.
- Tests base de données et nouveau job CI `db-test`.
- Diagramme `docs/journal-schema.md` décrivant le schéma.

## [1.1.11] - 2025-05-29

### Ajouté
- Rapport d'audit `docs/user-preferences-point7-audit.md` détaillant le mapping du `UserPreferencesContext` et les pistes premium.
- Référence vers ce document ajoutée dans le README.


## [1.1.10] - 2025-05-28

### Ajouté
- `LayoutProvider` intègre `AppProviders` pour centraliser la gestion du sidebar et du mode plein écran.
- Rapport d'audit `docs/shell-layout-point4-audit.md` récapitulant la structure du Shell et de la navigation.
- Test `layoutContextExports.test.ts` vérifiant les exports du contexte de layout.

### Modifié
- Mise à jour de `docs/layout-shell-audit.md` et `docs/shell-navigation-premium-audit.md` avec la nouvelle hiérarchie des providers.
- `README.md` référence le nouveau document d'audit et précise l'utilisation de `LayoutProvider`.

## [1.1.8] - 2025-05-26

### Corrigé
- Typage unifié de `ThemeContextType` avec les préférences d'accessibilité
  (`reduceMotion`, `setReduceMotion`, etc.).
- Création de `OrchestrationContextType` dans `src/types/orchestration.ts` et
  ajustement des imports correspondants.
- Correction de `AppProviders` avec l'ordre complet des providers.
- Ajout de `history` dans l'état initial de `MusicContext`.

### Technique
- Mise à jour des exports globaux dans `src/types.ts`.




## [1.1.5] - 2025-05-23

### Ajouté
- Documentation `docs/shell-navigation-premium-audit.md` décrivant la structure du Shell et les recommandations premium.

### Modifié
- Mise à jour de `README.md` pour préciser l'ordre d'injection des contextes.
- Mise à jour de `docs/layout-shell-audit.md` avec la suppression de l'ancien Shell et le rappel de la hiérarchie des providers.

### Supprimé
- Fichier obsolète `src/components/Shell.tsx`.

## [1.1.6] - 2025-05-24

### Ajouté
- Rapport `docs/unified-access-adaptive-audit.md` détaillant la logique d'accès unifiée et l'expérience adaptative.

### Modifié
- `README.md` référence désormais ce nouveau document dans la section documentation technique.

## [1.1.7] - 2025-05-25

### Ajouté
- Rapport `docs/scalability-innovation-audit.md` sur l'évolutivité et l'innovation continue
- Fichier `docs/module-registry.md` listant les modules et la roadmap technique

### Modifié
- Mise à jour de `README.md` pour référencer ces nouveaux documents





## [1.1.9] - 2025-05-27

### Ajouté
- Bouton de sauvegarde animé dans `DataPrivacySettings` permettant d'enregistrer les préférences.
- Documentation `docs/ui-polish-restoration.md` décrivant la restauration de l'interface.

### Modifié
- `README.md` référence ce nouveau document.

## [1.1.8] - 2025-05-26

### Modifié
- Alignement des types liés aux scans audio et vocaux (`EmotionSource`, `AudioProcessorProps`, etc.).
- Suppression des interfaces locales remplacées par les définitions centralisées.

### Ajouté
- Documentation `docs/scan-audio-type-fixes.md` décrivant les corrections.




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
