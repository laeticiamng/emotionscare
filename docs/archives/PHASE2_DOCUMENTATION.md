# Phase 2 - Engagement : Documentation Technique

## Vue d'ensemble

La Phase 2 enrichit EmotionsCare avec 5 fonctionnalités majeures pour améliorer l'engagement des utilisateurs :

1. **Intégration musicale avancée (Suno API)**
2. **Système d'invitations social complet**
3. **Templates de journal pré-configurés**
4. **Analytics prédictives IA long-terme**
5. **Événements avec visio intégrée (Zoom/Meet)**

---

## 1. Intégration Musicale Avancée

### Fichiers créés
- `supabase/migrations/20251114_phase2_music_playlists.sql`
- `src/services/music/enhanced-music-service.ts`

### Tables de base de données

#### `music_generations`
Stocke l'historique des générations musicales avec Suno.

**Colonnes principales :**
- `user_id` : Utilisateur propriétaire
- `title`, `style`, `prompt` : Détails de la génération
- `audio_url`, `audio_id` : Liens vers la musique générée
- `status` : pending | processing | completed | failed
- `metadata` : Configuration avancée (JSONB)

#### `music_playlists`
Playlists personnalisées des utilisateurs.

**Colonnes principales :**
- `name`, `description` : Informations de la playlist
- `is_public` : Visibilité publique/privée
- `tags` : Tags pour catégorisation

#### `playlist_tracks`
Association entre playlists et morceaux.

#### `music_favorites`
Musiques favorites de l'utilisateur.

#### `music_shares`
Partage de musiques avec d'autres utilisateurs ou publiquement.

**Colonnes principales :**
- `share_token` : Token unique pour partage public
- `expires_at` : Date d'expiration du partage

### API Service

```typescript
import { enhancedMusicService } from '@/services/music/enhanced-music-service';

// Générer une musique avec tracking
const generation = await enhancedMusicService.generateMusicWithTracking({
  title: "Relaxation matinale",
  style: "ambient",
  prompt: "Une musique douce pour méditer",
  model: "chirp-v3",
  instrumental: true,
  customMode: false
});

// Créer une playlist
const playlist = await enhancedMusicService.createPlaylist(
  "Ma playlist zen",
  "Musiques pour me détendre",
  true, // publique
  ["relaxation", "meditation"]
);

// Ajouter à la playlist
await enhancedMusicService.addToPlaylist(playlist.id, generation.id);

// Ajouter aux favoris
await enhancedMusicService.addToFavorites(generation.id);

// Partager publiquement
const share = await enhancedMusicService.shareMusic(generation.id, {
  isPublic: true,
  expiresInDays: 30,
  message: "Écoutez cette musique apaisante !"
});
```

---

## 2. Système d'Invitations Social

### Fichiers créés
- `supabase/migrations/20251114_phase2_social_invitations.sql`
- `src/services/social/invitations-service.ts`

### Tables de base de données

#### `user_profiles`
Profils publics des utilisateurs.

**Colonnes principales :**
- `display_name`, `avatar_url`, `bio`
- `is_public` : Profil visible publiquement
- `show_activity` : Afficher les activités dans le feed

#### `friendships`
Relations d'amitié bidirectionnelles.

**Statuts :** active | blocked

#### `friend_invitations`
Invitations d'amis.

**Statuts :** pending | accepted | rejected | cancelled

#### `friend_suggestions`
Suggestions d'amis basées sur des algorithmes.

**Colonnes principales :**
- `reason` : mutual_friends | similar_interests | location
- `score` : Score de pertinence (0-1)

#### `social_activities`
Feed d'activités sociales.

**Types :** achievement | music_share | journal_milestone | streak | badge | level_up

#### `social_notifications`
Notifications sociales.

**Types :** friend_request | friend_accept | mention | comment | like | share

### API Service

