# EmotionsCare Music Module - Quick Start Guide

## Your Question Answers

### 1. What is the app structure?
- **Framework**: Vite + React 18 SPA (Single Page Application)
- **Language**: TypeScript 5.4.5
- **Styling**: Tailwind CSS + Shadcn/UI components
- **State**: React Context (MusicContext) + Zustand + React Query
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Routing**: React Router v6 with lazy loading

### 2. What exists in the `/app/music` directory/path?
NOT a file directory - it's a ROUTE:
- **Route**: `/app/music` → `/src/pages/B2CMusicEnhanced.tsx` (918 lines)
- **Related pages**:
  - `/app/music/profile` → `/src/pages/MusicProfilePage.tsx`
  - `/app/music/analytics` → `/src/pages/MusicAnalyticsPage.tsx`
  - `/app/music/premium` → `/src/pages/B2CMusicTherapyPremiumPage.tsx`

**Physical file structure** instead:
```
src/
├── pages/
│   ├── B2CMusicEnhanced.tsx (MAIN - 918 lines)
│   ├── MusicProfilePage.tsx
│   ├── MusicAnalyticsPage.tsx
│   └── B2CMusicTherapyPremiumPage.tsx
├── components/music/
│   ├── 80+ music-specific components
│   ├── player/ (16 player sub-components)
│   └── page/ (4 page tab components)
├── services/music/
│   └── 31 service files (15,000+ lines of code)
├── contexts/music/
│   └── MusicContext.tsx + 8 supporting files
└── hooks/
    └── 10+ music-specific custom hooks
```

### 3. Main components and features already implemented

#### Core Playback
- Play/pause/skip/seek controls
- Volume control and equalizer
- Playlist management (create, edit, shuffle, repeat)
- Waveform and audio visualizations

#### AI Music Generation
- **Suno AI integration** - Advanced music generation
- **TopMedia AI** - Alternative generation provider
- Emotion-based generation
- Custom prompt support

#### Personalization
- User preferences learning
- Adaptive playlists
- Recommendation engine
- Taste change notifications

#### Gamification & Social
- Badge system (30+ achievements)
- Daily challenges with XP rewards
- Level progression
- Leaderboards
- Friend features
- Playlist sharing

#### Analytics & Metrics
- Listening history tracking
- Weekly insights dashboard
- Time spent analytics
- Engagement metrics
- Personal statistics

#### Advanced Features
- Spatial/3D audio controls
- Immersive fullscreen visualizer
- Synchronized lyrics display
- Collaborative listening sessions
- Therapeutic guided journeys

### 4. File structure and conventions

#### Page Template
```typescript
import { usePageSEO } from '@/hooks/usePageSEO';
import { ConsentGate } from '@/features/clinical-optin/ConsentGate';
import PageRoot from '@/components/common/PageRoot';

const MyPage: React.FC = () => {
  usePageSEO({ title: '...', description: '...' });
  return (
    <ConsentGate>
      <PageRoot>
        {/* Content */}
      </PageRoot>
    </ConsentGate>
  );
};
```

#### Component Naming
- Page components: `B2C{Feature}Page.tsx` or `{Feature}Page.tsx`
- Reusable components: `{Feature}{Component}.tsx`
- Utility components: stored in subdirectories like `player/`

#### Service Naming
- Primary: `{domain}-service.ts`
- Integrations: `{provider}Service.ts`
- Utilities: `{purpose}.ts`

#### Hook Naming
- Custom hooks: `use{Feature}.ts`
- All exported from `/hooks/` for consistency

### 5. Similar features as templates

#### Best examples to copy:
1. **B2CMusicEnhanced.tsx** (918 lines) - Full-featured page
2. **B2CVRGalaxyPage.tsx** - Complex immersive UX
3. **B2CAICoachPage.tsx** - Conversational interface
4. **B2CSocialCoconPage.tsx** - Social features

#### Feature module pattern:
```
src/features/[feature-name]/
├── index.ts
├── [Feature]Context.tsx
├── useCustomHook.ts
└── types.ts
```

