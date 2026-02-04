# 📚 API Reference - EmotionsCare

> Documentation technique des APIs backend - Dernière mise à jour : 4 février 2026

---

## 🎯 Architecture Super-Routers

EmotionsCare utilise **8 super-routers** qui consolident toutes les Edge Functions en endpoints logiques.

| Router | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `router-wellness` | `/wellness/*` | Méditation, respiration, VR | ✅ |
| `router-ai` | `/ai/*` | Coach, analyse, génération | ✅ |
| `router-music` | `/music/*` | Suno, playlists, sessions | ✅ |
| `router-b2b` | `/b2b/*` | Dashboard RH, heatmaps, reports | ✅ Admin |
| `router-gdpr` | `/gdpr/*` | Export, suppression, consentement | ✅ |
| `router-community` | `/community/*` | Guildes, tournois, social | ✅ |
| `router-context-lens` | `/context-lens/*` | Visualisation médicale 3D | ✅ Pro |
| `router-system` | `/system/*` | Health check, metrics, monitoring | 🔓 Partial |

---

## 🧘 Router Wellness

### Méditation

```typescript
// Démarrer une session
POST /wellness/meditation/start
Body: { type: "guided" | "free", duration: number }
Response: { sessionId: string, startedAt: string }

// Compléter une session
POST /wellness/meditation/complete
Body: { sessionId: string, moodBefore: number, moodAfter: number }
Response: { xpEarned: number, streakUpdated: boolean }

// Statistiques
GET /wellness/meditation/stats
Response: { totalSessions: number, totalMinutes: number, currentStreak: number }
```

### Respiration

```typescript
// Templates disponibles
GET /wellness/breath/templates
Response: { templates: BreathTemplate[] }

// Session respiration
POST /wellness/breath/session
Body: { templateId: string, duration: number }
Response: { metrics: BreathMetrics }
```

### VR Thérapie

```typescript
// Templates VR
GET /wellness/vr/templates
Response: { templates: VRTemplate[] }

// Démarrer session VR
POST /wellness/vr/start
Body: { templateId: string, deviceType: "headset" | "mobile" }
Response: { sessionId: string, environmentUrl: string }

// Compléter session VR
POST /wellness/vr/complete
Body: { sessionId: string, metrics: VRMetrics }
Response: { xpEarned: number, benefits: string[] }
```

---

## 🤖 Router AI

### Coach IA (Nyvée)

```typescript
// Chat avec le coach
POST /ai/coach/chat
Body: { message: string, context?: EmotionalContext }
Response: { reply: string, suggestions?: string[], emotion?: string }

// Analyse émotionnelle
POST /ai/coach/analyze
Body: { text: string }
Response: { emotions: EmotionScore[], dominant: string, confidence: number }
```

### Analyse d'image

```typescript
POST /ai/vision/analyze
Body: { imageUrl: string, type: "emotion" | "scene" }
Response: { analysis: VisionAnalysis }
```

### Transcription audio

```typescript
POST /ai/transcribe
Body: FormData (audio file)
Response: { text: string, language: string, confidence: number }
```

---

## 🎵 Router Music

### Génération Suno

```typescript
// Générer musique thérapeutique
POST /music/generate
Body: { 
  mood: "calm" | "energetic" | "focus" | "sleep",
  duration: number,
  style?: string 
}
Response: { taskId: string, status: "pending" }

// Vérifier statut
GET /music/status/:taskId
Response: { status: string, audioUrl?: string, progress?: number }

// Callback (interne)
POST /music/callback
Body: { taskId: string, status: string, urls: string[] }
```

### Playlists

```typescript
// Liste des playlists
GET /music/playlists
Response: { playlists: Playlist[] }

// Créer playlist
POST /music/playlists
Body: { name: string, tracks: string[] }
Response: { playlistId: string }
```

---

## 🏢 Router B2B

### Dashboard RH

```typescript
// Métriques équipe
GET /b2b/team/metrics
Query: { orgId: string, period: "week" | "month" | "quarter" }
Response: { 
  engagement: number,
  wellbeingScore: number,
  activeUsers: number,
  trends: TrendData[]
}

// Heatmap émotionnel
GET /b2b/heatmap
Query: { orgId: string, startDate: string, endDate: string }
Response: { heatmap: HeatmapCell[][] }

// Export rapport
POST /b2b/report/export
Body: { orgId: string, format: "pdf" | "excel", period: string }
Response: { downloadUrl: string }
```

