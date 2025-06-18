
# Chemins Uniques - Documentation

Ce document liste tous les chemins d'accès uniques du projet EmotionsCare. **Chaque fonctionnalité dispose d'un seul et unique chemin d'accès** pour éviter la confusion et garantir une navigation cohérente.

## 🏠 Routes Principales

| Route | Description | Accès |
|-------|-------------|-------|
| `/` | Page d'accueil | Public |
| `/choose-mode` | Sélection du mode utilisateur | Public |
| `/b2b/selection` | Sélection B2B (User/Admin) | Public |

## 🔐 Routes d'Authentification

### B2C (Particuliers)
| Route | Description |
|-------|-------------|
| `/b2c/login` | Connexion B2C |
| `/b2c/register` | Inscription B2C |
| `/b2c/dashboard` | Tableau de bord B2C |

### B2B Utilisateurs
| Route | Description |
|-------|-------------|
| `/b2b/user/login` | Connexion collaborateur |
| `/b2b/user/register` | Inscription collaborateur |
| `/b2b/user/dashboard` | Tableau de bord collaborateur |

### B2B Administrateurs
| Route | Description |
|-------|-------------|
| `/b2b/admin/login` | Connexion administrateur |
| `/b2b/admin/dashboard` | Tableau de bord administrateur |

## 🛠️ Fonctionnalités Communes (Accès Unique)

| Route | Fonctionnalité | Accès |
|-------|-----------------|--------|
| `/scan` | Scanner d'émotions | Tous utilisateurs connectés |
| `/music` | Musicothérapie adaptative | Tous utilisateurs connectés |
| `/coach` | Coach IA | Tous utilisateurs connectés |
| `/coach-chat` | Chat avec le coach IA | Tous utilisateurs connectés |
| `/journal` | Journal personnel | Tous utilisateurs connectés |
| `/vr` | Expériences VR | Tous utilisateurs connectés |
| `/settings` | Paramètres de l'application | Tous utilisateurs connectés |
| `/preferences` | Préférences utilisateur | Tous utilisateurs connectés |
| `/gamification` | Système de gamification | Tous utilisateurs connectés |
| `/social-cocon` | Espace social collaboratif | Tous utilisateurs connectés |

## 👑 Fonctionnalités Administrateur Uniquement

| Route | Fonctionnalité | Accès |
|-------|-----------------|--------|
| `/teams` | Gestion des équipes | Administrateurs B2B uniquement |
| `/reports` | Rapports et analytics | Administrateurs B2B uniquement |
| `/events` | Gestion des événements | Administrateurs B2B uniquement |
| `/optimisation` | Optimisation RH | Administrateurs B2B uniquement |

## ✅ Garanties

1. **Unicité**: Chaque fonctionnalité a exactement un chemin d'accès
2. **Cohérence**: Tous les utilisateurs accèdent aux mêmes fonctionnalités via les mêmes chemins
3. **Simplicité**: Plus de confusion entre différents chemins pour la même fonctionnalité
4. **Maintenance**: Un seul point de modification par fonctionnalité

## 🚫 Chemins Supprimés

Les doublons suivants ont été supprimés :
- `/b2c/scan`, `/b2b/user/scan`, `/b2b/admin/scan` → **Unifié vers `/scan`**
- `/b2c/music`, `/b2b/user/music`, `/b2b/admin/music` → **Unifié vers `/music`**
- `/b2c/coach`, `/b2b/user/coach`, `/b2b/admin/coach` → **Unifié vers `/coach`**
- `/b2c/journal`, `/b2b/user/journal`, `/b2b/admin/journal` → **Unifié vers `/journal`**
- `/b2c/vr`, `/b2b/user/vr` → **Unifié vers `/vr`**
- Tous les fichiers de routes dupliqués dans `/src/router/`

## 🔄 Migration

Pour les liens existants qui pointaient vers les anciens chemins, la navigation se fera automatiquement vers les nouveaux chemins uniques grâce aux mises à jour de `navConfig.ts` et `routeUtils.ts`.
