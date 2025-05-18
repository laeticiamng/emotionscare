
# Application Types

This directory contains all the official type definitions for the application. These types serve as the single source of truth for data structures throughout the codebase.

All modules must import their data types from this directory. Do not create local or duplicated type definitions elsewhere in the project.

## Guidelines for Type Definitions

1. **Single Source of Truth**: Each concept should have one definitive type definition.
2. **Consistency**: Property names should be consistent across all types (e.g., always use `thumbnailUrl` not `thumbnail`).
3. **Documentation**: Each type and non-obvious property should be documented with comments.
4. **Naming Conventions**: Use camelCase for property names and PascalCase for type names.
5. **Backward Compatibility**: When renaming properties, keep the old property as optional with a deprecation comment.

## Main Type Files

- `music.ts` - All music-related types (MusicTrack, MusicPlaylist, etc.)
- `emotion.ts` - Emotion tracking and detection types
- `chat.ts` - Chat and messaging types (`ChatHookResult`, `UseChatOptions`)
- `vr.ts` - VR session and experience types

## Using These Types

Always import types directly from these files, not from component files or duplicated definitions:

```typescript
// Correct
import { MusicTrack, MusicPlaylist } from '@/types/music';

// Incorrect
import { MusicTrack } from '@/components/MusicPlayer';
```

## Adding New Types

When adding a new type:

1. Decide which file it belongs in (or create a new one if it's a new domain)
2. Document the type with JSDoc comments
3. Make sure it follows naming conventions and is consistent with existing types
4. Add it to this README if it's a major type
