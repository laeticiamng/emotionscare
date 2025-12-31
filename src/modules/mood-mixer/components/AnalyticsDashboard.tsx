// @ts-nocheck
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, TrendingUp, Clock, Flame, Award, 
  BarChart3, Star, Target, Zap
} from 'lucide-react';
import type { MoodAnalytics } from '../hooks/useMoodAnalytics';

interface AnalyticsDashboardProps {
  analytics: MoodAnalytics;
  isLoading?: boolean;
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  analytics,
  isLoading = false,
}) => {
  const unlockedAchievements = useMemo(
    () => analytics.achievements.filter(a => a.unlockedAt),
    [analytics.achievements]
  );

  const inProgressAchievements = useMemo(
    () => analytics.achievements.filter(a => !a.unlockedAt && a.progress > 0),
    [analytics.achievements]
  );

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-8 bg-muted rounded w-1/2 mb-2" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{analytics.totalSessions}</p>
                  <p className="text-xs text-muted-foreground">Sessions totales</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Flame className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{analytics.streakDays}</p>
                  <p className="text-xs text-muted-foreground">Jours de streak</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatDuration(analytics.totalDuration)}</p>
                  <p className="text-xs text-muted-foreground">Temps total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">
                    {analytics.weeklyGrowth >= 0 ? '+' : ''}{analytics.weeklyGrowth}%
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">vs semaine dernière</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Achievements
            <Badge variant="outline" className="ml-auto">
              {unlockedAchievements.length}/{analytics.achievements.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {analytics.achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`p-3 rounded-lg border ${
                  achievement.unlockedAt 
                    ? 'bg-yellow-500/10 border-yellow-500/30' 
                    : 'bg-muted/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${
                    achievement.unlockedAt 
                      ? 'bg-yellow-500/20' 
                      : 'bg-muted'
                  }`}>
                    {achievement.unlockedAt ? (
                      <Award className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <Target className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${
                      achievement.unlockedAt ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {achievement.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {achievement.description}
                    </p>
                    {!achievement.unlockedAt && (
                      <div className="mt-2">
                        <Progress 
                          value={(achievement.progress / achievement.target) * 100} 
                          className="h-1.5"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {achievement.progress}/{achievement.target}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mood Evolution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Évolution de l'humeur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {analytics.moodEvolution.map((dim, index) => (
              <div key={dim.dimension} className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium capitalize">{dim.dimension}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{dim.startValue}%</span>
                    <span>→</span>
                    <span className={dim.trend === 'up' ? 'text-green-500' : dim.trend === 'down' ? 'text-red-500' : ''}>
                      {dim.currentValue}%
                    </span>
                  </div>
                </div>
                <Badge variant={dim.trend === 'up' ? 'default' : dim.trend === 'down' ? 'destructive' : 'secondary'}>
                  {dim.trend === 'up' ? '↑' : dim.trend === 'down' ? '↓' : '→'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Favorite presets & Peak hours */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5" />
              Presets favoris
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.favoritePresets.length > 0 ? (
              <div className="space-y-2">
                {analytics.favoritePresets.map((preset, index) => (
                  <div key={preset.name} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <span className="text-sm">{preset.name}</span>
                    <Badge variant="outline">{preset.count}x</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Utilisez des presets pour voir vos favoris
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Heures de pointe
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.peakHours.length > 0 ? (
              <div className="space-y-2">
                {analytics.peakHours.map((hour) => (
                  <div key={hour.hour} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <span className="text-sm">{hour.hour}h00</span>
                    <Badge variant="outline">{hour.count} sessions</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Pas encore assez de données
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
