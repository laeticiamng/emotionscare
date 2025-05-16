
import React from 'react';
import MusicLibrary from './MusicLibrary';
import { MusicTrack, MusicPlaylist } from '@/types/music';

interface LibraryTabProps {
  playlists?: MusicPlaylist[];
  onSelectTrack?: (track: MusicTrack) => void;
  onSelectPlaylist?: (playlist: MusicPlaylist) => void;
}

const LibraryTab: React.FC<LibraryTabProps> = ({ 
  playlists = [],
  onSelectTrack,
  onSelectPlaylist
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Bibliothèque musicale</h2>
      
      <MusicLibrary 
        tracks={playlists.flatMap(playlist => playlist.tracks)}
        playlists={playlists} 
        onTrackSelect={onSelectTrack}
        onSelectPlaylist={onSelectPlaylist}
      />
    </div>
  );
};

export default LibraryTab;
