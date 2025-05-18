
# Music Context

This directory contains the official Music Context and related utilities for the application.

## Important Guidelines

- For accessing the MusicContext, use **EXCLUSIVELY** the `useMusic` hook defined in `@/hooks/useMusic`.
- Any variation or duplication is prohibited and will be removed in the next code cleanup.
- All music-related functionality must go through this context.
- The `MusicContextType` in `@/types/music.ts` defines all available properties and methods.

## Structure

- `MusicContext.tsx` - The main context definition
- `index.ts` - Exports for the context and hooks
- `mockMusicData.ts` - Mock data for testing/development
- `types.ts` - (Deprecated) Types for backward compatibility

## Adding New Functionality

When adding new music-related features:

1. First update the `MusicContextType` in `@/types/music.ts`
2. Implement the feature in the provider in `MusicContext.tsx`
3. Use the `useMusic` hook to access it from components

## Legacy Hooks

The following hooks are deprecated and will be removed in future versions:

- `useMusicPlayer` - use `useMusic` instead
- `usePlayerContext` - use `useMusic` instead

Do not create new hooks that duplicate functionality already in the music context.
