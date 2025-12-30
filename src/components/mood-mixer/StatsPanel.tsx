import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  Clock, 
  TrendingUp, 
  Award,
  Target,
  Flame,
  Calendar,
  Music
} from 'lucide-react';

export interface MoodMixerUserStats {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  averageMoodImprovement: number;
  favoriteCategory: string;
  thisWeekSessions: number;
  weeklyGoal: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  achievements: { id: string; name: string; icon: string; unlockedAt: Date }[];
  weeklyData: { day: string; sessions: number; minutes: number; improvement: number }[];
}

interface StatsPanelProps {
  stats: MoodMixerUserStats;
  isLoading?: boolean;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ stats, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Statistiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-muted/50 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const weekProgress = (stats.thisWeekSessions / stats.weeklyGoal) * 100;
  const levelProgress = (stats.xp / stats.xpToNextLevel) * 100;

  return (
    <div className="space-y-4">
      {/* Niveau et XP */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">Niveau {stats.level}</div>
                <div className="text-sm text-muted-foreground">
                  {stats.xp} / {stats.xpToNextLevel} XP
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              🎵 DJ Émotionnel
            </Badge>
          </div>
          <Progress value={levelProgress} className="h-2" />
        </CardContent>
      </Card>

      {/* Métriques principales */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Music className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.totalSessions}</div>
                  <div className="text-xs text-muted-foreground">Sessions totales</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
        >
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{Math.round(stats.totalMinutes / 60)}h</div>
                  <div className="text-xs text-muted-foreground">Temps d'écoute</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Flame className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.currentStreak}</div>
                  <div className="text-xs text-muted-foreground">Jours consécutifs</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
        >
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">+{stats.averageMoodImprovement}%</div>
                  <div className="text-xs text-muted-foreground">Amélioration moy.</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Objectif hebdomadaire */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4" />
            Objectif de la semaine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              {stats.thisWeekSessions} / {stats.weeklyGoal} sessions
            </span>
            <span className="text-sm font-medium">
              {Math.round(weekProgress)}%
            </span>
          </div>
          <Progress value={weekProgress} className="h-2" />
        </CardContent>
      </Card>

      {/* Activité hebdomadaire */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Activité cette semaine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-1 h-20">
            {stats.weeklyData.map((day, index) => {
              const height = day.sessions > 0 
                ? Math.max(20, (day.sessions / Math.max(...stats.weeklyData.map(d => d.sessions))) * 100)
                : 8;
              return (
                <motion.div
                  key={day.day}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div 
                    className={`w-full rounded-t transition-colors ${
                      day.sessions > 0 
                        ? 'bg-primary' 
                        : 'bg-muted'
                    }`}
                    style={{ height: '100%' }}
                  />
                  <span className="text-xs text-muted-foreground">{day.day}</span>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievements récents */}
      {stats.achievements.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-4 w-4" />
              Badges récents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.achievements.slice(0, 4).map((achievement) => (
                <motion.div
                  key={achievement.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50"
                >
                  <span className="text-lg">{achievement.icon}</span>
                  <span className="text-sm">{achievement.name}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StatsPanel;
