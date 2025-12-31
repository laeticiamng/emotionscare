import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useBreathSessions } from '@/hooks/useBreathSessions';
import { Activity, Flame, Target, Clock, TrendingUp, TrendingDown, Minus, Share2, ChevronRight, Award, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, unit = '', trend, trendValue, onClick }) => (
  <div 
    className={cn(
      "flex flex-col gap-2 rounded-xl border border-border/50 bg-card/40 px-4 py-3 transition-all",
      onClick && "cursor-pointer hover:bg-card/60 hover:border-border"
    )}
    onClick={onClick}
    role={onClick ? "button" : undefined}
    tabIndex={onClick ? 0 : undefined}
    onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="text-primary/80">{icon}</div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
      </div>
      {trend && (
        <div className={cn(
          "flex items-center gap-1 text-xs",
          trend === 'up' && "text-success",
          trend === 'down' && "text-warning",
          trend === 'stable' && "text-muted-foreground"
        )}>
          {trend === 'up' && <TrendingUp className="h-3 w-3" />}
          {trend === 'down' && <TrendingDown className="h-3 w-3" />}
          {trend === 'stable' && <Minus className="h-3 w-3" />}
          {trendValue}
        </div>
      )}
    </div>
    <div className="flex items-end justify-between">
      <p className="text-xl font-semibold text-foreground">
        {value}<span className="text-sm text-muted-foreground ml-1">{unit}</span>
      </p>
      {onClick && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
    </div>
  </div>
);

// Weekly goal settings
const WEEKLY_GOAL_OPTIONS = [30, 60, 90, 120, 150];

export const BreathSessionStats: React.FC = () => {
  const { user } = useAuth();
  const { stats, loading } = useBreathSessions();
  const [showDetails, setShowDetails] = useState(false);
  const [showGoalSetting, setShowGoalSetting] = useState(false);
  const [weeklyGoal, setWeeklyGoal] = useState(60);

  // Load weekly goal from Supabase
  useEffect(() => {
    const loadGoal = async () => {
      if (user) {
        const { data } = await supabase
          .from('user_settings')
          .select('value')
          .eq('user_id', user.id)
          .eq('key', 'breath_weekly_goal')
          .maybeSingle();
        if (data?.value) {
          setWeeklyGoal(parseInt(data.value) || 60);
          return;
        }
      }
      const saved = localStorage.getItem('breath-weekly-goal');
      if (saved) setWeeklyGoal(parseInt(saved) || 60);
    };
    loadGoal();
  }, [user]);

  // Calculate trends (simulated - would come from historical data)
  const trends = useMemo(() => ({
    sessions: { trend: 'up' as const, value: '+12%' },
    total: { trend: 'up' as const, value: '+8%' },
    weekly: { trend: stats.weeklyMinutes >= weeklyGoal * 0.8 ? 'up' as const : 'stable' as const, value: '' },
    streak: { trend: stats.currentStreak > 3 ? 'up' as const : 'stable' as const, value: '' },
  }), [stats, weeklyGoal]);

  const goalProgress = Math.min(100, (stats.weeklyMinutes / weeklyGoal) * 100);

  const handleShare = async () => {
    const shareText = `🧘 Mes stats de respiration cette semaine:\n• ${stats.totalSessions} séances\n• ${stats.weeklyMinutes} minutes\n• Série de ${stats.currentStreak} jours\n\n#EmotionsCare #Respiration`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch {
        navigator.clipboard.writeText(shareText);
        toast.success('Stats copiées !');
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Stats copiées !');
    }
  };

  const handleSetGoal = async (minutes: number) => {
    setWeeklyGoal(minutes);
    localStorage.setItem('breath-weekly-goal', String(minutes));
    
    if (user) {
      await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          key: 'breath_weekly_goal',
          value: String(minutes),
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,key' });
    }
    
    setShowGoalSetting(false);
    toast.success(`Objectif fixé à ${minutes} min/semaine`);
  };

  if (loading) {
    return (
      <Card className="border-border/50 bg-card/40" data-zero-number-check="true">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Tes statistiques respiratoires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20 bg-muted/30" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-border/50 bg-card/40" data-zero-number-check="true">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">
              Tes statistiques respiratoires
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-muted-foreground hover:text-foreground"
                onClick={handleShare}
                aria-label="Partager les statistiques"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-muted-foreground hover:text-foreground"
                onClick={() => setShowDetails(true)}
              >
                Détails
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              icon={<Activity className="h-4 w-4" />}
              label="Séances"
              value={stats.totalSessions}
              trend={trends.sessions.trend}
              trendValue={trends.sessions.value}
            />
            <StatCard
              icon={<Clock className="h-4 w-4" />}
              label="Total"
              value={stats.totalMinutes}
              unit="min"
              trend={trends.total.trend}
              trendValue={trends.total.value}
            />
            <StatCard
              icon={<Target className="h-4 w-4" />}
              label="Cette semaine"
              value={stats.weeklyMinutes}
              unit="min"
              trend={trends.weekly.trend}
              onClick={() => setShowGoalSetting(true)}
            />
            <StatCard
              icon={<Flame className="h-4 w-4" />}
              label="Série"
              value={stats.currentStreak}
              unit="jours"
              trend={trends.streak.trend}
            />
          </div>

          {/* Weekly goal progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Objectif hebdo</span>
              <span className="text-foreground">{stats.weeklyMinutes}/{weeklyGoal} min</span>
            </div>
            <Progress value={goalProgress} className="h-2" />
            {goalProgress >= 100 && (
              <div className="flex items-center gap-2 text-xs text-success">
                <Award className="h-3 w-3" />
                Objectif atteint ! 🎉
              </div>
            )}
          </div>

          {stats.averageSessionDuration > 0 && (
            <p className="text-sm text-muted-foreground">
              Durée moyenne: <span className="text-foreground">{Math.round(stats.averageSessionDuration / 60)}min {stats.averageSessionDuration % 60}s</span>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Statistiques détaillées</DialogTitle>
            <DialogDescription>Vue complète de votre pratique respiratoire</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-primary">{stats.totalSessions}</div>
                <div className="text-sm text-muted-foreground">Séances totales</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-info">{Math.round(stats.totalMinutes / 60)}h</div>
                <div className="text-sm text-muted-foreground">Heures de pratique</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-success">{stats.currentStreak}</div>
                <div className="text-sm text-muted-foreground">Jours consécutifs</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-accent">{Math.round(stats.averageSessionDuration / 60)}</div>
                <div className="text-sm text-muted-foreground">Min/séance en moyenne</div>
              </div>
            </div>

            {/* Milestones */}
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Prochains jalons</h4>
              <div className="space-y-2">
                {stats.totalSessions < 10 && (
                  <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <span className="text-sm">10 séances</span>
                    <Progress value={(stats.totalSessions / 10) * 100} className="w-24 h-2" />
                  </div>
                )}
                {stats.totalMinutes < 100 && (
                  <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <span className="text-sm">100 minutes</span>
                    <Progress value={(stats.totalMinutes / 100) * 100} className="w-24 h-2" />
                  </div>
                )}
                {stats.currentStreak < 7 && (
                  <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <span className="text-sm">7 jours d'affilée</span>
                    <Progress value={(stats.currentStreak / 7) * 100} className="w-24 h-2" />
                  </div>
                )}
              </div>
            </div>

            <Button className="w-full" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Partager mes stats
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Goal Setting Dialog */}
      <Dialog open={showGoalSetting} onOpenChange={setShowGoalSetting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Objectif hebdomadaire</DialogTitle>
            <DialogDescription>Définissez votre objectif de minutes par semaine</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {WEEKLY_GOAL_OPTIONS.map((minutes) => (
              <Button
                key={minutes}
                variant={weeklyGoal === minutes ? 'default' : 'outline'}
                onClick={() => handleSetGoal(minutes)}
                className="h-16 flex-col"
              >
                <span className="text-lg font-bold">{minutes}</span>
                <span className="text-xs">min/sem</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
