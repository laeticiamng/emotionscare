# EmotionsCare Codebase Structure - Comprehensive Overview

## 1. Application Architecture Overview

### Tech Stack
- **Framework**: Vite + React 18.2.0 (SPA)
- **Language**: TypeScript 5.4.5
- **Styling**: Tailwind CSS 3.4.3 + Shadcn/UI Components
- **State Management**: Recoil 0.7.7, Zustand 4.5.2
- **Forms**: React Hook Form 7.53.0 with Zod validation
- **Data Fetching**: TanStack React Query 5.56.2
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Routing**: React Router DOM 6.22.1
- **Animation**: Framer Motion 11.1.2
- **UI Libraries**: Chakra UI, Radix UI, Headless UI
- **3D Graphics**: Three.js 0.160.1 + React Three Fiber + React Three XR
- **Audio**: Tone.js 15.1.22
- **AI Services**: OpenAI, Suno AI, TopMedia AI, Hume AI
- **Monitoring**: Sentry 7.120.3

### Directory Structure
```
src/
├── pages/              # 100+ page components (B2C, B2B, admin)
├── components/         # 500+ reusable UI components
├── features/           # Feature-specific logic (music, scan, vr, etc.)
├── services/           # 35+ music services + other domain services
├── contexts/           # React Context providers (MusicContext, etc.)
├── hooks/              # 50+ custom React hooks
├── modules/            # Feature modules (coach, nyvee, orchestration, etc.)
├── types/              # TypeScript type definitions
├── lib/                # Utilities and helpers
├── routerV2/           # React Router configuration
├── layouts/            # Page layout wrappers
├── i18n/               # Internationalization (French/English)
├── providers/          # Root providers
├── stores/             # Zustand stores
└── theme/              # Theme configuration
```

---

## 2. Music Feature Analysis

### Current Status: ✅ HIGHLY SOPHISTICATED SYSTEM

The music module is one of the most developed features in the application.

### 2.1 Music Page Structure

**Main Pages:**
- `/pages/B2CMusicEnhanced.tsx` (918 lines) - **Primary music interface**
  - Vinyl record UI with therapeutic music
  - Unified music player integration
  - Emotional music generation
  - Journey player, auto-mix, focus flow
  - Social features, gamification
  - Real-time analytics dashboard

- `/pages/MusicProfilePage.tsx` - User music profile with:
  - Level and XP progression
  - Badge system
  - Daily challenges
  - Social features
  - Listening history

- `/pages/B2CMusicTherapyPremiumPage.tsx` - Premium therapeutic content
  - Binaural frequency therapy
  - Exclusive compositions

- `/pages/MusicAnalyticsPage.tsx` - Advanced analytics dashboard

### 2.2 Music Components (80+ components)

**Major Component Groups:**

#### Player Components (`/components/music/player/`)
- `MusicPlayer.tsx` - Basic player
- `PremiumMusicPlayer.tsx` - Feature-rich player
- `ImmersiveVisualization.tsx` - 3D visualizations
- `ImmersiveFullscreenPlayer.tsx` - Fullscreen immersive mode
- `AdvancedEqualizer.tsx` - 10-band equalizer
- `WaveformVisualizer.tsx` - Audio waveform display
- `ThreeDVisualizer.tsx` - Three.js 3D visualizations
- `SpatialAudioControls.tsx` - Spatial audio (3D sound)
- `PlayerControls.tsx`, `PlayerSettings.tsx`, `PlayerKeyboardShortcuts.tsx`
- `TrackInfo.tsx`, `TrackDetails.tsx`, `ProgressBar.tsx`, `VolumeControl.tsx`
- `LyricsDisplay.tsx` - Synchronized lyrics
- `AudioAnalysisDisplay.tsx` - Real-time audio analysis
- `AIRecommendationEngine.tsx` - ML-powered recommendations
- `CollaborativeSession.tsx` - Real-time collaborative listening

