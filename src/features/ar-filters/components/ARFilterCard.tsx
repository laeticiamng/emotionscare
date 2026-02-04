/**
 * ARFilterCard - Carte de sélection de filtre AR
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, Play, Sparkles } from 'lucide-react';
import { ARFilter } from '../index';
import { cn } from '@/lib/utils';

interface ARFilterCardProps {
  filter: ARFilter;
  onSelect: (filter: ARFilter) => void;
  isActive?: boolean;
  isLocked?: boolean;
  className?: string;
}

export const ARFilterCard = memo<ARFilterCardProps>(({
  filter,
  onSelect,
  isActive = false,
  isLocked = false,
  className,
}) => {
  const handleClick = () => {
    if (!isLocked) {
      onSelect(filter);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: isLocked ? 1 : 1.02 }}
      whileTap={{ scale: isLocked ? 1 : 0.98 }}
    >
      <Card 
        className={cn(
          "relative overflow-hidden cursor-pointer transition-all",
          isActive && "ring-2 ring-primary",
          isLocked && "opacity-60 cursor-not-allowed",
          className
        )}
        onClick={handleClick}
      >
        {/* Image de preview */}
        <div className="relative aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
          {filter.thumbnailUrl ? (
            <img 
              src={filter.thumbnailUrl} 
              alt={filter.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="text-4xl">
              {filter.type === 'mood-aura' && '✨'}
              {filter.type === 'emotion-mask' && '🎭'}
              {filter.type === 'zen-particles' && '🧘'}
              {filter.type === 'nature-overlay' && '🌿'}
              {filter.type === 'dream-filter' && '☁️'}
              {filter.type === 'energy-flow' && '⚡'}
            </div>
          )}

          {/* Overlay pour les filtres premium verrouillés */}
          {isLocked && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Lock className="h-8 w-8 text-muted-foreground" />
            </div>
          )}

          {/* Badge premium */}
          {filter.isPremium && (
            <Badge 
              className="absolute top-2 right-2"
              variant="secondary"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              PRO
            </Badge>
          )}

          {/* Indicateur actif */}
          {isActive && (
            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
              <div className="bg-primary text-primary-foreground rounded-full p-2">
                <Play className="h-6 w-6" />
              </div>
            </div>
          )}
        </div>

        <CardContent className="p-3">
          <h3 className="font-medium text-sm truncate">{filter.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {filter.description}
          </p>

          {/* Tags d'humeur */}
          <div className="flex flex-wrap gap-1 mt-2">
            {filter.moodTags.slice(0, 2).map((tag, i) => (
              <Badge 
                key={i} 
                variant="outline" 
                className="text-[10px] px-1.5 py-0"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Barre d'intensité */}
          <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary/70 rounded-full"
              style={{ width: `${filter.intensity}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

ARFilterCard.displayName = 'ARFilterCard';

export default ARFilterCard;
