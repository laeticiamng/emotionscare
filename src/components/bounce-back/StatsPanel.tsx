/**
 * StatsPanel - Panneau de statistiques de résilience
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Target, 
  Clock, 
  TrendingUp, 
  Award,
  Brain,
  Heart,
  Users,
  Smile,
  Lightbulb
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface StatsData {
  total_battles: number;
  completed_battles: number;
  completion_rate: number | string;
  total_duration_seconds: number;
  average_duration_seconds: number;
  coping_averages?: Record<string, number>;
  coping_strategies_avg?: Record<string, number>; // Alternative key from service
}

interface StatsPanelProps {
  stats: StatsData | null;
  isLoading?: boolean;
}

import type { LucideIcon } from 'lucide-react';

const COPING_LABELS: Record<string, { label: string; icon: LucideIcon }> = {
  distraction: { label: 'Distraction', icon: Brain },
  reframing: { label: 'Recadrage', icon: Lightbulb },
  support: { label: 'Support social', icon: Users },
  relaxation: { label: 'Relaxation', icon: Heart },
  problem_solving: { label: 'Résolution', icon: Smile }
};

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes} min`;
};

export const StatsPanel: React.FC<StatsPanelProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
            <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Aucune bataille effectuée</p>
          <p className="text-sm">Commencez votre première bataille pour voir vos statistiques</p>
        </CardContent>
      </Card>
    );
  }

  // Handle both key names from different sources
  const copingData = stats.coping_averages || stats.coping_strategies_avg;
  const copingEntries = copingData 
    ? Object.entries(copingData)
    : [];
  
  const completionRate = typeof stats.completion_rate === 'string' 
    ? parseFloat(stats.completion_rate) 
    : stats.completion_rate;

  return (
    <div className="space-y-6">
      {/* Stats principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="pt-6 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">
                {stats.total_battles}
              </div>
              <div className="text-sm text-muted-foreground">
                Batailles totales
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
            <CardContent className="pt-6 text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-success" />
              <div className="text-2xl font-bold text-foreground">
                {stats.completed_battles}
              </div>
              <div className="text-sm text-muted-foreground">
                Complétées
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
            <CardContent className="pt-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-info" />
              <div className="text-2xl font-bold text-foreground">
                {completionRate.toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">
                Taux de complétion
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="pt-6 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-warning" />
              <div className="text-2xl font-bold text-foreground">
                {formatDuration(stats.total_duration_seconds)}
              </div>
              <div className="text-sm text-muted-foreground">
                Temps total
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Stratégies de coping */}
      {copingEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Stratégies de coping
            </CardTitle>
            <CardDescription>
              Vos scores moyens pour chaque stratégie de résilience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {copingEntries.map(([key, value], index) => {
              const config = COPING_LABELS[key] || { label: key, icon: Shield };
              const IconComponent = config.icon;
              const percentage = (value / 4) * 100;

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">
                        {config.label}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {value.toFixed(1)} / 4
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </motion.div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Durée moyenne */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-medium text-foreground">Durée moyenne</div>
                <div className="text-sm text-muted-foreground">Par bataille complétée</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {formatDuration(stats.average_duration_seconds)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
