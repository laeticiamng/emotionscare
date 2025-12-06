
# Music Context

This directory contains exports and utilities for the **unique** MusicContext used in the application.

## Important Guidelines

- For accessing the MusicContext, use **EXCLUSIVELY** the `useMusic` hook defined in `@/hooks/useMusic`.
- Any variation or duplication is prohibited and will be removed in the next code cleanup.
- All music-related functionality must go through this context.
- The `MusicContextType` in `@/types/music.ts` defines all available properties and methods.

## Structure

- `index.ts` - Exports for the context and hooks
- `mockMusicData.ts` - Mock data for testing/development

## Adding New Functionality

When adding new music-related features:

1. First update the `MusicContextType` in `@/types/music.ts`
2. Implement the feature in the provider in `MusicContext.tsx`
3. Use the `useMusic` hook to access it from components

## Legacy Hooks

The old provider implementations have been removed. Do **not** create new hooks
or providers. Always use `useMusic` and `MusicProvider` from this folder.
