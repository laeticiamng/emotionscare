# Music Feature

This directory contains all code related to music generation and music therapy.

## Structure

```
music/
├── components/          # React components for music generation
│   ├── MusicGenerator.tsx
│   ├── MusicPlayer.tsx
│   ├── EmotionMusicMapper.tsx
│   └── index.ts
├── hooks/              # Custom hooks for music
│   ├── useMusicGeneration.ts
│   ├── useMusicSessions.ts
│   ├── useCreateMusic.ts
│   └── index.ts
├── services/           # API client and business logic
│   ├── musicApi.ts
│   ├── sunoService.ts
│   └── index.ts
├── types/              # Local types (if not in contracts)
│   └── index.ts
└── index.ts            # Public exports
```

## Usage

```typescript
// Import from the feature
import { MusicGenerator, useMusicGeneration } from '@/features/music';

// Or import specific items
import { useMusicSessions } from '@/features/music/hooks';
import { musicApi } from '@/features/music/services';
```

## Music Generation Flow

1. **Emotion Detection** → Capture user's emotional state
2. **Music Configuration** → Map emotion to music style/parameters
3. **Generation Request** → Call Suno API via backend
4. **Polling/Callback** → Wait for generation completion
5. **Playback** → Stream or download generated music

## Integration with Suno AI

This feature integrates with Suno AI for music generation. The API client handles:
- Custom and instrumental mode
- Multiple model versions (V3_5, V4, V4_5, V5)
- Style customization
- Callback handling for async generation
