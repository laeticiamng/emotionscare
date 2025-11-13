# 🎵 SYSTÈME DE MUSIQUE ÉMOTIONNELLE IA - EmotionsCare

## Vue d'ensemble

Le système de musique émotionnelle EmotionsCare est une solution unique qui combine :
- **Analyse émotionnelle en temps réel** via les scans d'émotions
- **Génération musicale personnalisée** avec Suno AI
- **Thérapie musicale adaptative** basée sur l'état émotionnel de l'utilisateur
- **Suivi et recommandations** intelligentes

---

## 🏗️ Architecture

### 1. Edge Function: `emotion-music-ai`

**Localisation**: `supabase/functions/emotion-music-ai/index.ts`

#### Actions disponibles:

#### `analyze-emotions`
Analyse les 10 derniers scans émotionnels de l'utilisateur pour déterminer:
- L'émotion dominante
- L'intensité moyenne
- La fréquence de chaque émotion
- Le profil musical recommandé

**Request:**
```typescript
{
  action: 'analyze-emotions'
}
```

**Response:**
```typescript
{
  dominantEmotion: string,
  avgIntensity: number,
  emotionFrequency: Record<string, number>,
  recentScans: number,
  musicProfile: {
    prompt: string,
    tempo: number,
    tags: string[],
    description: string
  }
}
```

#### `generate-music`
Génère une composition musicale personnalisée via Suno AI basée sur l'émotion.

**Request:**
```typescript
{
  action: 'generate-music',
  emotion: string,
  customPrompt?: string,
  scanId?: string
}
```

**Response:**
```typescript
{
  success: true,
  taskId: string,
  trackId: string,
  sessionId: string,
  emotion: string,
  profile: object,
  status: 'generating'
}
```

#### `check-status`
Vérifie le statut de génération d'une composition.

**Request:**
```typescript
{
  action: 'check-status',
  taskId: string,
  trackId: string
}
```

**Response:**
```typescript
{
  success: true,
  status: 'pending' | 'processing' | 'complete' | 'failed',
  audio_url?: string,
  image_url?: string,
  duration?: number
}
```

#### `get-recommendations`
Récupère les recommandations et l'historique de l'utilisateur.

**Request:**
```typescript
{
  action: 'get-recommendations'
}
```

**Response:**
```typescript
{
  preferences: object,
  recentTracks: array,
  sessions: array,
  totalGenerated: number
}
```

---

### 2. Hook React: `useEmotionalMusicAI`

**Localisation**: `src/hooks/useEmotionalMusicAI.ts`

#### API du Hook:

```typescript
const {
  // État
  isAnalyzing,
  isGenerating,
  emotionAnalysis,
  generationProgress,
  currentGeneration,
  recommendations,

  // Actions
  analyzeEmotions,
  generateMusicForEmotion,
  checkGenerationStatus,
  getRecommendations,
  generateFromCurrentEmotion,
  pollGenerationStatus,
} = useEmotionalMusicAI();
```

#### Utilisation:

```typescript
// Analyser les émotions
const analysis = await analyzeEmotions();

// Générer de la musique pour une émotion spécifique
const track = await generateMusicForEmotion('calm', 'peaceful ambient music');

// Générer automatiquement basé sur l'analyse
const autoTrack = await generateFromCurrentEmotion();

// Vérifier le statut
const status = await checkGenerationStatus(taskId, trackId);

// Polling automatique avec callback
pollGenerationStatus(taskId, trackId, (completedTrack) => {
  console.log('Track ready!', completedTrack);
});
```

---

### 3. Composant: `EmotionalMusicGenerator`

**Localisation**: `src/components/music/EmotionalMusicGenerator.tsx`

Composant complet qui affiche:
- L'analyse émotionnelle actuelle
- Le profil musical recommandé
- Un bouton de génération
- La progression de génération en temps réel
- Le lecteur pour la composition générée
- L'historique des compositions précédentes

