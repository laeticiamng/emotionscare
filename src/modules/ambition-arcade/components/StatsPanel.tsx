/**
 * Panneau de statistiques Ambition Arcade
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Trophy, Star, Target, Flame, CheckCircle, 
  TrendingUp, Zap, Clock 
} from 'lucide-react';
import { useAmbitionStats } from '../hooks';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, subValue, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <Card className="bg-gradient-to-br from-background to-muted/30 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            {icon}
          </div>
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
            {subValue && (
              <p className="text-xs text-primary">{subValue}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export const StatsPanel: React.FC = () => {
  const { data: stats, isLoading } = useAmbitionStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>Aucune statistique disponible</p>
      </div>
    );
  }

  const xpProgress = stats.xpToNextLevel > 0 
    ? ((stats.level * 100 - stats.xpToNextLevel) / (stats.level * 100)) * 100
    : 100;

  return (
    <div className="space-y-6">
      {/* Level & XP */}
      <Card className="bg-gradient-to-br from-primary/10 via-background to-warning/10 border-primary/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-warning flex items-center justify-center">
                <Trophy className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Niveau</p>
                <p className="text-4xl font-bold">{stats.level}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">XP Total</p>
              <p className="text-2xl font-bold text-primary">{stats.totalXP.toLocaleString()}</p>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progression</span>
              <span>{stats.xpToNextLevel > 0 ? `${stats.xpToNextLevel} XP restants` : 'Max!'}</span>
            </div>
            <Progress value={xpProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Target className="w-5 h-5 text-primary" />}
          label="Objectifs"
          value={stats.totalRuns}
          subValue={`${stats.activeRuns} actifs`}
          delay={0.1}
        />
        <StatCard
          icon={<CheckCircle className="w-5 h-5 text-success" />}
          label="Complétés"
          value={stats.completedRuns}
          subValue={`${stats.completionRate.toFixed(0)}% taux`}
          delay={0.15}
        />
        <StatCard
          icon={<Zap className="w-5 h-5 text-warning" />}
          label="Quêtes"
          value={stats.completedQuests}
          subValue={`sur ${stats.totalQuests}`}
          delay={0.2}
        />
        <StatCard
          icon={<Star className="w-5 h-5 text-info" />}
          label="Artifacts"
          value={stats.artifacts}
          delay={0.25}
        />
        <StatCard
          icon={<Flame className="w-5 h-5 text-destructive" />}
          label="Streak Actuel"
          value={stats.currentStreak}
          subValue="jours"
          delay={0.3}
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5 text-primary" />}
          label="Meilleur Streak"
          value={stats.longestStreak}
          subValue="jours"
          delay={0.35}
        />
      </div>
    </div>
  );
};

export default StatsPanel;