Examples: `src/features/music/`, `src/features/scan/`, `src/features/vr/`

---

## How to Access Music Features

### Use the Music Hook (RECOMMENDED)
```typescript
import { useMusic } from '@/hooks/useMusic';

function MyComponent() {
  const {
    state,           // Current music state
    play,            // Play(track?)
    pause,           // Pause()
    seek,            // Seek(time)
    setVolume,       // SetVolume(0-1)
    generateMusicForEmotion, // GenerateMusicForEmotion(emotion)
    toggleFavorite,  // ToggleFavorite(trackId)
  } = useMusic();
}
```

### Use Services Directly
```typescript
import { enhancedMusicService } from '@/services/music/enhanced-music-service';
import { recommendationsService } from '@/services/music/recommendations-service';
import { playlistService } from '@/services/music/playlist-service';

// Generate music
const track = await enhancedMusicService.generateMusicWithTracking({
  title: "Relaxation",
  style: "ambient, meditation",
  instrumental: true
});

// Get recommendations
const tracks = await recommendationsService.getRecommendations({
  emotion: "calm",
  limit: 5
});

// Manage playlists
const playlist = await playlistService.createPlaylist({
  name: "My Playlist",
  tracks: [],
  isPublic: false
});
```

---

## Key Files to Study

### Start Here (in order)
1. `/src/pages/B2CMusicEnhanced.tsx` - Main page structure
2. `/src/contexts/music/MusicContext.tsx` - State management
3. `/src/components/music/UnifiedMusicPlayer.tsx` - Core player
4. `/src/services/music/enhanced-music-service.ts` - AI generation

### Reference
5. `/src/services/music/README.md` - Service architecture
6. `/src/contexts/music/README.md` - Context guidelines
7. `/ANALYSE_COMPLETE_MUSIC_MODULE.md` - Detailed analysis
8. `/EMOTIONSCARE_CODEBASE_OVERVIEW.md` - Full overview

---

## Tech Stack Details

### UI Components
- **Shadcn/UI** - Primary (Button, Card, Dialog, Tabs, etc.)
- **Radix UI** - Primitives (Dialog, Dropdown, etc.)
- **Chakra UI** - Alternative components
- **Lucide React** - Icons (369+ available)
- **Framer Motion** - Animations

### Data Management
- **React Context** - Global music state
- **Zustand** - App-wide state
- **React Query** - Server state
- **React Hook Form** + **Zod** - Forms & validation

### APIs & Integrations
- **Supabase** - Database & Auth
- **Suno AI** - Music generation
- **TopMedia AI** - Alternative generation
- **Hume AI** - Emotion detection
- **OpenAI** - Additional AI features

---

## Next Steps

1. Read `/EMOTIONSCARE_CODEBASE_OVERVIEW.md` for complete details
2. Check `/MUSIC_FILES_REFERENCE.txt` for all file locations
3. Review `/src/pages/B2CMusicEnhanced.tsx` to see full implementation
4. Examine `/src/services/music/enhanced-music-service.ts` for generation logic
5. Study `/src/contexts/music/MusicContext.tsx` for state patterns

---

## Common Development Tasks

### Add a new music component
1. Create file: `/src/components/music/MyComponent.tsx`
2. Use music hook: `const { state } = useMusic();`
3. Import from shadcn: `import { Button } from '@/components/ui/button';`
4. Add to index: `/src/components/music/index.ts`

### Generate music programmatically
```typescript
const { generateMusicForEmotion } = useMusic();
const track = await generateMusicForEmotion("calm");
```

### Add a new music service
1. Create: `/src/services/music/my-service.ts`
2. Export singleton instance
3. Implement error handling with error-handler.ts
4. Use consistent logging patterns

### Create a music page
1. Copy B2CMusicEnhanced.tsx structure
2. Use usePageSEO for SEO
3. Wrap in ConsentGate for clinical compliance
4. Use PageRoot wrapper
5. Add to router.tsx

---

The music module is **production-ready** and demonstrates best practices for the entire codebase!
