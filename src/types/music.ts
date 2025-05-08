
// Importing the MusicTrack and Playlist from index for consistency
import { MusicTrack, MusicPlaylist as Playlist } from '@/types';

// Re-exporting with the correct type definitions
export type { MusicTrack, Playlist };

// Types utilisés par les services de musique (maintaining backward compatibility)
export interface Track extends MusicTrack {}

// Make sure that this type is only used for legacy purposes
// and that new code uses MusicTrack from the main types
