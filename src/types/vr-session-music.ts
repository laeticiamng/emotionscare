// @ts-nocheck

import { MusicTrack } from './music';
import { VRSession } from './vr';

export interface VRSessionMusicAssociation {
  id: string;
  vr_session_id: string;
  music_track_id: string;
  position: number;
  start_time?: number;
  end_time?: number;
}

export interface VRSessionWithMusic extends VRSession {
  musicTracks: MusicTrack[];
}