```typescript
import { invitationsService } from '@/services/social/invitations-service';

// Rechercher des utilisateurs
const users = await invitationsService.searchUsers("Sophie");

// Envoyer une invitation
await invitationsService.sendFriendInvitation(
  userId,
  "J'aimerais te rejoindre sur EmotionsCare !"
);

// Récupérer les invitations reçues
const invitations = await invitationsService.getReceivedInvitations();

// Accepter une invitation
await invitationsService.acceptFriendInvitation(invitationId);

// Récupérer mes amis
const friends = await invitationsService.getFriends();

// Créer une activité sociale
await invitationsService.createActivity(
  'music_share',
  { musicId: '...', title: 'Ma nouvelle création' },
  true // public
);

// Récupérer le feed
const feed = await invitationsService.getActivityFeed(20);
```

---

## 3. Templates de Journal

### Fichiers créés
- `supabase/migrations/20251114_phase2_journal_templates.sql`
- `src/services/journal/journal-templates-service.ts`

### Templates pré-configurés

1. **Gratitude Quotidienne** 🙏
2. **Suivi de Humeur** 😊
3. **Objectifs et Intentions** 🎯
4. **Réflexion du Soir** 🌙
5. **Bien-être Global** 💪
6. **Méditation et Pleine Conscience** 🧘

### Tables de base de données

#### `journal_templates`
Templates système et personnalisés.

**Types de prompts :**
- `text`, `textarea` : Questions ouvertes
- `number`, `slider` : Valeurs numériques
- `mood_scale` : Échelle d'humeur 1-10
- `yes_no` : Question binaire
- `select`, `multi_choice` : Choix multiples
- `checklist` : Liste de tâches

#### `journal_template_entries`
Entrées basées sur des templates.

**Colonnes principales :**
- `responses` : Réponses aux prompts (JSONB)
- `completion_percentage` : Taux de complétion
- `mood_score` : Score d'humeur global

#### `journal_habits`
Suivi des habitudes de journaling.

**Colonnes principales :**
- `frequency` : daily | weekly | monthly | custom
- `current_streak` : Série actuelle
- `longest_streak` : Meilleure série
- `reminder_enabled` : Activer les rappels

### API Service

```typescript
import { journalTemplatesService } from '@/services/journal/journal-templates-service';

// Récupérer tous les templates
const templates = await journalTemplatesService.getTemplates();

// Récupérer un template par slug
const template = await journalTemplatesService.getTemplateBySlug('daily-gratitude');

// Créer une entrée
await journalTemplatesService.createTemplateEntry(
  template.id,
  {
    q1: "Je suis reconnaissant pour ma famille",
    q2: "Mon collègue Jean",
    q3: "Le soleil ce matin"
  },
  8 // mood score
);

// Créer une habitude
const habit = await journalTemplatesService.createHabit(
  template.id,
  'daily',
  {
    preferredTime: '08:00',
    reminderEnabled: true
  }
);

// Récupérer les statistiques
const stats = await journalTemplatesService.getJournalingStats();
// { totalEntries, currentStreak, longestStreak, favoriteTemplate, completionRate }
```

---

## 4. Analytics Prédictives IA

### Fichiers créés
- `src/services/analytics/predictive-analytics-service.ts`

### Fonctionnalités

#### Analyse des tendances émotionnelles
- Extraction de patterns hebdomadaires et mensuels
- Calcul de moyennes mobiles
- Détection de tendances (amélioration/déclin)

#### Prédictions à 7 jours
- Prédiction des scores émotionnels futurs
- Niveau de confiance décroissant
- Identification des facteurs influents

#### Détection de risques
- **Déclin d'humeur** : Score < 40 prolongé
- **Stress accumulé** : Variance émotionnelle élevée
- **Alertes préventives** : Prédiction de baisses futures

#### Projection de bien-être
- Tendance globale : improving | stable | declining
- Score projeté à 1 mois
- Facteurs clés avec impact quantifié

### API Service

