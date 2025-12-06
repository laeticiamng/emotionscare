// @ts-nocheck
/**
 * Composant pour afficher et gérer les quêtes du parc émotionnel
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lock, Zap, Target } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface QuestItemProps {
  quest: any;
  onStart?: () => void;
  delay?: number;
}

const QuestItem: React.FC<QuestItemProps> = ({ quest, onStart, delay = 0 }) => {
  const progress = (quest.progress / quest.maxProgress) * 100;
  const difficultyColor = {
    easy: 'from-green-500/20 to-emerald-500/20',
    medium: 'from-yellow-500/20 to-orange-500/20',
    hard: 'from-red-500/20 to-pink-500/20'
  };

  const difficultyLabel = {
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Difficile'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Card className={`
        relative overflow-hidden
        bg-gradient-to-br ${difficultyColor}
        border-2 border-border/50
        hover:border-primary/50 transition-all
        group cursor-pointer h-full
      `}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-3 flex-1">
              <span className="text-2xl">{quest.icon}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm group-hover:text-primary transition-colors truncate">
                  {quest.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {quest.description}
                </p>
              </div>
            </div>
            {quest.completed && (
              <Badge variant="secondary" className="text-xs gap-1 shrink-0">
                <Trophy className="h-3 w-3" />
                Fait
              </Badge>
            )}
            {!quest.completed && (
              <Badge variant="outline" className="text-xs shrink-0">
                {difficultyLabel[quest.difficulty]}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Objective */}
          <div className="text-xs">
            <p className="text-muted-foreground mb-1">Objectif</p>
            <p className="font-medium text-foreground flex items-center gap-1">
              <Target className="h-3 w-3" />
              {quest.objective}
            </p>
          </div>

          {/* Progress Bar */}
          {!quest.completed && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-muted-foreground">Progression</span>
                <span className="text-xs font-semibold">
                  {quest.progress}/{quest.maxProgress}
                </span>
              </div>
              <motion.div
                className="h-2 bg-muted rounded-full overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: delay + 0.1, duration: 0.3 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ delay: delay + 0.2, duration: 0.5 }}
                />
              </motion.div>
            </div>
          )}

          {/* Reward */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-primary" />
              <span className="text-xs font-medium">{quest.reward} points</span>
            </div>
            {onStart && !quest.completed && (
              <Button
                size="xs"
                variant="ghost"
                onClick={onStart}
                className="text-xs h-6"
              >
                Commencer
              </Button>
            )}
          </div>
        </CardContent>

        {/* Background glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.5 }}
        />
      </Card>
    </motion.div>
  );
};

interface ParkQuestsProps {
  quests: any[];
  completedCount: number;
  totalRewards: number;
  onQuestStart?: (questId: string) => void;
}

export const ParkQuests: React.FC<ParkQuestsProps> = ({
  quests,
  completedCount,
  totalRewards,
  onQuestStart
}) => {
  const activeQuests = quests.filter(q => !q.completed).slice(0, 3);

  if (quests.length === 0) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            Quêtes du Parc
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {completedCount} quête(s) complétée(s) • {totalRewards} points gagnés
          </p>
        </div>
      </div>

      {/* Active Quests */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {activeQuests.map((quest, index) => (
          <QuestItem
            key={quest.id}
            quest={quest}
            onStart={() => onQuestStart?.(quest.id)}
            delay={index * 0.05}
          />
        ))}

        {/* Add more quests button */}
        {activeQuests.length < quests.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: activeQuests.length * 0.05 }}
            className="flex items-center justify-center"
          >
            <Card className="w-full h-full border-2 border-dashed border-border/50 hover:border-primary/50 transition-all cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
                <Zap className="h-8 w-8 text-primary/50 mb-2" />
                <p className="text-sm font-medium text-muted-foreground">
                  {quests.length - activeQuests.length} plus de quêtes disponibles
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Complète les quêtes actuelles pour débloquer d'autres
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Completed Quests Preview */}
      {completedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20"
        >
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Bravo! Tu as complété {completedCount} quête{completedCount > 1 ? 's' : ''}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Reviens plus tard pour plus de défis passionnants
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.section>
  );
};
