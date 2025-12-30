/**
 * Composant de statistiques d'activités
 */

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Flame, 
  Clock, 
  TrendingUp, 
  Target,
  Trophy,
  Calendar
} from 'lucide-react';
import { ActivitySessionService, ActivityStreak } from '../services/activitySessionService';
import { useAuth } from '@/contexts/AuthContext';

interface DetailedStats {
  totalSessions: number;
  totalMinutes: number;
  averageMoodImprovement: number;
  favoriteCategory: string;
  completionRate: number;
  byCategory: Record<string, number>;
  byDay: Record<string, number>;
}

export function ActivityStats() {
  const { user } = useAuth();
  const [streak, setStreak] = useState<ActivityStreak | null>(null);
  const [stats, setStats] = useState<DetailedStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        const [streakData, statsData] = await Promise.all([
          ActivitySessionService.getStreak(user.id),
          ActivitySessionService.getDetailedStats(user.id)
        ]);
        setStreak(streakData);
        setStats(statsData);
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const categoryLabels: Record<string, string> = {
    relaxation: 'Relaxation',
    physical: 'Physique',
    creative: 'Créative',
    social: 'Sociale',
    mindfulness: 'Pleine conscience',
    nature: 'Nature'
  };

  const categoryColors: Record<string, string> = {
    relaxation: 'bg-blue-500',
    physical: 'bg-green-500',
    creative: 'bg-purple-500',
    social: 'bg-pink-500',
    mindfulness: 'bg-indigo-500',
    nature: 'bg-emerald-500'
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const weeklyProgress = streak?.weekly_progress || 0;
  const weeklyGoal = streak?.weekly_goal || 5;
  const weeklyPercent = Math.min((weeklyProgress / weeklyGoal) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-bl-full" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              Série actuelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{streak?.current_streak || 0}</div>
            <p className="text-xs text-muted-foreground">
              Record : {streak?.longest_streak || 0} jours
            </p>
          </CardContent>
        </Card>

        {/* Total Activities */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-bl-full" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              Activités complétées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.totalSessions || 0}</div>
            <p className="text-xs text-muted-foreground">
              Taux de complétion : {stats?.completionRate || 0}%
            </p>
          </CardContent>
        </Card>

        {/* Total Time */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-bl-full" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-500" />
              Temps total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.totalMinutes || 0}</div>
            <p className="text-xs text-muted-foreground">minutes de bien-être</p>
          </CardContent>
        </Card>

        {/* Mood Improvement */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-bl-full" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Amélioration humeur
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {(stats?.averageMoodImprovement ?? 0) >= 0 ? '+' : ''}
              {stats?.averageMoodImprovement ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">points en moyenne</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Goal & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Goal */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Objectif hebdomadaire
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-4xl font-bold">{weeklyProgress}</span>
                <span className="text-xl text-muted-foreground">/{weeklyGoal}</span>
              </div>
              {weeklyProgress >= weeklyGoal && (
                <Trophy className="h-8 w-8 text-yellow-500" />
              )}
            </div>
            <Progress value={weeklyPercent} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {weeklyProgress >= weeklyGoal 
                ? 'Objectif atteint ! Bravo !' 
                : `Plus que ${weeklyGoal - weeklyProgress} activité(s) pour atteindre votre objectif`}
            </p>
          </CardContent>
        </Card>

        {/* Categories Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Répartition par catégorie
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.byCategory && Object.keys(stats.byCategory).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(stats.byCategory)
                  .sort((a, b) => b[1] - a[1])
                  .map(([category, count]) => {
                    const total = Object.values(stats.byCategory).reduce((a, b) => a + b, 0);
                    const percent = (count / total) * 100;
                    return (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{categoryLabels[category] || category}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${categoryColors[category] || 'bg-primary'} transition-all`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Aucune activité complétée pour l'instant
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
