import React, { useState, useEffect, memo } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Award, Lock, Star, Share2, Heart, Calendar, TrendingUp, Sparkles, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface BadgeCardProps {
  id?: string;
  name: string;
  description: string;
  iconUrl?: string;
  isEarned: boolean;
  progress: number;
  threshold: number;
  earnedAt?: Date;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  category?: string;
}

const STORAGE_KEY = 'badge-card-data';

interface BadgeStats {
  viewCount: number;
  shareCount: number;
  favorites: string[];
  earnedBadges: { id: string; earnedAt: string }[];
}

const RARITY_STYLES = {
  common: {
    bg: 'bg-muted',
    border: 'border-muted-foreground/20',
    text: 'text-muted-foreground',
    label: 'Commun',
  },
  rare: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-500',
    label: 'Rare',
  },
  epic: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-500',
    label: 'Épique',
  },
  legendary: {
    bg: 'bg-gradient-to-br from-amber-500/20 to-orange-500/20',
    border: 'border-amber-500/50',
    text: 'text-amber-500',
    label: 'Légendaire',
  },
};

const BadgeCard: React.FC<BadgeCardProps> = memo(({
  id = '',
  name,
  description,
  iconUrl,
  isEarned,
  progress,
  threshold,
  earnedAt,
  rarity = 'common',
  category = 'Général',
}) => {
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [stats, setStats] = useState<BadgeStats>({
    viewCount: 0,
    shareCount: 0,
    favorites: [],
    earnedBadges: [],
  });

  const badgeId = id || `${name}-${threshold}`;
  const rarityStyle = RARITY_STYLES[rarity];

  // Load stats from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: BadgeStats = JSON.parse(saved);
      setStats(parsed);
      setIsFavorite(parsed.favorites.includes(badgeId));
    }
  }, [badgeId]);

  // Save stats
  const saveStats = (newStats: BadgeStats) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
    setStats(newStats);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavorites = isFavorite
      ? stats.favorites.filter(f => f !== badgeId)
      : [...stats.favorites, badgeId];
    
    saveStats({ ...stats, favorites: newFavorites });
    setIsFavorite(!isFavorite);
    
    toast({
      title: isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris',
      description: isFavorite ? 'Badge retiré de vos favoris' : 'Retrouvez ce badge facilement',
    });
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = isEarned
      ? `🏆 J'ai débloqué le badge "${name}" sur EmotionsCare ! ${description}`
      : `🎯 Je travaille pour débloquer le badge "${name}" - ${Math.round(progress)}% complété !`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
        saveStats({ ...stats, shareCount: stats.shareCount + 1 });
      } catch {
        // cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      saveStats({ ...stats, shareCount: stats.shareCount + 1 });
      toast({ title: 'Copié !', description: 'Texte copié dans le presse-papier' });
    }
  };

  const handleOpenDetails = () => {
    saveStats({ ...stats, viewCount: stats.viewCount + 1 });
    setShowDetails(true);
  };

  const progressPercent = Math.min(100, (progress / threshold) * 100);
  const daysUntilEstimate = threshold > progress
    ? Math.ceil((threshold - progress) / Math.max(1, progress / 7))
    : 0;

  return (
    <TooltipProvider>
      <>
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          onClick={handleOpenDetails}
        >
          <Card className={cn(
            'transition-all cursor-pointer relative overflow-hidden',
            isEarned ? `border-2 ${rarityStyle.border}` : 'border',
            isHovered && 'shadow-lg'
          )}>
            {/* Rarity indicator */}
            {isEarned && rarity !== 'common' && (
              <div className={cn(
                'absolute top-0 right-0 px-2 py-0.5 text-xs font-medium rounded-bl-lg',
                rarityStyle.bg, rarityStyle.text
              )}>
                {rarityStyle.label}
              </div>
            )}

            {/* Favorite indicator */}
            {isFavorite && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 left-2"
              >
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              </motion.div>
            )}

            <CardHeader className="flex flex-row items-center justify-center pb-2 pt-4">
              <motion.div
                animate={isHovered && isEarned ? { rotate: [0, -10, 10, 0] } : {}}
                transition={{ duration: 0.5 }}
                className={cn(
                  'relative flex h-16 w-16 items-center justify-center rounded-full',
                  isEarned ? rarityStyle.bg : 'bg-muted'
                )}
              >
                {iconUrl ? (
                  <img 
                    src={iconUrl} 
                    alt={name} 
                    className={cn('h-10 w-10', !isEarned && 'grayscale opacity-50')}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <Award className={cn(
                    'h-8 w-8',
                    isEarned ? rarityStyle.text : 'text-muted-foreground'
                  )} />
                )}

                {!isEarned && (
                  <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground text-white">
                    <Lock className="h-3 w-3" />
                  </div>
                )}

                {/* Sparkle effect for earned badges */}
                <AnimatePresence>
                  {isEarned && isHovered && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute -top-1 -right-1"
                    >
                      <Sparkles className="h-4 w-4 text-amber-400" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </CardHeader>

            <CardContent className="text-center pb-2">
              <h3 className={cn(
                'font-medium',
                isEarned ? rarityStyle.text : 'text-muted-foreground'
              )}>
                {name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
              
              {/* Category badge */}
              <Badge variant="outline" className="mt-2 text-xs">
                {category}
              </Badge>
            </CardContent>

            <CardFooter className="flex-col space-y-2 pb-4">
              <Progress 
                value={progressPercent} 
                className={cn('w-full h-2', isEarned && 'bg-primary/20')} 
              />
              <div className="text-xs text-muted-foreground">
                {isEarned ? (
                  <span className="flex items-center justify-center gap-1 text-green-600">
                    <Award className="h-3 w-3" />
                    Débloqué
                    {earnedAt && (
                      <span className="text-muted-foreground">
                        • {new Date(earnedAt).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                  </span>
                ) : (
                  <span>{Math.round(progressPercent)}% • {threshold - Math.floor(progress)} pts restants</span>
                )}
              </div>

              {/* Quick actions on hover */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-2 pt-2"
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={toggleFavorite}
                        >
                          <Heart className={cn(
                            'h-4 w-4',
                            isFavorite && 'fill-red-500 text-red-500'
                          )} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Favoris</TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={handleShare}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Partager</TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={handleOpenDetails}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Détails</TooltipContent>
                    </Tooltip>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Details Dialog */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Award className={cn('h-5 w-5', isEarned ? rarityStyle.text : 'text-muted-foreground')} />
                {name}
              </DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Statut</span>
                <Badge className={isEarned ? 'bg-green-500' : 'bg-muted'}>
                  {isEarned ? 'Débloqué' : 'En cours'}
                </Badge>
              </div>

              {/* Progress details */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progression</span>
                  <span className="font-medium">{Math.floor(progress)} / {threshold}</span>
                </div>
                <Progress value={progressPercent} className="h-3" />
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted/30 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                    <Star className="h-3 w-3" />
                  </div>
                  <div className="text-lg font-bold">{rarityStyle.label}</div>
                  <div className="text-xs text-muted-foreground">Rareté</div>
                </div>

                <div className="p-3 bg-muted/30 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                    <Calendar className="h-3 w-3" />
                  </div>
                  <div className="text-lg font-bold">
                    {earnedAt ? new Date(earnedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '-'}
                  </div>
                  <div className="text-xs text-muted-foreground">Obtenu le</div>
                </div>
              </div>

              {/* Estimation for incomplete badges */}
              {!isEarned && progress > 0 && (
                <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <div className="text-sm">
                    <span className="text-muted-foreground">Estimation: </span>
                    <span className="font-medium">~{daysUntilEstimate} jours</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(e);
                  }}
                >
                  <Heart className={cn(
                    'h-4 w-4 mr-2',
                    isFavorite && 'fill-red-500 text-red-500'
                  )} />
                  {isFavorite ? 'Retirer' : 'Favoris'}
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    </TooltipProvider>
  );
});

BadgeCard.displayName = 'BadgeCard';

export default BadgeCard;