#### Main Components (`/components/music/`)
- `UnifiedMusicPlayer.tsx` - Central player component
- `MusicJourneyPlayer.tsx` - Therapeutic journey playback
- `AutoMixPlayer.tsx` - Automatic audio mixing
- `FocusFlowPlayer.tsx` - Deep focus mode player
- `EmotionalMusicGenerator.tsx` - Generate music from emotions
- `EmotionMusicGeneratorEnhanced.tsx` - Advanced emotion-based generation
- `MusicTherapyDashboard.tsx` - Therapy interface
- `AdaptivePlaylistEngine.tsx` - Smart playlist generation
- `AdaptiveMusicDashboard.tsx` - Adaptive music settings
- `AudioEqualizer.tsx`, `AudioVisualizer.tsx` - Audio controls
- `MusicHistory.tsx` - Listening history
- `PlaylistManager.tsx` - Playlist management
- `MusicRecommendations.tsx` - Recommendation UI
- `PersonalizedPlaylistRecommendations.tsx`
- `WeeklyInsightsDashboard.tsx` - Weekly listening analytics
- `MusicBadgesDisplay.tsx` - Achievement badges
- `SocialFriendsPanel.tsx` - Social features
- `DailyChallengesPanel.tsx` - Gamification challenges
- `MusicLyricsSynchronized.tsx` - Synced lyrics display
- `MoodPresetPicker.tsx` - Mood-based preset selection

#### Page Sub-components (`/components/music/page/`)
- `PlayerTab.tsx` - Player UI tab
- `MusicPlayerCard.tsx` - Card-based player
- `MusicMixer.tsx` - Audio mixing interface
- `MusicLibrary.tsx` - Track library
- `LibraryTab.tsx` - Library browsing

#### Generation & Analytics
- `AdvancedMusicGenerator.tsx` - Suno + TopMedia integration
- `ClinicalMusicGenerator.tsx` - Clinically-informed generation
- `CreationsList.tsx` - User creations management
- `MusicGenerationTest.tsx` - Generation testing UI
- `MusicAnalyticsDashboard.tsx` - Analytics dashboard

#### Utilities
- `MusicMiniPlayer.tsx` - Compact player
- `MusicControls.tsx` - Basic controls
- `MusicMoodVisualization.tsx` - Mood visualization
- `MusicProgressBar.tsx` - Progress tracking
- `MusicPresetCard.tsx` - Preset display
- `MusicPreferencesModal.tsx` - Preferences dialog
- `QuotaIndicator.tsx` - Usage quota display
- `PremiumBadge.tsx` - Premium status indicator
- `SunoServiceStatus.tsx` - Service health indicator

### 2.3 Music Services (31 services)

**Core Services:**
1. **enhanced-music-service.ts** - Suno AI + TopMedia AI integration
2. **music-generator-service.ts** - Core generation logic
3. **orchestration.ts** - Clinical signal orchestration
4. **recommendations-service.ts** - ML recommendations
5. **preferences-service.ts** - User preferences
6. **preferences-learning-service.ts** - Adaptive learning
7. **playlist-service.ts** - Playlist CRUD operations
8. **favorites-service.ts** - Favorite tracks management
9. **history-service.ts** - Listening history tracking
10. **cache-service-advanced.ts** - IndexedDB caching

**Feature Services:**
- **badges-service.ts** - Achievement tracking
- **challenges-service.ts** - Daily challenges
- **social-service.ts** - Social/sharing features
- **quota-service.ts** - API quota management
- **storage-service.ts** - Supabase storage
- **session-service.ts** - Session management
- **user-service.ts** - User data

**Integrations:**
- **topMediaService.ts** - TopMedia AI API
- **recoApi.ts** - Reco API integration
- **emotion-music-mapping.ts** - Emotion → music mapping
- **presetMapper.ts** - Preset orchestration
- **presetMetadata.ts** - Preset metadata

**Utilities:**
- **error-handler.ts** - Centralized error handling
- **converters.ts** - Data conversion utilities
- **playlist-utils.ts** - Playlist utilities
- **playlist-data.ts** - Default playlist data
- **demo-tracks.ts** - Demo track data

### 2.4 Music Hooks (6+ custom hooks)

