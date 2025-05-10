
import { MusicTrack, VRSessionTemplate } from './index';

export interface VRSessionWithMusicProps {
  session?: VRSessionTemplate;
  musicTracks?: MusicTrack[];
  onSessionComplete: () => void;
  isAudioOnly?: boolean;
  videoUrl?: string;
  audioUrl?: string;
  emotion?: string;
}
