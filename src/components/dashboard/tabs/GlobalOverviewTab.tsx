// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Brain, Activity, TrendingUp } from 'lucide-react';
import { UserRole } from '@/types/user';
import { logger } from '@/lib/logger';

interface GlobalOverviewTabProps {
  className?: string;
  userRole?: UserRole;
}

const SLEEP_REMINDER_STORAGE_KEY = 'breath:isi:status';

const GlobalOverviewTab: React.FC<GlobalOverviewTabProps> = ({ className, userRole }) => {
  const stats = [
    {
      title: 'Bien-être général',
      value: '85%',
      icon: Heart,
      trend: '+5%',
      color: 'text-success'
    },
    {
      title: 'Niveau de stress',
      value: 'Faible',
      icon: Brain,
      trend: '-12%',
      color: 'text-primary'
    },
    {
      title: 'Activité quotidienne',
      value: '7/10',
      icon: Activity,
      trend: '+2%',
      color: 'text-accent'
    },
    {
      title: 'Progression',
      value: '92%',
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
                <span>Analyses émotionnelles</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Sessions VR</span>
                <span className="font-medium">5</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Écoute musicale</span>
                <span className="font-medium">8h 30min</span>
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
              <div className="p-3 bg-primary/10 rounded-lg">
                <p className="text-sm">Prenez une pause VR de 10 minutes pour réduire le stress</p>
              </div>
              <div className="p-3 bg-success/10 rounded-lg">
                <p className="text-sm">Votre bien-être s'améliore ! Continuez vos bonnes habitudes</p>
              </div>
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
