# Audit des Routes de la Plateforme EmotionsCare

**Date**: 2025-11-14
**Statut**: Audit complet effectué
**Périmètre**: Frontend Routes + Backend API Routes

---

## 📊 Vue d'ensemble

### Statistiques Actuelles
- **Routes Frontend**: 200+ routes React Router
- **Routes Backend API**: ~180 Edge Functions Supabase
- **Modules Principaux**: 20+ modules fonctionnels
- **Tables Base de Données**: 547 tables PostgreSQL

### État de Santé Global
- ✅ **Frontend**: Excellente couverture avec routing sophistiqué
- ⚠️ **Backend API**: Lacunes importantes entre modèles de données et API
- 🔴 **Gap Critique**: Nombreuses tables sans endpoints API REST

---

## 🎯 Priorités d'Action

### 🔴 Critique (À implémenter immédiatement)
1. **API Assessment/Clinical** - Aucune API pour gérer les évaluations psychométriques
2. **API Emotion Scans** - Pas de CRUD pour les scans émotionnels
3. **API Coach Sessions** - Gestion des sessions de coaching manquante
4. **API Modules Génériques** - Système générique pour tracker les sessions

### 🟡 Important (Priorité haute)
5. **API Community** - Posts, commentaires, groupes
6. **API Goals** - Gestion des objectifs personnels
7. **API Music Sessions** - Historique des sessions de musicothérapie
8. **API VR Sessions** - Suivi des expériences immersives

### 🟢 Améliorations (Priorité moyenne)
9. **API Gamification** - Achievements, challenges, leaderboards
10. **API User Preferences** - Gestion complète des préférences
11. **API Analytics** - Analytics temps réel et historiques
12. **Amélioration Journal API** - Update, delete, search

---

## 📋 Analyse Détaillée par Domaine

### 1. Authentication & User Management

#### ✅ Routes Existantes (Frontend)
- `/login`, `/signup` - Authentification unifiée B2C/B2B
- `/app/profile`, `/settings/profile` - Profil utilisateur
- `/settings/privacy` - Contrôles de confidentialité
- `/settings/general` - Paramètres généraux
- `/mode-selection` - Sélection mode B2C/B2B

#### ✅ API Existante (Backend)
- Edge Functions: `user-profile`, `optin-accept`, `optin-revoke`, `consent-manager`

#### ⚠️ Routes Manquantes

**API Backend**:
```
POST   /api/v1/users                    - Créer utilisateur
GET    /api/v1/users/:id                - Détails utilisateur
PATCH  /api/v1/users/:id                - Mettre à jour profil
DELETE /api/v1/users/:id                - Supprimer compte
GET    /api/v1/users/:id/preferences    - Récupérer préférences
PATCH  /api/v1/users/:id/preferences    - Mettre à jour préférences
POST   /api/v1/users/:id/avatar         - Upload avatar
DELETE /api/v1/users/:id/avatar         - Supprimer avatar
GET    /api/v1/users/:id/stats          - Statistiques utilisateur
POST   /api/v1/users/:id/deactivate     - Désactiver compte
POST   /api/v1/users/:id/reactivate     - Réactiver compte
```

**Frontend**:
```
/settings/account-delete                 - Page suppression compte
/settings/data-export                    - Export données personnelles
/settings/connected-devices              - Appareils connectés
/settings/sessions                       - Gestion des sessions actives
/settings/two-factor                     - Authentification 2FA
```

---

### 2. Emotional Scan & Assessment

#### ✅ Routes Existantes (Frontend)
- `/app/scan` - Hub principal de scan émotionnel
- `/app/scan/facial` - Détection faciale
- `/app/scan/voice` - Analyse vocale
- `/app/scan/text` - Analyse de texte
- `/app/scan/emoji` - Check-in par emoji

#### ⚠️ API Existante (Backend)
- Edge Functions: `analyze-text`, `analyze-voice-hume`, `analyze-vision`, `emotion-analysis`
- ❌ **Problème**: Pas de CRUD pour persister et récupérer l'historique

#### 🔴 Routes Manquantes CRITIQUES

**API Backend**:
```
POST   /api/v1/scans                     - Créer nouveau scan
GET    /api/v1/scans                     - Liste des scans (avec filtres)
GET    /api/v1/scans/:id                 - Détails d'un scan
DELETE /api/v1/scans/:id                 - Supprimer un scan
GET    /api/v1/scans/stats               - Statistiques globales
GET    /api/v1/scans/trends              - Tendances émotionnelles
GET    /api/v1/scans/patterns            - Patterns détectés
GET    /api/v1/scans/daily               - Scan quotidien
GET    /api/v1/scans/weekly              - Scans de la semaine
GET    /api/v1/scans/monthly             - Scans du mois
POST   /api/v1/scans/batch               - Analyse batch
GET    /api/v1/scans/export              - Export données scans

POST   /api/v1/assessments               - Créer évaluation
GET    /api/v1/assessments               - Liste évaluations
GET    /api/v1/assessments/:id           - Détails évaluation
GET    /api/v1/assessments/active        - Évaluation en cours
POST   /api/v1/assessments/:id/submit    - Soumettre réponses
GET    /api/v1/assessments/:id/results   - Résultats
GET    /api/v1/assessments/history       - Historique
GET    /api/v1/assessments/instruments   - Instruments disponibles (WHO-5, PHQ-9, etc.)
```

**Frontend**:
```
/app/scan/history                        - Historique complet des scans
/app/scan/compare                        - Comparer plusieurs scans
/app/scan/export                         - Exporter historique
/app/scan/calendar                       - Vue calendrier des scans
/app/assessments                         - Hub des évaluations
/app/assessments/:id                     - Passer une évaluation
/app/assessments/results/:id             - Résultats détaillés
/app/assessments/history                 - Historique des évaluations
```

---

### 3. AI Coach & Conversations

#### ✅ Routes Existantes (Frontend)
- `/app/coach` - Coach émotionnel AI
- `/app/coach/programs` - Programmes de coaching
- `/app/coach/programs/:id` - Détails programme
- `/app/coach/sessions` - Historique sessions
- `/app/coach/analytics` - Analytics coaching
- `/app/coach-micro` - Micro-décisions

