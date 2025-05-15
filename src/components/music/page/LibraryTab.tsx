
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MusicLibraryProps } from '@/types';

const LibraryTab: React.FC<MusicLibraryProps> = ({ 
  playlists = [],
  onSelectTrack,
  onSelectPlaylist
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium mb-3">Toutes vos playlists</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {playlists.map(playlist => (
          <Card 
            key={playlist.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onSelectPlaylist?.(playlist)}
          >
            <CardContent className="p-4">
              <h3 className="font-medium">{playlist.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {playlist.description || 'Collection de morceaux'}
              </p>
              <div className="text-xs text-muted-foreground mt-2">
                {playlist.tracks.length} morceaux
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {playlists.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Vous n'avez pas encore créé de playlists.
          </p>
        </div>
      )}
    </div>
  );
};

export default LibraryTab;
