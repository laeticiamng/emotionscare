# 🔌 Guide d'Intégration des APIs Premium

> Documentation détaillée des APIs tierces intégrées dans EmotionsCare

---

## 📋 Vue d'Ensemble

| API | Usage | Edge Function | Statut |
|-----|-------|---------------|--------|
| **ElevenLabs** | Text-to-Speech premium | `elevenlabs-tts` | ✅ Production |
| **Perplexity** | Recherche IA contextuelle | `perplexity-search` | ✅ Production |
| **Suno** | Génération musicale | `suno-music` | ✅ Production |
| **Firecrawl** | Web scraping intelligent | `firecrawl-scrape` | ✅ Production |
| **Hume AI** | Analyse émotionnelle | `analyze-emotion` | ✅ Production |
| **Lovable AI Gateway** | LLM (Gemini) | `router-ai` | ✅ Production |

---

## 🎙️ ElevenLabs (Text-to-Speech)

### Description

Voix ultra-réalistes multilingues pour le coach IA et les méditations guidées.

### Configuration

```bash
# Secret requis dans Supabase
ELEVENLABS_API_KEY=sk_...
```

### Edge Function : `elevenlabs-tts`

**Endpoint** : `POST /functions/v1/elevenlabs-tts`

**Payload** :
```json
{
  "text": "Bienvenue dans votre session de relaxation",
  "voice_id": "pNInz6obpgDQGcFmaJgB",
  "model_id": "eleven_multilingual_v2",
  "voice_settings": {
    "stability": 0.75,
    "similarity_boost": 0.75,
    "style": 0.5,
    "use_speaker_boost": true
  }
}
```

**Réponse** : Audio MPEG binaire

### Voix Disponibles

| ID | Nom | Usage Recommandé |
|----|-----|------------------|
| `EXAVITQu4vr4xnSDxMaL` | Sarah | Voix calme féminine |
| `VR6AewLTigWG4xSOukaG` | Arnold | Voix calme masculine |
| `pNInz6obpgDQGcFmaJgB` | Adam | Méditation profonde |
| `ErXwobaYiN019PkySvjV` | Antoni | Exercices respiration |

### Usage Frontend

```typescript
import { supabase } from '@/integrations/supabase/client';

const generateSpeech = async (text: string) => {
  const { data, error } = await supabase.functions.invoke('elevenlabs-tts', {
    body: { text, voice_id: 'pNInz6obpgDQGcFmaJgB' }
  });
  
  if (error) throw error;
  
  // data est un ArrayBuffer audio
  const audioBlob = new Blob([data], { type: 'audio/mpeg' });
  const audioUrl = URL.createObjectURL(audioBlob);
  
  const audio = new Audio(audioUrl);
  audio.play();
};
```

### Limites

- **Caractères max** : 5000 par requête
- **Rate limit** : Selon plan ElevenLabs
- **Latence typique** : 1-3 secondes

---

## 🔍 Perplexity (Recherche IA)

### Description

Recherche contextuelle intelligente avec citations pour l'aide et les ressources bien-être.

### Configuration

```bash
# Secret requis dans Supabase
PERPLEXITY_API_KEY=pplx-...
```

### Edge Function : `perplexity-search`

**Endpoint** : `POST /functions/v1/perplexity-search`

**Payload** :
```json
{
  "query": "techniques de respiration pour réduire l'anxiété",
  "context": "wellness",
  "language": "fr",
  "max_tokens": 1024
}
```

**Contextes disponibles** :
- `wellness` : Bien-être général
- `meditation` : Méditation et mindfulness
- `stress` : Gestion du stress
- `emotional` : Régulation émotionnelle
- `general` : Recherche générale

**Réponse** :
```json
{
  "answer": "Les techniques de respiration les plus efficaces...",
  "citations": ["https://source1.com", "https://source2.com"],
  "model": "sonar",
  "usage": { "prompt_tokens": 50, "completion_tokens": 200 }
}
```

### Usage Frontend

```typescript
const searchWellness = async (query: string) => {
  const { data, error } = await supabase.functions.invoke('perplexity-search', {
    body: { 
      query, 
      context: 'wellness',
      language: 'fr' 
    }
  });
  
  if (error) throw error;
  return data.answer;
};
```

### Limites

- **Tokens max** : 4096 par réponse
- **Rate limit** : Selon plan Perplexity
- **Modèle** : `sonar` (optimisé pour la recherche)

---

## 🎵 Suno (Génération Musicale)

### Description

Génération de morceaux thérapeutiques personnalisés selon l'humeur.

### Configuration

```bash
# Secret requis dans Supabase
SUNO_API_KEY=...
SUNO_CALLBACK_URL=https://your-project.supabase.co/functions/v1/suno-callback
```

### Edge Function : `suno-music`

**Endpoint** : `POST /functions/v1/suno-music`

**Payload** :
```json
{
  "emotion": "calm",
  "style": "ambient",
  "duration": 120,
  "prompt": "Musique apaisante pour méditation"
}
```

