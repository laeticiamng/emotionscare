# Music Services - Documentation Complète

## 📚 Vue d'Ensemble

Le répertoire `services/music/` contient l'ensemble des services backend pour la gestion de la musique thérapeutique dans EmotionsCare.

### Architecture

```
services/music/
├── orchestration.ts              # Orchestration clinique (presets adaptatifs)
├── enhanced-music-service.ts     # Service principal enrichi
├── music-generator-service.ts    # Génération musicale (TopMedia AI)
├── recommendations-service.ts    # Recommandations personnalisées
├── preferences-service.ts        # Gestion des préférences utilisateur
├── preferences-learning-service.ts # Apprentissage automatique
├── playlist-service.ts           # Gestion des playlists
├── favorites-service.ts          # Favoris utilisateur
├── history-service.ts            # Historique d'écoute
├── session-service.ts            # Sessions thérapeutiques
├── challenges-service.ts         # Défis et objectifs
├── badges-service.ts             # Badges et récompenses
├── social-service.ts             # Fonctionnalités sociales
├── storage-service.ts            # Stockage persistant
├── user-service.ts               # Données utilisateur
├── premiumFeatures.ts            # Features premium
├── recoApi.ts                    # API de recommandation
├── topMediaService.ts            # Interface TopMedia AI
├── emotion-music-mapping.ts      # Mapping émotions <-> musique
├── converters.ts                 # Convertisseurs de données
├── presetMapper.ts               # Mapping presets
├── presetMetadata.ts             # Métadonnées presets
├── playlist-utils.ts             # Utilitaires playlists
├── playlist-data.ts              # Données playlists
├── demo-tracks.ts                # Pistes de démonstration
└── types.ts                      # Types (deprecated, use @/types/music)
```

---

## 🎼 Services Principaux

### 1. orchestration.ts

**Responsabilité**: Orchestration musicale adaptative basée sur les signaux cliniques (WHO5, SAM).

#### API Publique

```typescript
import { musicOrchestrationService } from '@/services/music/orchestration';

// Types
export type MusicOrchestrationPresetId = 'ambient_soft' | 'focus' | 'bright';

export interface MusicOrchestrationPreset {
  id: MusicOrchestrationPresetId;
  label: string;
  description: string;
  texture: 'soft' | 'focused' | 'radiant';
  intensity: 'low' | 'medium' | 'high';
  volume: number;              // 0-1
  playbackRate: number;        // 0.8-1.2
  crossfadeMs: number;         // Durée du crossfade
  source: 'resume' | 'clinical' | 'mood';
  hints: string[];             // Actions cliniques
  reason: string;              // Explication de la sélection
}
```

#### Méthodes

##### `getActivePreset(): MusicOrchestrationPreset`
Retourne le preset actuellement actif.

```typescript
const preset = musicOrchestrationService.getActivePreset();
console.log(preset.label); // "Ambient Soft"
console.log(preset.volume); // 0.45
```

##### `refreshFromClinicalSignals(): Promise<PresetEvaluation>`
Récupère les signaux cliniques récents et adapte le preset musical.

```typescript
const { preset, changed } = await musicOrchestrationService.refreshFromClinicalSignals();

if (changed) {
  console.log(`Nouveau preset: ${preset.label}`);
  console.log(`Raison: ${preset.reason}`);
  // Appliquer les nouveaux paramètres au player
}
```

##### `handleMoodUpdate(mood: MoodVector): PresetEvaluation`
Met à jour le preset en fonction d'une nouvelle mesure d'humeur.

```typescript
const evaluation = musicOrchestrationService.handleMoodUpdate({
  valence: 65,  // 0-100
  arousal: 55,  // 0-100
  timestamp: new Date().toISOString()
});

if (evaluation.changed) {
  // Le preset a changé
}
```

#### Logique de Sélection

Le service sélectionne automatiquement le preset selon:

1. **Signaux cliniques prioritaires**:
   - Anxiété niveau ≥3 → `ambient_soft`
   - WHO5 ≤1 (faible bien-être) → `ambient_soft`
   - Hints: `gentle_tone`, `reduce_intensity`, `prefer_silence` → `ambient_soft`
   - Hint: `encourage_movement` → `bright`

2. **Scores SAM/Mood**:
   - Arousal ≤35 → `ambient_soft`
   - Valence <40 && Arousal >70 → `ambient_soft`
   - Valence ≥65 && Arousal ≥55 → `bright`
   - Arousal ≥65 → `focus`
   - Valence ≥55 → `bright`

3. **Défaut**: `focus`

#### Exemples d'Usage

**Cas 1: Initialisation au chargement**
```typescript
useEffect(() => {
  const initMusic = async () => {
    const { preset } = await musicOrchestrationService.refreshFromClinicalSignals();
    setMusicPreset(preset);
  };
  initMusic();
}, []);
```