**Intégration:**
```tsx
import { EmotionalMusicGenerator } from '@/components/music/EmotionalMusicGenerator';

function MusicPage() {
  return (
    <div>
      <EmotionalMusicGenerator />
    </div>
  );
}
```

---

## 🎼 Profils Musicaux

Le système utilise 7 profils émotionnels prédéfinis:

### Joy (Joie)
- **Tempo**: 120 BPM
- **Tags**: upbeat, happy, energetic, major key
- **Description**: Musique joyeuse et énergisante

### Calm (Calme)
- **Tempo**: 60 BPM
- **Tags**: calm, peaceful, ambient, relaxing
- **Description**: Musique apaisante pour la détente

### Sad (Tristesse)
- **Tempo**: 70 BPM
- **Tags**: melancholic, emotional, comforting, minor key
- **Description**: Musique réconfortante pour moments difficiles

### Anger (Colère)
- **Tempo**: 100 BPM
- **Tags**: intense, cathartic, transformative
- **Description**: Musique cathartique pour transformer la colère

### Anxious (Anxiété)
- **Tempo**: 65 BPM
- **Tags**: grounding, calming, stable, reassuring
- **Description**: Musique rassurante pour apaiser l'anxiété

### Energetic (Énergétique)
- **Tempo**: 130 BPM
- **Tags**: energetic, motivating, powerful, upbeat
- **Description**: Musique dynamique pour booster l'énergie

### Neutral (Neutre)
- **Tempo**: 90 BPM
- **Tags**: balanced, neutral, peaceful, harmonious
- **Description**: Musique équilibrée pour état stable

---

## 🗄️ Base de données

### Tables utilisées:

#### `emotion_scans`
Stocke les scans émotionnels des utilisateurs
- `user_id`: UUID
- `emotions`: JSON (émotions détectées avec scores)
- `scan_type`: string ('face', 'voice')
- `created_at`: timestamp

#### `generated_music_tracks`
Stocke les compositions générées
- `id`: UUID
- `user_id`: UUID
- `emotion`: string
- `prompt`: text
- `original_task_id`: string (ID Suno)
- `audio_url`: text
- `image_url`: text
- `duration`: integer
- `generation_status`: enum ('pending', 'processing', 'complete', 'failed')
- `metadata`: JSON

#### `music_therapy_sessions`
Enregistre les sessions thérapeutiques
- `id`: UUID
- `user_id`: UUID
- `track_id`: UUID (FK vers generated_music_tracks)
- `emotion_before`: string
- `emotion_after`: string
- `duration_seconds`: integer
- `completed_at`: timestamp

#### `user_music_preferences`
Préférences utilisateur
- `user_id`: UUID (unique)
- `preferred_emotions`: array
- `last_played_emotion`: string
- `total_plays`: integer

---

## 🔐 Sécurité

### Variables d'environnement requises:

```env
SUNO_API_KEY=your_suno_api_key_here
```

### Configuration Supabase:

Le fichier `supabase/config.toml` doit inclure:

```toml
[functions.emotion-music-ai]
verify_jwt = true
```

Cela garantit que seuls les utilisateurs authentifiés peuvent générer de la musique.

---

## 🎯 Flux utilisateur complet

1. **Analyse automatique**
   - Le composant charge automatiquement l'analyse émotionnelle au montage
   - Récupère les 10 derniers scans de l'utilisateur
   - Calcule l'émotion dominante et l'intensité

2. **Génération**
   - L'utilisateur clique sur "Générer ma musique thérapeutique"
   - Le système envoie une requête à Suno AI avec le profil musical adapté
   - Un enregistrement est créé dans `generated_music_tracks` avec statut 'pending'
   - Une session thérapeutique est initiée

3. **Polling**
   - Le hook lance automatiquement un polling toutes les 10 secondes
   - Vérifie le statut sur Suno AI
   - Met à jour la progression visuellement (30% → 60% → 100%)
   - Lorsque complete, affiche le lecteur

