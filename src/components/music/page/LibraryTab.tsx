
import React from 'react';
import { MusicLibraryProps, MusicTrack, MusicPlaylist } from '@/types/music';

const LibraryTab: React.FC<MusicLibraryProps> = ({ 
  playlists = [], 
  onSelectTrack, 
  onSelectPlaylist 
}) => {
  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Bibliothèque musicale</h2>
      <div className="space-y-6">
        {playlists.map(playlist => (
          <div key={playlist.id} className="space-y-2">
            <h3 className="font-medium">{playlist.name || playlist.title}</h3>
            <p className="text-sm text-muted-foreground">{playlist.description}</p>
            <button 
              onClick={() => onSelectPlaylist(playlist)}
              className="text-sm text-primary hover:underline"
            >
              Voir la playlist
            </button>
          </div>
        ))}
        
        {playlists.length === 0 && (
          <p className="text-muted-foreground">Aucune playlist disponible</p>
        )}
      </div>
    </div>
  );
};

export default LibraryTab;
