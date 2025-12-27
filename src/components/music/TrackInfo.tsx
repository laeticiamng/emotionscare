import React, { useState } from 'react';
import { MusicTrack } from '@/types/music';
import { getTrackCover, getTrackTitle, getTrackArtist } from '@/utils/musicCompatibility';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Heart, MoreHorizontal, Play, Pause, Share2, ListPlus, Radio, Clock, Disc3, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TrackInfoProps {
  track: MusicTrack;
  className?: string;
  isPlaying?: boolean;
  isLiked?: boolean;
  showDuration?: boolean;
  showBpm?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onPlay?: () => void;
  onPause?: () => void;
  onLike?: () => void;
  onAddToPlaylist?: () => void;
  onShare?: () => void;
  onRadio?: () => void;
}

const TrackInfo: React.FC<TrackInfoProps> = ({ 
  track, 
  className = '',
  isPlaying = false,
  isLiked = false,
  showDuration = true,
  showBpm = false,
  size = 'md',
  onPlay,
  onPause,
  onLike,
  onAddToPlaylist,
  onShare,
  onRadio
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const coverUrl = getTrackCover(track);
  const title = getTrackTitle(track);
  const artist = getTrackArtist(track);
  const duration = (track as any).duration || (track as any).duration_seconds;
  const bpm = (track as any).bpm || (track as any).tempo;
  const mood = (track as any).mood || (track as any).emotion;

  const formatDuration = (seconds?: number) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const sizeConfig = {
    sm: { cover: 'w-8 h-8', text: 'text-sm', subtext: 'text-xs' },
    md: { cover: 'w-12 h-12', text: 'text-base', subtext: 'text-sm' },
    lg: { cover: 'w-16 h-16', text: 'text-lg', subtext: 'text-base' }
  };

  const config = sizeConfig[size];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Écoute "${title}" par ${artist} sur EmotionsCare`,
          url: window.location.href
        });
      } catch (err) {
        // Ignorer si annulé
      }
    }
    onShare?.();
  };

  return (
    <motion.div 
      className={cn("flex items-center gap-3 group", className)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Cover avec overlay de lecture */}
      <div className={cn("flex-shrink-0 relative rounded-md overflow-hidden", config.cover)}>
        {coverUrl ? (
          <>
            <motion.img 
              src={coverUrl} 
              alt={title} 
              className={cn(
                "w-full h-full object-cover transition-all",
                isHovered && "brightness-75"
              )}
              onLoad={() => setImageLoaded(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: imageLoaded ? 1 : 0 }}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
          </>
        ) : (
          <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary">
            <Disc3 className={cn(
              "transition-transform",
              isPlaying && "animate-spin",
              size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6'
            )} />
          </div>
        )}

        {/* Overlay de lecture au hover */}
        <AnimatePresence>
          {isHovered && (onPlay || onPause) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/40"
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                onClick={isPlaying ? onPause : onPlay}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Indicateur de lecture */}
        {isPlaying && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>
      
      {/* Informations */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className={cn(
            "font-medium truncate",
            config.text,
            isPlaying && "text-primary"
          )}>
            {title}
          </h4>
          
          {/* Indicateur de lecture animé */}
          {isPlaying && (
            <div className="flex items-end gap-0.5 h-3">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-0.5 bg-primary rounded-full"
                  animate={{ height: ['40%', '100%', '60%', '80%', '40%'] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
          )}

          {isLiked && (
            <Heart className="w-3 h-3 text-red-500 fill-red-500 flex-shrink-0" />
          )}
        </div>
        
        <p className={cn("text-muted-foreground truncate", config.subtext)}>
          {artist}
        </p>

        {/* Métadonnées */}
        <div className="flex items-center gap-2 mt-1">
          {showDuration && duration && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(duration)}
            </span>
          )}
          {showBpm && bpm && (
            <Badge variant="secondary" className="text-xs h-4 px-1">
              {bpm} BPM
            </Badge>
          )}
          {mood && (
            <Badge variant="outline" className="text-xs h-4 px-1 capitalize">
              {mood}
            </Badge>
          )}
        </div>
      </div>

      {/* Actions */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex items-center gap-1"
          >
            {onLike && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={onLike}
                    >
                      <Heart className={cn(
                        "h-4 w-4",
                        isLiked && "text-red-500 fill-red-500"
                      )} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isLiked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onAddToPlaylist && (
                  <DropdownMenuItem onClick={onAddToPlaylist}>
                    <ListPlus className="h-4 w-4 mr-2" />
                    Ajouter à une playlist
                  </DropdownMenuItem>
                )}
                {onRadio && (
                  <DropdownMenuItem onClick={onRadio}>
                    <Radio className="h-4 w-4 mr-2" />
                    Créer une radio
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TrackInfo;
