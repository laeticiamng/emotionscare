# ⚡ Edge Functions - Documentation

## 📋 Vue d'ensemble

26 Edge Functions Supabase pour la logique backend et intégrations externes.

## 🗂️ Catégories

### 🤖 IA & OpenAI (10 fonctions)
Edge functions utilisant les modèles OpenAI pour diverses fonctionnalités IA.

#### `openai-chat`
Chat conversationnel avec GPT-5.

**Endpoint**: `POST /openai-chat`

**Body:**
```json
{
  "messages": [
    { "role": "user", "content": "Bonjour" }
  ]
}
```

**Response:**
```json
{
  "response": "Réponse du modèle GPT-5"
}
```

**Modèle**: `gpt-5-2025-08-07` (flagship)

---

#### `openai-moderate`
Modération de contenu via OpenAI Moderation API.

**Endpoint**: `POST /openai-moderate`

**Body:**
```json
{
  "input": "Texte à modérer"
}
```

**Response:**
```json
{
  "flagged": false,
  "categories": { "hate": false, "violence": false, ... },
  "category_scores": { "hate": 0.001, ... }
}
```

---

#### `openai-transcribe`
Transcription audio via Whisper-1.

**Endpoint**: `POST /openai-transcribe`

**Body**: `multipart/form-data` avec fichier audio

**Response:**
```json
{
  "text": "Transcription du fichier audio",
  "language": "fr"
}
```

**Formats supportés**: mp3, mp4, wav, webm (max 25MB)

---

#### `openai-embeddings`
Génération d'embeddings textuels.

**Endpoint**: `POST /openai-embeddings`

**Body:**
```json
{
  "input": "Texte à encoder",
  "model": "text-embedding-3-small"
}
```

**Response:**
```json
{
  "embedding": [0.123, -0.456, ...],
  "usage": { "prompt_tokens": 10, "total_tokens": 10 }
}
```

---

#### `openai-tts`
Text-to-Speech avec OpenAI TTS.

**Endpoint**: `POST /openai-tts`

**Body:**
```json
{
  "text": "Texte à synthétiser",
  "voice": "alloy",
  "model": "tts-1"
}
```

**Response:**
```json
{
  "audioContent": "base64_encoded_mp3"
}
```

**Voix disponibles**: alloy, echo, fable, onyx, nova, shimmer

---

#### `analyze-emotion-text`
Analyse émotionnelle de texte via GPT-4.1.

**Endpoint**: `POST /analyze-emotion-text`

**Body:**
```json
{
  "text": "Je me sens bien aujourd'hui"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "emotions": [
      { "name": "joie", "intensity": 0.8 }
    ],
    "sentiment": "positif",
    "confidence": 0.9,
    "suggestions": ["Continuer ces pratiques positives"]
  },
  "timestamp": "2025-01-20T10:00:00Z"
}
```

---

#### `ai-coach-chat`
Coach IA de bien-être conversationnel.

**Endpoint**: `POST /ai-coach-chat`

**Body:**
```json
{
  "message": "Je me sens stressé",
  "conversationHistory": [
    { "sender": "user", "text": "Message précédent" }
  ],
  "userId": "uuid"
}
```

**Response:**
```json
{
  "response": "Réponse empathique du coach avec conseils pratiques"
}
```

**Modèle**: `gpt-4.1-2025-04-14`

---

#### `chat-coach`
Variante du coach IA avec historique étendu.

**Endpoint**: `POST /chat-coach`

**Body:**
```json
{
  "message": "Besoin de motivation",
  "history": [
    { "sender": "user", "content": "..." },
    { "sender": "assistant", "content": "..." }
  ]
}
```

---

#### `chat-with-ai`
Chat généraliste avec contexte utilisateur.

**Endpoint**: `POST /chat-with-ai`

**Body:**
```json
{
  "message": "Question générale",
  "conversationHistory": [],
  "userContext": "Utilisateur B2C cherchant du soutien"
}
```

---

#### `text-to-voice`
Synthèse vocale avec authentification obligatoire.

**Endpoint**: `POST /text-to-voice`

**Auth**: Bearer token requis

**Body:**
```json
{
  "text": "Texte à synthétiser",
  "voice": "alloy"
}
```

---

### 📊 Analytics & Metrics (4 fonctions)

#### `metrics`
Récupération de métriques utilisateur.

**Endpoint**: `GET /metrics?userId={uuid}&period={week|month|year}`

**Response:**
```json
{
  "emotionTrends": [...],
  "wellbeingScore": 7.5,
  "activityCount": 42
}
```

---

### 👥 Auth & Users (5 fonctions)

#### `team-management`
Gestion d'équipes B2B.

**Endpoint**: `POST /team-management`

**Actions:**
- `create_team` - Créer équipe
- `add_member` - Ajouter membre
- `remove_member` - Retirer membre
- `update_role` - Modifier rôle

**Body exemple:**
```json
{
  "action": "create_team",
  "teamName": "Équipe Marketing",
  "orgId": "uuid"
}
```

---

### 🔔 Notifications (3 fonctions)

#### `notifications-send`
Envoi de notifications push/email.

