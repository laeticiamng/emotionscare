/**
 * Parcours de découverte guidés
 * @module discovery
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { 
  Lock, 
  CheckCircle, 
  ChevronRight, 
  Sparkles,
  Clock,
  Trophy,
  Map
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DiscoveryPath } from '../types';

interface DiscoveryPathsProps {
  paths: DiscoveryPath[];
  onSelectPath: (pathId: string) => void;
}

export const DiscoveryPathsPanel = memo(function DiscoveryPathsPanel({
  paths,
  onSelectPath,
}: DiscoveryPathsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Map className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Parcours Guidés</h2>
      </div>

      <div className="space-y-4">
        {paths.map((path, index) => {
          const progressPercent = path.items.length > 0 
            ? (path.completedItems / path.items.length) * 100 
            : 0;
          const isComplete = progressPercent === 100;

          return (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  'relative overflow-hidden transition-all duration-300',
                  'hover:shadow-lg hover:shadow-primary/5',
                  !path.isUnlocked && 'opacity-60',
                  isComplete && 'border-green-500/30'
                )}
              >
                {/* Gradient Background */}
                <div 
                  className={cn(
                    'absolute inset-0 opacity-10 bg-gradient-to-r',
                    path.color
                  )}
                />

                <div className="relative p-5">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div 
                      className={cn(
                        'w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0',
                        'bg-gradient-to-br shadow-inner',
                        path.color,
                        !path.isUnlocked && 'grayscale'
                      )}
                    >
                      {path.isUnlocked ? path.icon : <Lock className="w-6 h-6 text-muted-foreground" />}
                    </div>

                    {/* Content */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">
                          {path.name}
                        </h3>
                        {isComplete && (
                          <Badge className="bg-green-500/10 text-green-600 border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Complété
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {path.description}
                      </p>

                      {/* Meta info */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <span>{path.totalXp} XP</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>~{path.estimatedHours}h</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Trophy className="w-4 h-4" />
                          <span>{path.items.length} découvertes</span>
                        </div>
                      </div>

                      {/* Progress */}
                      {path.isUnlocked && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Progression</span>
                            <span className="text-foreground font-medium">
                              {path.completedItems} / {path.items.length}
                            </span>
                          </div>
                          <Progress 
                            value={progressPercent} 
                            className={cn(
                              'h-2',
                              isComplete && '[&>div]:bg-green-500'
                            )}
                          />
                        </div>
                      )}
                    </div>

                    {/* Action */}
                    <Button
                      variant={isComplete ? 'outline' : 'default'}
                      size="sm"
                      disabled={!path.isUnlocked}
                      onClick={() => onSelectPath(path.id)}
                      className="shrink-0"
                    >
                      {!path.isUnlocked ? (
                        <>
                          <Lock className="w-4 h-4 mr-1" />
                          Verrouillé
                        </>
                      ) : isComplete ? (
                        <>
                          Revoir
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </>
                      ) : (
                        <>
                          Continuer
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Path Items Preview */}
                  {path.isUnlocked && (
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        {path.items.slice(0, 5).map((item, idx) => {
                          const isItemComplete = item.status === 'completed' || item.status === 'mastered';
                          const isItemLocked = item.status === 'locked';
                          
                          return (
                            <div
                              key={item.id}
                              className={cn(
                                'w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0',
                                'border-2 transition-colors',
                                isItemComplete 
                                  ? 'bg-green-500/10 border-green-500' 
                                  : isItemLocked
                                    ? 'bg-muted border-muted-foreground/20 grayscale'
                                    : 'bg-primary/10 border-primary/30'
                              )}
                              title={item.title}
                            >
                              {isItemComplete ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : isItemLocked ? (
                                <Lock className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                item.icon
                              )}
                            </div>
                          );
                        })}
                        {path.items.length > 5 && (
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted text-muted-foreground text-sm font-medium">
                            +{path.items.length - 5}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

export default DiscoveryPathsPanel;
