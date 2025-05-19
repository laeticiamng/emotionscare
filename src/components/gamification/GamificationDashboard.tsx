
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layers, Award, Zap, Target } from 'lucide-react';
import KpiCard from '@/components/dashboard/admin/KpiCard';

interface GamificationDashboardProps {
  data?: {
    points: number;
    level: number;
    streakDays: number;
    badgesCount: number;
    nextLevelPoints: number;
  };
  className?: string;
  isLoading?: boolean;
}

const GamificationDashboard: React.FC<GamificationDashboardProps> = ({
  data = {
    points: 1250,
    level: 5,
    streakDays: 7,
    badgesCount: 12,
    nextLevelPoints: 1500
  },
  className = '',
  isLoading = false
}) => {
  const kpiCards = [
    {
      id: 'points',
      title: "Points",
      value: data.points,
      icon: <Zap className="h-4 w-4" />,
      status: 'info' as const,
    },
    {
      id: 'level',
      title: "Niveau",
      value: `${data.level}`,
      icon: <Layers className="h-4 w-4" />,
      status: 'neutral' as const,
    },
    {
      id: 'streak',
      title: "Série",
      value: data.streakDays,
      icon: <Target className="h-4 w-4" />,
      status: 'success' as const,
      subtitle: "jours consécutifs"
    },
    {
      id: 'badges',
      title: "Badges",
      value: data.badgesCount,
      icon: <Award className="h-4 w-4" />,
      status: 'warning' as const,
    }
  ];

  return (
    <Card className={`shadow-sm ${className}`}>
      <CardHeader>
        <CardTitle>Gamification</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpiCards.map((card) => (
            <KpiCard
              key={card.id}
              id={card.id}
              title={card.title}
              value={card.value}
              icon={card.icon}
              status={card.status}
              subtitle={card.subtitle}
              isLoading={isLoading}
            />
          ))}
        </div>

        <div className="mt-6">
          <div className="w-full bg-muted h-2 rounded-full mt-2">
            <div 
              className="bg-primary h-2 rounded-full" 
              style={{ 
                width: `${Math.min(100, (data.points / data.nextLevelPoints) * 100)}%` 
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Niveau {data.level}</span>
            <span>{data.nextLevelPoints - data.points} points jusqu'au niveau {data.level + 1}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GamificationDashboard;