```typescript
import { predictiveAnalyticsService } from '@/services/analytics/predictive-analytics-service';

// Générer une analyse complète
const analysis = await predictiveAnalyticsService.generatePredictiveAnalysis(3); // 3 mois

console.log(analysis.emotionTrends); // Historique
console.log(analysis.predictions); // Prédictions 7 jours
console.log(analysis.patterns); // Patterns identifiés
console.log(analysis.riskAlerts); // Alertes de risque
console.log(analysis.wellnessProjection); // Projection bien-être

// Obtenir des recommandations personnalisées
const recommendations = await predictiveAnalyticsService.getPersonalizedRecommendations();
console.log(recommendations.immediate); // Actions immédiates
console.log(recommendations.shortTerm); // Court terme (1-2 semaines)
console.log(recommendations.longTerm); // Long terme (1-3 mois)

// Générer un rapport pour RH/coach
const report = await predictiveAnalyticsService.generateAnalyticsReport();
```

### Algorithmes utilisés

1. **Régression linéaire simple** : Calcul de tendances
2. **Moyenne mobile** : Lissage des données
3. **Analyse de variance** : Détection d'instabilité émotionnelle
4. **Détection de patterns** : Analyse jour de semaine, période du mois
5. **Scoring multi-facteurs** : Projection de bien-être

---

## 5. Événements avec Visio

### Fichiers créés
- `supabase/migrations/20251114_phase2_virtual_events.sql`
- `src/services/events/virtual-events-service.ts`
- `supabase/functions/create-zoom-meeting/index.ts`
- `supabase/functions/create-google-meet/index.ts`

### Tables de base de données

#### `virtual_events`
Événements virtuels.

**Types d'événements :**
- therapy, meditation, workshop, support_group, coaching, webinar, other

**Plateformes supportées :**
- Zoom, Google Meet, Teams, Custom

**Statuts :** scheduled | live | completed | cancelled

#### `event_participants`
Participants aux événements.

**Statuts :** registered | approved | declined | attended | cancelled

#### `event_reminders`
Rappels pour les événements.

**Types :** email | notification | sms

#### `event_resources`
Ressources et enregistrements.

**Types :** document | video | audio | link | other

#### `event_series`
Événements récurrents (format iCal RRULE).

### Configuration requise

#### Variables d'environnement - Zoom

```env
ZOOM_ACCOUNT_ID=your_account_id
ZOOM_CLIENT_ID=your_client_id
ZOOM_CLIENT_SECRET=your_client_secret
```