**Cas 2: Mise à jour après scan émotionnel**
```typescript
const handleEmotionScan = (emotions: EmotionData) => {
  const evaluation = musicOrchestrationService.handleMoodUpdate({
    valence: emotions.valence,
    arousal: emotions.arousal,
    timestamp: new Date().toISOString()
  });

  if (evaluation.changed) {
    notifyUser(`Musique adaptée: ${evaluation.preset.label}`);
    applyPreset(evaluation.preset);
  }
};
```

---

### 2. enhanced-music-service.ts

**Responsabilité**: Service principal pour génération, playlists, favoris et partage.

#### API Publique

```typescript
import { enhancedMusicService } from '@/services/music/enhanced-music-service';
```

#### Génération Musicale

##### `generateMusicWithTracking(request): Promise<MusicGeneration>`

Génère une nouvelle musique avec tracking complet en base de données.

```typescript
const generation = await enhancedMusicService.generateMusicWithTracking({
  title: "Calme Thérapeutique",
  style: "ambient, meditation, nature sounds",
  prompt: "Musique apaisante pour réduction du stress",
  instrumental: true,
  model: "V4_5",
  durationSeconds: 180
});

console.log(generation.id);        // UUID
console.log(generation.status);     // 'processing'
console.log(generation.audioUrl);   // URL une fois complété
```

**Paramètres**:
- `title`: Titre de la musique
- `style`: Style musical (séparé par virgules)
- `prompt`: Description textuelle
- `instrumental`: true/false
- `model`: 'V3_5' | 'V4' | 'V4_5' | 'V4_5PLUS' | 'V5'
- `durationSeconds`: Durée cible
- `vocalGender`: 'm' | 'f' | null
- `styleWeight`: 0-100 (influence du style)

##### `getMusicHistory(limit, offset): Promise<MusicGeneration[]>`

Récupère l'historique des générations.

```typescript
const history = await enhancedMusicService.getMusicHistory(50, 0);
history.forEach(gen => {
  console.log(`${gen.title} - ${gen.status}`);
});
```

#### Playlists

##### `createPlaylist(name, description?, isPublic?, tags?): Promise<MusicPlaylist>`

Crée une nouvelle playlist.

```typescript
const playlist = await enhancedMusicService.createPlaylist(
  "Ma Playlist Zen",
  "Musiques apaisantes pour méditation",
  false,
  ['meditation', 'calm', 'nature']
);
```

##### `getUserPlaylists(): Promise<MusicPlaylist[]>`

```typescript
const playlists = await enhancedMusicService.getUserPlaylists();
```

##### `addToPlaylist(playlistId, musicGenerationId): Promise<void>`

```typescript
await enhancedMusicService.addToPlaylist(
  'playlist-uuid',
  'generation-uuid'
);
```

##### `getPlaylistTracks(playlistId): Promise<PlaylistTrack[]>`

```typescript
const tracks = await enhancedMusicService.getPlaylistTracks('playlist-uuid');
tracks.forEach(track => {
  console.log(track.musicGeneration?.title);
});
```

#### Favoris

##### `addToFavorites(musicGenerationId): Promise<void>`

```typescript
await enhancedMusicService.addToFavorites('generation-uuid');
```

##### `removeFromFavorites(musicGenerationId): Promise<void>`

```typescript
await enhancedMusicService.removeFromFavorites('generation-uuid');
```

##### `getFavorites(): Promise<MusicGeneration[]>`

```typescript
const favorites = await enhancedMusicService.getFavorites();
```

##### `isFavorite(musicGenerationId): Promise<boolean>`

```typescript
const isFav = await enhancedMusicService.isFavorite('generation-uuid');
```

#### Partage

##### `shareMusic(musicGenerationId, options): Promise<MusicShare>`

```typescript
const share = await enhancedMusicService.shareMusic(
  'generation-uuid',
  {
    isPublic: true,
    message: "Écoute cette musique relaxante !",
    expiresInDays: 7
  }
);

console.log(share.shareToken); // Token de partage public
const shareUrl = `${window.location.origin}/music/shared/${share.shareToken}`;
```

##### `getMusicByShareToken(token): Promise<MusicGeneration | null>`

```typescript
const music = await enhancedMusicService.getMusicByShareToken('share_abc123');
if (music) {
  playMusic(music);
}
```

---

### 3. recommendations-service.ts

**Responsabilité**: Génération de playlists personnalisées basées sur l'apprentissage automatique.

#### API

```typescript
import { generatePersonalizedPlaylists } from '@/services/music/recommendations-service';

const playlists = await generatePersonalizedPlaylists(
  userId,
  listeningHistory
);

playlists.forEach(playlist => {
  console.log(`${playlist.name} - Match: ${playlist.matchScore}%`);
  console.log(`Basé sur: ${playlist.basedOn.join(', ')}`);
});
```

---

### 4. preferences-service.ts

**Responsabilité**: Gestion des préférences musicales utilisateur.

```typescript
import { preferencesService } from '@/services/music/preferences-service';

// Obtenir les préférences
const prefs = await preferencesService.getPreferences(userId);

// Mettre à jour
await preferencesService.updatePreferences(userId, {
  favoriteGenres: ['ambient', 'classical'],
  dislikedGenres: ['metal'],
  preferredDuration: 180,
  autoplay: true
});
```

