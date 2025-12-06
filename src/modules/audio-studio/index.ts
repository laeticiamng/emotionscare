/**
 * Point d'entrée du module audio-studio
 */

export { AudioStudioMain } from './components/AudioStudioMain';
export { useAudioStudio } from './useAudioStudio';
export { AudioStudioService } from './audioStudioService';
export { RecordingControls } from './ui/RecordingControls';
export { TrackList } from './ui/TrackList';

export type {
  RecordingStatus,
  PlaybackStatus,
  AudioTrack,
  RecordingConfig,
  AudioStudioState,
  AudioMetadata
} from './types';
