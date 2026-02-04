/**
 * GroundingTechniqueCard - Carte de présentation d'une technique d'ancrage
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, Sparkles, Play } from 'lucide-react';
import { GroundingTechnique, GroundingCategory } from '../index';
import { cn } from '@/lib/utils';

interface GroundingTechniqueCardProps {
  technique: GroundingTechnique;
  onStart: (techniqueId: string) => void;
  isFavorite?: boolean;
  completedCount?: number;
  className?: string;
}

const CATEGORY_ICONS: Record<GroundingCategory, string> = {
  '5-4-3-2-1': '👁️',
  'body-scan': '🧘',
  'object-focus': '🔮',
  'breath-anchor': '🌬️',
  'safe-place': '🏠',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-500/20 text-green-600 border-green-500/30',
  intermediate: 'bg-amber-500/20 text-amber-600 border-amber-500/30',
  advanced: 'bg-red-500/20 text-red-600 border-red-500/30',
};

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  advanced: 'Avancé',
};

export const GroundingTechniqueCard = memo<GroundingTechniqueCardProps>(({
  technique,
  onStart,
  isFavorite = false,
  completedCount = 0,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        "h-full flex flex-col overflow-hidden transition-shadow hover:shadow-lg",
        isFavorite && "ring-2 ring-primary/50",
        className
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <span className="text-3xl" role="img" aria-label={technique.category}>
              {CATEGORY_ICONS[technique.category]}
            </span>
            <div className="flex items-center gap-2">
              {isFavorite && (
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              )}
              <Badge 
                variant="outline" 
                className={cn("text-xs", DIFFICULTY_COLORS[technique.difficulty])}
              >
                {DIFFICULTY_LABELS[technique.difficulty]}
              </Badge>
            </div>
          </div>
          <CardTitle className="text-lg mt-2">{technique.name}</CardTitle>
          <CardDescription className="line-clamp-2">
            {technique.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 pb-3">
          {/* Statistiques */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {technique.duration_minutes} min
            </span>
            {completedCount > 0 && (
              <span className="flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                {completedCount} fois
              </span>
            )}
          </div>

          {/* Bénéfices */}
          <div className="flex flex-wrap gap-1">
            {technique.benefits.slice(0, 3).map((benefit, i) => (
              <Badge 
                key={i} 
                variant="secondary" 
                className="text-xs font-normal"
              >
                {benefit}
              </Badge>
            ))}
          </div>

          {/* Étapes preview */}
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-muted-foreground mb-2">
              {technique.steps.length} étapes
            </p>
            <div className="flex gap-1">
              {technique.steps.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1 flex-1 rounded-full bg-muted",
                    i < completedCount && "bg-primary"
                  )}
                />
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <Button 
            onClick={() => onStart(technique.id)} 
            className="w-full"
            variant={isFavorite ? "default" : "outline"}
          >
            <Play className="mr-2 h-4 w-4" />
            Commencer
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
});

GroundingTechniqueCard.displayName = 'GroundingTechniqueCard';

export default GroundingTechniqueCard;
