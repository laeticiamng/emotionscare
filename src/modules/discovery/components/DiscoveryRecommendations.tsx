/**
 * Recommandations personnalisées de découverte
 * @module discovery
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  TrendingUp, 
  Heart, 
  Clock,
  History,
  Target,
  Zap,
  ChevronRight
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DiscoveryRecommendation } from '../types';

interface DiscoveryRecommendationsProps {
  recommendations: DiscoveryRecommendation[];
  onStartItem: (id: string) => void;
}

const basedOnIcons = {
  mood: Heart,
  history: History,
  goals: Target,
  time: Clock,
  trending: TrendingUp,
} as const;

const basedOnLabels: Record<string, string> = {
  mood: 'Votre humeur',
  history: 'Votre historique',
  goals: 'Vos objectifs',
  time: 'Le moment',
  trending: 'Populaire',
};

export const DiscoveryRecommendationsPanel = memo(function DiscoveryRecommendationsPanel({
  recommendations,
  onStartItem,
}: DiscoveryRecommendationsProps) {
  if (recommendations.length === 0) return null;

  return (
    <Card className="p-5 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Recommandé pour vous</h3>
          <p className="text-xs text-muted-foreground">Basé sur votre profil et votre activité</p>
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, index) => {
          const BasedOnIcon = basedOnIcons[rec.basedOn] || Sparkles;
          const matchPercent = Math.round(rec.matchScore * 100);

          return (
            <motion.div
              key={rec.item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div 
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg',
                  'bg-background/50 hover:bg-background/80 transition-colors',
                  'cursor-pointer border border-transparent hover:border-primary/20'
                )}
                onClick={() => onStartItem(rec.item.id)}
              >
                {/* Icon */}
                <div 
                  className={cn(
                    'w-12 h-12 rounded-lg flex items-center justify-center text-xl shrink-0',
                    'bg-gradient-to-br',
                    rec.item.color
                  )}
                >
                  {rec.item.icon}
                </div>

                {/* Content */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-medium text-foreground truncate">
                      {rec.item.title}
                    </h4>
                    <Badge 
                      variant="secondary" 
                      className="text-xs bg-primary/10 text-primary shrink-0"
                    >
                      {matchPercent}% match
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {rec.reason}
                  </p>

                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <BasedOnIcon className="w-3 h-3" />
                      <span>{basedOnLabels[rec.basedOn]}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{rec.item.estimatedMinutes} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-500" />
                      <span>{rec.item.xpReward} XP</span>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </div>
            </motion.div>
          );
        })}
      </div>

      <Button 
        variant="ghost" 
        className="w-full mt-3 text-primary hover:text-primary hover:bg-primary/10"
      >
        Voir toutes les recommandations
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </Card>
  );
});

export default DiscoveryRecommendationsPanel;
