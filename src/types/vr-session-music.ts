
import { VRSessionTemplate } from './vr';
import { MusicTrack } from './music';

export interface VRSessionMusic {
  id: string;
  session_id: string;
  track_id: string;
  played_at: string | Date;
  duration: number;
  user_id: string;
  track_data?: MusicTrack;
}
