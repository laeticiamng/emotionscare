import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Music, Play, Clock, Heart } from 'lucide-react';
import { MusicTrack, MusicPlaylist } from '@/types/music';

interface LibraryTabProps {
  playlists?: MusicPlaylist[];
  onSelectTrack?: (track: MusicTrack) => void;
  onSelectPlaylist?: (playlist: MusicPlaylist) => void;
}

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const LibraryTab: React.FC<LibraryTabProps> = ({ 
  playlists = [],
  onSelectTrack,
  onSelectPlaylist
}) => {
  const allTracks = playlists.flatMap(playlist => playlist.tracks || []);
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Music className="h-5 w-5 text-primary" />
        Bibliothèque musicale
      </h2>
      
      {/* Playlists Section */}
      {playlists.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mes Playlists</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {playlists.map((playlist) => (
                <button
                  key={playlist.id}
                  onClick={() => onSelectPlaylist?.(playlist)}
                  className="p-4 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Music className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{playlist.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {playlist.tracks.length} titre{playlist.tracks.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Tracks Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tous les titres</CardTitle>
        </CardHeader>
        <CardContent>
          {allTracks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun titre dans votre bibliothèque</p>
              <p className="text-sm mt-2">Ajoutez des titres à vos playlists pour les voir ici</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {allTracks.map((track) => (
                  <div
                    key={track.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/40 transition-colors group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {track.coverUrl ? (
                        <img 
                          src={track.coverUrl} 
                          alt={track.title}
                          className="w-10 h-10 rounded object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                          <Music className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{track.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {track.mood && (
                        <Badge variant="outline" className="text-xs">
                          {track.mood}
                        </Badge>
                      )}
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(track.duration)}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => onSelectTrack?.(track)}
                        aria-label={`Lire ${track.title}`}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LibraryTab;