Located in `/src/features/music/` and various hook files:
- **useMusicEngine.ts** - Low-level music engine
- **useMusicSession.ts** - Session management
- **useMusic()** - Main music context hook
- **useMusicFavorites()** - Favorite tracks
- **useMusicJourney()** - Journey player
- **useUserMusicPreferences()** - Preferences
- **useMusicPreferencesLearning()** - Adaptive learning
- **useTasteChangeNotifications()** - Taste notifications
- **useAudioUrls()** - Audio URL management
- **useAdaptivePlayback()** - Adaptive playback
- **useMusicCache()** - Cache management

### 2.5 Music Context & State Management

**Location:** `/src/contexts/music/`

**Files:**
- `MusicContext.tsx` - Main provider
- `types.ts` - MusicContextType & MusicState
- `reducer.ts` - State reducer
- `index.ts` - Exports
- `mockMusicData.ts` - Mock data for testing
- `useMusicPlayback.ts` - Playback controls
- `useMusicPlaylist.ts` - Playlist controls
- `useMusicGeneration.ts` - Generation hooks
- `useMusicTherapeutic.ts` - Therapeutic features
- `README.md` - Documentation

**State Structure:**
```typescript
interface MusicState {
  currentTrack: MusicTrack | null
  isPlaying: boolean
  isPaused: boolean
  volume: number
  currentTime: number
  duration: number
  activePreset: MusicOrchestrationPreset
  playlist: MusicTrack[]
  currentPlaylistIndex: number
  shuffleMode: boolean
  repeatMode: 'none' | 'one' | 'all'
  isGenerating: boolean
  generationProgress: number
  playHistory: MusicTrack[]
  favorites: string[]
  therapeuticMode: boolean
  emotionTarget: string | null
  adaptiveVolume: boolean
}
```

### 2.6 Music Types

**Location:** `/src/types/music.ts` and `/src/types/music-generation.ts`

**Key Types:**
- `MusicTrack` - Track object with metadata
- `MusicPlaylist` - Playlist container
- `MusicGenerationRequest` - Generation parameters
- `MusicOrchestrationPreset` - Clinical presets
- `EmotionalMusicResponse` - Generation response
- `MusicBpmProfile` - BPM profiles (slow, medium, fast)
- `MusicTextureKey` - Texture types (calm, energetic, etc.)
- `MusicIntensityKey` - Intensity levels

### 2.7 Music Router Configuration

**Route:** `/app/music` (B2CMusicEnhanced)

Routes configured in `/src/routerV2/router.tsx`:
```typescript
const B2CMusicEnhanced = lazy(() => import('@/pages/B2CMusicEnhanced'));
const MusicAnalyticsPage = lazy(() => import('@/pages/MusicAnalyticsPage'));
const MusicProfilePage = lazy(() => import('@/pages/MusicProfilePage'));
const B2CMusicTherapyPremiumPage = lazy(() => import('@/pages/B2CMusicTherapyPremiumPage'));
const MusicQueueAdminPage = lazy(() => import('@/pages/admin/MusicQueueAdminPage'));
const MusicQueueMetricsPage = lazy(() => import('@/pages/admin/MusicQueueMetricsPage'));
const MusicAnalyticsDashboard = lazy(() => import('@/pages/admin/MusicAnalyticsDashboard'));
```

---

## 3. Page Structure Conventions

### Page Template Pattern

All B2C pages follow this structure:

```typescript
import React from 'react';
import { usePageSEO } from '@/hooks/usePageSEO';
import { ConsentGate } from '@/features/clinical-optin/ConsentGate';
import PageRoot from '@/components/common/PageRoot';
import { Card } from '@/components/ui/card';
// ... other imports

const MyPageComponent: React.FC = () => {
  // 1. Set SEO metadata
  usePageSEO({
    title: 'Page Title',
    description: 'Page description',
    keywords: 'keyword1, keyword2'
  });

  // 2. Component logic
  const [state, setState] = useState(...);
  // ... hooks and effects

  // 3. Render wrapped in ConsentGate
  return (
    <ConsentGate>
      <PageRoot>
        <div className="container">
          {/* Page content */}
        </div>
      </PageRoot>
    </ConsentGate>
  );
};

export default MyPageComponent;
```