---

### 5. session-service.ts

**Responsabilité**: Gestion des sessions thérapeutiques musicales.

```typescript
import { sessionService } from '@/services/music/session-service';

// Démarrer une session
const session = await sessionService.startSession({
  userId,
  targetEmotion: 'calm',
  duration: 1800, // 30 minutes
  type: 'relaxation'
});

// Mettre à jour avec émotions
await sessionService.updateEmotions(session.id, emotionData);

// Terminer
await sessionService.endSession(session.id, {
  effectiveness: 8,
  enjoyment: 9,
  comments: "Très relaxant"
});
```

---

## 🔧 Utilitaires

### emotion-music-mapping.ts

Mapping entre émotions et paramètres musicaux.

```typescript
import { getEmotionMusicParams } from '@/services/music/emotion-music-mapping';

const params = getEmotionMusicParams('anxious');
// {
//   bpm: '60-80',
//   mode: 'minor',
//   instruments: ['piano', 'strings'],
//   style: 'ambient, calm'
// }
```

### converters.ts

Convertisseurs entre formats de données.

```typescript
import { convertTrackToMusicTrack } from '@/services/music/converters';

const musicTrack = convertTrackToMusicTrack(externalTrack);
```

---

## 📊 Base de Données

### Tables Supabase

#### `music_generations`
```sql
- id: uuid (PK)
- user_id: uuid (FK users)
- title: text
- style: text
- prompt: text
- model: text
- audio_url: text
- audio_id: text
- status: enum (pending, processing, completed, failed)
- created_at: timestamptz
- completed_at: timestamptz
```

#### `music_playlists`
```sql
- id: uuid (PK)
- user_id: uuid (FK users)
- name: text
- description: text
- is_public: boolean
- tags: text[]
- created_at: timestamptz
- updated_at: timestamptz
```

#### `playlist_tracks`
```sql
- id: uuid (PK)
- playlist_id: uuid (FK music_playlists)
- music_generation_id: uuid (FK music_generations)
- position: integer
- added_at: timestamptz
```

#### `music_favorites`
```sql
- user_id: uuid (FK users)
- music_generation_id: uuid (FK music_generations)
- created_at: timestamptz
- PRIMARY KEY (user_id, music_generation_id)
```

#### `music_shares`
```sql
- id: uuid (PK)
- music_generation_id: uuid (FK music_generations)
- shared_by: uuid (FK users)
- shared_with: uuid (FK users, nullable)
- is_public: boolean
- share_token: text (unique)
- message: text
- created_at: timestamptz
- expires_at: timestamptz
```

---

## 🧪 Tests

```bash
# Tests unitaires
npm run test src/services/music/

# Test spécifique
npm run test src/services/music/__tests__/presetMapper.spec.ts
```

### Exemples de Tests

```typescript
import { musicOrchestrationService } from '../orchestration';

describe('musicOrchestrationService', () => {
  it('should select ambient_soft for high anxiety', async () => {
    // Mock clinical signals
    mockSupabase.from('clinical_signals').select().returns([
      { domain: 'anxiety', level: 4, source_instrument: 'WHO5' }
    ]);

    const { preset } = await musicOrchestrationService.refreshFromClinicalSignals();

    expect(preset.id).toBe('ambient_soft');
    expect(preset.intensity).toBe('low');
  });
});
```

---

## 🚀 Best Practices

### 1. Gestion d'Erreurs

```typescript
try {
  const result = await enhancedMusicService.generateMusicWithTracking(request);
} catch (error) {
  logger.error('Generation failed', error, 'MUSIC');
  // Fallback ou notification utilisateur
}
```

### 2. Caching

```typescript
import { useMusicCache } from '@/hooks/music/useMusicCache';

const { getCached, setCached } = useMusicCache();

const getPlaylist = async (id: string) => {
  const cached = getCached(`playlist:${id}`);
  if (cached) return cached;

  const playlist = await enhancedMusicService.getPlaylistTracks(id);
  setCached(`playlist:${id}`, playlist, 300); // 5 minutes
  return playlist;
};
```

### 3. Optimistic Updates

```typescript
const toggleFavorite = async (id: string) => {
  // Update UI immédiatement
  setFavorites(prev => [...prev, id]);

  try {
    await enhancedMusicService.addToFavorites(id);
  } catch (error) {
    // Rollback en cas d'erreur
    setFavorites(prev => prev.filter(fav => fav !== id));
    showError('Impossible d\'ajouter aux favoris');
  }
};
```

---

## 📞 Support

- **Bugs**: GitHub Issues
- **Questions**: Documentation centrale `/docs/music/`
- **Contribution**: Pull Requests welcomes

---

## 🔄 Changelog

### v2.0.0 (2025-11-14)
- ✨ Documentation complète
- ✨ Consolidation des types
- 🐛 Fixes diverses

### v1.5.0
- ✨ Ajout orchestration clinique
- ✨ Service de partage
- ✨ Badges et challenges

### v1.0.0
- 🎉 Version initiale
