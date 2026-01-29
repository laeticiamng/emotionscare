/**
 * QuestComplete - Écran de complétion de quête
 */

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Clock, Target, RotateCcw, Home, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';
import type { Quest } from './BossGritQuestPanel';

interface QuestCompleteProps {
  quest: Quest;
  elapsedTime: number;
  earnedXP: number;
  newLevel?: number;
  onNewQuest: () => void;
  onBackToMenu: () => void;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const QuestComplete: React.FC<QuestCompleteProps> = ({
  quest,
  elapsedTime,
  earnedXP,
  newLevel,
  onNewQuest,
  onBackToMenu
}) => {
  useEffect(() => {
    // Celebrate with confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ffd700', '#ff6b6b', '#4ecdc4']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ffd700', '#ff6b6b', '#4ecdc4']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="max-w-lg mx-auto text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 10 }}
        className="mb-8"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-warning to-warning/60 rounded-full mb-4">
          <Trophy className="w-12 h-12 text-primary-foreground" />
        </div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-foreground mb-2"
        >
          Quête Accomplie !
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground"
        >
          {quest.title}
        </motion.p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-3 gap-4 mb-8"
      >
        <Card>
          <CardContent className="pt-6 text-center">
            <Star className="w-6 h-6 mx-auto mb-2 text-warning" />
            <div className="text-2xl font-bold text-foreground">+{earnedXP}</div>
            <div className="text-xs text-muted-foreground">XP gagnés</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <Clock className="w-6 h-6 mx-auto mb-2 text-info" />
            <div className="text-2xl font-bold text-foreground">{formatTime(elapsedTime)}</div>
            <div className="text-xs text-muted-foreground">Temps</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <Target className="w-6 h-6 mx-auto mb-2 text-success" />
            <div className="text-2xl font-bold text-foreground">{quest.tasks.length}</div>
            <div className="text-xs text-muted-foreground">Tâches</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Level up notification */}
      {newLevel && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-8 p-4 bg-gradient-to-r from-warning/20 to-info/20 rounded-xl border border-warning/30"
        >
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-warning" />
            <span className="font-bold text-lg text-foreground">
              Niveau {newLevel} atteint !
            </span>
            <Sparkles className="w-5 h-5 text-warning" />
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Button
          variant="outline"
          onClick={onBackToMenu}
          className="gap-2"
        >
          <Home className="w-4 h-4" />
          Menu principal
        </Button>
        <Button
          onClick={onNewQuest}
          className="gap-2 bg-gradient-to-r from-primary to-info"
        >
          <RotateCcw className="w-4 h-4" />
          Nouvelle quête
        </Button>
      </motion.div>
    </div>
  );
};
