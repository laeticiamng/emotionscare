# Music Context Documentation

## Overview

This is the official music context for the application. All components requiring music functionality should use this context via the `useMusic` hook.

## Usage

```tsx
import { useMusic } from '@/contexts/MusicContext';

function MusicComponent() {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    playTrack,
    // ...other methods and properties
  } = useMusic();
  
  // Use the music context
}
```

## Available Methods and Properties

The music context provides a comprehensive set of methods and properties for music playback, playlist management, and emotion-based recommendations:

### State Properties:
- `isInitialized`: Boolean indicating if the music system is ready
- `isPlaying`: Boolean indicating if music is currently playing
- `currentTrack`: The currently selected track (or null)
- `volume`: Current volume level (0-1)
- `duration`: Duration of the current track in seconds
- `currentTime`: Current playback position in seconds
- `muted`: Boolean indicating if audio is muted
- `playlist`: Current playlist object
- `emotion`: Current selected emotion for music recommendations
- `openDrawer`: Boolean controlling the music drawer UI component

### Playback Methods:
- `playTrack(track)`: Start playing a specific track
- `pauseTrack()`: Pause the current track
- `resumeTrack()`: Resume playing the current track
- `togglePlay()`: Toggle between play and pause
- `nextTrack()`: Skip to the next track in playlist
- `previousTrack()` or `prevTrack()`: Go to the previous track in playlist
- `seekTo(time)`: Jump to specific time in the track

### Playlist Methods:
- `setPlaylist(playlist)`: Set the current playlist
- `loadPlaylistForEmotion(emotion)`: Load a playlist based on an emotion
- `getRecommendationByEmotion(emotion)`: Get track recommendations for an emotion
- `findTracksByMood(mood)`: Find tracks matching a specific mood

### UI Control:
- `setOpenDrawer(isOpen)`: Control the visibility of the music drawer
- `toggleDrawer()`: Toggle the music drawer visibility

### Other Methods:
- `setVolume(volume)`: Set the audio volume
- `setMute(isMuted)`: Set muted state
- `toggleMute()`: Toggle audio mute
- `generateMusic(prompt)`: Generate AI music based on a text prompt

## Demo/Test

To test if the music context is working correctly, you can use the `TestMusicContext` component located in `src/components/test/TestMusicContext.tsx`.

## Important Notes

- DO NOT create multiple instances of MusicProvider in your application
- Always use this context through the `useMusic` hook
- When implementing new music-related features, extend this context instead of creating new ones
