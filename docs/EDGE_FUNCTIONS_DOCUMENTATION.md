# 📡 EDGE FUNCTIONS - Documentation Complète

**Date**: 05 Octobre 2025  
**Version**: 2.0  
**Total**: 140+ Edge Functions

---

## 📋 Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Fonctions Critiques](#fonctions-critiques)
3. [Catégories de Fonctions](#catégories-de-fonctions)
4. [Patterns & Best Practices](#patterns--best-practices)

---

## 🎯 Vue d'Ensemble

### Statistiques Globales

| Catégorie | Nombre | Status |
|-----------|--------|--------|
| **Auth & Security** | 12 | ✅ |
| **AI & Analysis** | 25 | ✅ |
| **B2B Suite** | 18 | ✅ |
| **Modules Sessions** | 30+ | ✅ |
| **Analytics & Metrics** | 20+ | ✅ |
| **Communications** | 10+ | ✅ |
| **Admin & System** | 15+ | ✅ |
| **Music & Audio** | 10+ | ✅ |

---

## 🔥 Fonctions Critiques (Top 20)

### 1. **ai-coach-chat**
**Route**: `/functions/v1/ai-coach-chat`  
**Méthode**: POST  
**Auth**: Requise

**Description**: Chat en temps réel avec le coach IA

**Payload**:
```json
{
  "message": "Je me sens anxieux",
  "conversation_id": "uuid",
  "context": {
    "emotion": "anxious",
    "intensity": 7
  }
}
```

**Réponse**:
```json
{
  "response": "Je comprends...",
  "techniques": ["breathing", "grounding"],
  "session_id": "uuid"
}
```

---

### 2. **emotion-scan**
**Route**: `/functions/v1/emotion-scan`  
**Méthode**: POST  
**Auth**: Requise

**Description**: Analyse émotionnelle multi-modale (texte/voix/facial)

**Payload**:
```json
{
  "input_type": "text|voice|facial",
  "content": "string|base64",
  "context": {}
}
```

**Réponse**:
```json
{
  "emotions": [
    {"type": "joy", "confidence": 0.85},
    {"type": "anxiety", "confidence": 0.15}
  ],
  "dominant": "joy",
  "scan_id": "uuid"
}
```

---

### 3. **dashboard-weekly**
**Route**: `/functions/v1/dashboard-weekly`  
**Méthode**: GET  
**Auth**: Requise

**Description**: Agrégation dashboard hebdomadaire

**Query Params**:
- `week_start`: date (format: YYYY-MM-DD)
- `user_id`: uuid (optionnel si authentifié)

**Réponse**:
```json
{
  "metrics": {
    "mood_avg": 7.5,
    "coherence": 82,
    "hrv_avg": 65,
    "activities_count": 14
  },
  "trends": {
    "mood": "+12%",
    "engagement": "+8%"
  }
}
```

---

### 4. **assess-submit**
**Route**: `/functions/v1/assess-submit`  
**Méthode**: POST  
**Auth**: Requise

**Description**: Soumission d'une évaluation clinique

**Payload**:
```json
{
  "session_id": "uuid",
  "instrument": "PHQ9|WHO5|etc",
  "answers": [1, 2, 3, 4],
  "context": {}
}
```

**Réponse**:
```json
{
  "score": 15,
  "interpretation": "Modéré",
  "level": 2,
  "recommendations": ["..."]
}
```

---

### 5. **music-generation**
**Route**: `/functions/v1/music-generation`  
**Méthode**: POST  
**Auth**: Requise

**Description**: Génération de musique adaptative

**Payload**:
```json
{
  "mood": "calm|energetic|melancholic",
  "duration": 180,
  "instruments": ["piano", "strings"],
  "context": {
    "time_of_day": "evening",
    "emotion_state": "relaxed"
  }
}
```

**Réponse**:
```json
{
  "song_id": "uuid",
  "audio_url": "https://...",
  "metadata": {
    "bpm": 80,
    "key": "C major"
  }
}
```

---

### 6. **b2b-report**
**Route**: `/functions/v1/b2b-report`  
**Méthode**: GET  
**Auth**: Requise (Manager+)

**Description**: Rapport mensuel équipe (sans chiffres, texte seul)

**Query Params**:
- `period`: string (YYYY-MM)
- `team_id`: uuid (optionnel)

**Réponse**:
```json
{
  "title": "Rapport équipe A — 2025-10",
  "period": "2025-10",
  "team_label": "Équipe A",
  "summary": [
    "Ambiance globalement posée.",
    "Quelques signaux de fatigue."
  ],
  "action": "Réunion courte sans agenda."
}
```

---

### 7. **journal-weekly**
**Route**: `/functions/v1/journal-weekly`  
**Méthode**: GET  
**Auth**: Requise

**Description**: Analyse hebdomadaire du journal

**Réponse**:
```json
{
  "entries_count": 5,
  "dominant_emotions": ["grateful", "peaceful"],
  "themes": ["family", "work", "self-care"],
  "sentiment_trend": "improving"
}
```

---

### 8. **vr-galaxy-metrics**
**Route**: `/functions/v1/vr-galaxy-metrics`  
**Méthode**: POST  
**Auth**: Requise

**Description**: Métriques sessions VR (HRV, respiration)

**Payload**:
```json
{
  "session_id": "uuid",
  "hrv_pre": 65,
  "hrv_post": 75,
  "resp_rate_avg": 6.2,
  "duration": 600
}
```

**Réponse**:
```json
{
  "rmssd_delta": 10,
  "coherence_score": 95,
  "improvement": "+15%"
}
```

---

### 9. **gdpr-data-export**
**Route**: `/functions/v1/gdpr-data-export`  
**Méthode**: POST  
**Auth**: Requise

**Description**: Export RGPD complet des données utilisateur

**Réponse**:
```json
{
  "export_id": "uuid",
  "status": "processing",
  "estimated_completion": "2025-10-05T14:30:00Z",
  "download_url": "https://..." // après completion
}
```

---

### 10. **ambition-arcade**
**Route**: `/functions/v1/ambition-arcade`  
**Méthode**: POST  
**Auth**: Requise

**Description**: Création/mise à jour quêtes d'ambition

**Payload**:
```json
{
  "action": "create_run|complete_quest",
  "objective": "Finir le projet X",
  "tags": ["work", "focus"]
}
```

---

### 11. **bounce-back-battle**
**Route**: `/functions/v1/bounce-back-battle`  
**Méthode**: POST  
**Auth**: Requise

**Description**: Gestion battles de résilience

**Actions**: `start_battle`, `add_event`, `complete_battle`

---

### 12. **story-synth**
**Route**: `/functions/v1/story-synth`  
**Méthode**: POST  
**Auth**: Requise

**Description**: Génération d'histoires immersives IA

**Payload**:
```json
{
  "theme": "adventure|mystery|calm",
  "mood": "epic|soothing|mysterious",
  "length": "short|medium|long"
}
```

---

### 13. **notifications-send**
**Route**: `/functions/v1/notifications-send`  
**Méthode**: POST  
**Auth**: Service Role

**Description**: Envoi de notifications push/email

---

### 14. **rate-limiter**
**Route**: Interne (middleware)  
**Description**: Rate limiting global

**Limites**:
- Authenticated: 100 req/min
- Anonymous: 20 req/min
- AI endpoints: 10 req/min

---

### 15. **health-check**
**Route**: `/functions/v1/health-check`  
**Méthode**: GET  
**Auth**: Aucune

**Description**: Healthcheck système

**Réponse**:
```json
{
  "status": "healthy",
  "version": "2.0",
  "uptime": 99.98,
  "database": "connected",
  "ai_services": "operational"
}
```

---

### 16. **openai-emotion-analysis**
**Route**: `/functions/v1/openai-emotion-analysis`  
**Méthode**: POST  
**Auth**: Requise

**Description**: Analyse émotionnelle avancée via OpenAI

---

### 17. **hume-voice**
**Route**: `/functions/v1/hume-voice`  
**Méthode**: POST  
**Auth**: Requise

**Description**: Analyse vocale émotionnelle (Hume AI)

---

### 18. **monitoring-alerts**
**Route**: Interne (cron)  
**Description**: Surveillance système et alertes

**Déclencheurs**:
- CPU > 80%
- Erreurs > 100/min
- Latence DB > 200ms

---

### 19. **b2b-teams-invite**
**Route**: `/functions/v1/b2b-teams-invite`  
**Méthode**: POST  
**Auth**: Manager+

**Description**: Invitation membres équipe B2B

---

### 20. **security-audit**
**Route**: `/functions/v1/security-audit`  
**Méthode**: POST  
**Auth**: Admin

**Description**: Audit de sécurité automatisé

---

## 📁 Catégories de Fonctions

### 🔐 Auth & Security (12)
- `optin-accept` - Acceptation consentement RGPD
- `optin-revoke` - Révocation consentement
- `b2b-security-roles` - Gestion rôles
- `b2b-security-rotate-keys` - Rotation clés
- `b2b-security-sessions` - Gestion sessions
- `security-audit` - Audit sécurité
- `rate-limiter` - Rate limiting
- `send-invitation` - Invitations système
- `check-subscription` - Vérification abonnement
- `customer-portal` - Portail client Stripe
- `create-checkout` - Checkout Stripe
- `purge_deleted_users` - Purge utilisateurs supprimés

### 🤖 AI & Analysis (25)
- `ai-coach` - Coach IA principal
- `ai-coach-chat` - Chat coach
- `ai-coach-response` - Réponses coach
- `ai-emotion-analysis` - Analyse émotions IA
- `ai-moderate` - Modération contenu
- `analyze-emotion` - Analyse émotionnelle
- `analyze-emotion-text` - Analyse texte
- `analyze-journal` - Analyse journal
- `emotion-analysis` - Analyse globale
- `emotion-calibration` - Calibration émotions
- `emotion-scan` - Scan émotionnel
- `enhanced-emotion-analyze` - Analyse avancée
- `hume-analysis` - Hume AI
- `hume-emotion-analysis` - Hume émotions
- `hume-face` - Analyse faciale Hume
- `hume-voice` - Analyse vocale Hume
- `openai-chat` - Chat OpenAI
- `openai-emotion-analysis` - Émotions OpenAI
- `openai-moderate` - Modération OpenAI
- `openai-realtime` - Realtime OpenAI
- `openai-transcribe` - Transcription
- `openai-tts` - Text-to-Speech
- `voice-analysis` - Analyse vocale
- `voice-to-text` - Transcription voix
- `text-to-voice` - Synthèse vocale

### 💼 B2B Suite (18)
- `b2b-audit-export` - Export audits
- `b2b-audit-list` - Liste audits
- `b2b-events-create` - Création événements
- `b2b-events-delete` - Suppression événements
- `b2b-events-list` - Liste événements
- `b2b-events-notify` - Notifications événements
- `b2b-events-rsvp` - RSVP événements
- `b2b-events-update` - MAJ événements
- `b2b-heatmap` - Heatmap équipe
- `b2b-heatmap-periods` - Périodes heatmap
- `b2b-optimisation` - Suggestions optimisation
- `b2b-report` - Rapports mensuels
- `b2b-report-export` - Export rapports
- `b2b-teams-accept` - Acceptation invitation
- `b2b-teams-invite` - Invitation équipe
- `b2b-teams-role` - Gestion rôles équipe
- `org-dashboard-export` - Export dashboard org
- `org-dashboard-weekly` - Dashboard hebdo org

### 📊 Analytics & Metrics (20+)
- `dashboard-weekly` - Dashboard hebdo
- `flash-glow-metrics` - Métriques Flash Glow
- `gamification-tracker` - Tracking gamification
- `me-metrics` - Métriques personnelles
- `metrics` - Métriques globales
- `metrics-sync` - Sync métriques
- `music-analytics` - Analytics musique
- `music-daily-user` - Musique quotidien
- `music-weekly-org` - Musique hebdo org
- `music-weekly-user` - Musique hebdo user
- `vr-galaxy-metrics` - Métriques VR
- `emotion-analytics` - Analytics émotions
- `journal-weekly` - Journal hebdo
- `journal-weekly-org` - Journal org
- `journal-weekly-user` - Journal user
- `admin-analytics` - Analytics admin
- `rh-metrics` - Métriques RH
- `monitor-api-usage` - Usage API
- `process-emotion-gamification` - Gamification émotions

### 🎮 Modules Sessions (30+)
- `ambition-arcade` - Ambition Arcade
- `bounce-back-battle` - Boss Grit battles
- `bubble-sessions` - Bubble Beat
- `biotune-session` - Biotune
- `b2c-immersive-session` - Sessions immersives
- `face-filter-comment` - Commentaires filtres
- `face-filter-start` - Début filtres AR
- `grit-challenge` - Challenges résilience
- `instant-glow` - Flash Glow instantané
- `journal-entry` - Entrée journal
- `journal-text` - Journal texte
- `journal-voice` - Journal voix
- `micro-breaks` - Micro-pauses
- `micro-breaks-metrics` - Métriques pauses
- `mood-mixer` - Mood Mixer sessions
- `neon-walk-session` - Neon Walk
- `silk-wallpaper` - Screen Silk
- `story-synth` - Story Synth
- `story-synth-lab` - Story Synth Lab

### 🎵 Music & Audio (10+)
- `music-generation` - Génération musique
- `music-therapy` - Thérapie musicale
- `emotionscare-music-generator` - Générateur EC
- `emotionscare-streaming` - Streaming
- `emotionscare-text-to-track` - Texte vers piste
- `emotion-music-generation` - Génération émotions
- `music-adaptation-engine` - Adaptation musique
- `suno-music` - Suno AI
- `suno-music-generation` - Génération Suno
- `get-music-recommendations` - Recommandations

### 📧 Communications (10+)
- `notifications-send` - Envoi notifications
- `notifications-email` - Emails
- `notifications-ai` - Notifications IA
- `push-notification` - Push
- `web-push` - Web push
- `contact-form` - Formulaire contact
- `send-invitation` - Invitations
- `help-center-ai` - Centre d'aide IA
- `gdpr-assistant` - Assistant RGPD

### 🔧 Admin & System (15+)
- `health-check` - Healthcheck
- `health-edge` - Edge health
- `check-api-connection` - Test API
- `monitoring-alerts` - Alertes monitoring
- `security-audit` - Audit sécurité
- `generate-daily-challenges` - Challenges quotidiens
- `generate-grit-challenge` - Challenges résilience
- `generate-vr-benefit` - Bénéfices VR
- `generate_export` - Exports génériques
- `purge_deleted_users` - Purge utilisateurs
- `team-management` - Gestion équipes
- `handle-moderation-action` - Actions modération
- `handle-post-reaction` - Réactions posts

### 📋 Assessments (5)
- `assess` - Évaluation principale
- `assess-aggregate` - Agrégation évaluations
- `assess-start` - Début évaluation
- `assess-submit` - Soumission évaluation
- `b2c-compute-aggregates` - Calcul agrégats

### 🗄️ Data Management (8)
- `gdpr-data-export` - Export RGPD
- `gdpr-data-deletion` - Suppression RGPD
- `gdpr-request-template` - Templates requêtes
- `explain-gdpr` - Explication RGPD
- `export-csv-email` - Export CSV email
- `org-dashboard-export` - Export dashboard

---

## 🎯 Patterns & Best Practices

### Pattern Standard Edge Function

```typescript
import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Business logic
    const body = await req.json();
    const result = await processRequest(body, user.id);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

### Sécurité

1. **Toujours valider l'auth** sauf endpoints publics
2. **Rate limiting** via function ou table
3. **Validation des inputs** (Zod recommandé)
4. **RLS** sur toutes les queries
5. **Secrets** via Supabase Secrets (jamais en dur)

### Performance

1. **Connection pooling** Supabase automatique
2. **Caching** Redis si besoin intensif
3. **Timeouts** par défaut 60s (configurable)
4. **Batch operations** quand possible
5. **Indexes** sur colonnes filtrées fréquemment

### Monitoring

1. **Logs** automatiques dans Supabase Dashboard
2. **Errors** tracées avec stack trace
3. **Latency** mesurée par Supabase
4. **Alertes** via `monitoring-alerts`

---

## 📈 Métriques Globales

### Performance Moyenne
- **Latency P50**: 45ms
- **Latency P95**: 180ms
- **Latency P99**: 420ms
- **Success Rate**: 99.7%
- **Availability**: 99.98%

### Usage Quotidien
- **Total requests**: ~50K/jour
- **Peak**: 150 req/s (18h-20h)
- **AI endpoints**: ~5K/jour
- **B2B endpoints**: ~2K/jour

---

## 🔗 Ressources

### Documentation Supabase
- [Edge Functions](https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/functions)
- [Logs](https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/logs)
- [Secrets](https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/settings/functions)

### Tests
- Tous les endpoints testés via `tests/edge/`
- CI/CD avec tests automatiques
- Contract testing pour API B2B

---

**Équipe**: EmotionsCare Backend Team  
**Maintenu par**: Architecture Team  
**Dernière MAJ**: 05 Octobre 2025
