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
  const [selectedWeek, setSelectedWeek] = useState(3);
  const [stats, setStats] = useState<MeditationStat[]>([]);
  const [weeklyGoal, setWeeklyGoal] = useState({ target: 7, completed: 0, percentage: 0 });
  const [recentAchievements, setRecentAchievements] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<{ week: string; sessions: number; minutes: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load meditation stats from Supabase
  React.useEffect(() => {
    const loadStats = async () => {
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setIsLoading(false);
          return;
        }

        // Get meditation sessions
        const { data: sessions } = await supabase
          .from('activity_sessions')
          .select('*')
          .eq('user_id', user.id)
          .in('module_name', ['meditation', 'breathing', 'breathing-vr'])
          .order('created_at', { ascending: false });

        if (sessions && sessions.length > 0) {
          // Calculate weekly sessions
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          const twoWeeksAgo = new Date();
          twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

          const thisWeekSessions = sessions.filter(s => new Date(s.created_at) >= weekAgo);
          const lastWeekSessions = sessions.filter(s => new Date(s.created_at) >= twoWeeksAgo && new Date(s.created_at) < weekAgo);

          const thisWeekMinutes = Math.round(thisWeekSessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60);
          const lastWeekMinutes = Math.round(lastWeekSessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60);

          // Calculate streak
          const uniqueDays = new Set(sessions.map(s => s.created_at.split('T')[0]));
          let streak = 0;
          let checkDate = new Date();
          while (uniqueDays.has(checkDate.toISOString().split('T')[0])) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
          }

          const hours = Math.floor(thisWeekMinutes / 60);
          const mins = thisWeekMinutes % 60;
          const weekDiff = thisWeekSessions.length - lastWeekSessions.length;
          const minDiff = thisWeekMinutes - lastWeekMinutes;

          setStats([
            {
              label: 'Sessions cette semaine',
              value: thisWeekSessions.length,
              icon: <Calendar className="h-5 w-5" />,
              trend: `${weekDiff >= 0 ? '+' : ''}${weekDiff} vs semaine dernière`,
              trendDirection: weekDiff >= 0 ? 'up' : 'down',
              color: 'text-blue-500',
            },
            {
              label: 'Temps total médité',
              value: `${hours}h ${mins}min`,
              icon: <Clock className="h-5 w-5" />,
              trend: `${minDiff >= 0 ? '+' : ''}${minDiff}min cette semaine`,
              trendDirection: minDiff >= 0 ? 'up' : 'down',
              color: 'text-emerald-500',
            },
            {
              label: 'Série actuelle',
              value: streak,
              icon: <Flame className="h-5 w-5" />,
              trend: 'jours consécutifs',
              trendDirection: 'neutral',
              color: 'text-orange-500',
            },
            {
              label: 'Objectif hebdomadaire',
              value: `${Math.round((thisWeekSessions.length / 7) * 100)}%`,
              icon: <Target className="h-5 w-5" />,
              progress: Math.round((thisWeekSessions.length / 7) * 100),
              color: 'text-purple-500',
            }
          ]);

          setWeeklyGoal({
            target: 7,
            completed: thisWeekSessions.length,
            percentage: Math.round((thisWeekSessions.length / 7) * 100)
          });

          // Calculate monthly data
          const monthData: { week: string; sessions: number; minutes: number }[] = [];
          for (let i = 3; i >= 0; i--) {
            const weekStart = new Date();
            weekStart.setDate(weekStart.getDate() - (i * 7) - 7);
            const weekEnd = new Date();
            weekEnd.setDate(weekEnd.getDate() - (i * 7));

            const weekSessions = sessions.filter(s => {
              const d = new Date(s.created_at);
              return d >= weekStart && d < weekEnd;
            });

            monthData.push({
              week: `Sem. ${4 - i}`,
              sessions: weekSessions.length,
              minutes: Math.round(weekSessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60)
            });
          }
          setMonthlyData(monthData);
        }

        // Load achievements
        const { data: achievements } = await supabase
          .from('user_achievements')
          .select('*, achievements(*)')
          .eq('user_id', user.id)
          .order('earned_at', { ascending: false })
          .limit(3);

        if (achievements) {
          setRecentAchievements(achievements.map(a => ({
            id: a.id,
            title: a.achievements?.name || 'Badge',
            description: a.achievements?.description || '',
            icon: a.achievements?.icon || '🏆',
            date: formatRelativeDate(a.earned_at),
            rarity: a.achievements?.tier || 'common'
          })));
        }

      } catch (error) {
        console.error('Error loading meditation stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  const formatRelativeDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 14) return 'Il y a 1 semaine';
    return `Il y a ${Math.floor(diffDays / 7)} semaines`;
  };

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
