/**
 * Music Stats Section - Statistiques d'écoute avancées
 * Graphiques, émotions, tendances, insights
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Music,
  Heart,
  Flame,
  Calendar,
  Headphones,
  Target,
  Award,
  Sparkles,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface ListeningStats {
  totalMinutes: number;
  totalTracks: number;
  uniqueArtists: number;
  topEmotion: string;
  streak: number;
  weeklyChange: number;
}

interface EmotionStat {
  emotion: string;
  percentage: number;
  color: string;
  count: number;
}

interface DailyListening {
  day: string;
  minutes: number;
  tracks: number;
}

const MOCK_STATS: ListeningStats = {
  totalMinutes: 4320,
  totalTracks: 156,
  uniqueArtists: 42,
  topEmotion: 'focus',
  streak: 12,
  weeklyChange: 15,
};

const EMOTION_STATS: EmotionStat[] = [
  { emotion: 'Focus', percentage: 35, color: 'bg-blue-500', count: 54 },
  { emotion: 'Calme', percentage: 28, color: 'bg-green-500', count: 43 },
  { emotion: 'Énergie', percentage: 18, color: 'bg-orange-500', count: 28 },
  { emotion: 'Joie', percentage: 12, color: 'bg-yellow-500', count: 19 },
  { emotion: 'Mélancolie', percentage: 7, color: 'bg-purple-500', count: 12 },
];

const DAILY_LISTENING: DailyListening[] = [
  { day: 'Lun', minutes: 45, tracks: 12 },
  { day: 'Mar', minutes: 62, tracks: 18 },
  { day: 'Mer', minutes: 38, tracks: 10 },
  { day: 'Jeu', minutes: 55, tracks: 15 },
  { day: 'Ven', minutes: 78, tracks: 22 },
  { day: 'Sam', minutes: 95, tracks: 28 },
  { day: 'Dim', minutes: 42, tracks: 11 },
];

const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
};

export const MusicStatsSection: React.FC = () => {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');
  const maxMinutes = Math.max(...DAILY_LISTENING.map((d) => d.minutes));

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Statistiques d'écoute
          </CardTitle>
          <div className="flex gap-1">
            {(['week', 'month', 'year'] as const).map((p) => (
              <Button
                key={p}
                size="sm"
                variant={period === p ? 'default' : 'ghost'}
                className="h-7 text-xs"
                onClick={() => setPeriod(p)}
              >
                {p === 'week' ? '7j' : p === 'month' ? '30j' : '1an'}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border text-center"
          >
            <Clock className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-lg font-bold">{formatTime(MOCK_STATS.totalMinutes)}</p>
            <p className="text-xs text-muted-foreground">Temps d'écoute</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="p-3 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border text-center"
          >
            <Music className="h-5 w-5 mx-auto mb-1 text-green-500" />
            <p className="text-lg font-bold">{MOCK_STATS.totalTracks}</p>
            <p className="text-xs text-muted-foreground">Titres écoutés</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-3 rounded-lg bg-gradient-to-br from-orange-500/10 to-orange-500/5 border text-center"
          >
            <Flame className="h-5 w-5 mx-auto mb-1 text-orange-500" />
            <p className="text-lg font-bold">{MOCK_STATS.streak} jours</p>
            <p className="text-xs text-muted-foreground">Série active</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-3 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5 border text-center"
          >
            <Headphones className="h-5 w-5 mx-auto mb-1 text-purple-500" />
            <p className="text-lg font-bold">{MOCK_STATS.uniqueArtists}</p>
            <p className="text-xs text-muted-foreground">Artistes uniques</p>
          </motion.div>
        </div>

        {/* Weekly Trend */}
        <div className="p-3 rounded-lg bg-muted/20 border">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium">Tendance hebdomadaire</p>
            <Badge
              variant={MOCK_STATS.weeklyChange > 0 ? 'default' : 'secondary'}
              className="gap-1"
            >
              {MOCK_STATS.weeklyChange > 0 ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )}
              {Math.abs(MOCK_STATS.weeklyChange)}%
            </Badge>
          </div>

          {/* Mini Bar Chart */}
          <div className="flex items-end justify-between gap-1 h-20">
            {DAILY_LISTENING.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ height: 0 }}
                animate={{ height: `${(day.minutes / maxMinutes) * 100}%` }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="flex-1 flex flex-col items-center"
              >
                <div
                  className="w-full rounded-t bg-gradient-to-t from-primary to-primary/50 min-h-[4px]"
                  style={{ height: `${(day.minutes / maxMinutes) * 100}%` }}
                />
                <span className="text-[10px] text-muted-foreground mt-1">{day.day}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Emotion Distribution */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium flex items-center gap-2">
              <Heart className="h-4 w-4 text-pink-500" />
              Répartition émotionnelle
            </p>
            <Badge variant="outline" className="text-xs">
              Top: {MOCK_STATS.topEmotion}
            </Badge>
          </div>

          <div className="space-y-2">
            {EMOTION_STATS.map((stat, index) => (
              <motion.div
                key={stat.emotion}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="space-y-1"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{stat.emotion}</span>
                  <span className="text-muted-foreground">
                    {stat.count} titres ({stat.percentage}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.percentage}%` }}
                    transition={{ delay: 0.2 + index * 0.05, duration: 0.5 }}
                    className={`h-full rounded-full ${stat.color}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-lg border bg-gradient-to-br from-blue-500/5 to-transparent">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-medium">Objectif</span>
            </div>
            <p className="text-sm">
              <span className="font-bold">85%</span> de votre objectif hebdo
            </p>
            <Progress value={85} className="h-1.5 mt-2" />
          </div>

          <div className="p-3 rounded-lg border bg-gradient-to-br from-yellow-500/5 to-transparent">
            <div className="flex items-center gap-2 mb-1">
              <Award className="h-4 w-4 text-yellow-500" />
              <span className="text-xs font-medium">Badge</span>
            </div>
            <p className="text-sm">
              Prochain: <span className="font-bold">Mélomane</span>
            </p>
            <Progress value={72} className="h-1.5 mt-2" />
          </div>
        </div>

        {/* AI Insight */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-3 rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20"
        >
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-primary mb-1">Insight IA</p>
              <p className="text-xs text-muted-foreground">
                Vous écoutez 40% plus de musique de concentration le matin.
                Essayez notre playlist "Morning Focus" pour optimiser votre routine.
              </p>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default MusicStatsSection;