#### ⚠️ API Existante (Backend)
- Edge Functions: `ai-coach-response`, `chat-with-ai`, `chat-coach`, `openai-chat`
- ❌ **Problème**: Pas de gestion structurée des sessions

#### 🔴 Routes Manquantes CRITIQUES

**API Backend**:
```
POST   /api/v1/coach/sessions            - Créer session coaching
GET    /api/v1/coach/sessions            - Liste des sessions
GET    /api/v1/coach/sessions/:id        - Détails session
PATCH  /api/v1/coach/sessions/:id        - Mettre à jour session
DELETE /api/v1/coach/sessions/:id        - Supprimer session
POST   /api/v1/coach/sessions/:id/close  - Clore session
GET    /api/v1/coach/sessions/:id/summary - Résumé de session

POST   /api/v1/coach/messages            - Envoyer message
GET    /api/v1/coach/messages            - Historique messages
GET    /api/v1/coach/sessions/:id/messages - Messages d'une session
DELETE /api/v1/coach/messages/:id        - Supprimer message

GET    /api/v1/coach/programs            - Programmes disponibles
GET    /api/v1/coach/programs/:id        - Détails programme
POST   /api/v1/coach/programs/:id/enroll - S'inscrire à un programme
GET    /api/v1/coach/programs/:id/progress - Progression

GET    /api/v1/coach/insights            - Insights générés
GET    /api/v1/coach/recommendations     - Recommandations
POST   /api/v1/coach/feedback            - Feedback sur coaching
```

**Frontend**:
```
/app/coach/session/:id                   - Session de coaching active
/app/coach/programs/:id/enroll           - Inscription à un programme
/app/coach/insights                      - Insights du coach
/app/coach/techniques                    - Techniques enseignées
/app/coach/resources                     - Ressources recommandées
```

---

### 4. Journal & Voice Entries

#### ✅ Routes Existantes (Frontend)
- `/app/journal` - Journal émotionnel (voix/texte)
- `/app/journal-new` - Nouvelle entrée
- `/settings/journal` - Préférences journal

#### ✅ API Existante (Backend)
- Routes: `POST /api/v1/journal/voice`, `POST /api/v1/journal/text`, `GET /api/v1/me/journal`
- Edge Functions: `journal`, `journal-voice`, `text-to-voice`

#### 🟡 Routes Manquantes (Amélioration)

**API Backend**:
```
PATCH  /api/v1/journal/:id               - Modifier entrée
DELETE /api/v1/journal/:id               - Supprimer entrée
GET    /api/v1/journal/search            - Rechercher dans journal
GET    /api/v1/journal/tags              - Tags utilisés
GET    /api/v1/journal/tagged/:tag       - Entrées par tag
GET    /api/v1/journal/date/:date        - Entrées par date
GET    /api/v1/journal/stats             - Statistiques journal
GET    /api/v1/journal/export            - Export journal complet
POST   /api/v1/journal/import            - Import journal

GET    /api/v1/journal/prompts           - Prompts du jour
POST   /api/v1/journal/prompts           - Créer prompt personnalisé
GET    /api/v1/journal/reminders         - Rappels configurés
POST   /api/v1/journal/reminders         - Créer rappel
PATCH  /api/v1/journal/reminders/:id     - Modifier rappel
DELETE /api/v1/journal/reminders/:id     - Supprimer rappel
```

**Frontend**:
```
/app/journal/:id/edit                    - Éditer entrée
/app/journal/search                      - Recherche dans journal
/app/journal/tags                        - Gestion des tags
/app/journal/stats                       - Statistiques d'écriture
/app/journal/prompts                     - Prompts d'écriture
/app/journal/reminders                   - Rappels journal
```

---

### 5. Music Therapy

#### ✅ Routes Existantes (Frontend)
- `/app/music` - Musicothérapie AI
- `/app/music/analytics` - Analytics musicale
- `/app/music/profile` - Profil musical
- `/app/music-premium` - Fonctionnalités premium

#### ⚠️ API Existante (Backend)
- Edge Functions: `emotion-music-ai`, `suno-music`, `generate-suno-prompt`, `adaptive-music`, `mood-mixer`
- Route: `POST /api/mood_playlist`
- ❌ **Problème**: Pas de gestion des sessions, historique limité

#### 🔴 Routes Manquantes IMPORTANTES

**API Backend**:
```
POST   /api/v1/music/sessions            - Créer session musicale
GET    /api/v1/music/sessions            - Historique sessions
GET    /api/v1/music/sessions/:id        - Détails session
PATCH  /api/v1/music/sessions/:id        - Mettre à jour session
DELETE /api/v1/music/sessions/:id        - Supprimer session

GET    /api/v1/music/playlists           - Playlists utilisateur
POST   /api/v1/music/playlists           - Créer playlist
GET    /api/v1/music/playlists/:id       - Détails playlist
PATCH  /api/v1/music/playlists/:id       - Modifier playlist
DELETE /api/v1/music/playlists/:id       - Supprimer playlist
POST   /api/v1/music/playlists/:id/tracks - Ajouter track

GET    /api/v1/music/generated           - Musiques générées
GET    /api/v1/music/generated/:id       - Détails musique générée
DELETE /api/v1/music/generated/:id       - Supprimer musique
POST   /api/v1/music/generated/:id/favorite - Ajouter aux favoris

GET    /api/v1/music/favorites           - Favoris
POST   /api/v1/music/favorites           - Ajouter favori
DELETE /api/v1/music/favorites/:id       - Retirer favori

GET    /api/v1/music/history             - Historique d'écoute
POST   /api/v1/music/play-log            - Log écoute
POST   /api/v1/music/skip-log            - Log skip

GET    /api/v1/music/queue               - File d'attente
GET    /api/v1/music/queue/:id/status    - Statut génération
POST   /api/v1/music/queue/cancel/:id    - Annuler génération

GET    /api/v1/music/recommendations     - Recommandations
GET    /api/v1/music/preferences         - Préférences musicales
PATCH  /api/v1/music/preferences         - Modifier préférences
```

**Frontend**:
```
/app/music/sessions                      - Historique des sessions
/app/music/sessions/:id                  - Détails session
/app/music/playlists                     - Gestion des playlists
/app/music/playlists/:id                 - Détails playlist
/app/music/playlists/:id/edit            - Éditer playlist
/app/music/generated                     - Musiques générées
/app/music/favorites                     - Favoris
/app/music/history                       - Historique complet
/app/music/queue                         - File d'attente
/app/music/recommendations               - Recommandations
```

