
// Export each component individually
// IMPORTANT: L'ordre des exports est important pour éviter les dépendances circulaires
export { default as MusicControls } from './MusicControls';
export { default as ProgressBar } from './ProgressBar';
export { default as PlayerControls } from './PlayerControls';
export { default as TrackInfo } from './TrackInfo';
export { default as VolumeControl } from './VolumeControl';
export { default as MusicPlayer } from './MusicPlayer';
export { default as MusicDrawer } from './MusicDrawer';
// Nous n'importons plus useAudioPlayer ici car il est maintenant dans src/hooks/
