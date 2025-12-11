// @ts-nocheck

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { InfoIcon, CheckCircle, ArrowRight, Star, Lock, Sparkles } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
  tooltip?: string;
  isNew?: boolean;
  isPremium?: boolean;
  isCompleted?: boolean;
  progress?: number;
  onClick?: () => void;
  onLearnMore?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'highlighted' | 'compact';
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  badge, 
  tooltip,
  isNew = false,
  isPremium = false,
  isCompleted = false,
  progress,
  onClick,
  onLearnMore,
  disabled = false,
  variant = 'default'
}) => {
  const [isHovered, setIsHovered] = useState(false);

  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
      >
        <Card 
          className={cn(
            "cursor-pointer transition-all",
            disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-md hover:border-primary/30",
            isCompleted && "border-green-500/30 bg-green-50/50 dark:bg-green-950/20"
          )}
          onClick={disabled ? undefined : onClick}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-full",
              isCompleted ? "bg-green-100 dark:bg-green-900/50" : "bg-primary/10"
            )}>
              {isCompleted ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Icon className="h-4 w-4 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{title}</p>
              {progress !== undefined && (
                <Progress value={progress} className="h-1 mt-1" />
              )}
            </div>
            {isPremium && <Lock className="h-4 w-4 text-muted-foreground" />}
            {isNew && <Badge className="text-xs">Nouveau</Badge>}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: disabled ? 0 : -4 }}
      onHoverStart={() => !disabled && setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className={cn(
        "h-full transition-all duration-300 overflow-hidden",
        disabled 
          ? "opacity-60 cursor-not-allowed" 
          : "hover:shadow-lg cursor-pointer",
        variant === 'highlighted' && "border-primary/50 bg-primary/5",
        isCompleted && "border-green-500/30"
      )}>
        <CardContent className="p-6 flex flex-col h-full relative">
          {/* Badges en haut à droite */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {isNew && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Nouveau
                </Badge>
              </motion.div>
            )}
            {isPremium && (
              <Badge variant="outline" className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                <Star className="w-3 h-3 mr-1 text-purple-500" />
                Premium
              </Badge>
            )}
            {isCompleted && (
              <Badge className="bg-green-500 text-white">
                <CheckCircle className="w-3 h-3 mr-1" />
                Terminé
              </Badge>
            )}
          </div>

          <div className="flex items-start mb-4">
            {/* Icône animée */}
            <motion.div 
              className={cn(
                "p-3 rounded-full mr-4 transition-colors",
                isCompleted 
                  ? "bg-green-100 dark:bg-green-900/50" 
                  : "bg-primary/10",
                isHovered && !isCompleted && "bg-primary/20"
              )}
              animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
            >
              {isCompleted ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <Icon className="h-6 w-6 text-primary" />
              )}
            </motion.div>
            
            <div className="flex-1 pr-20">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-medium">{title}</h3>
                {badge && (
                  <Badge variant="outline" className="bg-primary/10">
                    {badge}
                  </Badge>
                )}
                
                {tooltip && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        {tooltip}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
            </div>
          </div>

          {/* Barre de progression */}
          {progress !== undefined && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progression</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Actions au hover */}
          <AnimatePresence>
            {isHovered && !disabled && (onClick || onLearnMore) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-auto pt-4 flex gap-2"
              >
                {onClick && (
                  <Button 
                    size="sm" 
                    className="flex-1 group"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClick();
                    }}
                    disabled={isPremium}
                  >
                    {isPremium ? (
                      <>
                        <Lock className="w-3 h-3 mr-2" />
                        Débloquer
                      </>
                    ) : (
                      <>
                        Commencer
                        <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                )}
                {onLearnMore && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLearnMore();
                    }}
                  >
                    En savoir plus
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FeatureCard;
