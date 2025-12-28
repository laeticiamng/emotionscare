/**
 * Carte individuelle d'une quête Ambition Arcade
 */
import React, { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, CheckCircle, Clock, Zap, 
  ChevronDown, ChevronUp, Timer 
} from 'lucide-react';
import { useStartQuest, useCompleteQuest, type AmbitionQuest } from '../hooks';
import { QuestTimer } from './QuestTimer';

interface QuestCardProps {
  quest: AmbitionQuest;
  showTimer?: boolean;
}

const STATUS_CONFIG = {
  available: { 
    color: 'bg-muted text-muted-foreground',
    label: 'Disponible',
    icon: null
  },
  in_progress: { 
    color: 'bg-primary/20 text-primary',
    label: 'En cours',
    icon: <Timer className="w-3 h-3" />
  },
  completed: { 
    color: 'bg-success/20 text-success',
    label: 'Complétée',
    icon: <CheckCircle className="w-3 h-3" />
  }
};

export const QuestCard: React.FC<QuestCardProps> = memo(({ quest, showTimer = true }) => {
  const [expanded, setExpanded] = useState(false);
  const startQuest = useStartQuest();
  const completeQuest = useCompleteQuest();
  
  const config = STATUS_CONFIG[quest.status];
  const isInProgress = quest.status === 'in_progress';
  const isCompleted = quest.status === 'completed';
  const isAvailable = quest.status === 'available';

  const handleStart = async () => {
    await startQuest.mutateAsync(quest.id);
  };

  const handleComplete = async () => {
    await completeQuest.mutateAsync({ questId: quest.id });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Card className={`transition-all ${
        isInProgress ? 'border-primary ring-1 ring-primary/20' : 
        isCompleted ? 'opacity-70' : ''
      }`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Status indicator */}
            <div className={`w-3 h-3 rounded-full mt-1.5 ${
              isCompleted ? 'bg-success' : 
              isInProgress ? 'bg-primary animate-pulse' : 
              'bg-muted-foreground/30'
            }`} />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                  {quest.title}
                </h4>
                <Badge className={config.color} variant="secondary">
                  {config.icon}
                  <span className="ml-1">{config.label}</span>
                </Badge>
              </div>

              {quest.flavor && (
                <p className="text-sm text-muted-foreground italic mb-2">
                  "{quest.flavor}"
                </p>
              )}

              {/* Meta info */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{quest.estMinutes} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-warning" />
                  <span>{quest.xpReward} XP</span>
                </div>
              </div>

              {/* Timer for in-progress quests */}
              {isInProgress && showTimer && (
                <div className="mt-3">
                  <QuestTimer
                    questId={quest.id}
                    questTitle={quest.title}
                    estimatedMinutes={quest.estMinutes}
                  />
                </div>
              )}

              {/* Notes/Result for completed quests */}
              {isCompleted && (quest.result || quest.notes) && (
                <div className="mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => setExpanded(!expanded)}
                  >
                    {expanded ? <ChevronUp className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
                    {expanded ? 'Masquer' : 'Voir détails'}
                  </Button>
                  
                  {expanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 p-2 bg-muted/50 rounded text-sm"
                    >
                      {quest.result && <p><strong>Résultat:</strong> {quest.result}</p>}
                      {quest.notes && <p className="mt-1 text-muted-foreground">{quest.notes}</p>}
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              {isAvailable && (
                <Button
                  size="sm"
                  onClick={handleStart}
                  disabled={startQuest.isPending}
                  className="gap-1"
                >
                  <Play className="w-3 h-3" />
                  Go
                </Button>
              )}
              
              {isInProgress && !showTimer && (
                <Button
                  size="sm"
                  variant="default"
                  onClick={handleComplete}
                  disabled={completeQuest.isPending}
                  className="gap-1"
                >
                  <CheckCircle className="w-3 h-3" />
                  Done
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

QuestCard.displayName = 'QuestCard';

export default QuestCard;
