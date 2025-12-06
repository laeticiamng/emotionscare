/**
 * Hook principal pour audio-studio
 */

import { useAudioStudioMachine } from './useAudioStudioMachine';
import type { RecordingConfig } from './types';

const DEFAULT_CONFIG: RecordingConfig = {
  sampleRate: 44100,
  channelCount: 1,
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true
};

interface UseAudioStudioOptions {
  config?: Partial<RecordingConfig>;
}

export function useAudioStudio(options: UseAudioStudioOptions = {}) {
  const machine = useAudioStudioMachine();

  const config: RecordingConfig = {
    ...DEFAULT_CONFIG,
    ...options.config
  };

  const startRecording = () => machine.startRecording(config);

  return {
    recordingStatus: machine.state.recordingStatus,
    playbackStatus: machine.state.playbackStatus,
    tracks: machine.state.tracks,
    currentTrack: machine.state.currentTrack,
    elapsedTime: machine.state.elapsedTime,
    error: machine.state.error,
    startRecording,
    pauseRecording: machine.pauseRecording,
    resumeRecording: machine.resumeRecording,
    stopRecording: machine.stopRecording,
    deleteTrack: machine.deleteTrack,
    reset: machine.reset
  };
}