### Key Conventions:
1. **SEO**: Use `usePageSEO()` hook
2. **Auth**: Wrap in `ConsentGate` for clinical consent
3. **Layout**: Use `PageRoot` wrapper
4. **Styling**: Tailwind + Shadcn components
5. **Toast notifications**: `useToast()` from hooks
6. **Navigation**: `useNavigate()` from react-router
7. **Data fetching**: Use hooks (TanStack Query)
8. **Error handling**: Use error boundary + Sentry

---

## 4. Existing Feature Implementations as Templates

### Similar Comprehensive Features:

#### 1. **VR Gallery Module** (`/pages/B2CVRGalaxyPage.tsx`)
- Complex 3D visualization
- Multiple interaction modes
- Immersive user experience
- Similar structure to music

#### 2. **AI Coach Module** (`/pages/B2CAICoachPage.tsx`)
- Conversational interface
- Multi-tab design
- Real-time interactions
- Medical disclaimers

#### 3. **Scan Module** (`/pages/B2CScanPage.tsx`)
- Multi-step workflows
- Real-time analysis
- Progress tracking
- Results visualization

#### 4. **Social Cocon** (`/pages/B2CSocialCoconPage.tsx`)
- Social interactions
- Real-time updates
- User profiles
- Leaderboards

#### 5. **Dashboard Pages** (`/pages/B2CDashboardPage.tsx`)
- Multiple widgets
- Data visualization
- Analytics integration
- Responsive grid layout

### Feature Module Pattern (`/src/features/`)

Most features follow this structure:
```
src/features/[feature-name]/
├── index.ts                    # Exports
├── [Feature]Context.tsx         # State provider
├── useCustomHook.ts            # Feature hooks
├── types.ts                    # Type definitions
├── services/                   # Business logic
└── components/                 # Feature-specific components
```

Example: `/src/features/music/`, `/src/features/scan/`, `/src/features/vr/`

---

## 5. Component Organization Patterns

### Component Hierarchy in Music Module:

```
Pages/
├── B2CMusicEnhanced (main)
│   ├── UnifiedMusicPlayer
│   │   ├── PlayerControls
│   │   ├── ProgressBar
│   │   ├── VolumeControl
│   │   └── TrackInfo
│   ├── MusicJourneyPlayer
│   ├── EmotionalMusicGenerator
│   ├── MusicAnalyticsDashboard
│   ├── WeeklyInsightsDashboard
│   ├── MusicBadgesDisplay
│   └── DailyChallengesPanel

├── MusicProfilePage
│   ├── MusicBadgesDisplay
│   ├── DailyChallengesPanel
│   └── SocialFriendsPanel

└── MusicAnalyticsPage
    ├── Chart visualizations
    └── Stats cards
```

---

## 6. Styling & UI Framework

### UI Component Library
- **Shadcn/UI** - Primary component library
  - Button, Card, Dialog, Tabs, Slider, Progress
  - Located in `/src/components/ui/`
  
- **Chakra UI** - Alternative components
  - Icons from @chakra-ui/icons
  
- **Radix UI** - Headless components
  - Dialog, Dropdown, Tabs, etc.
  
- **Lucide React** - Icons (primary)
  - 369+ icons available

### Tailwind CSS
- Configured with plugins
- Dark mode support (next-themes)
- Custom theme in `/src/theme/`
- Animations from tailwindcss-animate

### Animation
- **Framer Motion** - React animations
- Smooth transitions in lists, cards, modals

---

## 7. State Management Patterns

### 1. React Context (MusicContext)
Used for global music state - preferred for music features

### 2. Zustand Stores
Located in `/src/stores/`
- Lightweight alternative to Redux
- Used for app-wide state

### 3. React Query
For server state management
- Caching
- Auto-refetch
- Background sync

### 4. React Hook Form + Zod
For form state and validation

### 5. Custom Hooks
For specific feature logic
- `useMusic()` - Music context
- `useMusicPreferences()` - User preferences
- etc.

---

