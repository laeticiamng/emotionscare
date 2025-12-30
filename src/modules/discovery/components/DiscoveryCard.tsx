/**
 * Carte de découverte individuelle
 * @module discovery
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Clock, Lock, CheckCircle, Star, Sparkles, Play, Trophy } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DiscoveryItem } from '../types';

interface DiscoveryCardProps {
  item: DiscoveryItem;
  onStart: (id: string) => void;
  index?: number;
}

const difficultyLabels: Record<string, string> = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  advanced: 'Avancé',
  expert: 'Expert',
};

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-500/10 text-green-600 border-green-200',
  intermediate: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
  advanced: 'bg-orange-500/10 text-orange-600 border-orange-200',
  expert: 'bg-red-500/10 text-red-600 border-red-200',
};

const statusConfig = {
  locked: { icon: Lock, label: 'Verrouillé', color: 'text-muted-foreground' },
  available: { icon: Play, label: 'Disponible', color: 'text-primary' },
  in_progress: { icon: Sparkles, label: 'En cours', color: 'text-amber-500' },
  completed: { icon: CheckCircle, label: 'Complété', color: 'text-green-500' },
  mastered: { icon: Trophy, label: 'Maîtrisé', color: 'text-purple-500' },
} as const;

export const DiscoveryCard = memo(function DiscoveryCard({
  item,
  onStart,
  index = 0,
}: DiscoveryCardProps) {
  const isLocked = item.status === 'locked';
  const isCompleted = item.status === 'completed' || item.status === 'mastered';
  const statusInfo = statusConfig[item.status];
  const StatusIcon = statusInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={isLocked ? {} : { scale: 1.02, y: -4 }}
      className="h-full"
    >
      <Card
        className={cn(
          'relative h-full overflow-hidden transition-all duration-300',
          'border border-border/50 bg-card/80 backdrop-blur-sm',
          isLocked && 'opacity-60 grayscale',
          !isLocked && 'hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5',
          isCompleted && 'border-green-500/30 bg-green-500/5'
        )}
      >
        {/* Gradient Background */}
        <div 
          className={cn(
            'absolute inset-0 opacity-10 bg-gradient-to-br',
            item.color
          )}
        />

        {/* Content */}
        <div className="relative p-5 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div 
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center text-2xl',
                  'bg-gradient-to-br shadow-inner',
                  item.color
                )}
              >
                {item.icon}
              </div>
              <div>
                <h3 className="font-semibold text-foreground leading-tight">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge 
                    variant="outline" 
                    className={cn('text-xs', difficultyColors[item.difficulty])}
                  >
                    {difficultyLabels[item.difficulty]}
                  </Badge>
                  <StatusIcon className={cn('w-4 h-4', statusInfo.color)} />
                </div>
              </div>
            </div>
            
            {/* XP Badge */}
            <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 px-2 py-1 rounded-full">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-xs font-medium">{item.xpReward} XP</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground flex-grow mb-4 line-clamp-2">
            {item.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {item.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-muted/50 text-xs text-muted-foreground rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Progress Bar (if in progress) */}
          {item.status === 'in_progress' && item.progress > 0 && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progression</span>
                <span>{item.progress}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.progress}%` }}
                  className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{item.estimatedMinutes} min</span>
            </div>

            <Button
              size="sm"
              variant={isCompleted ? 'outline' : 'default'}
              disabled={isLocked}
              onClick={() => onStart(item.id)}
              className={cn(
                'gap-2',
                isCompleted && 'border-green-500/30 text-green-600 hover:bg-green-500/10'
              )}
            >
              {isLocked ? (
                <>
                  <Lock className="w-4 h-4" />
                  Verrouillé
                </>
              ) : isCompleted ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Revoir
                </>
              ) : item.status === 'in_progress' ? (
                <>
                  <Play className="w-4 h-4" />
                  Continuer
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Commencer
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Completed Overlay */}
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-3 right-3"
          >
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
});

export default DiscoveryCard;
