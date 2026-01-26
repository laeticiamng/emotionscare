// @ts-nocheck

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Lock, Share2, Sparkles, Users, Star, Eye, EyeOff, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  points: number;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress?: number;
  maxProgress?: number;
  hint?: string;
  category?: string;
  unlockedByPercent?: number; // % of users who unlocked this
}

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  onShare?: (achievement: Achievement) => void;
  onShowcase?: (achievement: Achievement) => void;
  isShowcased?: boolean;
  friendsWhoUnlocked?: { name: string; avatar: string }[];
}

const RARITY_STATS = {
  common: { percent: 75, label: 'Commun' },
  rare: { percent: 25, label: 'Rare' },
  epic: { percent: 5, label: 'Épique' },
  legendary: { percent: 1, label: 'Légendaire' },
};

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ 
  achievement, 
  size = 'md',
  showDetails = true,
  onShare,
  onShowcase,
  isShowcased = false,
  friendsWhoUnlocked = [],
}) => {
  const { toast } = useToast();
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);
  const [showCollectionDialog, setShowCollectionDialog] = useState(false);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900';
      case 'rare': return 'border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30';
      case 'epic': return 'border-purple-400 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30';
      case 'legendary': return 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/30 dark:to-amber-800/30';
      default: return 'border-gray-400 bg-gray-50';
    }
  };

  const getRarityGlow = (rarity: string) => {
    if (!achievement.unlocked) return '';
    switch (rarity) {
      case 'common': return 'shadow-gray-300/50 shadow-lg';
      case 'rare': return 'shadow-blue-400/50 shadow-lg';
      case 'epic': return 'shadow-purple-400/50 shadow-lg';
      case 'legendary': return 'shadow-yellow-400/50 shadow-xl animate-pulse';
      default: return 'shadow-gray-200';
    }
  };

  const getRarityTextColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 dark:text-gray-400';
      case 'rare': return 'text-blue-600 dark:text-blue-400';
      case 'epic': return 'text-purple-600 dark:text-purple-400';
      case 'legendary': return 'text-amber-600 dark:text-amber-400';
      default: return 'text-gray-600';
    }
  };

  const sizeClasses = {
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6'
  };

  const iconSizes = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-14 w-14'
  };

  const progressPercentage = achievement.progress && achievement.maxProgress 
    ? (achievement.progress / achievement.maxProgress) * 100 
    : 0;

  const rarityStats = RARITY_STATS[achievement.rarity];
  const unlockedPercent = achievement.unlockedByPercent ?? rarityStats.percent;

  const handleShare = async () => {
    const shareText = `🏆 J'ai débloqué "${achievement.title}" sur EmotionsCare ! +${achievement.points} points\n\n${achievement.description}\n\n#EmotionsCare #BienEtre`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Mon succès EmotionsCare', text: shareText });
      } catch (err) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast({
        title: 'Copié !',
        description: 'Le texte a été copié dans le presse-papier.',
      });
    }
    
    onShare?.(achievement);
  };

  const handleShowcase = () => {
    onShowcase?.(achievement);
    toast({
      title: isShowcased ? '📌 Retiré de la vitrine' : '🌟 Ajouté à la vitrine !',
      description: isShowcased 
        ? 'Ce badge ne sera plus visible sur votre profil.' 
        : 'Ce badge sera visible sur votre profil public.',
    });
  };

  return (
    <TooltipProvider>
      <Dialog open={showCollectionDialog} onOpenChange={setShowCollectionDialog}>
        <motion.div
          whileHover={{ scale: achievement.unlocked ? 1.05 : 1.02 }}
          whileTap={{ scale: 0.95 }}
          className={achievement.unlocked ? '' : 'cursor-not-allowed'}
        >
          <Card 
            className={`
              ${getRarityColor(achievement.rarity)} 
              border-2 
              ${achievement.unlocked ? getRarityGlow(achievement.rarity) : 'opacity-60 grayscale'}
              transition-all duration-300 relative overflow-hidden
              ${isShowcased ? 'ring-2 ring-primary ring-offset-2' : ''}
            `}
          >
            {/* Showcased indicator */}
            {isShowcased && achievement.unlocked && (
              <div className="absolute top-1 right-1 z-10">
                <Badge variant="default" className="h-5 px-1">
                  <Eye className="h-3 w-3" />
                </Badge>
              </div>
            )}

            {/* Legendary sparkle effect */}
            {achievement.unlocked && achievement.rarity === 'legendary' && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    animate={{
                      x: [0, 100, 0],
                      y: [0, -50, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                    style={{ left: `${20 + i * 30}%`, top: '50%' }}
                  >
                    <Sparkles className="w-3 h-3 text-yellow-400" />
                  </motion.div>
                ))}
              </div>
            )}

            <CardContent className={`${sizeClasses[size]} text-center relative`}>
              <div className="space-y-2">
                {/* Icon */}
                <div className={`mx-auto ${achievement.unlocked ? 'text-primary' : 'text-muted-foreground'}`}>
                  {achievement.unlocked ? (
                    <motion.div 
                      className={iconSizes[size]}
                      initial={showUnlockAnimation ? { scale: 0, rotate: -180 } : false}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      {achievement.icon}
                    </motion.div>
                  ) : (
                    <div className="relative">
                      <Lock className={iconSizes[size]} />
                      {/* Progress ring for locked achievements */}
                      {achievement.progress !== undefined && achievement.maxProgress && (
                        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 36 36">
                          <circle
                            cx="18" cy="18" r="16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray={`${progressPercentage}, 100`}
                            className="text-primary/30"
                          />
                        </svg>
                      )}
                    </div>
                  )}
                </div>

                {showDetails && (
                  <>
                    {/* Title */}
                    <h3 className={`font-semibold ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'}`}>
                      {achievement.title}
                    </h3>

                    {/* Description */}
                    <p className={`text-muted-foreground ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
                      {achievement.unlocked ? achievement.description : (achievement.hint || '???')}
                    </p>

                    {/* Progress bar for locked achievements */}
                    {!achievement.unlocked && achievement.progress !== undefined && achievement.maxProgress && (
                      <div className="space-y-1">
                        <Progress value={progressPercentage} className="h-1.5" />
                        <p className="text-xs text-muted-foreground">
                          {achievement.progress}/{achievement.maxProgress}
                        </p>
                      </div>
                    )}

                    {/* Points */}
                    <div className="flex items-center justify-center gap-1 text-yellow-600">
                      <Trophy className="h-4 w-4" />
                      <span className="font-semibold text-sm">{achievement.points}</span>
                    </div>

                    {/* Rarity Badge with stats */}
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-auto p-1"
                        onClick={() => setShowCollectionDialog(true)}
                      >
                        <Badge 
                          variant="outline" 
                          className={`capitalize ${getRarityTextColor(achievement.rarity)} border-current cursor-pointer hover:bg-muted`}
                        >
                          {achievement.rarity}
                          <BarChart3 className="h-3 w-3 ml-1" />
                        </Badge>
                      </Button>
                    </DialogTrigger>

                    {/* Friends who unlocked */}
                    {friendsWhoUnlocked.length > 0 && (
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {friendsWhoUnlocked.length} ami{friendsWhoUnlocked.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}

                    {/* Unlock Date and Actions */}
                    {achievement.unlocked && (
                      <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
                        {achievement.unlockedAt && (
                          <p className="text-xs text-muted-foreground">
                            {new Date(achievement.unlockedAt).toLocaleDateString('fr-FR')}
                          </p>
                        )}
                        <div className="flex gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShare();
                                }}
                              >
                                <Share2 className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Partager</TooltipContent>
                          </Tooltip>
                          {onShowcase && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className={`h-6 w-6 ${isShowcased ? 'text-primary' : ''}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleShowcase();
                                  }}
                                >
                                  {isShowcased ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {isShowcased ? 'Retirer de la vitrine' : 'Ajouter à la vitrine'}
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Collection/Stats Dialog */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {achievement.icon}
              {achievement.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Rarity info */}
            <div className={`p-4 rounded-lg ${getRarityColor(achievement.rarity)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`font-semibold capitalize ${getRarityTextColor(achievement.rarity)}`}>
                  {achievement.rarity}
                </span>
                <Badge variant="outline">{unlockedPercent}% des utilisateurs</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{achievement.description}</p>
            </div>

            {/* Unlock statistics */}
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Statistiques de rareté
              </h4>
              <div className="space-y-1">
                {Object.entries(RARITY_STATS).map(([key, stats]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className={`text-xs capitalize w-20 ${key === achievement.rarity ? 'font-bold' : ''}`}>
                      {stats.label}
                    </span>
                    <Progress 
                      value={stats.percent} 
                      className={`h-2 flex-1 ${key === achievement.rarity ? '' : 'opacity-50'}`}
                    />
                    <span className="text-xs w-10 text-right">{stats.percent}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Friends who unlocked */}
            {friendsWhoUnlocked.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Amis qui ont ce badge
                </h4>
                <div className="flex flex-wrap gap-2">
                  {friendsWhoUnlocked.map((friend, i) => (
                    <div key={i} className="flex items-center gap-1 text-sm bg-muted px-2 py-1 rounded">
                      <img 
                        src={friend.avatar || '/placeholder.svg'} 
                        alt={friend.name} 
                        className="w-5 h-5 rounded-full"
                      />
                      {friend.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Category */}
            {achievement.category && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4" />
                Catégorie: {achievement.category}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default AchievementBadge;
