// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Brain, Activity, TrendingUp } from 'lucide-react';
import { UserRole } from '@/types/user';
import { logger } from '@/lib/logger';
import { useDashboard } from '@/hooks/useDashboard';
import { useDashboardWeekly } from '@/hooks/useDashboardWeekly';
import { useAuth } from '@/contexts/AuthContext';

interface GlobalOverviewTabProps {
  className?: string;
  userRole?: UserRole;
}

const SLEEP_REMINDER_STORAGE_KEY = 'breath:isi:status';

const GlobalOverviewTab: React.FC<GlobalOverviewTabProps> = ({ className, userRole }) => {
  const { user } = useAuth();
  const { stats: dashboardStats, weeklySummary } = useDashboard(user?.id || '');
  const { data: weeklyData } = useDashboardWeekly();

  // Calculate stats from real API data
  const wellnessScore = dashboardStats?.wellnessScore || 0;
  const stressLevel = wellnessScore > 70 ? 'Faible' : wellnessScore > 40 ? 'Modéré' : 'Élevé';
  const dailyActivity = weeklyData?.today?.glow_score
    ? `${Math.round(weeklyData.today.glow_score / 10)}/10`
    : '0/10';
  const progression = wellnessScore;

  const stats = [
    {
      title: 'Bien-être général',
      value: `${wellnessScore}%`,
      icon: Heart,
      trend: '+5%',
      color: 'text-success'
    },
    {
      title: 'Niveau de stress',
      value: stressLevel,
      icon: Brain,
      trend: wellnessScore > 60 ? '-12%' : '+3%',
      color: 'text-primary'
    },
    {
      title: 'Activité quotidienne',
      value: dailyActivity,
      icon: Activity,
      trend: '+2%',
      color: 'text-accent'
    },
    {
      title: 'Progression',
      value: `${progression}%`,
      icon: TrendingUp,
      trend: '+8%',
      color: 'text-warning'
    }
  ];

  const [showSoothingReminder, setShowSoothingReminder] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(SLEEP_REMINDER_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { level?: string; updatedAt?: string } | null;
      if (!parsed || parsed.level !== 'high') return;
      const updatedAt = parsed.updatedAt ? new Date(parsed.updatedAt) : null;
      if (updatedAt && Number.isNaN(updatedAt.getTime())) {
        setShowSoothingReminder(true);
        return;
      }
      const now = Date.now();
      if (!updatedAt || now - updatedAt.getTime() <= 7 * 24 * 60 * 60 * 1000) {
        setShowSoothingReminder(true);
      }
    } catch (error) {
      logger.warn('Soothing reminder flag parse failed', error, 'UI');
    }
  }, []);

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">{stat.trend}</span> par rapport à la semaine dernière
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Aperçu de la semaine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Sessions totales</span>
                <span className="font-medium">{weeklySummary?.totalSessions || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Temps total</span>
                <span className="font-medium">
                  {weeklySummary?.totalMinutes
                    ? `${Math.floor(weeklySummary.totalMinutes / 60)}h ${weeklySummary.totalMinutes % 60}min`
                    : '0min'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Modules favoris</span>
                <span className="font-medium">
                  {weeklySummary?.topModules?.[0] || 'Aucun'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommandations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {wellnessScore >= 70 && (
                <div className="p-3 bg-success/10 rounded-lg">
                  <p className="text-sm">Excellent ! Votre bien-être est optimal. Continuez vos bonnes habitudes !</p>
                </div>
              )}
              {wellnessScore < 70 && wellnessScore >= 40 && (
                <div className="p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm">Prenez une pause de 10 minutes pour améliorer votre bien-être</p>
                </div>
              )}
              {wellnessScore < 40 && (
                <div className="p-3 bg-warning/10 rounded-lg">
                  <p className="text-sm">Votre niveau de stress semble élevé. Essayez une session de respiration ou de méditation.</p>
                </div>
              )}
              {showSoothingReminder && (
                <div className="rounded-lg border border-warning/20 bg-warning/10 p-3">
                  <p className="text-sm text-warning-foreground">
                    Rappel hebdo : programme une respiration apaisante 4-7-8 pour protéger ton sommeil.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GlobalOverviewTab;
