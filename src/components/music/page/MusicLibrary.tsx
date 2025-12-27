import React from 'react';
import { MusicTrack, MusicPlaylist } from '@/types/music';
import TrackList from '../TrackList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface MusicLibraryProps {
  playlists?: MusicPlaylist[];
  onSelectTrack?: (track: MusicTrack) => void;
  onSelectPlaylist?: (playlist: MusicPlaylist) => void;
  currentTrack?: MusicTrack | null;
  isPlaying?: boolean;
}

const MusicLibrary: React.FC<MusicLibraryProps> = ({
  playlists = [],
  onSelectTrack,
  onSelectPlaylist,
  currentTrack,
  isPlaying
}) => {
  // Ensure playlists is always an array
  const safePlaylists = Array.isArray(playlists) ? playlists : [];

  return (
    <div className="space-y-4">
      {safePlaylists.map((playlist) => (
        <Card key={playlist.id} className="shadow-md">
          <CardHeader>
            <CardTitle 
              className="text-lg font-semibold cursor-pointer hover:underline" 
              onClick={() => onSelectPlaylist?.(playlist)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelectPlaylist?.(playlist)}
              aria-label={`Ouvrir la playlist ${playlist.name}`}
            >
              {playlist.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea>
              <TrackList
                tracks={playlist.tracks || []}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onTrackSelect={onSelectTrack}
              />
            </ScrollArea>
          </CardContent>
        </Card>
      ))}
      
      {safePlaylists.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Aucune playlist disponible</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MusicLibrary;
