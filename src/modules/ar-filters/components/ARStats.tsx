/**
 * Statistiques utilisateur pour le module AR Filters
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Camera, Clock, Award, TrendingUp, Image, Star, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { ARFilterStats } from '../types';
import type { ARFilterAchievement, ARFilterRecommendation } from '../arFiltersService';

interface ARStatsProps {
  stats: (ARFilterStats & { 
    weeklyTrend: number[];
    achievements?: ARFilterAchievement[];
    recommendations?: ARFilterRecommendation[];
  }) | null;
  isLoading: boolean;
}

const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const mins = Math.floor(seconds / 60);
  return `${mins} min`;
};

const FILTER_NAMES: Record<string, string> = {
  joy: 'Joie',
  calm: 'Calme',
  energy: 'Énergie',
  serenity: 'Sérénité',
  creativity: 'Créativité',
  confidence: 'Confiance',
  playful: 'Ludique',
  focused: 'Focus',
  none: 'Aucun',
};

export const ARStats = memo<ARStatsProps>(({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Pas encore de statistiques</p>
            <p className="text-sm mt-1">Commencez une session pour voir vos stats</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const statItems = [
    {
      icon: Camera,
      label: 'Sessions',
      value: stats.totalSessions,
      color: 'text-blue-500',
    },
    {
      icon: Image,
      label: 'Photos',
      value: stats.totalPhotosTaken,
      color: 'text-green-500',
    },
    {
      icon: Clock,
      label: 'Durée moy.',
      value: formatDuration(stats.averageDuration),
      color: 'text-purple-500',
    },
    {
      icon: Star,
      label: 'Préféré',
      value: FILTER_NAMES[stats.favoriteFilter] || stats.favoriteFilter,
      color: 'text-yellow-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Vos statistiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {statItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-muted/50 rounded-lg p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 ${item.color}`} />
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">{item.value}</p>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Trend */}
      {stats.weeklyTrend && stats.weeklyTrend.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Activité cette semaine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between h-24 gap-1">
              {stats.weeklyTrend.map((count, index) => {
                const maxCount = Math.max(...stats.weeklyTrend, 1);
                const height = (count / maxCount) * 100;
                const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(height, 4)}%` }}
                      transition={{ delay: index * 0.05 }}
                      className="w-full bg-primary/80 rounded-t min-h-[4px]"
                    />
                    <span className="text-xs text-muted-foreground">{days[index]}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {stats.recommendations && stats.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Recommandations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.recommendations.map((rec, index) => (
              <motion.div
                key={rec.filterId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
              >
                <span className="text-2xl">{rec.filterEmoji}</span>
                <div className="flex-1">
                  <p className="font-medium">{rec.filterName}</p>
                  <p className="text-xs text-muted-foreground">{rec.reason}</p>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Achievements */}
      {stats.achievements && stats.achievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="w-5 h-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.achievements.map((achievement, index) => {
              const progress = Math.min((achievement.progress / achievement.target) * 100, 100);
              const isUnlocked = !!achievement.unlockedAt;
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-3 rounded-lg border ${isUnlocked ? 'bg-primary/5 border-primary/20' : 'bg-muted/50 border-border'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{achievement.icon}</span>
                      <span className="font-medium text-sm">{achievement.name}</span>
                    </div>
                    {isUnlocked && (
                      <Badge variant="default" className="text-xs">Débloqué</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                  <div className="flex items-center gap-2">
                    <Progress value={progress} className="flex-1 h-2" />
                    <span className="text-xs text-muted-foreground min-w-[50px] text-right">
                      {achievement.progress}/{achievement.target}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
});

ARStats.displayName = 'ARStats';

export default ARStats;
