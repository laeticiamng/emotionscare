
export interface AudioTrack {
  id: string;
  title: string;
  artist?: string;
  duration: number;
  url: string;
  coverUrl?: string;
  mood?: string;
  bpm?: number;
  genre?: string;
}

export interface AudioPlaylist {
  id: string;
  name: string;
  description?: string;
  tracks: AudioTrack[];
  coverUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AudioProcessorProps {
  isRecording: boolean;
  onResult?: (result: any) => void;
  onProcessingChange?: (isProcessing: boolean) => void;
}
