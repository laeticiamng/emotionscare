/**
 * QuestPanel - Panneau de quête active
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Trophy, Clock, Pause, Play, X, CheckCircle2, Circle, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import confetti from 'canvas-confetti';

export interface QuestTask {
  id: string | number;
  text: string;
  completed: boolean;
  xp: number;
}

export interface Quest {
  id?: string;
  title: string;
  description: string;
  difficulty: string;
  tasks: QuestTask[];
  totalXP: number;
  icon: string;
  theme: string;
}

interface QuestPanelProps {
  quest: Quest;
  elapsedTime: number;
  isPaused: boolean;
  onToggleTask: (taskId: string | number) => void;
  onPause: () => void;
  onResume: () => void;
  onComplete: () => void;
  onAbandon: () => void;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const QuestPanel: React.FC<QuestPanelProps> = ({
  quest,
  elapsedTime,
  isPaused,
  onToggleTask,
  onPause,
  onResume,
  onComplete,
  onAbandon
}) => {
  const completedTasks = quest.tasks.filter(t => t.completed).length;
  const totalTasks = quest.tasks.length;
  const progress = (completedTasks / totalTasks) * 100;
  const earnedXP = quest.tasks.filter(t => t.completed).reduce((sum, t) => sum + t.xp, 0);
  const allCompleted = completedTasks === totalTasks;

  // Trigger confetti when all tasks complete
  useEffect(() => {
    if (allCompleted) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  }, [allCompleted]);

  const getDifficultyEmoji = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'douce': return '🌸';
      case 'modérée': return '⚔️';
      case 'épique': return '👑';
      case 'boss': return '🐉';
      default: return '🎯';
    }
  };

  return (
    <Card className="border-2 border-primary/30 bg-gradient-to-br from-card to-primary/5">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="gap-1">
            {getDifficultyEmoji(quest.difficulty)} {quest.difficulty}
          </Badge>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="font-mono font-semibold">{formatTime(elapsedTime)}</span>
          </div>
        </div>
        
        <CardTitle className="text-xl flex items-center gap-2 mt-2">
          <Target className="w-5 h-5 text-primary" />
          {quest.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{quest.description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Progression: {completedTasks}/{totalTasks} tâches
            </span>
            <span className="font-semibold text-warning">
              +{earnedXP} XP
            </span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Tasks */}
        <div className="space-y-2">
          <AnimatePresence>
            {quest.tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                  task.completed 
                    ? 'bg-success/10 border-success/30' 
                    : 'bg-card border-border hover:border-primary/30'
                }`}
                onClick={() => onToggleTask(task.id)}
              >
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                )}
                <span className={`flex-1 ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {task.text}
                </span>
                <Badge variant="outline" className="text-xs">
                  +{task.xp} XP
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={isPaused ? onResume : onPause}
            className="gap-2"
          >
            {isPaused ? (
              <>
                <Play className="w-4 h-4" />
                Reprendre
              </>
            ) : (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onAbandon}
            className="gap-2 text-destructive hover:text-destructive"
          >
            <X className="w-4 h-4" />
            Abandonner
          </Button>

          {allCompleted && (
            <Button
              size="sm"
              onClick={onComplete}
              className="ml-auto gap-2 bg-gradient-to-r from-primary to-info"
            >
              <Trophy className="w-4 h-4" />
              Terminer la quête
            </Button>
          )}
        </div>

        {/* Completion Message */}
        <AnimatePresence>
          {allCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center justify-center gap-2 p-4 bg-success/10 rounded-lg border border-success/30"
            >
              <Sparkles className="w-5 h-5 text-success" />
              <span className="font-semibold text-success">
                Toutes les tâches sont complétées ! 🎉
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
