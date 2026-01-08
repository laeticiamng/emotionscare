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
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] touch-manipulation"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      aria-label={`Playlist ${playlist.name}`}
    >
      {/* Cover - aspect ratio responsive */}
      <div className="relative aspect-square bg-gradient-to-br from-primary/20 to-accent/20">
        {playlist.coverUrl ? (
          <img
            src={playlist.coverUrl}
            alt={playlist.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-muted-foreground/50" />
          </div>
        )}
        
        {/* Play button overlay - responsive */}
        <Button
          size="icon"
          className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full shadow-lg opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
          onClick={handlePlay}
          aria-label={`Jouer ${playlist.name}`}
        >
          <Play className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ml-0.5" />
        </Button>
      </div>

      <CardContent className="p-2.5 sm:p-3 md:p-4">
        <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">
          {playlist.name}
        </h3>
        {playlist.description && (
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-0.5 sm:mt-1">
            {playlist.description}
          </p>
        )}
        <div className="flex items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-muted-foreground">
          <span>{playlist.tracks.length} titres</span>
          <span className="flex items-center gap-0.5 sm:gap-1">
            <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            {formatTotalDuration(playlist.tracks)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
});

export default PlaylistCard;