---

### 6. VR & Immersive Experiences

#### ✅ Routes Existantes (Frontend)
- `/app/vr` - Galaxie VR relaxante
- `/app/vr-galaxy` - Expérience galaxie
- `/app/vr-breath-guide` - Respiration guidée VR

#### ⚠️ API Existante (Backend)
- Edge Functions: `vr-therapy`, `vr-galaxy-metrics`, `neon-walk-session`, `biotune-session`
- ❌ **Problème**: Pas de CRUD pour les sessions VR

#### 🔴 Routes Manquantes IMPORTANTES

**API Backend**:
```
POST   /api/v1/vr/sessions               - Créer session VR
GET    /api/v1/vr/sessions               - Liste sessions
GET    /api/v1/vr/sessions/:id           - Détails session
PATCH  /api/v1/vr/sessions/:id           - Mettre à jour session
DELETE /api/v1/vr/sessions/:id           - Supprimer session
POST   /api/v1/vr/sessions/:id/complete  - Terminer session

GET    /api/v1/vr/experiences            - Expériences disponibles
GET    /api/v1/vr/experiences/:id        - Détails expérience
GET    /api/v1/vr/experiences/:id/stats  - Statistiques

GET    /api/v1/vr/environments           - Environnements disponibles
GET    /api/v1/vr/favorites              - Expériences favorites
POST   /api/v1/vr/favorites/:id          - Ajouter aux favoris

POST   /api/v1/ar/sessions               - Créer session AR
GET    /api/v1/ar/sessions               - Liste sessions AR
GET    /api/v1/ar/filters                - Filtres disponibles
POST   /api/v1/ar/filters/:id/use        - Utiliser filtre
```

**Frontend**:
```
/app/vr/experiences                      - Catalogue expériences VR
/app/vr/experiences/:id                  - Détails expérience
/app/vr/sessions                         - Historique sessions
/app/vr/sessions/:id                     - Détails session
/app/vr/favorites                        - Expériences favorites
/app/vr/environments                     - Environnements
/app/ar/filters                          - Filtres AR disponibles
/app/ar/sessions                         - Historique AR
```

---

### 7. Community & Social

#### ✅ Routes Existantes (Frontend)
- `/app/community` - Feed communautaire
- `/app/communaute` - Communauté (FR)
- `/app/social-cocon` - Espace social sécurisé
- `/app/friends` - Liste d'amis
- `/app/groups` - Gestion des groupes
- `/messages` - Messages directs

#### ⚠️ API Existante (Backend)
- Edge Functions: `community`, `community-hub`, `handle-post-reaction`, `handle-moderation-action`
- ❌ **Problème**: API limitée, pas de CRUD complet

#### 🔴 Routes Manquantes CRITIQUES

**API Backend**:
```
# Posts
POST   /api/v1/community/posts           - Créer post
GET    /api/v1/community/posts           - Liste posts (feed)
GET    /api/v1/community/posts/:id       - Détails post
PATCH  /api/v1/community/posts/:id       - Modifier post
DELETE /api/v1/community/posts/:id       - Supprimer post
POST   /api/v1/community/posts/:id/like  - Liker post
DELETE /api/v1/community/posts/:id/like  - Unliker post
POST   /api/v1/community/posts/:id/report - Signaler post
POST   /api/v1/community/posts/:id/share - Partager post

# Comments
POST   /api/v1/community/posts/:id/comments       - Créer commentaire
GET    /api/v1/community/posts/:id/comments       - Commentaires d'un post
PATCH  /api/v1/community/comments/:id             - Modifier commentaire
DELETE /api/v1/community/comments/:id             - Supprimer commentaire
POST   /api/v1/community/comments/:id/like        - Liker commentaire
POST   /api/v1/community/comments/:id/report      - Signaler commentaire

# Groups
POST   /api/v1/community/groups          - Créer groupe
GET    /api/v1/community/groups          - Liste groupes
GET    /api/v1/community/groups/:id      - Détails groupe
PATCH  /api/v1/community/groups/:id      - Modifier groupe
DELETE /api/v1/community/groups/:id      - Supprimer groupe
POST   /api/v1/community/groups/:id/join - Rejoindre groupe
POST   /api/v1/community/groups/:id/leave - Quitter groupe
GET    /api/v1/community/groups/:id/members - Membres
POST   /api/v1/community/groups/:id/invite - Inviter membre
GET    /api/v1/community/groups/:id/posts - Posts du groupe

# Friends
GET    /api/v1/friends                   - Liste amis
POST   /api/v1/friends/requests          - Envoyer demande
GET    /api/v1/friends/requests          - Demandes en attente
POST   /api/v1/friends/requests/:id/accept - Accepter demande
POST   /api/v1/friends/requests/:id/decline - Refuser demande
DELETE /api/v1/friends/:id               - Retirer ami

# Messages
POST   /api/v1/messages                  - Envoyer message
GET    /api/v1/messages                  - Conversations
GET    /api/v1/messages/:conversationId  - Messages conversation
PATCH  /api/v1/messages/:id              - Modifier message
DELETE /api/v1/messages/:id              - Supprimer message
POST   /api/v1/messages/:id/read         - Marquer comme lu
GET    /api/v1/messages/unread           - Messages non lus
```

**Frontend**:
```
/app/community/post/:id                  - Détails d'un post
/app/community/post/:id/edit             - Éditer post
/app/community/create-post               - Créer post
/app/community/my-posts                  - Mes posts
/app/groups/:id                          - Page groupe
/app/groups/:id/members                  - Membres du groupe
/app/groups/:id/settings                 - Paramètres groupe
/app/groups/create                       - Créer groupe
/app/friends/requests                    - Demandes d'amis
/app/friends/suggestions                 - Suggestions d'amis
/messages/conversation/:id               - Conversation
/messages/new                            - Nouveau message
```

---

### 8. Goals & Wellness

#### ✅ Routes Existantes (Frontend)
- `/app/goals` - Liste des objectifs
- `/app/goals/:id` - Détails objectif
- `/app/goals/new` - Créer objectif

