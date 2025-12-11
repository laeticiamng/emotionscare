import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  Award, 
  Flame,
  Share2,
  ChevronRight,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface MeditationStat {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  progress?: number;
  color?: string;
}

const MeditationStats: React.FC = () => {
  const { toast } = useToast();
  const [selectedWeek, setSelectedWeek] = useState(3); // Current week

  // Mock data - En production, ces données viendraient d'une API
  const stats: MeditationStat[] = [
    {
      label: 'Sessions cette semaine',
      value: 5,
      icon: <Calendar className="h-5 w-5" />,
      trend: '+2 vs semaine dernière',
      trendDirection: 'up',
      color: 'text-blue-500',
    },
    {
      label: 'Temps total médité',
      value: '2h 45min',
      icon: <Clock className="h-5 w-5" />,
      trend: '+35min cette semaine',
      trendDirection: 'up',
      color: 'text-emerald-500',
    },
    {
      label: 'Série actuelle',
      value: 7,
      icon: <Flame className="h-5 w-5" />,
      trend: 'jours consécutifs',
      trendDirection: 'neutral',
      color: 'text-orange-500',
    },
    {
      label: 'Objectif hebdomadaire',
      value: '71%',
      icon: <Target className="h-5 w-5" />,
      progress: 71,
      color: 'text-purple-500',
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
      date: 'Il y a 3 jours',
      rarity: 'rare'
    },
    {
      id: '2',
      title: 'Respirateur zen',
      description: '50 exercices de respiration complétés',
      icon: '🧘',
      date: 'Il y a 1 semaine',
      rarity: 'epic'
    },
    {
      id: '3',
      title: 'Explorateur sonore',
      description: 'Tous les types d\'ambiances testés',
      icon: '🎵',
      date: 'Il y a 2 semaines',
      rarity: 'common'
    }
  ];

  const monthlyData = [
    { week: 'Sem. 1', sessions: 3, minutes: 45 },
    { week: 'Sem. 2', sessions: 5, minutes: 75 },
    { week: 'Sem. 3', sessions: 6, minutes: 90 },
    { week: 'Sem. 4', sessions: 5, minutes: 85 }
  ];

  // Calculate totals
  const totals = useMemo(() => ({
    sessions: monthlyData.reduce((acc, w) => acc + w.sessions, 0),
    minutes: monthlyData.reduce((acc, w) => acc + w.minutes, 0),
  }), []);

  // Get max for chart scaling
  const maxMinutes = Math.max(...monthlyData.map(w => w.minutes));

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-gradient-to-r from-amber-400 to-orange-500 text-white';
      case 'epic': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'rare': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      default: return 'bg-muted';
    }
  };

  const shareStats = () => {
    const text = `🧘 Mes stats de méditation cette semaine:\n• ${stats[0].value} sessions\n• ${stats[1].value} de méditation\n• ${stats[2].value} jours de série\n#Méditation #Mindfulness`;
    
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      toast({
        title: 'Copié !',
        description: 'Vos stats ont été copiées',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Main stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  {stat.trend && (
                    <div className={cn(
                      'flex items-center gap-1 text-xs',
                      stat.trendDirection === 'up' && 'text-green-500',
                      stat.trendDirection === 'down' && 'text-red-500',
                      stat.trendDirection === 'neutral' && 'text-muted-foreground'
                    )}>
                      {stat.trendDirection === 'up' && <TrendingUp className="h-3 w-3" />}
                      {stat.trend}
                    </div>
                  )}
                  {stat.progress !== undefined && (
                    <Progress value={stat.progress} className="mt-2 h-2" />
                  )}
                </div>
                <div className={cn('p-2 rounded-full bg-muted', stat.color)}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly goal */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                Objectif Hebdomadaire
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={shareStats}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Progression</span>
                <Badge variant="secondary">{weeklyGoal.completed}/{weeklyGoal.target} sessions</Badge>
              </div>
              
              {/* Visual progress */}
              <div className="flex gap-2">
                {Array.from({ length: weeklyGoal.target }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex-1 h-3 rounded-full transition-all',
                      i < weeklyGoal.completed 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                        : 'bg-muted'
                    )}
                  />
                ))}
              </div>
              
              <Progress value={weeklyGoal.percentage} className="h-3" />
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {weeklyGoal.target - weeklyGoal.completed} sessions restantes
                </span>
                <span className="font-medium text-purple-500">
                  {weeklyGoal.percentage}%
                </span>
              </div>

              {weeklyGoal.percentage >= 100 && (
                <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-700 dark:text-green-400">
                    Objectif atteint ! Bravo ! 🎉
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              Réalisations Récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAchievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
                >
                  <div className={cn(
                    'text-2xl p-2 rounded-lg',
                    getRarityColor(achievement.rarity)
                  )}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{achievement.title}</p>
                      <Badge variant="outline" className="text-xs capitalize">
                        {achievement.rarity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{achievement.date}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly evolution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-500" />
            Évolution ce Mois
          </CardTitle>
          <CardDescription>
            Visualisez votre progression semaine par semaine
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Visual chart */}
            <div className="flex items-end justify-around gap-4 h-32 px-4">
              {monthlyData.map((week, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedWeek(index)}
                  className={cn(
                    'flex-1 flex flex-col items-center gap-2 transition-all',
                    selectedWeek === index && 'scale-105'
                  )}
                >
                  <div 
                    className={cn(
                      'w-full rounded-t-lg transition-all',
                      selectedWeek === index 
                        ? 'bg-gradient-to-t from-primary to-primary/60' 
                        : 'bg-muted hover:bg-muted-foreground/20'
                    )}
                    style={{ height: `${(week.minutes / maxMinutes) * 100}%`, minHeight: '20px' }}
                  />
                  <span className={cn(
                    'text-xs',
                    selectedWeek === index ? 'font-medium' : 'text-muted-foreground'
                  )}>
                    {week.week}
                  </span>
                </button>
              ))}
            </div>

            {/* Selected week details */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {monthlyData[selectedWeek].sessions}
                </div>
                <div className="text-xs text-muted-foreground">sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {monthlyData[selectedWeek].minutes}
                </div>
                <div className="text-xs text-muted-foreground">minutes</div>
              </div>
            </div>
            
            {/* Monthly totals */}
            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Total ce mois</p>
                  <p className="text-xl font-bold">{totals.sessions} sessions</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Temps total</p>
                  <p className="text-xl font-bold">
                    {Math.floor(totals.minutes / 60)}h {totals.minutes % 60}min
                  </p>
                </div>
              </div>
            </div>

            {/* Comparison with previous month */}
            <div className="flex items-center justify-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">+23%</span>
              <span className="text-muted-foreground">par rapport au mois dernier</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeditationStats;
