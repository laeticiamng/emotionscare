// @ts-nocheck
/**
 * TeamEngagementWidget - Widget d'engagement équipe
 * Affiche les métriques d'engagement et d'activité
 */
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity, Users, Zap, Clock } from 'lucide-react';
import { useB2BTeamStats } from '@/hooks/useB2BTeamStats';

export const TeamEngagementWidget: React.FC = () => {
  const { stats, loading } = useB2BTeamStats();

  const engagementMetrics = [
    {
      id: 'active',
      label: 'Membres actifs',
      value: stats.activeThisWeek,
      total: stats.totalMembers,
      icon: Users,
      color: 'text-primary',
    },
    {
      id: 'engagement',
      label: 'Taux d\'engagement',
      value: stats.avgEngagement,
      total: 100,
      suffix: '%',
      icon: Zap,
      color: 'text-warning',
    },
    {
      id: 'wellbeing',
      label: 'Score bien-être',
      value: stats.avgWellbeing,
      total: 100,
      suffix: '/100',
      icon: Activity,
      color: 'text-success',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" aria-hidden="true" />
          Engagement équipe
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <div className="space-y-6">
            {engagementMetrics.map((metric) => {
              const Icon = metric.icon;
              const percentage = (metric.value / metric.total) * 100;
              
              return (
                <div key={metric.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${metric.color}`} aria-hidden="true" />
                      <span className="text-sm font-medium">{metric.label}</span>
                    </div>
                    <span className="text-lg font-bold">
                      {metric.value}
                      {metric.suffix ? metric.suffix : `/${metric.total}`}
                    </span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className="h-2"
                    aria-label={`${metric.label}: ${metric.value} sur ${metric.total}`}
                  />
                </div>
              );
            })}

            {/* Activités populaires */}
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" aria-hidden="true" />
                Top activités
              </h4>
              <div className="space-y-2">
                {stats.topActivities.slice(0, 3).map((activity, index) => (
                  <div key={activity.name} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="text-muted-foreground">{index + 1}.</span>
                      {activity.name}
                    </span>
                    <span className="text-muted-foreground">{activity.count} sessions</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamEngagementWidget;
