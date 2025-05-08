
// Export each component individually
// IMPORTANT: Order of exports is important to avoid circular dependencies
export { default as MusicControls } from './MusicControls';
export { default as ProgressBar } from './ProgressBar';
export { default as PlayerControls } from './PlayerControls';
export { default as TrackInfo } from './TrackInfo';
export { default as VolumeControl } from './VolumeControl';
export { default as MusicPlayer } from './MusicPlayer';
export { default as MusicDrawer } from './MusicDrawer';
// We now use the useAudioPlayer hook from @/hooks/useAudioPlayer.tsx
