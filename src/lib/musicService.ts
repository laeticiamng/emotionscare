
import { supabase } from '@/integrations/supabase/client';
import { MusicTrack, MusicPlaylist } from '@/types/music';

// Re-export everything from the service modules
export { getPlaylist } from '@/services/music/playlist-service';
export { saveUserCurrentTrack, getUserListeningHistory } from '@/services/music/user-service';
export { 
  convertMusicTrackToTrack,
  convertTrackToMusicTrack,
  convertMusicPlaylistToPlaylist,
  convertPlaylistToMusicPlaylist
} from '@/services/music/converters';
export type { Track, Playlist } from '@/services/music/types';
