/**
 * Affichage du streak quotidien Ambition Arcade
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Calendar, Zap, Trophy } from 'lucide-react';
import { useAmbitionStats } from '../hooks';

interface DailyStreakProps {
  compact?: boolean;
}

const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100];

export const DailyStreak: React.FC<DailyStreakProps> = ({ compact = false }) => {
  const { data: stats } = useAmbitionStats();

  const currentStreak = stats?.currentStreak || 0;
  const longestStreak = stats?.longestStreak || 0;
  
  // Find next milestone
  const nextMilestone = STREAK_MILESTONES.find(m => m > currentStreak) || 100;
  const progressToMilestone = (currentStreak / nextMilestone) * 100;

  const getStreakMessage = () => {
    if (currentStreak === 0) return 'Commencez votre streak !';
    if (currentStreak === 1) return 'Premier jour !';
    if (currentStreak < 7) return `${7 - currentStreak} jours avant une semaine !`;
    if (currentStreak < 30) return `${30 - currentStreak} jours avant un mois !`;
    return 'Incroyable régularité !';
  };

  const getFlameColor = () => {
    if (currentStreak >= 30) return 'text-orange-500';
    if (currentStreak >= 7) return 'text-amber-500';
    if (currentStreak >= 3) return 'text-yellow-500';
    return 'text-muted-foreground';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <motion.div
          animate={currentStreak > 0 ? {
            scale: [1, 1.1, 1],
          } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Flame className={`w-5 h-5 ${getFlameColor()}`} />
        </motion.div>
        <span className="font-bold">{currentStreak}</span>
        <span className="text-xs text-muted-foreground">jours</span>
      </div>
    );
  }

  return (
    <Card className={`overflow-hidden ${
      currentStreak >= 7 
        ? 'border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-orange-500/10' 
        : ''
    }`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={currentStreak > 0 ? {
                scale: [1, 1.15, 1],
                rotate: [0, 5, -5, 0]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className={`p-3 rounded-full ${
                currentStreak >= 7 
                  ? 'bg-gradient-to-br from-amber-500 to-orange-600' 
                  : 'bg-muted'
              }`}
            >
              <Flame className={`w-6 h-6 ${
                currentStreak >= 7 ? 'text-white' : getFlameColor()
              }`} />
            </motion.div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{currentStreak}</span>
                <span className="text-muted-foreground">jours</span>
              </div>
              <p className="text-xs text-muted-foreground">{getStreakMessage()}</p>
            </div>
          </div>

          {longestStreak > 0 && (
            <Badge variant="outline" className="gap-1">
              <Trophy className="w-3 h-3" />
              Record: {longestStreak}
            </Badge>
          )}
        </div>

        {/* Progress to next milestone */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Prochain objectif: {nextMilestone} jours</span>
            <span>{Math.round(progressToMilestone)}%</span>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressToMilestone}%` }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full"
            />
          </div>
        </div>

        {/* Week visualization */}
        <div className="flex justify-between mt-4 gap-1">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => {
            const isActive = index < Math.min(currentStreak, 7);
            return (
              <motion.div
                key={day}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`flex-1 h-8 rounded flex items-center justify-center text-xs font-medium ${
                  isActive 
                    ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {day}
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyStreak;