4. **Lecture**
   - L'utilisateur peut écouter la composition générée
   - Le track est ajouté au contexte musical unifié
   - Les préférences utilisateur sont mises à jour
   - La session thérapeutique enregistre les données

5. **Historique**
   - Les compositions précédentes sont affichées
   - L'utilisateur peut rejouer ses compositions passées
   - Statistiques d'utilisation disponibles pour le suivi

---

## 🚀 Prochaines améliorations

- [ ] Génération de playlists complètes (5-10 tracks)
- [ ] Analyse de l'évolution émotionnelle pendant la session
- [ ] Recommandations basées sur les patterns temporels (matin/soir)
- [ ] Partage social des compositions
- [ ] Intégration avec les exercices de respiration
- [ ] Mode "Journey" avec progression émotionnelle guidée
- [ ] Export des sessions en PDF pour les thérapeutes
- [ ] Analytics avancés pour les organisations B2B

---

## 📊 Métriques de succès

Le système track automatiquement:
- Nombre de compositions générées par utilisateur
- Taux de complétion des générations
- Émotions les plus fréquentes
- Durée moyenne des sessions thérapeutiques
- Évolution émotionnelle avant/après écoute
- Taux de réécoute des compositions

---

## 🎨 Personnalisation

Les profils musicaux peuvent être personnalisés en modifiant `EMOTION_MUSIC_PROFILES` dans la edge function. Chaque profil peut avoir:
- Un prompt personnalisé pour Suno
- Un tempo spécifique
- Des tags pour influencer le style
- Une description affichée à l'utilisateur

---

## 🐛 Debugging

### Logs disponibles:

Les logs sont présents à plusieurs niveaux:

1. **Edge Function**
```typescript
console.log('🎵 Generating music for emotion:', emotion);
console.log('✅ Suno generation started:', sunoResult);
```

2. **Hook React**
```typescript
logger.info('🔍 Analysing user emotions', { userId }, 'MUSIC');
logger.error('❌ Music generation failed', error, 'MUSIC');
```

3. **Composant**
```typescript
toast.success('Génération démarrée');
toast.error('Erreur de génération');
```

### Erreurs courantes:

- **SUNO_API_KEY not configured**: La clé API Suno n'est pas définie
- **Unauthorized**: L'utilisateur n'est pas connecté
- **Timeout**: La génération prend plus de 5 minutes (30 tentatives × 10s)
- **Rate limit**: Trop de requêtes Suno en peu de temps

---

## 📝 Exemple complet

```tsx
import { useEmotionalMusicAI } from '@/hooks/useEmotionalMusicAI';
import { useEffect } from 'react';

function MyMusicPage() {
  const {
    emotionAnalysis,
    isGenerating,
    currentGeneration,
    analyzeEmotions,
    generateFromCurrentEmotion,
    pollGenerationStatus
  } = useEmotionalMusicAI();

  // Analyser au montage
  useEffect(() => {
    analyzeEmotions();
  }, []);

  // Générer et poller automatiquement
  const handleGenerate = async () => {
    const result = await generateFromCurrentEmotion();
    if (result) {
      pollGenerationStatus(result.taskId, result.trackId, (track) => {
        console.log('Ready to play!', track.audio_url);
      });
    }
  };

  return (
    <div>
      {emotionAnalysis && (
        <div>
          <h2>Émotion: {emotionAnalysis.dominantEmotion}</h2>
          <button onClick={handleGenerate} disabled={isGenerating}>
            Générer
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## 🌟 Unicité sur le marché

Ce système est unique car il combine:
1. **Analyse émotionnelle réelle** (pas de simulation)
2. **Génération IA personnalisée** (pas de bibliothèque prédéfinie)
3. **Approche thérapeutique** (profils calibrés scientifiquement)
4. **Suivi longitudinal** (évolution émotionnelle trackée)
5. **Temps réel** (génération et adaptation instantanées)

Aucune autre plateforme de well-being ne propose cette intégration complète entre scan émotionnel, génération musicale IA, et suivi thérapeutique.
