import React, { useState, useEffect } from 'react';
import { MusicTrack } from '@/types/music';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Music, 
  Heart, 
  Share2, 
  MoreHorizontal, 
  ListPlus, 
  Info,
  ExternalLink,
  Copy,
  Check,
  Disc3,
  Clock,
  Headphones,
  Star,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface TrackInfoProps {
  track?: MusicTrack | null;
  className?: string;
  showDetails?: boolean;
}

interface FavoriteTrack {
  id: string;
  title: string;
  artist: string;
  addedAt: string;
}

const TrackInfo: React.FC<TrackInfoProps> = ({ 
  track, 
  className = "",
  showDetails = true
}) => {
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteTrack[]>(() => {
    const saved = localStorage.getItem('music_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [playCount, setPlayCount] = useState(() => {
    const saved = localStorage.getItem('track_play_counts');
    return saved ? JSON.parse(saved) : {};
  });
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [rating, setRating] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Default track if none provided
  const defaultTrack = {
    id: 'default',
    title: 'Ambiance Relaxante',
    artist: 'Sounds of Nature',
    coverUrl: undefined,
    duration: 180,
    album: 'Nature Sounds Collection',
    genre: 'Ambient',
    bpm: 60,
    mood: 'Relaxant'
  };

  const currentTrack = track || defaultTrack;

  // Check if current track is favorite
  useEffect(() => {
    const isFav = favorites.some(f => f.id === currentTrack.id);
    setIsFavorite(isFav);
    
    // Load rating
    const savedRatings = localStorage.getItem('track_ratings');
    if (savedRatings) {
      const ratings = JSON.parse(savedRatings);
      setRating(ratings[currentTrack.id] || 0);
    }
  }, [currentTrack.id, favorites]);

  // Persist favorites
  useEffect(() => {
    localStorage.setItem('music_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = () => {
    if (isFavorite) {
      setFavorites(prev => prev.filter(f => f.id !== currentTrack.id));
      toast({
        title: "Retiré des favoris",
        description: `"${currentTrack.title}" a été retiré de vos favoris`
      });
    } else {
      const newFavorite: FavoriteTrack = {
        id: currentTrack.id || Date.now().toString(),
        title: currentTrack.title,
        artist: currentTrack.artist || 'Artiste inconnu',
        addedAt: new Date().toISOString()
      };
      setFavorites(prev => [...prev, newFavorite]);
      toast({
        title: "Ajouté aux favoris",
        description: `"${currentTrack.title}" a été ajouté à vos favoris`
      });
    }
    setIsFavorite(!isFavorite);
  };

  const handleRating = (newRating: number) => {
    setRating(newRating);
    const savedRatings = localStorage.getItem('track_ratings');
    const ratings = savedRatings ? JSON.parse(savedRatings) : {};
    ratings[currentTrack.id || 'default'] = newRating;
    localStorage.setItem('track_ratings', JSON.stringify(ratings));
    toast({
      title: "Note enregistrée",
      description: `Vous avez donné ${newRating} étoile${newRating > 1 ? 's' : ''} à ce morceau`
    });
  };

  const shareTrack = async (method: 'copy' | 'twitter' | 'facebook') => {
    const shareText = `🎵 J'écoute "${currentTrack.title}" par ${currentTrack.artist || 'Artiste inconnu'} sur EmotionsCare`;
    const shareUrl = window.location.href;

    switch (method) {
      case 'copy':
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
          title: "Copié !",
          description: "Le lien a été copié dans le presse-papier"
        });
        break;
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          '_blank'
        );
        break;
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
          '_blank'
        );
        break;
    }
    setShowShareMenu(false);
  };

  const addToPlaylist = () => {
    toast({
      title: "Ajouté à la playlist",
      description: `"${currentTrack.title}" a été ajouté à votre playlist`
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get current play count
  const currentPlayCount = playCount[currentTrack.id || 'default'] || 0;

  return (
    <div 
      className={`flex items-center gap-3 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Album cover */}
      <div className="relative group">
        {currentTrack.coverUrl ? (
          <motion.img 
            src={currentTrack.coverUrl} 
            alt={currentTrack.title}
            className="w-14 h-14 rounded-lg object-cover shadow-md"
            animate={{ 
              scale: isHovered ? 1.05 : 1,
              rotate: isHovered ? [0, -2, 2, 0] : 0
            }}
            transition={{ duration: 0.3 }}
          />
        ) : (
          <motion.div 
            className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center shadow-md"
            animate={{ 
              scale: isHovered ? 1.05 : 1
            }}
            aria-hidden="true"
          >
            <Disc3 className="h-7 w-7 text-primary animate-spin" style={{ animationDuration: '3s' }} aria-hidden="true" />
          </motion.div>
        )}
        
        {/* Favorite indicator */}
        <AnimatePresence>
          {isFavorite && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5"
            >
              <Heart className="h-3 w-3 text-white fill-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Play count badge */}
        {currentPlayCount > 0 && (
          <Badge 
            variant="secondary" 
            className="absolute -bottom-1 -right-1 text-[10px] px-1 py-0"
          >
            {currentPlayCount}x
          </Badge>
        )}
      </div>
      
      {/* Track info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm truncate">
            {currentTrack.title}
          </h3>
          {currentTrack.mood && (
            <Badge variant="outline" className="text-[10px] px-1 py-0 hidden sm:inline-flex">
              <Sparkles className="h-2 w-2 mr-0.5" />
              {currentTrack.mood}
            </Badge>
          )}
        </div>
        
        {currentTrack.artist && (
          <p className="text-xs text-muted-foreground truncate">
            {currentTrack.artist}
          </p>
        )}

        {/* Extended metadata */}
        {showDetails && (
          <div className="flex items-center gap-2 mt-1">
            {currentTrack.duration && (
              <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                <Clock className="h-2.5 w-2.5" />
                {formatDuration(currentTrack.duration)}
              </span>
            )}
            {currentTrack.bpm && (
              <span className="text-[10px] text-muted-foreground">
                {currentTrack.bpm} BPM
              </span>
            )}
            {currentTrack.genre && (
              <Badge variant="secondary" className="text-[10px] px-1 py-0">
                {currentTrack.genre}
              </Badge>
            )}
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center gap-0.5 mt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRating(star)}
              className="focus:outline-none"
              aria-label={`Noter ${star} étoile${star > 1 ? 's' : ''}`}
            >
              <Star 
                className={`h-3 w-3 transition-colors ${
                  star <= rating 
                    ? 'text-yellow-500 fill-yellow-500' 
                    : 'text-muted-foreground/30 hover:text-yellow-500/50'
                }`} 
              />
            </button>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex items-center gap-1"
          >
            {/* Favorite button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={toggleFavorite}
                    aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  >
                    <Heart 
                      className={`h-4 w-4 transition-colors ${
                        isFavorite ? 'text-red-500 fill-red-500' : ''
                      }`} 
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Share button */}
            <Popover open={showShareMenu} onOpenChange={setShowShareMenu}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Partager"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2">
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => shareTrack('copy')}
                  >
                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copied ? 'Copié !' : 'Copier le lien'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => shareTrack('twitter')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Twitter / X
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => shareTrack('facebook')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Facebook
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* More options */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Plus d'options"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2">
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={addToPlaylist}
                  >
                    <ListPlus className="h-4 w-4 mr-2" />
                    Ajouter à une playlist
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Headphones className="h-4 w-4 mr-2" />
                    Écouter plus tard
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Info className="h-4 w-4 mr-2" />
                    Détails du morceau
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrackInfo;