## 8. Data Flow Architecture

### Music Data Flow:
```
User Action (Play, Generate, etc.)
    ↓
React Component
    ↓
useMusic() hook (context)
    ↓
MusicContext reducer
    ↓
Service layer (enhanced-music-service, etc.)
    ↓
Supabase API / External API
    ↓
Response → Reducer → State Update → Component Re-render
```

### Async Data Patterns:
1. **TanStack Query** - For API calls
2. **useEffect + useState** - For simple side effects
3. **useReducer** - For complex state (MusicContext)

---

## 9. Current Music Features Implemented

✅ **Core Playback:**
- Play, pause, skip, seek
- Volume control
- Playlist management (add, remove, shuffle, repeat)
- Progress tracking

✅ **Generation:**
- Suno AI integration
- TopMedia AI integration
- Emotion-based generation
- Custom prompts

✅ **Orchestration:**
- Clinical signal detection
- Automatic preset switching
- Adaptive volume
- Intensity/texture control

✅ **Personalization:**
- User preferences learning
- Taste change detection
- Recommendation engine
- Favorite tracking

✅ **Gamification:**
- Badge system (30+ achievements)
- Daily challenges
- Level/XP progression
- Leaderboards (social)

✅ **Analytics:**
- Listening history
- Weekly insights
- Time tracking
- Engagement metrics

✅ **Social:**
- Playlist sharing
- Friend features
- Collaborative sessions (framework)
- Social notifications

✅ **UI/UX:**
- Vinyl record interface
- Immersive visualizations
- Responsive design
- Dark/light themes
- Accessibility features

---

## 10. Architecture Insights

### Strengths:
1. **Modular Design** - Clear separation of concerns
2. **Type Safety** - Strong TypeScript usage
3. **Reusable Components** - 500+ composable components
4. **Rich Features** - Music generation, analytics, social, gamification
5. **AI Integration** - Multiple AI providers
6. **Performance** - Optimized with React.lazy, code splitting
7. **Testing** - Test infrastructure in place
8. **Documentation** - Existing READMEs and analysis docs

### Areas for Enhancement:
1. **Documentation** - More JSDoc comments on services
2. **Error Handling** - Could be more granular
3. **Accessibility** - WCAG compliance audit needed
4. **Offline Support** - Service worker could be expanded
5. **Testing** - More unit/integration tests

---

## 11. Quick Developer Reference

### Using Music Features:

```typescript
// 1. Access music context
import { useMusic } from '@/hooks/useMusic';

const MyComponent = () => {
  const {
    state,           // MusicState
    play,            // Play track
    pause,           // Pause playback
    generateMusicForEmotion, // Generate music
    toggleFavorite,  // Save/unsave
  } = useMusic();
};

// 2. Generate music
const track = await enhancedMusicService.generateMusicWithTracking({
  title: "Relaxation",
  style: "ambient, meditation",
  instrumental: true,
  duration: 300
});

// 3. Get recommendations
const tracks = await recommendationsService.getRecommendations({
  emotion: "calm",
  limit: 5
});

// 4. Manage playlists
const playlist = await playlistService.createPlaylist({
  name: "My Playlist",
  tracks: [...],
  isPublic: false
});
```

---

## 12. File Size Metrics

- **Main Music Page** (`B2CMusicEnhanced.tsx`): 918 lines
- **Music Services Total**: ~350KB across 31 files
- **Music Components Total**: ~500KB across 80+ components
- **Types Definition**: ~50KB
- **Hooks**: ~100KB across 10+ custom hooks

---

## Summary

EmotionsCare's music module is a **world-class therapeutic music platform** with:

- ✅ Sophisticated AI-powered music generation
- ✅ Clinical signal-based orchestration
- ✅ Rich user engagement features (gamification, social)
- ✅ Advanced analytics and personalization
- ✅ Accessible, responsive UI with immersive visualizations
- ✅ Modular, maintainable architecture
- ✅ Comprehensive service layer
- ✅ Strong type safety with TypeScript

The codebase demonstrates **professional React/TypeScript practices** and can serve as a template for new feature development across the application.

