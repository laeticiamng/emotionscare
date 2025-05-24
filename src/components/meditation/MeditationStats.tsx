
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, Target, TrendingUp, Award, Flame } from 'lucide-react';

interface MeditationStat {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  progress?: number;
}

const MeditationStats: React.FC = () => {
  // Mock data - En production, ces données viendraient d'une API
  const stats: MeditationStat[] = [
    {
      label: 'Sessions cette semaine',
      value: 5,
      icon: <Calendar className="h-4 w-4" />,
      trend: '+2 vs semaine dernière'
    },
    {
      label: 'Temps total médité',
      value: '2h 45min',
      icon: <Clock className="h-4 w-4" />,
      trend: '+35min cette semaine'
    },
    {
      label: 'Série actuelle',
      value: 7,
      icon: <Flame className="h-4 w-4" />,
      trend: 'jours consécutifs'
    },
    {
      label: 'Objectif hebdomadaire',
      value: '71%',
      icon: <Target className="h-4 w-4" />,
      progress: 71
    }
  ];

  const weeklyGoal = {
    target: 7,
    completed: 5,
    percentage: Math.round((5 / 7) * 100)
  };

  const recentAchievements = [
    {
      id: '1',
      title: 'Première semaine',
      description: '7 jours de méditation consécutifs',
      icon: '🏆',
      date: 'Il y a 3 jours'
    },
    {
      id: '2',
      title: 'Respirateur zen',
      description: '50 exercices de respiration complétés',
      icon: '🧘',
      date: 'Il y a 1 semaine'
    },
    {
      id: '3',
      title: 'Explorateur sonore',
      description: 'Tous les types d\'ambiances testés',
      icon: '🎵',
      date: 'Il y a 2 semaines'
    }
  ];

  const monthlyData = [
    { week: 'Sem. 1', sessions: 3, minutes: 45 },
    { week: 'Sem. 2', sessions: 5, minutes: 75 },
    { week: 'Sem. 3', sessions: 6, minutes: 90 },
    { week: 'Sem. 4', sessions: 5, minutes: 85 }
  ];

  return (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  {stat.trend && (
                    <p className="text-xs text-muted-foreground">{stat.trend}</p>
                  )}
                  {stat.progress && (
                    <Progress value={stat.progress} className="mt-2" />
                  )}
                </div>
                <div className="text-primary">{stat.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Objectif hebdomadaire */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Objectif Hebdomadaire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Progression</span>
                <Badge variant="secondary">{weeklyGoal.completed}/{weeklyGoal.target} sessions</Badge>
              </div>
              <Progress value={weeklyGoal.percentage} className="h-3" />
              <p className="text-sm text-muted-foreground">
                Plus que {weeklyGoal.target - weeklyGoal.completed} sessions pour atteindre votre objectif !
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Réalisations récentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Réalisations Récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{achievement.title}</p>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{achievement.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Évolution mensuelle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Évolution ce Mois
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              {monthlyData.map((week, index) => (
                <div key={index} className="text-center space-y-2">
                  <p className="text-sm font-medium">{week.week}</p>
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-primary">{week.sessions}</div>
                    <div className="text-xs text-muted-foreground">sessions</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">{week.minutes}min</div>
                    <div className="text-xs text-muted-foreground">médité</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Total ce mois</p>
                  <p className="text-xl font-bold">19 sessions</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Temps total</p>
                  <p className="text-xl font-bold">4h 55min</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeditationStats;
