// @ts-nocheck

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Share2, Star, Lock, ChevronRight, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface BadgeData {
  id: string;
  name: string;
  description?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt?: string;
  icon?: string;
}

interface EarnedBadgesDisplayProps {
  badges: (string | BadgeData)[];
  maxDisplay?: number;
  showProgress?: boolean;
  totalBadges?: number;
}

const RARITY_STYLES = {
  common: { bg: 'bg-slate-100 dark:bg-slate-800', border: 'border-slate-300', text: 'text-slate-700 dark:text-slate-300' },
  rare: { bg: 'bg-blue-100 dark:bg-blue-900/50', border: 'border-blue-400', text: 'text-blue-700 dark:text-blue-300' },
  epic: { bg: 'bg-purple-100 dark:bg-purple-900/50', border: 'border-purple-400', text: 'text-purple-700 dark:text-purple-300' },
  legendary: { bg: 'bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/50 dark:to-yellow-900/50', border: 'border-amber-400', text: 'text-amber-700 dark:text-amber-300' }
};

const EarnedBadgesDisplay: React.FC<EarnedBadgesDisplayProps> = ({ 
  badges,
  maxDisplay = 5,
  showProgress = true,
  totalBadges = 20
}) => {
  const [selectedBadge, setSelectedBadge] = useState<BadgeData | null>(null);
  const [showAll, setShowAll] = useState(false);

  if (!badges.length) return null;

  // Normaliser les badges
  const normalizedBadges: BadgeData[] = badges.map((badge, index) => 
    typeof badge === 'string' 
      ? { id: `badge-${index}`, name: badge, rarity: 'common' as const }
      : badge
  );

  const displayedBadges = showAll ? normalizedBadges : normalizedBadges.slice(0, maxDisplay);
  const hasMore = normalizedBadges.length > maxDisplay && !showAll;
  const progress = (normalizedBadges.length / totalBadges) * 100;

  const handleShare = async (badge: BadgeData) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Badge: ${badge.name}`,
          text: `J'ai gagné le badge "${badge.name}" sur EmotionsCare! 🎉`,
          url: window.location.href
        });
      } catch (err) {
        // Ignorer si l'utilisateur annule
      }
    }
  };

  const BadgeItem = ({ badge, index }: { badge: BadgeData; index: number }) => {
    const rarity = badge.rarity || 'common';
    const styles = RARITY_STYLES[rarity];

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="cursor-pointer"
              onClick={() => setSelectedBadge(badge)}
            >
              <Badge 
                variant="secondary" 
                className={cn(
                  "text-xs border relative overflow-hidden",
                  styles.bg, styles.border, styles.text,
                  rarity === 'legendary' && "animate-pulse"
                )}
              >
                {badge.icon && <span className="mr-1">{badge.icon}</span>}
                {badge.name}
                {rarity === 'legendary' && (
                  <Star className="h-2.5 w-2.5 ml-1 text-amber-500 fill-amber-500" />
                )}
              </Badge>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-center">
              <p className="font-medium">{badge.name}</p>
              {badge.description && <p className="text-xs text-muted-foreground">{badge.description}</p>}
              <p className="text-xs mt-1 capitalize">{rarity}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="mt-2 space-y-3">
      {/* Header avec progression */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium flex items-center">
          <Sparkles className="h-3 w-3 mr-1 text-amber-400" />
          Badges gagnés
          <span className="ml-2 text-xs text-muted-foreground">
            ({normalizedBadges.length}/{totalBadges})
          </span>
        </h4>
        {showProgress && (
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
          </div>
        )}
      </div>

      {/* Grille de badges */}
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {displayedBadges.map((badge, index) => (
            <BadgeItem key={badge.id} badge={badge} index={index} />
          ))}
        </AnimatePresence>

        {hasMore && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs"
            onClick={() => setShowAll(true)}
          >
            +{normalizedBadges.length - maxDisplay} autres
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        )}
      </div>

      {/* Prochain badge à débloquer */}
      {normalizedBadges.length < totalBadges && (
        <motion.div 
          className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <Lock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium">Prochain badge</p>
            <p className="text-xs text-muted-foreground">Continue pour débloquer !</p>
          </div>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      )}

      {/* Dialog détail badge */}
      <Dialog open={!!selectedBadge} onOpenChange={() => setSelectedBadge(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              {selectedBadge?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedBadge && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={cn(
                    "h-20 w-20 rounded-full flex items-center justify-center text-3xl",
                    RARITY_STYLES[selectedBadge.rarity || 'common'].bg
                  )}
                >
                  {selectedBadge.icon || '🏆'}
                </motion.div>
              </div>
              
              {selectedBadge.description && (
                <p className="text-center text-muted-foreground">{selectedBadge.description}</p>
              )}

              <div className="flex justify-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {selectedBadge.rarity || 'common'}
                </Badge>
                {selectedBadge.earnedAt && (
                  <Badge variant="secondary">
                    Obtenu le {new Date(selectedBadge.earnedAt).toLocaleDateString('fr-FR')}
                  </Badge>
                )}
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleShare(selectedBadge)}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Partager ce badge
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EarnedBadgesDisplay;
