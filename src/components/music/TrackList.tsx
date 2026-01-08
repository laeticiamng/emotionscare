import React, { useCallback } from 'react';
import type { MusicTrack } from '@/types/music';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Play, Pause, Heart, MoreVertical, ListPlus, Share2, Clock, Shuffle } from 'lucide-react';
import { formatDuration } from '@/utils/musicCompatibility';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusicPlayerFavorites } from '@/hooks/music/useMusicSettings';

interface TrackListProps {
  tracks: MusicTrack[];
  currentTrack?: MusicTrack | null;
  isPlaying?: boolean;
  onTrackSelect?: (track: MusicTrack) => void;
  onTrackPause?: () => void;
  onAddToQueue?: (track: MusicTrack) => void;
  onAddToPlaylist?: (track: MusicTrack) => void;
  showActions?: boolean;
}

const TrackList: React.FC<TrackListProps> = ({
  tracks,
  currentTrack,
  isPlaying = false,
  onTrackSelect,
  onTrackPause,
  onAddToQueue,
  onAddToPlaylist,
  showActions = true,
}) => {
  const { value: favoritesArray, setValue: setFavoritesArray } = useMusicPlayerFavorites();
  const favorites = new Set(favoritesArray.map((f: any) => f.id || f));
  const [hoveredTrack, setHoveredTrack] = React.useState<string | null>(null);

  const toggleFavorite = useCallback((trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isFav = favorites.has(trackId);
    if (isFav) {
      setFavoritesArray((prev: any[]) => prev.filter((f: any) => (f.id || f) !== trackId));
      toast.success('Retiré des favoris');
    } else {
      setFavoritesArray((prev: any[]) => [...prev, { id: trackId, addedAt: new Date().toISOString() }]);
      toast.success('Ajouté aux favoris ❤️');
    }
  }, [favorites, setFavoritesArray]);

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
      {/* Playlist controls - responsive */}
      {showActions && tracks.length > 1 && (
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pb-2 border-b border-border/50">
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={handlePlayAll} 
            className="gap-1 sm:gap-2 h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
          >
            <Play className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            <span className="hidden xs:inline">Tout</span> lire
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleShufflePlay} 
            className="gap-1 sm:gap-2 h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
          >
            <Shuffle className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            Aléatoire
          </Button>
          <span className="ml-auto text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
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
                  "flex items-center p-2 sm:p-3 rounded-lg hover:bg-accent cursor-pointer transition-all group touch-manipulation",
                  isCurrent && "bg-accent ring-1 ring-primary/30"
                )}
                onClick={() => onTrackSelect?.(track)}
                onMouseEnter={() => setHoveredTrack(track.id)}
                onMouseLeave={() => setHoveredTrack(null)}
              >
                {/* Track number / Play button - responsive */}
                <div className="flex-shrink-0 w-6 sm:w-8 mr-1.5 sm:mr-2 text-center">
                  {isHovered || isCurrent ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 sm:h-8 sm:w-8"
                      aria-label={isCurrent && isPlaying ? "Mettre en pause" : "Lire"}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isCurrent && isPlaying) {
                          onTrackPause?.();
                        } else {
                          onTrackSelect?.(track);
                        }
                      }}
                    >
                      {isCurrent && isPlaying ? (
                        <Pause className="h-3 w-3 sm:h-4 sm:w-4" />
                      ) : (
                        <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                    </Button>
                  ) : (
                    <span className="text-xs sm:text-sm text-muted-foreground">{index + 1}</span>
                  )}
                </div>
                
                {/* Track info - responsive */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <p className={cn(
                      "text-xs sm:text-sm font-medium truncate",
                      isCurrent ? "text-primary" : "text-foreground"
                    )}>
                      {track.title}
                    </p>
                    {isFavorite && <Heart className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-red-500 text-red-500 flex-shrink-0" />}
                  </div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    {track.artist}
                  </p>
                </div>

                {/* Duration - responsive */}
                <div className="text-[10px] sm:text-xs text-muted-foreground mx-1.5 sm:mx-3 hidden xs:block">
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
