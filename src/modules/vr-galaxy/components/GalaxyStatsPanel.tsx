import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Clock, Zap, Star, TrendingUp, Heart, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface GalaxyStatsData {
  totalSessions: number;
  totalMinutes: number;
  averageSessionDuration: number;
  currentStreak: number;
  longestStreak: number;
  constellationsUnlocked: number;
  totalConstellations: number;
  weeklyProgress: number[];
  favoriteGalaxy: string;
  averageCoherence: number;
  hrvImprovement: number;
}

interface GalaxyStatsPanelProps {
  stats: GalaxyStatsData;
  className?: string;
}

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  color?: string;
  delay?: number;
}> = ({ icon, label, value, subValue, color = 'text-primary', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-muted/50 rounded-lg p-4 space-y-2"
  >
    <div className={cn('flex items-center gap-2', color)}>
      {icon}
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-bold text-foreground">{value}</span>
      {subValue && <span className="text-xs text-muted-foreground">{subValue}</span>}
    </div>
  </motion.div>
);

export const GalaxyStatsPanel: React.FC<GalaxyStatsPanelProps> = ({ stats, className }) => {
  const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  
  const progressPercentage = useMemo(() => 
    Math.round((stats.constellationsUnlocked / stats.totalConstellations) * 100),
    [stats.constellationsUnlocked, stats.totalConstellations]
  );

  return (
    <Card className={cn('bg-card/80 backdrop-blur-sm border-border/50', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Statistiques cosmiques
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Grille de stats principales */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<Clock className="h-4 w-4" />}
            label="Sessions totales"
            value={stats.totalSessions}
            delay={0}
          />
          <StatCard
            icon={<Zap className="h-4 w-4" />}
            label="Minutes explorées"
            value={stats.totalMinutes}
            subValue="min"
            delay={0.1}
          />
          <StatCard
            icon={<Star className="h-4 w-4" />}
            label="Série actuelle"
            value={stats.currentStreak}
            subValue="jours"
            color="text-amber-500"
            delay={0.2}
          />
          <StatCard
            icon={<TrendingUp className="h-4 w-4" />}
            label="Record série"
            value={stats.longestStreak}
            subValue="jours"
            delay={0.3}
          />
        </div>

        {/* Progression des constellations */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Constellations débloquées</span>
            <span className="text-sm text-muted-foreground">
              {stats.constellationsUnlocked}/{stats.totalConstellations}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{progressPercentage}% complété</span>
            <span>{stats.totalConstellations - stats.constellationsUnlocked} restantes</span>
          </div>
        </div>

        {/* Activité hebdomadaire */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Calendar className="h-4 w-4" />
            Activité cette semaine
          </div>
          <div className="flex gap-2 justify-between">
            {stats.weeklyProgress.map((minutes, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-1">
                <div 
                  className="w-full bg-muted rounded-t-sm transition-all"
                  style={{ 
                    height: `${Math.max(4, (minutes / Math.max(...stats.weeklyProgress, 1)) * 40)}px`,
                    backgroundColor: minutes > 0 ? 'hsl(var(--primary))' : 'hsl(var(--muted))'
                  }}
                />
                <span className="text-[10px] text-muted-foreground">{weekDays[index]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Métriques de bien-être */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <Heart className="h-4 w-4" />
              <span className="text-xs font-medium">Cohérence moyenne</span>
            </div>
            <span className="text-lg font-bold text-foreground">{stats.averageCoherence}%</span>
          </div>
          <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium">Amélioration HRV</span>
            </div>
            <span className="text-lg font-bold text-foreground">+{stats.hrvImprovement}%</span>
          </div>
        </div>

        {/* Galaxie favorite */}
        {stats.favoriteGalaxy && (
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <span className="text-xs text-muted-foreground">Galaxie favorite</span>
            <p className="text-sm font-medium text-foreground mt-1">{stats.favoriteGalaxy}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
