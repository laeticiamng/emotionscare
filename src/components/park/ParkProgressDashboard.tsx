/**
 * ParkProgressDashboard - Tableau de bord de progression du parc
 * Vue d'ensemble de la progression, streaks, et objectifs
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Flame, Star, Zap, 
  Target, Clock, Award, ChevronRight, Sparkles 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface StreakData {
  current: number;
  longest: number;
  lastActivityDate?: string;
  weeklyProgress: boolean[];
}

interface LevelData {
  level: number;
  xp: number;
  xpToNextLevel: number;
  title: string;
}

interface DailyGoal {
  id: string;
  title: string;
  progress: number;
  target: number;
  icon: string;
  completed: boolean;
}

interface ParkProgressDashboardProps {
  streak: StreakData;
  level: LevelData;
  dailyGoals: DailyGoal[];
  totalVisits: number;
  zonesCompleted: number;
  totalZones: number;
  onStartActivity?: () => void;
}

const levelTitles: Record<number, string> = {
  1: 'Novice du Parc',
  2: 'Explorateur Curieux',
  3: 'Aventurier Émotionnel',
  4: 'Maître des Zones',
  5: 'Gardien du Parc',
  6: 'Sage des Émotions',
  7: 'Légende du Parc',
  8: 'Architecte Émotionnel',
  9: 'Gardien Suprême',
  10: 'Maître Absolu'
};

const StreakFlame: React.FC<{ count: number; isActive: boolean }> = ({ count, isActive }) => (
  <motion.div
    className={`
      relative flex items-center justify-center
      w-20 h-20 rounded-full
      ${isActive 
        ? 'bg-gradient-to-br from-orange-500/20 via-red-500/20 to-yellow-500/20' 
        : 'bg-muted/30'
      }
    `}
    animate={isActive ? { scale: [1, 1.05, 1] } : undefined}
    transition={{ duration: 2, repeat: Infinity }}
  >
    <motion.div
      animate={isActive ? { 
        y: [0, -3, 0],
        scale: [1, 1.1, 1]
      } : undefined}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <Flame className={`h-10 w-10 ${isActive ? 'text-orange-500' : 'text-muted-foreground'}`} />
    </motion.div>
    <motion.span
      className={`
        absolute -bottom-2 font-bold text-lg
        ${isActive ? 'text-orange-500' : 'text-muted-foreground'}
      `}
    >
      {count}
    </motion.span>
  </motion.div>
);

const WeeklyDots: React.FC<{ progress: boolean[] }> = ({ progress }) => {
  const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  
  return (
    <div className="flex items-center gap-1.5">
      {progress.map((completed, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="text-center"
        >
          <div
            className={`
              w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
              ${completed 
                ? 'bg-green-500 text-white' 
                : 'bg-muted text-muted-foreground'
              }
            `}
          >
            {completed ? '✓' : days[index]}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export const ParkProgressDashboard: React.FC<ParkProgressDashboardProps> = ({
  streak,
  level,
  dailyGoals,
  totalVisits,
  zonesCompleted,
  totalZones,
  onStartActivity
}) => {
  const levelProgress = useMemo(() => {
    return Math.round((level.xp / level.xpToNextLevel) * 100);
  }, [level.xp, level.xpToNextLevel]);

  const dailyProgress = useMemo(() => {
    const completed = dailyGoals.filter(g => g.completed).length;
    return Math.round((completed / dailyGoals.length) * 100);
  }, [dailyGoals]);

  const isStreakActive = streak.current > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Streak & Level Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Streak Card */}
        <Card className="bg-gradient-to-br from-orange-500/10 via-red-500/5 to-yellow-500/10 border-orange-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <StreakFlame count={streak.current} isActive={isStreakActive} />
              
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">
                  {isStreakActive ? 'Série en cours !' : 'Commencer une série'}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Record: {streak.longest} jours
                </p>
                <WeeklyDots progress={streak.weeklyProgress} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Level Card */}
        <Card className="bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge variant="secondary" className="mb-2">
                  Niveau {level.level}
                </Badge>
                <h3 className="font-bold text-lg">
                  {levelTitles[level.level] || level.title}
                </h3>
              </div>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Star className="h-8 w-8 text-primary" />
              </motion.div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>XP: {level.xp.toLocaleString()}</span>
                <span className="text-muted-foreground">
                  {level.xpToNextLevel.toLocaleString()} pour niveau {level.level + 1}
                </span>
              </div>
              <Progress value={levelProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Goals */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Objectifs du jour
            </CardTitle>
            <Badge variant={dailyProgress >= 100 ? 'default' : 'secondary'}>
              {dailyProgress}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {dailyGoals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                flex items-center gap-3 p-3 rounded-lg
                ${goal.completed ? 'bg-green-500/10' : 'bg-muted/30'}
              `}
            >
              <span className="text-xl">{goal.icon}</span>
              <div className="flex-1">
                <p className={`font-medium ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {goal.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Progress 
                    value={(goal.progress / goal.target) * 100} 
                    className="h-1.5 flex-1" 
                  />
                  <span className="text-xs text-muted-foreground">
                    {goal.progress}/{goal.target}
                  </span>
                </div>
              </div>
              {goal.completed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-green-500"
                >
                  ✓
                </motion.div>
              )}
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center p-4">
          <Clock className="h-5 w-5 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{totalVisits}</p>
          <p className="text-xs text-muted-foreground">Visites totales</p>
        </Card>
        
        <Card className="text-center p-4">
          <Award className="h-5 w-5 text-purple-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{zonesCompleted}/{totalZones}</p>
          <p className="text-xs text-muted-foreground">Zones complètes</p>
        </Card>
        
        <Card className="text-center p-4">
          <Zap className="h-5 w-5 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{level.xp}</p>
          <p className="text-xs text-muted-foreground">XP gagnés</p>
        </Card>
      </div>

      {/* CTA */}
      {onStartActivity && (
        <Button onClick={onStartActivity} className="w-full gap-2" size="lg">
          <Sparkles className="h-5 w-5" />
          Continuer l'aventure
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </motion.div>
  );
};

export default ParkProgressDashboard;
