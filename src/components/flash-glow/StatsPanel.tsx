/**
 * StatsPanel - Panneau de statistiques Flash Glow
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Flame, Clock, TrendingUp, Zap } from 'lucide-react';
import type { FlashGlowStats } from './types';

interface StatsPanelProps {
  stats: FlashGlowStats | null;
  isLoading?: boolean;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-warning" aria-hidden="true" />
            Statistiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const level = Math.floor((stats?.totalPoints || 0) / 500) + 1;
  const levelProgress = ((stats?.totalPoints || 0) % 500) / 500 * 100;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="h-5 w-5 text-warning" aria-hidden="true" />
          Vos statistiques
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Niveau et progression */}
        <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Niveau {level}</span>
            <span className="text-xs text-muted-foreground">
              {stats?.totalPoints || 0} pts
            </span>
          </div>
          <Progress value={levelProgress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {500 - ((stats?.totalPoints || 0) % 500)} pts jusqu'au niveau suivant
          </p>
        </div>

        {/* Stats en grille */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xl font-bold">{stats?.total_sessions || 0}</div>
              <div className="text-xs text-muted-foreground">Sessions</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <Flame className="h-5 w-5 text-destructive" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xl font-bold">{stats?.streak || 0}</div>
              <div className="text-xs text-muted-foreground">Streak (jours)</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-secondary" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xl font-bold">{stats?.avg_duration || 0}s</div>
              <div className="text-xs text-muted-foreground">Durée moy.</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-warning" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xl font-bold">{stats?.bestSession?.score || 0}</div>
              <div className="text-xs text-muted-foreground">Meilleur score</div>
            </div>
          </div>
        </div>

        {/* Tendance hebdo */}
        {stats?.weeklyTrend && stats.weeklyTrend.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Activité cette semaine</p>
            <div className="flex items-end gap-1 h-12">
              {stats.weeklyTrend.map((count, i) => (
                <div
                  key={i}
                  className="flex-1 bg-primary/20 rounded-t transition-all hover:bg-primary/40"
                  style={{ 
                    height: `${Math.max(8, (count / Math.max(...stats.weeklyTrend, 1)) * 100)}%`,
                    opacity: count > 0 ? 1 : 0.3
                  }}
                  title={`${count} session(s)`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Lun</span>
              <span>Dim</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsPanel;
