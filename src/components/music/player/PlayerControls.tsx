import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, 
  Heart, ListMusic, MoreVertical, Share2, Download, Clock, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useMusicPlayerFavorites, usePlaybackStats } from '@/hooks/music/useMusicSettings';

export interface PlayerControlsProps {
  isPlaying: boolean;
  loadingTrack?: boolean;
  onPlay: () => void;
  onPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  currentTrackId?: string;
  currentTrackTitle?: string;
  onShuffle?: () => void;
  onRepeat?: () => void;
  onAddToQueue?: () => void;
  onAddToPlaylist?: () => void;
  showExtendedControls?: boolean;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  loadingTrack = false,
  onPlay,
  onPause,
  onPrevious,
  onNext,
  currentTrackId,
  currentTrackTitle,
  onShuffle,
  onRepeat,
  onAddToQueue,
  onAddToPlaylist,
  showExtendedControls = true
}) => {
  const { toast } = useToast();
  const { value: favorites, setValue: setFavorites } = useMusicPlayerFavorites();
  const { value: stats, setValue: setStats } = usePlaybackStats();
  
  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [showAnimation, setShowAnimation] = useState(false);

  // Track play events
  useEffect(() => {
    if (isPlaying && currentTrackId) {
      setStats(prev => ({ ...prev, totalPlays: prev.totalPlays + 1 }));
    }
  }, [isPlaying, currentTrackId, setStats]);

  const isFavorite = currentTrackId ? (favorites as string[]).includes(currentTrackId) : false;

  const toggleFavorite = () => {
    if (!currentTrackId) return;
    
    const currentFavorites = favorites as string[];
    const newFavorites = isFavorite
      ? currentFavorites.filter(f => f !== currentTrackId)
      : [...currentFavorites, currentTrackId];
    
    setFavorites(newFavorites as any);
    
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 1000);
    
    toast({
      title: isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris',
      duration: 2000
    });
  };

  const handleShuffle = () => {
    setShuffleEnabled(!shuffleEnabled);
    onShuffle?.();
    toast({
      title: shuffleEnabled ? 'Lecture aléatoire désactivée' : 'Lecture aléatoire activée',
      duration: 2000
    });
  };

  const handleRepeat = () => {
    const modes: Array<'off' | 'all' | 'one'> = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(nextMode);
    onRepeat?.();
    
    const labels = { off: 'Répétition désactivée', all: 'Répéter tout', one: 'Répéter ce titre' };
    toast({ title: labels[nextMode], duration: 2000 });
  };

  const handleShare = async () => {
    const text = currentTrackTitle 
      ? `🎵 J'écoute "${currentTrackTitle}" sur EmotionsCare`
      : '🎵 Découvrez la musique thérapeutique sur EmotionsCare';
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copié !', description: 'Lien copié dans le presse-papier' });
    }
  };

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'one': return <Repeat1 className="h-4 w-4" />;
      default: return <Repeat className="h-4 w-4" />;
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-2">
        {/* Main controls */}
        <div className="flex items-center justify-center gap-2">
          {/* Shuffle */}
          {showExtendedControls && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleShuffle}
                  disabled={loadingTrack}
                  className={`h-8 w-8 ${shuffleEnabled ? 'text-primary' : ''}`}
                  aria-label="Lecture aléatoire"
                >
                  <Shuffle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Lecture aléatoire {shuffleEnabled ? '(activé)' : ''}</TooltipContent>
            </Tooltip>
          )}

          {/* Previous */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onPrevious}
                disabled={loadingTrack}
                className="h-9 w-9"
                aria-label="Piste précédente"
              >
                <SkipBack className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Précédent</TooltipContent>
          </Tooltip>
          
          {/* Play/Pause */}
          <motion.div
            whileTap={{ scale: 0.9 }}
          >
            {isPlaying ? (
              <Button 
                variant="default" 
                size="icon"
                onClick={onPause}
                disabled={loadingTrack}
                className="h-12 w-12 rounded-full"
                aria-label="Mettre en pause"
              >
                <Pause className="h-6 w-6" />
              </Button>
            ) : (
              <Button 
                variant="default" 
                size="icon"
                onClick={onPlay}
                disabled={loadingTrack}
                className="h-12 w-12 rounded-full"
                aria-label="Lire"
              >
                <Play className="h-6 w-6 ml-0.5" />
              </Button>
            )}
          </motion.div>
          
          {/* Next */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onNext}
                disabled={loadingTrack}
                className="h-9 w-9"
                aria-label="Piste suivante"
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Suivant</TooltipContent>
          </Tooltip>

          {/* Repeat */}
          {showExtendedControls && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleRepeat}
                  disabled={loadingTrack}
                  className={`h-8 w-8 ${repeatMode !== 'off' ? 'text-primary' : ''}`}
                  aria-label="Répéter"
                >
                  {getRepeatIcon()}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {repeatMode === 'off' ? 'Répéter' : repeatMode === 'all' ? 'Répéter tout' : 'Répéter ce titre'}
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Extended controls row */}
        {showExtendedControls && (
          <div className="flex items-center justify-center gap-1">
            {/* Favorite */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={toggleFavorite}
                  disabled={!currentTrackId}
                  className="h-8 w-8 relative"
                  aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                >
                  <AnimatePresence>
                    {showAnimation && (
                      <motion.div
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.5, 1] }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isFavorite ? 'Retirer' : 'Favoris'}</TooltipContent>
            </Tooltip>

            {/* Queue */}
            {onAddToQueue && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={onAddToQueue}
                    className="h-8 w-8"
                    aria-label="Ajouter à la file d'attente"
                  >
                    <ListMusic className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>File d'attente</TooltipContent>
              </Tooltip>
            )}

            {/* Share */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleShare}
                  className="h-8 w-8"
                  aria-label="Partager"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Partager</TooltipContent>
            </Tooltip>

            {/* More options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Plus d'options"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                {onAddToPlaylist && (
                  <DropdownMenuItem onClick={onAddToPlaylist}>
                    <ListMusic className="h-4 w-4 mr-2" />
                    Ajouter à une playlist
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <Clock className="h-4 w-4 mr-2" />
                  {stats.totalPlays} lectures
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Star className="h-4 w-4 mr-2" />
                  {favorites.length} favoris
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Status badges */}
        <div className="flex items-center justify-center gap-2">
          {shuffleEnabled && (
            <Badge variant="secondary" className="text-xs">
              <Shuffle className="h-3 w-3 mr-1" />
              Aléatoire
            </Badge>
          )}
          {repeatMode !== 'off' && (
            <Badge variant="secondary" className="text-xs">
              {repeatMode === 'all' ? <Repeat className="h-3 w-3 mr-1" /> : <Repeat1 className="h-3 w-3 mr-1" />}
              {repeatMode === 'all' ? 'Tout' : '1'}
            </Badge>
          )}
          {loadingTrack && (
            <Badge variant="outline" className="text-xs animate-pulse">
              Chargement...
            </Badge>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default PlayerControls;
