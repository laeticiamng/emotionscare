/**
 * MusicStatsSection - Statistiques d'écoute avec données RÉELLES
 * Connecté à useMusicListeningStats pour données Supabase
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Music,
  Heart,
  Flame,
  Headphones,
  Target,
  Award,
  Sparkles,
  ArrowUp,
  ArrowDown,
  RefreshCw,
} from 'lucide-react';
import { useMusicListeningStats } from '@/hooks/music/useMusicListeningStats';

const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
};

export const MusicStatsSection: React.FC = () => {
  const { stats, isLoading, refreshStats } = useMusicListeningStats();
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-32 rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground mb-4">Aucune statistique disponible</p>
          <Button variant="outline" onClick={refreshStats}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </CardContent>
      </Card>
    );
  }

  const maxMinutes = Math.max(...stats.dailyStats.map((d) => d.minutes), 1);

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
            <p className="text-lg font-bold">{formatTime(stats.totalMinutes)}</p>
            <p className="text-xs text-muted-foreground">Temps d'écoute</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="p-3 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border text-center"
          >
            <Music className="h-5 w-5 mx-auto mb-1 text-green-500" />
            <p className="text-lg font-bold">{stats.totalTracks}</p>
            <p className="text-xs text-muted-foreground">Titres écoutés</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-3 rounded-lg bg-gradient-to-br from-orange-500/10 to-orange-500/5 border text-center"
          >
            <Flame className="h-5 w-5 mx-auto mb-1 text-orange-500" />
            <p className="text-lg font-bold">{stats.streak} jours</p>
            <p className="text-xs text-muted-foreground">Série active</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-3 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5 border text-center"
          >
            <Headphones className="h-5 w-5 mx-auto mb-1 text-purple-500" />
            <p className="text-lg font-bold">{stats.uniqueArtists}</p>
            <p className="text-xs text-muted-foreground">Artistes uniques</p>
          </motion.div>
        </div>

        {/* Weekly Trend */}
        <div className="p-3 rounded-lg bg-muted/20 border">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium">Tendance hebdomadaire</p>
            <Badge
              variant={stats.weeklyChange > 0 ? 'default' : 'secondary'}
              className="gap-1"
            >
              {stats.weeklyChange > 0 ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )}
              {Math.abs(stats.weeklyChange)}%
            </Badge>
          </div>

          {/* Mini Bar Chart */}
          <div className="flex items-end justify-between gap-1 h-20">
            {stats.dailyStats.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ height: 0 }}
                animate={{ height: `${Math.max((day.minutes / maxMinutes) * 100, 5)}%` }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="flex-1 flex flex-col items-center"
              >
                <div
                  className="w-full rounded-t bg-gradient-to-t from-primary to-primary/50 min-h-[4px]"
                  style={{ height: `${Math.max((day.minutes / maxMinutes) * 100, 5)}%` }}
                />
                <span className="text-[10px] text-muted-foreground mt-1">{day.day}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Emotion Distribution */}
        {stats.emotionStats.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium flex items-center gap-2">
                <Heart className="h-4 w-4 text-pink-500" />
                Répartition émotionnelle
              </p>
              <Badge variant="outline" className="text-xs">
                Top: {stats.topEmotion}
              </Badge>
            </div>

            <div className="space-y-2">
              {stats.emotionStats.map((stat, index) => (
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
        )}

        {/* Top Artistes */}
        {stats.topArtists.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-500" />
              Top Artistes
            </p>
            <div className="space-y-1">
              {stats.topArtists.slice(0, 3).map((artist, index) => (
                <div key={artist.artist} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="text-muted-foreground">#{index + 1}</span>
                    {artist.artist}
                  </span>
                  <span className="text-muted-foreground">{artist.count} écoutes</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Insights */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-lg border bg-gradient-to-br from-blue-500/5 to-transparent">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-medium">Objectif</span>
            </div>
            <p className="text-sm">
              <span className="font-bold">{Math.min(stats.totalTracks, 100)}%</span> de votre objectif hebdo
            </p>
            <Progress value={Math.min(stats.totalTracks, 100)} className="h-1.5 mt-2" />
          </div>

          <div className="p-3 rounded-lg border bg-gradient-to-br from-yellow-500/5 to-transparent">
            <div className="flex items-center gap-2 mb-1">
              <Award className="h-4 w-4 text-yellow-500" />
              <span className="text-xs font-medium">Badge</span>
            </div>
            <p className="text-sm">
              Prochain: <span className="font-bold">Mélomane</span>
            </p>
            <Progress value={Math.min((stats.totalTracks / 50) * 100, 100)} className="h-1.5 mt-2" />
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
                {stats.totalTracks > 50
                  ? `Vous êtes un auditeur passionné avec ${stats.totalTracks} titres écoutés ! Essayez notre mode Focus pour optimiser votre concentration.`
                  : `Commencez votre parcours musical ! Explorez nos vinyles thérapeutiques pour découvrir de nouvelles sonorités.`}
              </p>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default MusicStatsSection;