#### ❌ API Existante (Backend)
- **AUCUNE API** pour gérer les objectifs

#### 🔴 Routes Manquantes CRITIQUES

**API Backend**:
```
POST   /api/v1/goals                     - Créer objectif
GET    /api/v1/goals                     - Liste objectifs
GET    /api/v1/goals/:id                 - Détails objectif
PATCH  /api/v1/goals/:id                 - Modifier objectif
DELETE /api/v1/goals/:id                 - Supprimer objectif
POST   /api/v1/goals/:id/complete        - Marquer comme terminé
POST   /api/v1/goals/:id/progress        - Mettre à jour progression
GET    /api/v1/goals/active              - Objectifs actifs
GET    /api/v1/goals/completed           - Objectifs terminés
GET    /api/v1/goals/stats               - Statistiques

POST   /api/v1/wellness/quests           - Créer quête
GET    /api/v1/wellness/quests           - Liste quêtes
GET    /api/v1/wellness/quests/:id       - Détails quête
POST   /api/v1/wellness/quests/:id/start - Commencer quête
POST   /api/v1/wellness/quests/:id/complete - Terminer quête
GET    /api/v1/wellness/streak           - Streak actuel
GET    /api/v1/wellness/chests           - Coffres disponibles
POST   /api/v1/wellness/chests/:id/open  - Ouvrir coffre

POST   /api/v1/rituals                   - Créer rituel
GET    /api/v1/rituals                   - Liste rituels
GET    /api/v1/rituals/:id               - Détails rituel
PATCH  /api/v1/rituals/:id               - Modifier rituel
DELETE /api/v1/rituals/:id               - Supprimer rituel
POST   /api/v1/rituals/:id/complete      - Compléter rituel du jour
GET    /api/v1/rituals/:id/history       - Historique
```

**Frontend**:
```
/app/goals/:id/edit                      - Éditer objectif
/app/wellness/quests                     - Quêtes de bien-être
/app/wellness/quests/:id                 - Détails quête
/app/wellness/streak                     - Streak de bien-être
/app/wellness/chests                     - Coffres à ouvrir
/app/rituals                             - Rituels quotidiens
/app/rituals/:id                         - Détails rituel
/app/rituals/:id/edit                    - Éditer rituel
```

---

### 9. Gamification & Achievements

#### ✅ Routes Existantes (Frontend)
- `/app/achievements` - Succès débloqués
- `/app/badges` - Badges obtenus
- `/app/leaderboard` - Classements
- `/app/challenges` - Défis
- `/app/challenges/:id` - Détail défi
- `/app/challenges/create` - Créer défi
- `/app/daily-challenges` - Défis quotidiens
- `/app/tournaments` - Tournois
- `/app/guilds` - Guildes
- `/app/guilds/:id` - Page guilde
- `/app/rewards` - Récompenses

#### ⚠️ API Existante (Backend)
- Edge Functions: `gamification`, `generate-daily-challenges`, `auto-unlock-badges`, `calculate-rankings`, `grit-challenge`
- ❌ **Problème**: API limitée, pas de CRUD complet

#### 🟡 Routes Manquantes (Haute priorité)

**API Backend**:
```
# Achievements
GET    /api/v1/achievements              - Succès disponibles
GET    /api/v1/achievements/:id          - Détails succès
GET    /api/v1/achievements/unlocked     - Succès débloqués
GET    /api/v1/achievements/progress     - Progression
GET    /api/v1/achievements/categories   - Catégories

# Badges
GET    /api/v1/badges                    - Badges disponibles
GET    /api/v1/badges/earned             - Badges obtenus
GET    /api/v1/badges/:id                - Détails badge

# Challenges
GET    /api/v1/challenges                - Défis disponibles
GET    /api/v1/challenges/:id            - Détails défi
POST   /api/v1/challenges/:id/join       - Rejoindre défi
POST   /api/v1/challenges/:id/complete   - Terminer défi
GET    /api/v1/challenges/:id/leaderboard - Classement défi
POST   /api/v1/challenges                - Créer défi personnalisé
GET    /api/v1/challenges/daily          - Défis du jour
GET    /api/v1/challenges/active         - Défis en cours
GET    /api/v1/challenges/history        - Historique

# Leaderboards
GET    /api/v1/leaderboards              - Classements disponibles
GET    /api/v1/leaderboards/:type        - Classement par type
GET    /api/v1/leaderboards/:type/me     - Ma position
GET    /api/v1/leaderboards/friends      - Classement amis

# Points & Rewards
GET    /api/v1/points                    - Points actuels
GET    /api/v1/points/history            - Historique points
GET    /api/v1/rewards                   - Récompenses disponibles
POST   /api/v1/rewards/:id/redeem        - Échanger récompense
GET    /api/v1/rewards/redeemed          - Récompenses échangées

# Guilds/Teams
POST   /api/v1/guilds                    - Créer guilde
GET    /api/v1/guilds                    - Liste guildes
GET    /api/v1/guilds/:id                - Détails guilde
PATCH  /api/v1/guilds/:id                - Modifier guilde
POST   /api/v1/guilds/:id/join           - Rejoindre guilde
POST   /api/v1/guilds/:id/leave          - Quitter guilde
GET    /api/v1/guilds/:id/members        - Membres
POST   /api/v1/guilds/:id/invite         - Inviter membre
GET    /api/v1/guilds/:id/stats          - Statistiques guilde
GET    /api/v1/guilds/:id/challenges     - Défis de guilde

# Tournaments
GET    /api/v1/tournaments               - Tournois disponibles
GET    /api/v1/tournaments/:id           - Détails tournoi
POST   /api/v1/tournaments/:id/register  - S'inscrire
GET    /api/v1/tournaments/:id/brackets  - Brackets
GET    /api/v1/tournaments/:id/matches   - Matchs
GET    /api/v1/matches/:id               - Détails match
GET    /api/v1/matches/:id/spectate      - Regarder match
```

