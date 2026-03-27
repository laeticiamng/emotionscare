// @ts-nocheck
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, ArrowRight, Heart, Share2, Clock, CheckCircle, X, RefreshCw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface AdviceChipProps {
  text: string;
  onClick: () => void;
  category?: 'breathing' | 'meditation' | 'exercise' | 'social' | 'general';
  difficulty?: 'easy' | 'medium' | 'hard';
  estimatedTime?: number;
  onFavorite?: () => void;
  onDismiss?: () => void;
  onRefresh?: () => void;
  isFavorite?: boolean;
  isCompleted?: boolean;
}

const CATEGORY_CONFIG = {
  breathing: { icon: '🌬️', color: 'from-blue-500/10 to-cyan-500/10', label: 'Respiration' },
  meditation: { icon: '🧘', color: 'from-purple-500/10 to-pink-500/10', label: 'Méditation' },
  exercise: { icon: '🏃', color: 'from-green-500/10 to-emerald-500/10', label: 'Exercice' },
  social: { icon: '👥', color: 'from-orange-500/10 to-amber-500/10', label: 'Social' },
  general: { icon: '💡', color: 'from-secondary/10 to-primary/10', label: 'Conseil' }
};

const DIFFICULTY_CONFIG = {
  easy: { label: 'Facile', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  medium: { label: 'Moyen', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  hard: { label: 'Avancé', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }
};

export const AdviceChip: React.FC<AdviceChipProps> = ({
  text,
  onClick,
  category = 'general',
  difficulty = 'easy',
  estimatedTime,
  onFavorite,
  onDismiss,
  onRefresh,
  isFavorite = false,
  isCompleted = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const categoryConfig = CATEGORY_CONFIG[category];
  const difficultyConfig = DIFFICULTY_CONFIG[difficulty];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Conseil EmotionsCare',
          text: text,
          url: window.location.href
        });
      } catch (err) {
        // Ignorer si annulé
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ delay: 0.3 }}
      onHoverStart={() => {
        setIsHovered(true);
        setShowActions(true);
      }}
      onHoverEnd={() => {
        setIsHovered(false);
        setTimeout(() => setShowActions(false), 300);
      }}
    >
      <Card className={cn(
        "relative overflow-hidden border-2 transition-all duration-300",
        `bg-gradient-to-r ${categoryConfig.color}`,
        isHovered && "shadow-lg border-primary/30",
        isCompleted && "opacity-60"
      )}>
        {/* Indicateur de complétion */}
        {isCompleted && (
          <div className="absolute top-2 right-2 z-10">
            <Badge className="bg-green-500 text-white">
              <CheckCircle className="w-3 h-3 mr-1" />
              Fait
            </Badge>
          </div>
        )}

        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Icône de catégorie */}
            <motion.div 
              className="w-10 h-10 rounded-full bg-background/80 flex items-center justify-center flex-shrink-0 text-xl"
              animate={isHovered ? { scale: 1.1, rotate: 10 } : { scale: 1, rotate: 0 }}
            >
              {categoryConfig.icon}
            </motion.div>
            
            <div className="flex-1 space-y-3">
              {/* En-tête avec badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  {categoryConfig.label}
                </Badge>
                <Badge className={cn("text-xs", difficultyConfig.color)}>
                  {difficultyConfig.label}
                </Badge>
                {estimatedTime && (
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {estimatedTime} min
                  </Badge>
                )}
              </div>

              {/* Contenu */}
              <div>
                <h4 className="font-medium text-sm text-foreground mb-1 flex items-center gap-2">
                  Suggestion
                  {isFavorite && <Heart className="w-3 h-3 text-red-500 fill-red-500" />}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {text}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={onClick}
                  size="sm"
                  className="flex-1 group"
                  disabled={isCompleted}
                  aria-label={`Action suggérée: ${text}`}
                >
                  <span>{isCompleted ? 'Terminé' : 'Essayer maintenant'}</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>

                {/* Actions secondaires */}
                <AnimatePresence>
                  {showActions && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="flex items-center gap-1"
                    >
                      {onFavorite && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={onFavorite}
                              >
                                <Heart className={cn(
                                  "h-4 w-4",
                                  isFavorite && "text-red-500 fill-red-500"
                                )} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                      <TooltipProvider>
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
                      </TooltipProvider>

                      {onRefresh && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={onRefresh}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Autre suggestion</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                      {onDismiss && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={onDismiss}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Ignorer</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Effet de brillance au hover */}
        <AnimatePresence>
          {isHovered && !isCompleted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-2 right-2"
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};