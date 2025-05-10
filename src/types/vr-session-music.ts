
import { VRSession, VRSessionTemplate } from './vr';
import { MusicTrack } from './music';

export interface VRSessionWithMusic extends VRSession {
  music_track_id?: string;
  music_track?: MusicTrack;
}

export interface VRSessionWithMusicProps {
  template: VRSessionTemplate;
  onComplete?: (session: VRSession) => void;
  onExit?: () => void;
  initialTrack?: MusicTrack;
}