**Frontend**:
```
/app/achievements/:id                    - Détails succès
/app/achievements/progress               - Progression globale
/app/badges/:id                          - Détails badge
/app/challenges/:id/leaderboard          - Classement défi
/app/leaderboards/:type                  - Classement spécifique
/app/points                              - Historique points
/app/rewards/:id                         - Détails récompense
/app/rewards/shop                        - Boutique récompenses
/app/guilds/:id/challenges               - Défis de guilde
/app/guilds/:id/stats                    - Stats guilde
/app/tournaments/:id                     - Détails tournoi
/app/tournaments/:id/brackets            - Brackets tournoi
/app/tournaments/:id/matches             - Matchs
```

---

### 10. Analytics & Reporting

#### ✅ Routes Existantes (Frontend)
- `/app/analytics` - Dashboard analytics
- `/app/analytics/advanced` - Analytics avancées
- `/app/weekly-bars` - Bars hebdomadaires
- `/app/scores` - Scores et heatmap
- `/app/insights` - Insights IA
- `/app/trends` - Tendances
- `/app/sessions` - Historique sessions
- `/app/sessions/:id` - Détail session
- `/reporting` - Rapports
- `/export` - Export données
- `/app/reports/weekly` - Rapport hebdo
- `/app/reports/monthly` - Rapport mensuel

#### ⚠️ API Existante (Backend)
- Edge Functions: `ai-analytics-insights`, `generate-analytics-report`, `dashboard-weekly`
- Metrics: Weekly metrics pour plusieurs modules
- ❌ **Problème**: API fragmentée, pas d'endpoint unifié

#### 🟡 Routes Manquantes (Amélioration)

**API Backend**:
```
# Analytics générales
GET    /api/v1/analytics/overview        - Vue d'ensemble
GET    /api/v1/analytics/dashboard       - Dashboard complet
GET    /api/v1/analytics/realtime        - Données temps réel
GET    /api/v1/analytics/compare         - Comparer périodes

# Analytics par module
GET    /api/v1/analytics/emotions        - Analytics émotions
GET    /api/v1/analytics/music           - Analytics musique
GET    /api/v1/analytics/journal         - Analytics journal
GET    /api/v1/analytics/vr              - Analytics VR
GET    /api/v1/analytics/coach           - Analytics coaching
GET    /api/v1/analytics/community       - Analytics communauté

# Tendances et patterns
GET    /api/v1/analytics/trends          - Tendances temporelles
GET    /api/v1/analytics/patterns        - Patterns comportementaux
GET    /api/v1/analytics/correlations    - Corrélations
GET    /api/v1/analytics/predictions     - Prédictions IA

# Rapports
GET    /api/v1/reports                   - Liste rapports
POST   /api/v1/reports/generate          - Générer rapport
GET    /api/v1/reports/:id               - Télécharger rapport
GET    /api/v1/reports/scheduled         - Rapports programmés
POST   /api/v1/reports/schedule          - Programmer rapport
DELETE /api/v1/reports/schedule/:id      - Annuler programmation

# Export
POST   /api/v1/export                    - Exporter données
GET    /api/v1/export/:id/status         - Statut export
GET    /api/v1/export/:id/download       - Télécharger export
GET    /api/v1/export/formats            - Formats disponibles

# Insights IA
GET    /api/v1/insights                  - Insights du jour
GET    /api/v1/insights/weekly           - Insights hebdo
GET    /api/v1/insights/personalized     - Insights personnalisés
POST   /api/v1/insights/feedback         - Feedback sur insight
```

**Frontend**:
```
/app/analytics/emotions                  - Analytics émotions
/app/analytics/music                     - Analytics musique
/app/analytics/compare                   - Comparaison périodes
/app/analytics/patterns                  - Patterns détectés
/app/analytics/predictions               - Prédictions
/app/reports                             - Centre des rapports
/app/reports/:id                         - Voir rapport
/app/reports/scheduled                   - Rapports programmés
/app/export/history                      - Historique exports
/app/insights/archive                    - Archive insights
```

---

### 11. Fun-First Modules

#### ✅ Routes Existantes (Frontend)
- `/app/flash-glow` - Flash Glow (boost 1-click)
- `/app/breath` - Exercices de respiration
- `/app/meditation` - Méditation guidée
- `/app/bubble-beat` - Jeu bulles musicales
- `/app/parcours-xl` - Parcours étendu
- `/app/nyvee` - Compagnon IA Nyvée
- `/app/face-ar` - Filtres AR faciaux
- `/app/screen-silk` - Pauses écran
- `/app/mood-mixer` - Mixer d'humeurs
- `/app/boss-grit` - Défis boss
- `/app/ambition-arcade` - Arcade ambition
- `/app/bounce-back` - Batailles résilience
- `/app/story-synth` - Labo de synthèse d'histoires

#### ⚠️ API Existante (Backend)
- Edge Functions: `instant-glow`, `flash-glow-metrics`, `breathing-exercises`, `bubble-sessions`, etc.
- ❌ **Problème**: Endpoints dispersés, pas de pattern unifié

#### 🟡 Routes Manquantes (Standardisation)

**API Backend** (Pattern unifié):
```
# Pour chaque module fun-first:
POST   /api/v1/modules/:module/sessions  - Créer session
GET    /api/v1/modules/:module/sessions  - Liste sessions
GET    /api/v1/modules/:module/sessions/:id - Détails session
PATCH  /api/v1/modules/:module/sessions/:id - Mettre à jour
DELETE /api/v1/modules/:module/sessions/:id - Supprimer
GET    /api/v1/modules/:module/stats     - Statistiques
GET    /api/v1/modules/:module/config    - Configuration

# Modules spécifiques:
GET    /api/v1/flash-glow/cards          - Cartes disponibles
POST   /api/v1/bubble-beat/highscore     - Enregistrer score
GET    /api/v1/bubble-beat/leaderboard   - Classement
GET    /api/v1/nyvee/conversations       - Historique Nyvée
POST   /api/v1/nyvee/message             - Parler à Nyvée
GET    /api/v1/ar-filters/available      - Filtres disponibles
POST   /api/v1/ar-filters/:id/use        - Utiliser filtre
GET    /api/v1/screen-silk/wallpapers    - Fonds d'écran
GET    /api/v1/mood-mixer/presets        - Presets d'humeur
POST   /api/v1/mood-mixer/create         - Créer mix
GET    /api/v1/parcours-xl/available     - Parcours disponibles
POST   /api/v1/parcours-xl/generate      - Générer parcours
POST   /api/v1/parcours-xl/:id/extend    - Étendre parcours
```

