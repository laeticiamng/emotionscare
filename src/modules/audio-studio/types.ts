/**
 * Types pour le module audio-studio
 */

export type RecordingStatus = 'idle' | 'recording' | 'paused' | 'stopped';
export type PlaybackStatus = 'idle' | 'playing' | 'paused';

export interface AudioTrack {
  id: string;
  name: string;
  blob: Blob;
  duration: number;
  volume: number;
  createdAt: Date;
}

export interface RecordingConfig {
  sampleRate: number;
  channelCount: number;
  echoCancellation: boolean;
  noiseSuppression: boolean;
  autoGainControl: boolean;
}

export interface AudioStudioState {
  recordingStatus: RecordingStatus;
  playbackStatus: PlaybackStatus;
  tracks: AudioTrack[];
  currentTrack: AudioTrack | null;
  elapsedTime: number;
  error: string | null;
}

export interface AudioMetadata {
  format: string;
  bitrate: number;
  size: number;
}