**Endpoint**: `POST /notifications-send`

**Body:**
```json
{
  "userId": "uuid",
  "type": "push",
  "title": "Rappel",
  "message": "N'oubliez pas votre check-in quotidien",
  "data": { "action": "open_checkin" }
}
```

---

#### `web-push`
Notifications push web (PWA).

**Endpoint**: `POST /web-push`

**Body:**
```json
{
  "subscription": {...},
  "payload": {
    "title": "Notification",
    "body": "Message",
    "icon": "/icon.png"
  }
}
```

---

### 🎵 Music & Media (1 fonction)

#### `suno-music-generation`
Génération musicale via Suno API.

**Endpoint**: `POST /suno-music-generation`

**Body:**
```json
{
  "emotion": "calme",
  "mood": "relaxed",
  "intensity": 0.7,
  "style": "ambient"
}
```

**Response:**
```json
{
  "id": "track_123",
  "title": "Sérénité",
  "audioUrl": "https://...",
  "duration": 180
}
```

---

### 📝 Journal & Content (2 fonctions)

#### `journal-entry`
Création/mise à jour d'entrées de journal.

**Endpoint**: `POST /journal-entry`

**Body:**
```json
{
  "content": "Ma journée a été...",
  "mood": "positive",
  "emotions": ["joy", "gratitude"],
  "private": true
}
```

---

#### `voice-analysis`
Analyse vocale pour détection émotionnelle.

**Endpoint**: `POST /voice-analysis`

**Body**: `multipart/form-data` avec fichier audio

**Response:**
```json
{
  "emotions": {
    "joy": 0.7,
    "sadness": 0.1,
    "anger": 0.05
  },
  "confidence": 0.85,
  "transcript": "Transcription optionnelle"
}
```

---

## 🔐 Authentification

### Middleware partagé

Fichier: `supabase/functions/_shared/auth-middleware.ts`

```typescript
import { authorizeRole } from '../_shared/auth-middleware.ts';

// Dans votre fonction
const { user, status } = await authorizeRole(req, ['b2c', 'b2b_user']);
if (!user) {
  return new Response(JSON.stringify({ error: "Unauthorized" }), { 
    status, 
    headers: corsHeaders 
  });
}
```

**Rôles disponibles:**
- `b2c` - Utilisateurs B2C
- `b2b_user` - Utilisateurs B2B standard
- `b2b_admin` - Administrateurs B2B
- `admin` - Super admin

---

## 🛡️ Sécurité

### CORS Headers

Toutes les fonctions incluent:

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// OPTIONS handler
if (req.method === 'OPTIONS') {
  return new Response(null, { headers: corsHeaders });
}
```

### Gestion d'erreurs stricte

Pattern TypeScript appliqué:

```typescript
} catch (error: unknown) {
  const errorMessage = error instanceof Error ? error.message : 'Default error';
  const errorDetails = error instanceof Error ? error.stack : String(error);
  console.error('Context:', errorMessage, errorDetails);
  
  return new Response(JSON.stringify({ error: errorMessage }), {
    status: 500,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}
```

---

## 📊 Monitoring & Logs

### Accès aux logs

1. **Supabase Dashboard**: 
   - Project → Edge Functions → [Nom fonction] → Logs

2. **CLI Supabase**:
```bash
supabase functions logs <function-name> --tail
```

### Logs structurés

```typescript
console.log('Action:', {
  userId: user.id,
  action: 'create',
  timestamp: new Date().toISOString()
});
```

---

## 🧪 Tests

### Test local

```bash
supabase functions serve <function-name>
```

### Test avec curl

```bash
curl -i --location --request POST \
  'http://localhost:54321/functions/v1/openai-chat' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"messages": [{"role": "user", "content": "Test"}]}'
```

---

## 🚀 Déploiement

### Déploiement automatique

Les edge functions sont déployées automatiquement avec le code lors des push vers `main`.

### Configuration

Fichier: `supabase/config.toml`

```toml
[functions.openai-chat]
verify_jwt = true  # Authentification requise

[functions.openai-moderate]
verify_jwt = false  # Public
```

---

## 🔑 Secrets Management

### Secrets requis

**OpenAI Functions:**
- `OPENAI_API_KEY` - Clé API OpenAI

**Autres:**
- `SUNO_API_KEY` - Pour génération musicale
- `WEB_PUSH_VAPID_*` - Pour notifications push

### Ajouter un secret

```bash
supabase secrets set OPENAI_API_KEY=sk-...
```

Ou via Dashboard: Project → Settings → Edge Functions → Secrets

---

## 📝 Conventions

### Structure fichier

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Logic here
    
    return new Response(JSON.stringify({ data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error: unknown) {
    // Error handling
  }
});
```

### Best Practices

1. ✅ CORS handlers systématiques
2. ✅ Typage strict des erreurs
3. ✅ Logs détaillés (avec stack traces)
4. ✅ Validation des inputs
5. ✅ Response JSON standardisée
6. ✅ Timeout raisonnable (< 10s)

---

## 📚 Ressources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Deno Documentation](https://deno.land/manual)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)

---

**Mis à jour**: ${new Date().toISOString().split('T')[0]}
