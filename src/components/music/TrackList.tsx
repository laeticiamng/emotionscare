import React, { useState, useCallback } from 'react';
import type { MusicTrack } from '@/types/music';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Play, Pause, Heart, MoreVertical, ListPlus, Share2, Clock, Shuffle } from 'lucide-react';
import { formatDuration } from '@/utils/musicCompatibility';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface TrackListProps {
  tracks: MusicTrack[];
  currentTrack?: MusicTrack | null;
  isPlaying?: boolean;
  onTrackSelect?: (track: MusicTrack) => void;
  onAddToQueue?: (track: MusicTrack) => void;
  onAddToPlaylist?: (track: MusicTrack) => void;
  showActions?: boolean;
}

const TrackList: React.FC<TrackListProps> = ({
  tracks,
  currentTrack,
  isPlaying = false,
  onTrackSelect,
  onAddToQueue,
  onAddToPlaylist,
  showActions = true,
}) => {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('music-favorites');
    return new Set(saved ? JSON.parse(saved) : []);
  });
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);

  const toggleFavorite = useCallback((trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(trackId)) {
        next.delete(trackId);
        toast.success('Retiré des favoris');
      } else {
        next.add(trackId);
        toast.success('Ajouté aux favoris ❤️');
      }
      localStorage.setItem('music-favorites', JSON.stringify([...next]));
      return next;
    });
  }, []);

  const handleShare = async (track: MusicTrack, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `🎵 J'écoute "${track.title}" par ${track.artist} sur EmotionsCare`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch {
        navigator.clipboard.writeText(shareText);
        toast.success('Lien copié !');
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Lien copié !');
    }
  };

  const handleAddToQueue = (track: MusicTrack, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToQueue?.(track);
    toast.success(`"${track.title}" ajouté à la file d'attente`);
  };

  const handleAddToPlaylist = (track: MusicTrack, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToPlaylist?.(track);
  };

  const handlePlayAll = () => {
    if (tracks.length > 0 && onTrackSelect) {
      onTrackSelect(tracks[0]);
      toast.success('Lecture de la playlist');
    }
  };

  const handleShufflePlay = () => {
    if (tracks.length > 0 && onTrackSelect) {
      const randomIndex = Math.floor(Math.random() * tracks.length);
      onTrackSelect(tracks[randomIndex]);
      toast.success('Lecture aléatoire');
    }
  };

  if (!tracks || tracks.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Aucune piste disponible
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Playlist controls */}
      {showActions && tracks.length > 1 && (
        <div className="flex items-center gap-2 pb-2 border-b border-border/50">
          <Button size="sm" variant="secondary" onClick={handlePlayAll} className="gap-2">
            <Play className="h-3 w-3" />
            Tout lire
          </Button>
          <Button size="sm" variant="outline" onClick={handleShufflePlay} className="gap-2">
            <Shuffle className="h-3 w-3" />
            Aléatoire
          </Button>
          <span className="ml-auto text-xs text-muted-foreground">
            {tracks.length} pistes • {formatDuration(tracks.reduce((acc, t) => acc + (t.duration || 0), 0))}
          </span>
        </div>
      )}

      {/* Track list */}
      <div className="space-y-1">
        <AnimatePresence>
          {tracks.map((track, index) => {
            const isCurrent = currentTrack?.id === track.id;
            const isFavorite = favorites.has(track.id);
            const isHovered = hoveredTrack === track.id;
            
            return (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className={cn(
                  "flex items-center p-3 rounded-lg hover:bg-accent cursor-pointer transition-all group",
                  isCurrent && "bg-accent ring-1 ring-primary/30"
                )}
                onClick={() => onTrackSelect?.(track)}
                onMouseEnter={() => setHoveredTrack(track.id)}
                onMouseLeave={() => setHoveredTrack(null)}
              >
                {/* Track number / Play button */}
                <div className="flex-shrink-0 w-8 mr-2 text-center">
                  {isHovered || isCurrent ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      aria-label={isCurrent && isPlaying ? "Mettre en pause" : "Lire"}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTrackSelect?.(track);
                      }}
                    >
                      {isCurrent && isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  ) : (
                    <span className="text-sm text-muted-foreground">{index + 1}</span>
                  )}
                </div>
                
                {/* Track info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={cn(
                      "text-sm font-medium truncate",
                      isCurrent ? "text-primary" : "text-foreground"
                    )}>
                      {track.title}
                    </p>
                    {isFavorite && <Heart className="h-3 w-3 fill-red-500 text-red-500 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {track.artist}
                  </p>
                </div>

                {/* Duration */}
                <div className="text-xs text-muted-foreground mx-3 hidden sm:block">
                  {formatDuration(track.duration)}
                </div>

                {/* Actions */}
                {showActions && (
                  <div className={cn(
                    "flex items-center gap-1 transition-opacity",
                    isHovered ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => toggleFavorite(track.id, e)}
                      aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                    >
                      <Heart className={cn(
                        "h-4 w-4 transition-colors",
                        isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-red-500"
                      )} />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => e.stopPropagation()}
                          aria-label="Plus d'options"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {onAddToQueue && (
                          <DropdownMenuItem onClick={(e) => handleAddToQueue(track, e as unknown as React.MouseEvent)}>
                            <Clock className="h-4 w-4 mr-2" />
                            Ajouter à la file d'attente
                          </DropdownMenuItem>
                        )}
                        {onAddToPlaylist && (
                          <DropdownMenuItem onClick={(e) => handleAddToPlaylist(track, e as unknown as React.MouseEvent)}>
                            <ListPlus className="h-4 w-4 mr-2" />
                            Ajouter à une playlist
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={(e) => handleShare(track, e as unknown as React.MouseEvent)}>
                          <Share2 className="h-4 w-4 mr-2" />
                          Partager
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TrackList;