**Frontend**:
```
/app/flash-glow/history                  - Historique Flash Glow
/app/bubble-beat/leaderboard             - Classement Bubble Beat
/app/bubble-beat/stats                   - Statistiques
/app/nyvee/conversations                 - Conversations Nyvée
/app/ar-filters/catalog                  - Catalogue filtres AR
/app/screen-silk/gallery                 - Galerie wallpapers
/app/mood-mixer/library                  - Bibliothèque de mix
/app/parcours-xl/library                 - Bibliothèque parcours
/app/parcours-xl/:id                     - Détails parcours
```

---

### 12. B2B Enterprise Features

#### ✅ Routes Existantes (Frontend)

**Employee**:
- `/app/collab` - Dashboard employé
- `/app/teams` - Gestion d'équipe
- `/app/social` - Social B2B

**Manager/RH**:
- `/app/rh` - Dashboard RH/Manager
- `/b2b/reports` - Rapports et heatmaps
- `/app/reports` - Rapports détaillés
- `/app/reports/:period` - Rapport par période
- `/app/events` - Événements entreprise
- `/app/optimization` - Outils d'optimisation
- `/app/security` - Gestion sécurité
- `/app/audit` - Logs d'audit
- `/app/accessibility` - Conformité accessibilité

#### ⚠️ API Existante (Backend)
- Edge Functions: `team-management`, `b2b-management`, `b2b-report`, `b2b-heatmap`, `b2b-events-*`, `b2b-optimisation`, etc.
- ❌ **Problème**: API partielle, manque endpoints CRUD complets

#### 🟡 Routes Manquantes (B2B)

**API Backend**:
```
# Organizations
GET    /api/v1/b2b/organizations         - Liste organisations (admin)
POST   /api/v1/b2b/organizations         - Créer organisation
GET    /api/v1/b2b/organization          - Mon organisation
PATCH  /api/v1/b2b/organization          - Modifier organisation
GET    /api/v1/b2b/organization/stats    - Statistiques org
GET    /api/v1/b2b/organization/members  - Membres organisation

# Teams
POST   /api/v1/b2b/teams                 - Créer équipe
GET    /api/v1/b2b/teams                 - Liste équipes
GET    /api/v1/b2b/teams/:id             - Détails équipe
PATCH  /api/v1/b2b/teams/:id             - Modifier équipe
DELETE /api/v1/b2b/teams/:id             - Supprimer équipe
GET    /api/v1/b2b/teams/:id/members     - Membres équipe
POST   /api/v1/b2b/teams/:id/members     - Ajouter membre
DELETE /api/v1/b2b/teams/:id/members/:userId - Retirer membre
GET    /api/v1/b2b/teams/:id/analytics   - Analytics équipe
GET    /api/v1/b2b/teams/:id/heatmap     - Heatmap équipe

# Reports
GET    /api/v1/b2b/reports/organization  - Rapport organisation
GET    /api/v1/b2b/reports/teams         - Rapports équipes
GET    /api/v1/b2b/reports/team/:id      - Rapport équipe
GET    /api/v1/b2b/reports/export        - Export rapport
POST   /api/v1/b2b/reports/schedule      - Programmer rapport

# Events
POST   /api/v1/b2b/events                - Créer événement
GET    /api/v1/b2b/events                - Liste événements
GET    /api/v1/b2b/events/:id            - Détails événement
PATCH  /api/v1/b2b/events/:id            - Modifier événement
DELETE /api/v1/b2b/events/:id            - Supprimer événement
POST   /api/v1/b2b/events/:id/rsvp       - RSVP événement
GET    /api/v1/b2b/events/:id/attendees  - Participants
POST   /api/v1/b2b/events/:id/notify     - Notifier participants

# Permissions & Roles
GET    /api/v1/b2b/roles                 - Rôles disponibles
GET    /api/v1/b2b/members/:id/roles     - Rôles d'un membre
PATCH  /api/v1/b2b/members/:id/roles     - Modifier rôles
GET    /api/v1/b2b/permissions           - Permissions disponibles

# Audit & Security
GET    /api/v1/b2b/audit/logs            - Logs d'audit
GET    /api/v1/b2b/audit/export          - Export audit
GET    /api/v1/b2b/security/sessions     - Sessions actives
POST   /api/v1/b2b/security/revoke/:id   - Révoquer session
POST   /api/v1/b2b/security/rotate-keys  - Rotation clés
GET    /api/v1/b2b/security/alerts       - Alertes sécurité
```

**Frontend**:
```
/app/rh/teams                            - Gestion équipes
/app/rh/teams/:id                        - Détails équipe
/app/rh/teams/:id/members                - Membres équipe
/app/rh/members                          - Gestion membres
/app/rh/members/:id                      - Détails membre
/app/rh/reports/teams                    - Rapports équipes
/app/rh/reports/team/:id                 - Rapport équipe
/app/rh/analytics                        - Analytics RH
/app/events/create                       - Créer événement
/app/events/:id/edit                     - Éditer événement
/app/events/:id/attendees                - Participants
/app/security/sessions                   - Sessions actives
/app/security/alerts                     - Alertes sécurité
/app/audit/logs                          - Logs d'audit
/app/audit/export                        - Export audit
```

---

### 13. Admin & Monitoring

#### ✅ Routes Existantes (Frontend)

**GDPR & Compliance**:
- `/admin/gdpr` - Dashboard GDPR
- `/gdpr/cron-monitoring` - Monitoring GDPR
- `/gdpr/blockchain-backups` - Backups blockchain

**Monitoring**:
- `/admin/system-health` - Santé système
- `/admin/monitoring` - Monitoring complet
- `/admin/api-monitoring` - Monitoring API
- `/admin/ai-monitoring` - Monitoring IA
- `/admin/cron-monitoring` - Monitoring crons
- `/k6-analytics` - Analytics tests de charge

**Alerts**:
- `/admin/alert-config` - Configuration alertes
- `/admin/alert-analytics` - Analytics alertes
- `/admin/alert-templates` - Templates alertes
- `/admin/alert-escalation` - Règles escalade

**Reports & Analytics**:
- `/admin/scheduled-reports` - Rapports programmés
- `/admin/executive` - Dashboard exécutif
- `/admin/incidents` - Rapports incidents