### Gestion équipe

```typescript
// Inviter membre
POST /b2b/team/invite
Body: { email: string, role: "member" | "manager" | "admin" }
Response: { invitationId: string }

// Accepter invitation
POST /b2b/team/accept
Body: { invitationToken: string }
Response: { success: boolean }
```

---

## 🔐 Router GDPR

### Export de données

```typescript
// Demander export
POST /gdpr/export
Body: { format: "json" | "csv", scope: "all" | "journals" | "sessions" }
Response: { requestId: string, estimatedTime: number }

// Télécharger export
GET /gdpr/export/:requestId
Response: { downloadUrl: string, expiresAt: string }
```

### Suppression de données

```typescript
// Demander suppression
POST /gdpr/delete
Body: { scope: "all" | "specific", tables?: string[] }
Response: { requestId: string, confirmation: string }

// Confirmer suppression
POST /gdpr/delete/confirm
Body: { requestId: string, confirmationCode: string }
Response: { deleted: boolean }
```

### Consentement

```typescript
// État du consentement
GET /gdpr/consent
Response: { analytics: boolean, marketing: boolean, clinical: boolean }

// Mettre à jour
POST /gdpr/consent
Body: { analytics: boolean, marketing: boolean, clinical: boolean }
Response: { updated: boolean }
```

---

## 👥 Router Community

### Guildes

```typescript
// Liste des guildes
GET /community/guilds
Response: { guilds: Guild[] }

// Rejoindre guilde
POST /community/guilds/:guildId/join
Response: { success: boolean, membershipId: string }

// Chat guilde
POST /community/guilds/:guildId/chat
Body: { message: string }
Response: { messageId: string }
```

### Tournois

```typescript
// Tournois actifs
GET /community/tournaments
Query: { status: "upcoming" | "active" | "completed" }
Response: { tournaments: Tournament[] }

// Participer
POST /community/tournaments/:tournamentId/join
Response: { participantId: string, bracket: BracketInfo }
```

---

## 🧠 Router Context-Lens

> Réservé aux utilisateurs Pro avec licence médicale

### Anatomie 3D

```typescript
// Structures anatomiques
GET /context-lens/anatomy/:scanId/structures
Response: { structures: AnatomicalStructure[] }

// Maillage 3D
GET /context-lens/anatomy/:structureId/mesh
Query: { lod: "low" | "medium" | "high" }
Response: { glTF: string }
```

### Notes cliniques

```typescript
// Ajouter note
POST /context-lens/notes
Body: { scanId: string, structureId: string, text: string }
Response: { noteId: string }
```

---

## ⚙️ Router System

### Health Check

```typescript
// Status global
GET /system/health
Response: { status: "healthy" | "degraded", services: ServiceStatus[] }

// Métriques
GET /system/metrics
Response: { cpu: number, memory: number, latency: LatencyMetrics }
```

---

## 🔑 Authentification

Toutes les requêtes authentifiées nécessitent le header :

```
Authorization: Bearer <supabase_jwt_token>
```

### Obtenir le token

```typescript
import { supabase } from '@/integrations/supabase/client';

const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;
```

---

## ⚠️ Gestion des erreurs

```typescript
// Format d'erreur standard
{
  error: {
    code: "VALIDATION_ERROR" | "AUTH_ERROR" | "RATE_LIMIT" | "SERVER_ERROR",
    message: string,
    details?: object
  }
}

// Codes HTTP
200 - Succès
400 - Erreur de validation
401 - Non authentifié
403 - Non autorisé
429 - Rate limit atteint
500 - Erreur serveur
```

---

## 📊 Rate Limiting

| Endpoint | Limite | Fenêtre |
|----------|--------|---------|
| `/ai/*` | 60 req | 1 min |
| `/music/generate` | 10 req | 1 heure |
| `/gdpr/*` | 5 req | 1 min |
| Autres | 100 req | 1 min |

---

## 🔗 Liens utiles

- [Edge Functions Dashboard](https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/functions)
- [Logs Edge Functions](https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/functions/router-wellness/logs)
- [MODULE_STATUS.md](./MODULE_STATUS.md) - État des modules

---

*Documentation générée automatiquement - EmotionsCare v2.7*