**Réponse initiale** :
```json
{
  "task_id": "task_abc123",
  "status": "processing",
  "estimated_time": 60
}
```

### Workflow Asynchrone

1. Client envoie requête → reçoit `task_id`
2. Suno génère la musique (30-90 secondes)
3. Suno appelle `suno-callback` avec le résultat
4. Client poll `suno-status-check` ou écoute realtime

### Usage Frontend

```typescript
const generateMusic = async (emotion: string) => {
  // 1. Lancer la génération
  const { data: task } = await supabase.functions.invoke('suno-music', {
    body: { emotion, style: 'ambient' }
  });
  
  // 2. Attendre le résultat (polling simplifié)
  let result = null;
  while (!result) {
    await new Promise(r => setTimeout(r, 5000));
    const { data } = await supabase.functions.invoke('check-music-status', {
      body: { task_id: task.task_id }
    });
    if (data.status === 'completed') {
      result = data;
    }
  }
  
  return result.audio_url;
};
```

### Limites

- **Durée max** : 4 minutes par morceau
- **Génération** : 30-90 secondes
- **Quota** : Selon plan Suno

---

## 🕷️ Firecrawl (Web Scraping)

### Description

Extraction intelligente de contenu web pour les ressources bien-être.

### Configuration

```bash
# Secret requis dans Supabase
FIRECRAWL_API_KEY=fc-...
```

### Edge Function : `firecrawl-scrape`

**Endpoint** : `POST /functions/v1/firecrawl-scrape`

**Payload** :
```json
{
  "url": "https://example.com/wellness-article",
  "formats": ["markdown", "html"],
  "only_main_content": true
}
```

**Réponse** :
```json
{
  "success": true,
  "data": {
    "markdown": "# Article Title\n\nContent...",
    "html": "<h1>Article Title</h1><p>Content...</p>",
    "metadata": {
      "title": "Article Title",
      "description": "Description",
      "language": "fr"
    }
  }
}
```

### Usage Frontend

```typescript
const scrapeArticle = async (url: string) => {
  const { data, error } = await supabase.functions.invoke('firecrawl-scrape', {
    body: { 
      url, 
      formats: ['markdown'],
      only_main_content: true 
    }
  });
  
  if (error) throw error;
  return data.data.markdown;
};
```

### Limites

- **Pages par requête** : 1
- **Rate limit** : 10 req/minute
- **Timeout** : 30 secondes

---

## 🧠 Hume AI (Analyse Émotionnelle)

### Description

Détection d'émotions à partir d'images faciales.

### Configuration

```bash
# Secret requis dans Supabase (via Lovable Gateway)
LOVABLE_API_KEY=...
```

### Edge Function : `analyze-emotion`

**Endpoint** : `POST /functions/v1/analyze-emotion`

**Payload** :
```json
{
  "input_type": "text",
  "raw_input": "Je me sens stressé aujourd'hui",
  "selected_emotion": null,
  "intensity": 7,
  "context_tags": ["work", "morning"]
}
```

**Réponse** :
```json
{
  "sessionId": "uuid",
  "detectedEmotions": [
    { "label": "stress", "intensity": 0.7, "confidence": 0.85, "valence": -0.3 }
  ],
  "primaryEmotion": "stress",
  "valence": -0.3,
  "arousal": 0.6,
  "summary": "Tension modérée détectée...",
  "modelVersion": "google/gemini-2.5-flash"
}
```

### Types d'Input

- `text` : Analyse de texte
- `choice` : Sélection d'émotion prédéfinie
- `voice` : Analyse vocale (via Whisper)
- `scan` : Analyse d'image faciale

### Limites

- **Rate limit** : 8 requêtes/minute par utilisateur
- **Texte max** : 500 caractères

---

## 🔒 Sécurité

### Règles Générales

1. **Secrets** : Tous les API keys sont stockés en Supabase Secrets, jamais en frontend
2. **Rate Limiting** : Appliqué sur toutes les Edge Functions
3. **Auth** : JWT vérifié avant appel API
4. **CORS** : Configuré pour le domaine de production uniquement

### Mocks pour Développement

Si vous n'avez pas de clés API, les Edge Functions retournent des données simulées :

```typescript
// Dans l'edge function
if (!API_KEY) {
  return new Response(JSON.stringify({
    success: true,
    data: mockData,
    source: 'simulation'
  }));
}
```

---

## 🧪 Tests

### Tester une intégration

```bash
# Via curl
curl -X POST https://your-project.supabase.co/functions/v1/elevenlabs-tts \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text": "Test"}'
```

### Vérifier les logs

```sql
-- Dans Supabase Dashboard > Logs
SELECT * FROM edge_logs 
WHERE function_name = 'elevenlabs-tts' 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## 📞 Support

- **Documentation ElevenLabs** : https://docs.elevenlabs.io
- **Documentation Perplexity** : https://docs.perplexity.ai
- **Documentation Suno** : https://suno.ai/docs
- **Documentation Firecrawl** : https://docs.firecrawl.dev

---

*Dernière mise à jour : 3 février 2026*