**Music Management**:
- `/admin/music-queue` - File génération musique
- `/admin/music-metrics` - Métriques musique

**User Management**:
- `/admin/user-roles` - Gestion rôles
- `/admin/team-skills` - Compétences équipes

**Gamification**:
- `/admin/challenges` - Dashboard défis
- `/admin/challenges/create` - Créer défi
- `/admin/challenges/edit/:id` - Éditer défi

**System**:
- `/admin/cron-setup` - Configuration crons

#### ✅ API Existante (Backend)
- Nombreuses Edge Functions pour monitoring, alerting, GDPR, reporting
- ✅ Bonne couverture API pour l'admin

#### 🟢 Routes Manquantes (Peu, mais possibles améliorations)

**API Backend**:
```
# User Management
GET    /api/v1/admin/users               - Liste tous utilisateurs
GET    /api/v1/admin/users/:id           - Détails utilisateur
PATCH  /api/v1/admin/users/:id           - Modifier utilisateur
POST   /api/v1/admin/users/:id/suspend   - Suspendre compte
POST   /api/v1/admin/users/:id/unsuspend - Réactiver compte
DELETE /api/v1/admin/users/:id           - Supprimer compte (GDPR)
GET    /api/v1/admin/users/:id/activity  - Activité utilisateur
POST   /api/v1/admin/users/:id/impersonate - Impersonate (support)

# Content Moderation
GET    /api/v1/admin/moderation/queue    - File modération
GET    /api/v1/admin/moderation/reported - Contenus signalés
POST   /api/v1/admin/moderation/:id/approve - Approuver
POST   /api/v1/admin/moderation/:id/reject - Rejeter
POST   /api/v1/admin/moderation/:id/ban-user - Bannir auteur

# Feature Flags
GET    /api/v1/admin/features            - Feature flags
PATCH  /api/v1/admin/features/:id        - Activer/désactiver
POST   /api/v1/admin/features            - Créer feature flag
GET    /api/v1/admin/features/:id/users  - Utilisateurs affectés

# System Configuration
GET    /api/v1/admin/config              - Configuration système
PATCH  /api/v1/admin/config              - Modifier config
GET    /api/v1/admin/config/modules      - Config modules
PATCH  /api/v1/admin/config/modules/:id  - Config module

# Database Maintenance
POST   /api/v1/admin/db/vacuum           - Vacuum database
POST   /api/v1/admin/db/backup           - Backup manuel
GET    /api/v1/admin/db/backup/status    - Statut backup
POST   /api/v1/admin/db/restore          - Restore (danger!)
```

**Frontend**:
```
/admin/users                             - Gestion utilisateurs
/admin/users/:id                         - Détails utilisateur
/admin/users/:id/activity                - Activité utilisateur
/admin/moderation                        - File modération
/admin/moderation/reported               - Contenus signalés
/admin/features                          - Feature flags
/admin/features/:id                      - Config feature flag
/admin/config                            - Configuration système
/admin/config/modules                    - Config modules
/admin/db                                - Maintenance DB
/admin/db/backups                        - Gestion backups
```

---

## 🏗️ Architecture Recommendations

### 1. API Standardization

**Créer un pattern unifié pour tous les modules**:

```typescript
// Standard REST endpoints for all modules
interface StandardModuleAPI {
  // Sessions
  'POST   /api/v1/:module/sessions'
  'GET    /api/v1/:module/sessions'
  'GET    /api/v1/:module/sessions/:id'
  'PATCH  /api/v1/:module/sessions/:id'
  'DELETE /api/v1/:module/sessions/:id'

  // Stats
  'GET    /api/v1/:module/stats'
  'GET    /api/v1/:module/stats/weekly'
  'GET    /api/v1/:module/stats/monthly'

  // User data
  'GET    /api/v1/:module/history'
  'GET    /api/v1/:module/favorites'
  'POST   /api/v1/:module/favorites/:id'
  'DELETE /api/v1/:module/favorites/:id'

  // Export
  'GET    /api/v1/:module/export'
}
```

### 2. Generic Session Tracker

Créer un système générique pour éviter la duplication:

```typescript
interface GenericSession {
  id: string
  user_id: string
  module: 'scan' | 'music' | 'vr' | 'coach' | 'journal' | ...
  session_type: string
  started_at: timestamp
  ended_at?: timestamp
  duration_minutes?: number
  mood_before?: number
  mood_after?: number
  data: JSONB // Module-specific data
  metadata: JSONB
}
```

### 3. Unified Analytics Endpoint

Au lieu de multiples endpoints weekly metrics:

```typescript
// Instead of:
// /breath-weekly-metrics
// /vr-weekly-metrics
// /scan-weekly-metrics
// etc.

// Use:
GET /api/v1/analytics/:module/weekly
GET /api/v1/analytics/:module/monthly
GET /api/v1/analytics/overview // All modules
```

### 4. Type-Safe API Layer

**Recommandation**: Utiliser tRPC ou similar pour type safety:

```typescript
// Example with tRPC
const appRouter = router({
  scan: {
    create: protectedProcedure.input(z.object({...})).mutation(...),
    list: protectedProcedure.query(...),
    get: protectedProcedure.input(z.string()).query(...),
  },
  music: {
    // Same pattern...
  }
})
```

### 5. GraphQL Layer (Optional)

Pour requêtes complexes avec relations:

```graphql
query UserDashboard {
  me {
    profile { ... }
    recentScans(limit: 5) { ... }
    musicSessions(limit: 5) { ... }
    coachInsights { ... }
    achievements(unlocked: true) { ... }
  }
}
```

### 6. Bulk Operations

Ajouter endpoints bulk pour efficacité:

```
POST /api/v1/scans/batch              - Créer plusieurs scans
GET  /api/v1/sessions/bulk             - Récupérer plusieurs sessions
DELETE /api/v1/journal/bulk            - Supprimer plusieurs entrées
```

### 7. Versioning

Mettre en place versioning API:

```
/api/v1/*  - Version actuelle
/api/v2/*  - Futures évolutions
```

### 8. Rate Limiting

Implémenter rate limiting cohérent:

