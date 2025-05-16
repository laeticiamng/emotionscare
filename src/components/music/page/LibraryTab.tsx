
import React from 'react';
import MusicLibrary from './MusicLibrary';
import { MusicLibraryProps, MusicTrack, MusicPlaylist } from '@/types';

const LibraryTab: React.FC<MusicLibraryProps> = ({ 
  playlists = [],
  onSelectTrack,
  onSelectPlaylist
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Bibliothèque musicale</h2>
      
      <MusicLibrary 
        playlists={playlists} 
        onSelectTrack={onSelectTrack}
        onSelectPlaylist={onSelectPlaylist}
      />
    </div>
  );
};

export default LibraryTab;
