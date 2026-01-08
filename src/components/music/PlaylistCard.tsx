/**
 * Carte de playlist
 */
import React, { memo } from 'react';
import { MusicPlaylist } from '@/types/music';
import { useMusic } from '@/contexts/MusicContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Music, Clock } from 'lucide-react';

interface PlaylistCardProps {
  playlist: MusicPlaylist;
  onClick?: () => void;
}

function formatTotalDuration(tracks: { duration: number }[]): string {
  const totalSeconds = tracks.reduce((acc, track) => acc + track.duration, 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes} min`;
}

export const PlaylistCard = memo(function PlaylistCard({
  playlist,
  onClick,
}: PlaylistCardProps) {
  const { setPlaylist, play } = useMusic();

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlaylist(playlist.tracks);
    if (playlist.tracks.length > 0) {
      play(playlist.tracks[0]);
    }
  };

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02]"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      aria-label={`Playlist ${playlist.name}`}
    >
      {/* Cover */}
      <div className="relative aspect-square bg-gradient-to-br from-primary/20 to-accent/20">
        {playlist.coverUrl ? (
          <img
            src={playlist.coverUrl}
            alt={playlist.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music className="h-16 w-16 text-muted-foreground/50" />
          </div>
        )}
        
        {/* Play button overlay */}
        <Button
          size="icon"
          className="absolute bottom-3 right-3 h-12 w-12 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handlePlay}
          aria-label={`Jouer ${playlist.name}`}
        >
          <Play className="h-6 w-6 ml-1" />
        </Button>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground truncate">
          {playlist.name}
        </h3>
        {playlist.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {playlist.description}
          </p>
        )}
        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
          <span>{playlist.tracks.length} titres</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTotalDuration(playlist.tracks)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
});

export default PlaylistCard;
