/**
 * Composant Défis Quotidiens - EmotionsCare
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer, CheckCircle, Star, Zap, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useGamification, type DailyChallenge } from '@/modules/gamification';
import { cn } from '@/lib/utils';

const CATEGORY_ICONS: Record<string, string> = {
  scan: '📷',
  journal: '📝',
  meditation: '🧘',
  social: '👥',
  wellness: '💚',
};

export function DailyChallengesCard() {
  const { dailyChallenges, getTimeRemaining, updateChallengeProgress } = useGamification();
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining());
    }, 60000);
    
    return () => clearInterval(interval);
  }, [getTimeRemaining]);

  const completedCount = dailyChallenges.filter(c => c.completed).length;
  const totalXp = dailyChallenges.reduce((sum, c) => sum + c.xpReward, 0);
  const earnedXp = dailyChallenges
    .filter(c => c.completed)
    .reduce((sum, c) => sum + c.xpReward, 0);

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="w-5 h-5 text-primary" aria-hidden="true" />
            Défis du jour
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Timer className="w-4 h-4" aria-hidden="true" />
            <span>
              {timeRemaining.hours}h {timeRemaining.minutes}m restantes
            </span>
          </div>
        </div>
        
        {/* Summary */}
        <div className="flex items-center gap-4 mt-2">
          <Badge variant="outline" className="text-xs">
            {completedCount}/{dailyChallenges.length} complétés
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Zap className="w-3 h-3 text-warning" />
            <span>{earnedXp}/{totalXp} XP</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {dailyChallenges.map((challenge, index) => (
          <DailyChallengeItem 
            key={challenge.id} 
            challenge={challenge}
            index={index}
          />
        ))}
        
        {/* Bonus when all completed */}
        {completedCount === dailyChallenges.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-success/20 to-success/10 rounded-lg p-4 text-center"
          >
            <Star className="w-8 h-8 text-warning mx-auto mb-2" />
            <p className="font-semibold text-success">Tous les défis complétés !</p>
            <p className="text-sm text-muted-foreground">+50 XP bonus</p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

interface DailyChallengeItemProps {
  challenge: DailyChallenge;
  index: number;
}

function DailyChallengeItem({ challenge, index }: DailyChallengeItemProps) {
  const progressPercent = (challenge.progress / challenge.target) * 100;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        'bg-card rounded-lg p-3 border transition-all',
        challenge.completed 
          ? 'border-success/50 bg-success/5' 
          : 'border-border hover:border-primary/30'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center text-lg',
          challenge.completed ? 'bg-success/20' : 'bg-muted'
        )}>
          {challenge.completed ? (
            <CheckCircle className="w-5 h-5 text-success" />
          ) : (
            <span>{challenge.icon || CATEGORY_ICONS[challenge.category] || '🎯'}</span>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={cn(
              'font-medium text-sm',
              challenge.completed && 'line-through text-muted-foreground'
            )}>
              {challenge.title}
            </h4>
            {challenge.completed && (
              <Badge variant="outline" className="text-xs text-success border-success/50">
                ✓
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            {challenge.description}
          </p>
          
          {/* Progress */}
          {!challenge.completed && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  {challenge.progress}/{challenge.target}
                </span>
                <span className="text-primary font-medium">
                  +{challenge.xpReward} XP
                </span>
              </div>
              <Progress value={progressPercent} className="h-1.5" />
            </div>
          )}
        </div>
        
        {/* Reward */}
        <div className="text-right shrink-0">
          <div className="flex items-center gap-1">
            <Zap className={cn(
              'w-4 h-4',
              challenge.completed ? 'text-success' : 'text-warning'
            )} />
            <span className={cn(
              'font-bold text-sm',
              challenge.completed ? 'text-success' : 'text-foreground'
            )}>
              {challenge.xpReward}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">XP</span>
        </div>
      </div>
    </motion.div>
  );
}

export default DailyChallengesCard;