```typescript
// Par endpoint
{
  '/api/v1/music/generate': { limit: 10, window: '1h' },
  '/api/v1/coach/message': { limit: 100, window: '1h' },
  '/api/v1/community/posts': { limit: 20, window: '1h' },
}
```

---

## 🗂️ Database Optimization

### Issues Identifiés

1. **547 tables** - Trop de tables, consolidation nécessaire
2. **Duplication** - 5+ tables journal, 10+ tables music
3. **Naming inconsistent** - Mix plural/singular, préfixes variés
4. **Sur-normalisation** - Complexité maintenance

### Recommandations

1. **Consolidation tables similaires**:
   ```sql
   -- Au lieu de: journal_text, journal_voice, journal_text_decrypted, journal_voice_decrypted
   -- Utiliser:
   CREATE TABLE journal_entries (
     id UUID PRIMARY KEY,
     user_id UUID,
     type TEXT, -- 'text' | 'voice'
     content TEXT, -- Encrypted
     content_decrypted TEXT, -- Computed/view
     ...
   )
   ```

2. **Generic session table**:
   ```sql
   CREATE TABLE user_sessions (
     id UUID PRIMARY KEY,
     user_id UUID,
     module TEXT, -- 'scan', 'music', 'vr', 'coach', etc.
     session_data JSONB, -- Module-specific
     ...
   )
   ```

3. **Naming conventions**:
   - Toujours pluriel pour tables: `users`, `profiles`, `sessions`
   - Pas de préfixe sauf nécessaire: `music_sessions` pas `med_mng_songs`
   - Relations claires: `user_achievements` pas `user_badges`

4. **Indexes manquants**:
   - Ajouter indexes sur foreign keys
   - Indexes composites pour queries fréquentes
   - Partial indexes pour filtres communs

---

## 📊 Métriques de Succès

Pour mesurer l'amélioration après implémentation:

### Coverage API
- **Avant**: ~30% des tables ont API complète
- **Cible**: 80% des tables principales avec CRUD
- **Timeline**: 3 mois

### Performance
- **Avant**: Multiples queries pour dashboard
- **Cible**: 1 query pour dashboard (GraphQL ou aggregate)
- **Amélioration**: -70% temps de chargement

### Developer Experience
- **Avant**: Pas de type safety, API discovery difficile
- **Cible**: Type safety complète, OpenAPI/tRPC docs
- **Mesure**: Temps développement nouvelle feature -50%

### User Experience
- **Avant**: Features limitées par manque API
- **Cible**: Toutes features DB disponibles frontend
- **Mesure**: User satisfaction +30%

---

## 📅 Roadmap Implémentation

### Phase 1 (Semaine 1-2): Routes Critiques
✅ **Priorité Critique**
- [ ] API Assessment/Clinical (CRUD complet)
- [ ] API Emotion Scans (CRUD + trends)
- [ ] API Coach Sessions (CRUD + messages)
- [ ] Generic Session Tracker

### Phase 2 (Semaine 3-4): Routes Importantes
✅ **Haute Priorité**
- [ ] API Community (posts, comments, groups)
- [ ] API Goals (objectifs + wellness quests)
- [ ] API Music Sessions (CRUD + playlists)
- [ ] API VR Sessions (CRUD + experiences)

### Phase 3 (Semaine 5-6): Améliorations
✅ **Priorité Moyenne**
- [ ] API Gamification (achievements, challenges)
- [ ] API User Preferences (settings complets)
- [ ] Amélioration Journal API (update, search)
- [ ] API Analytics (unified endpoints)

### Phase 4 (Semaine 7-8): Standardisation
✅ **Architecture**
- [ ] Pattern unifié tous modules
- [ ] Type safety (tRPC ou OpenAPI)
- [ ] Bulk operations
- [ ] Rate limiting cohérent

### Phase 5 (Semaine 9-10): Optimisation
✅ **Performance**
- [ ] GraphQL layer (optional)
- [ ] Database consolidation
- [ ] Indexes optimization
- [ ] Caching strategy

### Phase 6 (Semaine 11-12): Documentation
✅ **DX & Testing**
- [ ] API documentation complète
- [ ] Integration tests
- [ ] Postman/Insomnia collection
- [ ] Developer guides

---

## 🎯 Quick Wins (Actions immédiates)

### Ce qui peut être fait aujourd'hui:

1. **Créer API Assessment** (2-3h)
   - Endpoints CRUD basiques
   - RLS déjà en place
   - Impact: Débloquer évaluations psychométriques

2. **Créer API Emotion Scans** (2-3h)
   - GET liste + détails
   - POST nouveau scan
   - Impact: Historique émotions accessible

3. **Standardiser Session Endpoints** (4-5h)
   - Pattern générique
   - Appliquer à 2-3 modules pilotes
   - Impact: Cohérence API

4. **Documentation OpenAPI** (2-3h)
   - Swagger/OpenAPI spec
   - Auto-génération depuis code
   - Impact: Discovery API facilité

---

## 📝 Conclusion

### Résumé Exécutif

La plateforme EmotionsCare dispose de:
- ✅ **Frontend riche**: 200+ routes bien structurées
- ✅ **Base de données complète**: 547 tables couvrant tous besoins
- ⚠️ **API incomplète**: Seulement ~30% des fonctionnalités exposées
- 🔴 **Gap critique**: Modules clés sans API (assessments, scans, coach, etc.)

### Impact Business

**Sans les routes manquantes**:
- ❌ Features limitées (pas d'historique, pas de CRUD)
- ❌ Expérience utilisateur dégradée
- ❌ Impossible d'exploiter pleinement les données
- ❌ Développement ralenti (contournements nécessaires)

**Avec les routes implémentées**:
- ✅ Expérience utilisateur complète
- ✅ Exploitation data maximale
- ✅ Time-to-market réduit pour nouvelles features
- ✅ Architecture scalable et maintenable

### Prochaines Étapes

1. ✅ **Valider ce rapport** avec l'équipe
2. 📋 **Prioriser** les APIs selon business value
3. 🚀 **Implémenter Phase 1** (routes critiques)
4. 📊 **Mesurer impact** (métriques définies)
5. 🔄 **Itérer** sur phases suivantes

---

**Document maintenu par**: Claude AI
**Dernière mise à jour**: 2025-11-14
**Version**: 1.0
**Statut**: ✅ Complet - Prêt pour review équipe