**Obtenir les credentials :**
1. Créer une app "Server-to-Server OAuth" sur [Zoom Marketplace](https://marketplace.zoom.us/)
2. Récupérer Account ID, Client ID, Client Secret
3. Activer les scopes : `meeting:write`, `meeting:read`

#### Variables d'environnement - Google Meet

```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REFRESH_TOKEN=your_refresh_token
```

**Obtenir les credentials :**
1. Créer un projet sur [Google Cloud Console](https://console.cloud.google.com/)
2. Activer Google Calendar API
3. Créer des credentials OAuth 2.0
4. Générer un refresh token avec scope `https://www.googleapis.com/auth/calendar`

### API Service

```typescript
import { virtualEventsService } from '@/services/events/virtual-events-service';

// Créer un événement Zoom
const event = await virtualEventsService.createEvent({
  title: "Méditation guidée du matin",
  description: "Session de méditation collective",
  eventType: "meditation",
  startTime: "2025-11-20T08:00:00Z",
  endTime: "2025-11-20T09:00:00Z",
  timezone: "Europe/Paris",
  platform: "zoom",
  maxParticipants: 30,
  requireApproval: false,
  isPublic: true,
  tags: ["méditation", "bien-être"],
  recordingAvailable: false
});
// Zoom meeting créé automatiquement, meeting_url rempli

// S'inscrire à un événement
await virtualEventsService.registerForEvent(event.id);

// Créer un rappel (15 min avant)
await virtualEventsService.createReminder(event.id, 15, 'notification');

// Marquer sa présence
await virtualEventsService.markAttendance(event.id);

// Ajouter une ressource après l'événement
await virtualEventsService.addResource(event.id, {
  title: "Slides de la session",
  resourceType: "document",
  url: "https://...",
  isPublic: true
});

// Récupérer les événements à venir
const upcoming = await virtualEventsService.getUpcomingEvents();

// Récupérer mes événements
const myEvents = await virtualEventsService.getMyRegisteredEvents();
```

---

## Déploiement

### 1. Appliquer les migrations

```bash
# En local
supabase db reset

# En production
supabase db push
```

### 2. Déployer les edge functions

```bash
supabase functions deploy create-zoom-meeting
supabase functions deploy create-google-meet
```

### 3. Configurer les secrets

```bash
# Zoom
supabase secrets set ZOOM_ACCOUNT_ID=xxx
supabase secrets set ZOOM_CLIENT_ID=xxx
supabase secrets set ZOOM_CLIENT_SECRET=xxx

# Google
supabase secrets set GOOGLE_CLIENT_ID=xxx
supabase secrets set GOOGLE_CLIENT_SECRET=xxx
supabase secrets set GOOGLE_REFRESH_TOKEN=xxx
```

### 4. Variables d'environnement frontend

Ajouter au fichier `.env` :

```env
VITE_ZOOM_API_KEY=xxx
VITE_ZOOM_API_SECRET=xxx
VITE_GOOGLE_CLIENT_ID=xxx
```

---

## Tests

### Musique

```typescript
// Test création playlist
const playlist = await enhancedMusicService.createPlaylist("Test", "Description");
console.assert(playlist.id !== null);

// Test ajout favori
await enhancedMusicService.addToFavorites(musicId);
const favorites = await enhancedMusicService.getFavorites();
console.assert(favorites.length > 0);
```

### Social

```typescript
// Test invitation
await invitationsService.sendFriendInvitation(friendId, "Hello!");
const invitations = await invitationsService.getSentInvitations();
console.assert(invitations.length === 1);
```

### Journal

```typescript
// Test création template entry
const entry = await journalTemplatesService.createTemplateEntry(
  templateId,
  { q1: "Test" }
);
console.assert(entry.completionPercentage > 0);
```

### Analytics

```typescript
// Test analyse prédictive
const analysis = await predictiveAnalyticsService.generatePredictiveAnalysis();
console.assert(analysis.predictions.length > 0);
console.assert(analysis.wellnessProjection.overallTrend !== null);
```

### Événements

```typescript
// Test création événement
const event = await virtualEventsService.createEvent({
  title: "Test Event",
  eventType: "meditation",
  startTime: new Date(Date.now() + 86400000).toISOString(),
  endTime: new Date(Date.now() + 90000000).toISOString(),
  timezone: "UTC",
  platform: "zoom",
  requireApproval: false,
  isPublic: true,
  tags: []
});
console.assert(event.meetingUrl !== null);
```

---

## Prochaines étapes

### UI/UX à créer

1. **Pages de gestion des playlists musicales**
2. **Interface de recherche et ajout d'amis**
3. **Formulaires pour templates de journal**
4. **Dashboard analytics avec graphiques**
5. **Calendrier et liste d'événements**

### Optimisations futures

1. **Cache** : Redis pour suggestions d'amis
2. **Real-time** : WebSockets pour notifications sociales
3. **ML avancé** : Modèles prédictifs plus sophistiqués
4. **Stockage** : S3 pour enregistrements vidéo
5. **Scheduling** : Cron jobs pour rappels automatiques

---

## Support

Pour toute question ou problème :
- Consulter les logs Supabase : `supabase functions logs`
- Vérifier les RLS policies
- Tester les edge functions en local : `supabase functions serve`

---

**Auteur :** Claude
**Date :** 14 novembre 2025
**Version :** 1.0
