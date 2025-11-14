# 🎵 EmotionsCare Music System - Guide Complet

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [Utilisation](#utilisation)
4. [Configuration](#configuration)
5. [API Reference](#api-reference)
6. [Fonctionnalités avancées](#fonctionnalités-avancées)
7. [Tests](#tests)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Vue d'ensemble

Le système musical EmotionsCare est une solution complète de gestion musicale thérapeutique intégrant :

- **Lecture audio** avec contrôles complets
- **Génération de musique IA** via Suno API
- **Orchestration clinique** basée sur les signaux WHO5/SAM
- **Mode thérapeutique** adaptatif
- **Recommandations personnalisées**
- **Playlists dynamiques**
- **Crossfade** et transitions fluides

### ✨ Caractéristiques Clés

- ✅ Architecture modulaire avec hooks séparés
- ✅ Gestion d'état prévisible avec reducer
- ✅ Intégration Supabase pour la persistance
- ✅ Orchestration musicale basée sur l'humeur
- ✅ Génération de musique thérapeutique IA
- ✅ Support du mode offline
- ✅ TypeScript complet
- ✅ Tests unitaires

---

## 🏗️ Architecture

### Structure des Dossiers

```
src/contexts/music/
├── MusicContext.tsx           # Provider principal
├── types.ts                   # Définitions TypeScript
├── reducer.ts                 # Reducer pour state management
├── index.ts                   # Exports publics
├── README.md                  # Documentation module
│
├── Hooks Modulaires:
├── useMusicPlayback.ts        # Contrôles lecture (play, pause, etc.)
├── useMusicPlaylist.ts        # Gestion playlists
├── useMusicGeneration.ts      # Génération Suno AI
├── useMusicTherapeutic.ts     # Mode thérapeutique
├── useMusicOrchestration.ts   # Presets et crossfade
└── MUSIC_SYSTEM_GUIDE.md      # Ce fichier
```

### Flux de Données

```
┌─────────────────────────────────────────────────────┐
│                   MusicProvider                     │
│  ┌────────────┐                                     │
│  │   State    │ ◄─── Reducer ◄─── Actions          │
│  └────────────┘                                     │
│        │                                            │
│        ▼                                            │
│  ┌──────────────────────────────────────┐          │
│  │        Custom Hooks Layer            │          │
│  │  ┌──────────┐  ┌──────────────┐     │          │
│  │  │ Playback │  │  Playlist    │     │          │
│  │  └──────────┘  └──────────────┘     │          │
│  │  ┌──────────┐  ┌──────────────┐     │          │
│  │  │Generation│  │ Therapeutic  │     │          │
│  │  └──────────┘  └──────────────┘     │          │
│  │  ┌──────────────┐                   │          │
│  │  │Orchestration │                   │          │
│  │  └──────────────┘                   │          │
│  └──────────────────────────────────────┘          │
│        │                                            │
│        ▼                                            │
│  MusicContextType (API publique)                   │
└─────────────────────────────────────────────────────┘
         │
         ▼
   Components & Hooks
```

### Pattern de Composition

L'architecture utilise la **composition de hooks** pour séparer les responsabilités :

```typescript
// MusicContext.tsx
const playbackControls = useMusicPlayback(audioRef, state, dispatch);
const playlistControls = useMusicPlaylist(state, dispatch, playbackControls.play);
const generationControls = useMusicGeneration(dispatch);
const therapeuticControls = useMusicTherapeutic(dispatch);
useMusicOrchestration(audioRef, state, dispatch, playbackControls.setVolume);

const contextValue = {
  state,
  ...playbackControls,
  ...playlistControls,
  ...generationControls,
  ...therapeuticControls,
};
```

---

## 💻 Utilisation

### Installation de Base

```tsx
// 1. Wrapper votre app avec MusicProvider
import { MusicProvider } from '@/contexts/music';

function App() {
  return (
    <MusicProvider>
      <YourApp />
    </MusicProvider>
  );
}
```

### Hook useMusic

```tsx
import { useMusic } from '@/hooks/useMusic';

function MusicPlayer() {
  const { state, play, pause, next, previous, setVolume } = useMusic();

  return (
    <div>
      <h2>{state.currentTrack?.title}</h2>
      <button onClick={() => state.isPlaying ? pause() : play()}>
        {state.isPlaying ? 'Pause' : 'Play'}
      </button>
      <button onClick={next}>Next</button>
      <button onClick={previous}>Previous</button>
      <input
        type="range"
        value={state.volume * 100}
        onChange={e => setVolume(Number(e.target.value) / 100)}
      />
    </div>
  );
}
```

### Exemples d'Utilisation

#### 1. Lecture Simple

```tsx
const { play, pause, state } = useMusic();

const track = {
  id: '1',
  title: 'Relaxation',
  artist: 'Nature Sounds',
  audioUrl: 'https://example.com/track.mp3',
  duration: 180,
};

// Lancer la lecture
await play(track);

// Pause
pause();
```

#### 2. Génération de Musique IA

```tsx
const { generateMusicForEmotion, state } = useMusic();

async function generateCalm() {
  const track = await generateMusicForEmotion(
    'calm',
    'Musique apaisante avec sons de nature'
  );

  if (track) {
    console.log('Musique générée:', track.title);
    // La musique est automatiquement disponible
  }
}

// Suivre la progression
console.log(state.generationProgress); // 0-100
console.log(state.isGenerating); // true/false
```

#### 3. Mode Thérapeutique

```tsx
const {
  enableTherapeuticMode,
  disableTherapeuticMode,
  adaptVolumeToEmotion
} = useMusic();

// Activer le mode thérapeutique
enableTherapeuticMode('anxious');

// Le volume s'adapte automatiquement
adaptVolumeToEmotion('calm', 0.7);

// Désactiver
disableTherapeuticMode();
```

#### 4. Recommandations

```tsx
const { getRecommendationsForEmotion } = useMusic();

async function loadRecommendations() {
  const tracks = await getRecommendationsForEmotion('happy');
  console.log(`Trouvé ${tracks.length} recommandations`);
}
```

#### 5. Gestion Playlists

```tsx
const {
  setPlaylist,
  addToPlaylist,
  removeFromPlaylist,
  shufflePlaylist
} = useMusic();

// Créer une playlist
setPlaylist([track1, track2, track3]);

// Ajouter un track
addToPlaylist(newTrack);

// Retirer un track
removeFromPlaylist('track-id');

// Activer le shuffle
shufflePlaylist();
```

---

## ⚙️ Configuration

### Variables d'Environnement

Créez un fichier `.env.local` :

```bash
# Music Generation API
VITE_TOPMEDIA_API_KEY=your-topmedia-api-key-here

# Supabase (requis)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

### Configuration Supabase

Le système utilise les edge functions Supabase suivantes :

1. **`suno-music-generation`** - Génération de musique
2. **`emotionscare-music-generator`** - Recommandations

Assurez-vous qu'elles sont déployées.

### Presets d'Orchestration

Trois presets sont disponibles basés sur les signaux cliniques :

```typescript
// ambient_soft - Relaxation, récupération
{
  volume: 0.45,
  playbackRate: 0.96,
  crossfadeMs: 2600
}

// focus - Concentration
{
  volume: 0.6,
  playbackRate: 1.0,
  crossfadeMs: 1800
}

// bright - Énergie positive
{
  volume: 0.72,
  playbackRate: 1.06,
  crossfadeMs: 1200
}
```

---

## 📚 API Reference

### MusicContextType

#### State

```typescript
interface MusicState {
  // Playback
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  isPaused: boolean;
  volume: number; // 0-1
  currentTime: number; // secondes
  duration: number; // secondes

  // Orchestration
  activePreset: MusicOrchestrationPreset;
  lastPresetChange: string | null;

  // Playlist
  playlist: MusicTrack[];
  currentPlaylistIndex: number;
  shuffleMode: boolean;
  repeatMode: 'none' | 'one' | 'all';

  // Generation
  isGenerating: boolean;
  generationProgress: number; // 0-100
  generationError: string | null;

  // History
  playHistory: MusicTrack[];
  favorites: string[];

  // Therapeutic
  therapeuticMode: boolean;
  emotionTarget: string | null;
  adaptiveVolume: boolean;
}
```

#### Méthodes de Lecture

```typescript
// Lire un track (optionnel = continuer lecture en cours)
play: (track?: MusicTrack) => Promise<void>;

// Mettre en pause
pause: () => void;

// Arrêter (remet à 0)
stop: () => void;

// Track suivant
next: () => void;

// Track précédent
previous: () => void;

// Chercher à une position (en secondes)
seek: (time: number) => void;

// Changer le volume (0-1)
setVolume: (volume: number) => void;
```

#### Méthodes de Playlist

```typescript
// Définir une playlist
setPlaylist: (tracks: MusicTrack[]) => void;

// Ajouter un track
addToPlaylist: (track: MusicTrack) => void;

// Retirer un track
removeFromPlaylist: (trackId: string) => void;

// Toggle shuffle mode
shufflePlaylist: () => void;

// Toggle favoris
toggleFavorite: (trackId: string) => void;

// Obtenir des recommandations
getRecommendationsForEmotion: (emotion: string) => Promise<MusicTrack[]>;
```

#### Méthodes de Génération

```typescript
// Générer de la musique IA
generateMusicForEmotion: (
  emotion: string,
  prompt?: string
) => Promise<MusicTrack | null>;

// Vérifier le statut de génération
checkGenerationStatus: (taskId: string) => Promise<MusicTrack | null>;

// Obtenir la description d'une émotion
getEmotionMusicDescription: (emotion: string) => string;
```

#### Méthodes Thérapeutiques

```typescript
// Activer le mode thérapeutique
enableTherapeuticMode: (emotion: string) => void;

// Désactiver le mode thérapeutique
disableTherapeuticMode: () => void;

// Adapter le volume à l'émotion
adaptVolumeToEmotion: (emotion: string, intensity: number) => void;
```

### Types

```typescript
interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  audioUrl: string;
  duration: number;
  emotion?: string;
  mood?: string;
  coverUrl?: string;
  tags?: string;
  isGenerated?: boolean;
  generatedAt?: string;
  sunoTaskId?: string;
}

interface MusicPlaylist {
  id: string;
  name: string;
  tracks: MusicTrack[];
  description?: string;
  tags?: string[];
  creator?: string;
  isTherapeutic?: boolean;
  targetEmotion?: string;
}

interface MusicOrchestrationPreset {
  id: 'ambient_soft' | 'focus' | 'bright';
  label: string;
  description: string;
  texture: 'soft' | 'focused' | 'radiant';
  intensity: 'low' | 'medium' | 'high';
  volume: number;
  playbackRate: number;
  crossfadeMs: number;
  source: 'resume' | 'clinical' | 'mood';
  hints: string[];
  reason: string;
}
```

---

## 🚀 Fonctionnalités Avancées

### Orchestration Clinique

Le système écoute les événements `mood.updated` pour ajuster automatiquement la musique :

```typescript
// Dispatcher un événement mood
window.dispatchEvent(new CustomEvent('mood.updated', {
  detail: {
    valence: 75, // 0-100
    arousal: 50, // 0-100
    timestamp: new Date().toISOString()
  }
}));
```

Le système sélectionnera automatiquement le preset approprié avec crossfade.

### Crossfade Automatique

Les transitions entre presets utilisent un crossfade fluide :

```typescript
// Le crossfade est automatique lors des changements de preset
// Durée du fade définie par preset.crossfadeMs
```

### Persistance LocalStorage

Le preset actif est sauvegardé automatiquement :

```typescript
// Clé: 'emotionscare.music.lastPreset'
// Restauré au chargement de la page
```

### Intégration Historique

Tous les tracks joués sont automatiquement sauvegardés :

```typescript
// Sauvegardé dans state.playHistory (50 max)
// Persisté dans Supabase table 'music_history'
```

---

## 🧪 Tests

### Tester le Hook

```typescript
import { renderHook, act } from '@testing-library/react';
import { MusicProvider } from '@/contexts/music';
import { useMusic } from '@/hooks/useMusic';

describe('useMusic', () => {
  it('should play a track', async () => {
    const { result } = renderHook(() => useMusic(), {
      wrapper: MusicProvider
    });

    const track = {
      id: '1',
      title: 'Test',
      artist: 'Test Artist',
      audioUrl: 'test.mp3',
      duration: 180,
    };

    await act(async () => {
      await result.current.play(track);
    });

    expect(result.current.state.isPlaying).toBe(true);
    expect(result.current.state.currentTrack).toEqual(track);
  });
});
```

### Mock Provider pour Tests

```typescript
import { MusicProvider } from '@/contexts/music';

function MockMusicProvider({ children, initialState }) {
  return <MusicProvider>{children}</MusicProvider>;
}
```

---

## 🔧 Troubleshooting

### La musique ne se lance pas

1. **Vérifier la console** pour les erreurs CORS
2. **Vérifier l'URL** du fichier audio
3. **Permissions navigateur** - certains navigateurs bloquent l'autoplay

```typescript
// Solution : Demander une interaction utilisateur
<button onClick={() => play(track)}>
  Lancer la musique
</button>
```

### Génération Suno ne fonctionne pas

1. **Vérifier la variable d'environnement** `VITE_TOPMEDIA_API_KEY`
2. **Vérifier l'edge function** Supabase est déployée
3. **Consulter les logs** :

```typescript
// Les logs sont dans la console avec catégorie 'MUSIC'
```

### Pas de crossfade

1. **Vérifier** que la musique est en lecture (`isPlaying = true`)
2. **Le crossfade est désactivé** si `immediate: true`
3. **Vérifier le navigateur** supporte `requestAnimationFrame`

### État non synchronisé

1. **Vérifier** que le composant est bien dans le `<MusicProvider>`
2. **Relancer** l'application
3. **Nettoyer le LocalStorage** si nécessaire :

```typescript
localStorage.removeItem('emotionscare.music.lastPreset');
```

---

## 📝 Notes de Migration

### Depuis l'ancienne version

Si vous migrez depuis `/contexts/MusicContext.tsx` :

```typescript
// ❌ Ancien import
import { useMusic } from '@/contexts/MusicContext';

// ✅ Nouveau import
import { useMusic } from '@/hooks/useMusic';
```

Toutes les fonctionnalités sont identiques, l'API publique n'a pas changé.

---

## 🎯 Roadmap

### Features Prévues

- [ ] Mode offline avec cache
- [ ] Equalizer visuel
- [ ] Paroles synchronisées
- [ ] Partage de playlists
- [ ] Sessions collaboratives
- [ ] Analytics avancées
- [ ] Export playlists

---

## 📞 Support

Pour toute question ou problème :

1. Consulter cette documentation
2. Vérifier les issues GitHub
3. Contacter l'équipe technique

---

**Version:** 3.0.0
**Dernière mise à jour:** 2025-01-14
**Mainteneurs:** EmotionsCare Team
