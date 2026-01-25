/**
 * FlashGlowStatsPanel - Statistiques et progression Flash Glow
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, TrendingUp, Flame, Trophy, 
  Clock, Zap, Target, Calendar 
} from 'lucide-react';
import { flashGlowService, FlashGlowStats } from '../flash-glowService';

interface WeekDay {
  day: string;
  count: number;
  isToday: boolean;
}

export const FlashGlowStatsPanel: React.FC = () => {
  const [stats, setStats] = useState<FlashGlowStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await flashGlowService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeekDays = (): WeekDay[] => {
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const today = new Date().getDay();
    const trend = stats?.weeklyTrend || [0, 0, 0, 0, 0, 0, 0];

    return trend.map((count, index) => ({
      day: days[(today - 6 + index + 7) % 7],
      count,
      isToday: index === 6
    }));
  };

  const getLevelInfo = (sessions: number) => {
    const level = Math.floor(sessions / 10) + 1;
    const progress = ((sessions % 10) / 10) * 100;
    const titles = [
      'Débutant Lumineux',
      'Étoile Montante',
      'Maître de l\'Éclat',
      'Champion Radiant',
      'Légende Lumineuse'
    ];
    return {
      level,
      progress,
      title: titles[Math.min(level - 1, titles.length - 1)],
      sessionsToNext: 10 - (sessions % 10)
    };
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="h-32" />
          </Card>
        ))}
      </div>
    );
  }

  const levelInfo = getLevelInfo(stats?.total_sessions || 0);
  const weekDays = getWeekDays();
  const maxCount = Math.max(...weekDays.map(d => d.count), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Niveau et progression */}
      <Card className="bg-gradient-to-br from-primary/10 via-secondary/5 to-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Votre progression
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {levelInfo.level}
              </div>
              {(stats?.streak || 0) > 0 && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-destructive rounded-full flex items-center justify-center">
                  <Flame className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{levelInfo.title}</h3>
              <p className="text-sm text-muted-foreground">
                Niveau {levelInfo.level} • {stats?.total_sessions || 0} sessions
              </p>
              <div className="mt-2">
                <Progress value={levelInfo.progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {levelInfo.sessionsToNext} sessions pour le niveau suivant
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques clés */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.streak || 0}</p>
                <p className="text-xs text-muted-foreground">Jours de suite</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.totalPoints || 0}</p>
                <p className="text-xs text-muted-foreground">Points totaux</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{Math.round(stats?.avg_duration || 0)}s</p>
                <p className="text-xs text-muted-foreground">Durée moyenne</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.total_sessions || 0}</p>
                <p className="text-xs text-muted-foreground">Sessions totales</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activité hebdomadaire */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5" />
            Activité cette semaine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-2 h-24">
            {weekDays.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.count / maxCount) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className={`w-full rounded-t-md min-h-[4px] ${
                    day.isToday 
                      ? 'bg-gradient-to-t from-primary to-primary/60' 
                      : day.count > 0 
                        ? 'bg-gradient-to-t from-muted-foreground/60 to-muted-foreground/30'
                        : 'bg-muted'
                  }`}
                  style={{ height: Math.max(4, (day.count / maxCount) * 64) }}
                />
                <span className={`text-xs ${day.isToday ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                  {day.day}
                </span>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              {weekDays.reduce((sum, d) => sum + d.count, 0)} sessions cette semaine
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Meilleure session */}
      {stats?.bestSession && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5" />
              Meilleure session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg">
              <div>
                <p className="font-semibold">{stats.bestSession.score} points</p>
                <p className="text-sm text-muted-foreground">
                  {stats.bestSession.duration}s de session
                </p>
              </div>
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700">
                🏆 Record
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default FlashGlowStatsPanel;
