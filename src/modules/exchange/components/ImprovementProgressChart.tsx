/**
 * Improvement Progress Chart - Visualize goal progress over time
 */
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Calendar, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { ImprovementGoal } from '../types';

interface ImprovementProgressChartProps {
  goals: ImprovementGoal[];
}

const goalTypeColors: Record<string, string> = {
  sleep: 'from-indigo-500 to-purple-600',
  stress: 'from-rose-500 to-red-600',
  productivity: 'from-emerald-500 to-teal-600',
  study: 'from-blue-500 to-cyan-600',
  fitness: 'from-orange-500 to-amber-600',
  meditation: 'from-violet-500 to-fuchsia-600',
};

const goalTypeLabels: Record<string, string> = {
  sleep: 'Sommeil',
  stress: 'Stress',
  productivity: 'Productivité',
  study: 'Études',
  fitness: 'Fitness',
  meditation: 'Méditation',
};

const ImprovementProgressChart: React.FC<ImprovementProgressChartProps> = ({ goals }) => {
  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');
  
  const totalProgress = activeGoals.length > 0
    ? activeGoals.reduce((acc, g) => acc + (g.current_value / g.target_value) * 100, 0) / activeGoals.length
    : 0;

  const avgScore = goals.length > 0
    ? goals.reduce((acc, g) => acc + g.improvement_score, 0) / goals.length
    : 0;

  // Calculate category breakdown
  const categoryStats = Object.entries(goalTypeLabels).map(([type, label]) => {
    const typeGoals = goals.filter(g => g.goal_type === type);
    const count = typeGoals.length;
    const avgProgress = count > 0
      ? typeGoals.reduce((acc, g) => acc + (g.current_value / g.target_value) * 100, 0) / count
      : 0;
    return { type, label, count, avgProgress, color: goalTypeColors[type] };
  }).filter(c => c.count > 0);

  if (goals.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-600" />
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          Vue d'ensemble des progrès
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-3 bg-muted/50 rounded-lg"
          >
            <Target className="w-5 h-5 mx-auto mb-1 text-primary" />
            <p className="text-2xl font-bold">{activeGoals.length}</p>
            <p className="text-xs text-muted-foreground">Actifs</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center p-3 bg-muted/50 rounded-lg"
          >
            <Calendar className="w-5 h-5 mx-auto mb-1 text-emerald-500" />
            <p className="text-2xl font-bold">{completedGoals.length}</p>
            <p className="text-xs text-muted-foreground">Terminés</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center p-3 bg-muted/50 rounded-lg"
          >
            <Zap className="w-5 h-5 mx-auto mb-1 text-amber-500" />
            <p className="text-2xl font-bold">{Math.round(avgScore)}</p>
            <p className="text-xs text-muted-foreground">Score moyen</p>
          </motion.div>
        </div>

        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progression globale</span>
            <span className="font-medium">{Math.round(totalProgress)}%</span>
          </div>
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${totalProgress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"
            />
          </div>
        </div>

        {/* Category Breakdown */}
        {categoryStats.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Par catégorie</p>
            {categoryStats.map(({ type, label, count, avgProgress, color }) => (
              <motion.div
                key={type}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
                  <span className="text-white text-xs font-bold">{count}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">{label}</span>
                    <span className="text-xs text-muted-foreground">{Math.round(avgProgress)}%</span>
                  </div>
                  <Progress value={avgProgress} className="h-1.5" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImprovementProgressChart;
