import React, { useState, useEffect } from 'react';
import { Flame, Trophy, Calendar, Star, Bell, TrendingUp, Gift } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { pushNotificationService } from '@/lib/notifications/pushNotifications';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  lastActivityDate: string | null;
  streakAtRisk: boolean;
  nextMilestone: number;
  milestoneProgress: number;
}

interface StreakMilestone {
  days: number;
  reward: string;
  icon: string;
  achieved: boolean;
}

const MILESTONES: Omit<StreakMilestone, 'achieved'>[] = [
  { days: 3, reward: 'Badge Débutant', icon: '🌱' },
  { days: 7, reward: 'Badge Régulier', icon: '🔥' },
  { days: 14, reward: 'Badge Déterminé', icon: '💪' },
  { days: 30, reward: 'Badge Expert', icon: '⭐' },
  { days: 60, reward: 'Badge Maître', icon: '🏆' },
  { days: 100, reward: 'Badge Légende', icon: '👑' },
];

export default function StreakTracker() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    totalDays: 0,
    lastActivityDate: null,
    streakAtRisk: false,
    nextMilestone: 3,
    milestoneProgress: 0,
  });
  const [milestones, setMilestones] = useState<StreakMilestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadStreakData();
      checkStreakNotifications();
    }
  }, [user]);

  const loadStreakData = async () => {
    setLoading(true);
    try {
      // Load activity data for streak calculation
      const { data: activities } = await supabase
        .from('assessments')
        .select('ts')
        .eq('user_id', user?.id)
        .order('ts', { ascending: false });

      if (activities && activities.length > 0) {
        const streak = calculateStreak(activities.map(a => a.ts));
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const lastActivity = new Date(activities[0].ts);
        lastActivity.setHours(0, 0, 0, 0);
        
        const diffDays = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
        const streakAtRisk = diffDays === 1;

        // Find next milestone
        const nextMilestone = MILESTONES.find(m => m.days > streak.current)?.days || 100;
        const prevMilestone = MILESTONES.filter(m => m.days <= streak.current).pop()?.days || 0;
        const milestoneProgress = ((streak.current - prevMilestone) / (nextMilestone - prevMilestone)) * 100;

        setStreakData({
          currentStreak: streak.current,
          longestStreak: streak.longest,
          totalDays: activities.length,
          lastActivityDate: activities[0].ts,
          streakAtRisk,
          nextMilestone,
          milestoneProgress,
        });

        // Set milestones with achieved status
        setMilestones(MILESTONES.map(m => ({
          ...m,
          achieved: streak.current >= m.days,
        })));
      }
    } catch (err) {
      console.error('Failed to load streak data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStreak = (dates: string[]) => {
    if (dates.length === 0) return { current: 0, longest: 0 };

    const uniqueDays = new Set(
      dates.map(d => {
        const date = new Date(d);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      })
    );
    const sortedDays = Array.from(uniqueDays).sort((a, b) => b - a);
    
    let currentStreak = 1;
    let longestStreak = 1;
    let tempStreak = 1;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today.getTime() - 86400000);

    // Check if streak is still active (activity today or yesterday)
    const lastDay = sortedDays[0];
    if (lastDay !== today.getTime() && lastDay !== yesterday.getTime()) {
      currentStreak = 0;
    }

    for (let i = 1; i < sortedDays.length; i++) {
      const diff = sortedDays[i - 1] - sortedDays[i];
      if (diff === 86400000) {
        tempStreak++;
        if (i <= currentStreak || currentStreak === 0) {
          currentStreak = tempStreak;
        }
      } else {
        tempStreak = 1;
      }
      longestStreak = Math.max(longestStreak, tempStreak);
    }

    return { current: currentStreak, longest: longestStreak };
  };

  const checkStreakNotifications = async () => {
    const prefs = localStorage.getItem('notification_preferences');
    if (!prefs) return;
    
    const { streakAlerts } = JSON.parse(prefs);
    if (!streakAlerts) return;

    // Check if streak is at risk and notify
    if (streakData.streakAtRisk && streakData.currentStreak >= 3) {
      const lastNotified = localStorage.getItem('streak_alert_last');
      const today = new Date().toDateString();
      
      if (lastNotified !== today) {
        await pushNotificationService.showNotification(
          '🔥 Votre série est en danger!',
          {
            body: `Ne perdez pas votre série de ${streakData.currentStreak} jours. Faites une activité aujourd'hui!`,
            icon: '/favicon.ico',
          }
        );
        localStorage.setItem('streak_alert_last', today);
      }
    }
  };

  const claimMilestoneReward = (milestone: StreakMilestone) => {
    // Vérifier si déjà réclamé
    const claimed = localStorage.getItem(`milestone_claimed_${milestone.days}`);
    if (claimed) {
      toast({
        title: 'Déjà réclamé',
        description: `Vous avez déjà réclamé la récompense des ${milestone.days} jours`,
      });
      return;
    }
    
    // Marquer comme réclamé
    localStorage.setItem(`milestone_claimed_${milestone.days}`, 'true');
    
    toast({
      title: `${milestone.icon} Félicitations!`,
      description: `Vous avez débloqué: ${milestone.reward}`,
    });
  };
  
  const isMilestoneClaimed = (days: number) => {
    return localStorage.getItem(`milestone_claimed_${days}`) === 'true';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="h-32 bg-muted animate-pulse rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-amber-500/10 to-orange-500/10">
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-6 w-6 text-orange-500" />
          Votre série
        </CardTitle>
        <CardDescription>
          Maintenez votre régularité pour débloquer des récompenses
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Current streak */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <span className="text-6xl font-bold text-orange-500">
              {streakData.currentStreak}
            </span>
            <Flame className="h-10 w-10 text-orange-500 animate-pulse" />
          </div>
          <p className="text-muted-foreground">jours d'affilée</p>
          
          {streakData.streakAtRisk && (
            <Badge variant="destructive" className="mt-2 animate-pulse">
              <Bell className="h-3 w-3 mr-1" />
              À risque - Faites une activité aujourd'hui!
            </Badge>
          )}
        </div>

        {/* Progress to next milestone */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Prochain palier</span>
            <span className="font-medium">{streakData.nextMilestone} jours</span>
          </div>
          <Progress value={streakData.milestoneProgress} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">
            Plus que {streakData.nextMilestone - streakData.currentStreak} jours!
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 py-4 border-y">
          <div className="text-center">
            <Trophy className="h-5 w-5 mx-auto mb-1 text-amber-500" />
            <p className="text-xl font-bold">{streakData.longestStreak}</p>
            <p className="text-xs text-muted-foreground">Record</p>
          </div>
          <div className="text-center">
            <Calendar className="h-5 w-5 mx-auto mb-1 text-blue-500" />
            <p className="text-xl font-bold">{streakData.totalDays}</p>
            <p className="text-xs text-muted-foreground">Jours total</p>
          </div>
          <div className="text-center">
            <Star className="h-5 w-5 mx-auto mb-1 text-purple-500" />
            <p className="text-xl font-bold">
              {milestones.filter(m => m.achieved).length}
            </p>
            <p className="text-xs text-muted-foreground">Badges</p>
          </div>
        </div>

        {/* Milestones */}
        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Récompenses
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {milestones.map((milestone, idx) => {
              const claimed = isMilestoneClaimed(milestone.days);
              return (
                <button
                  key={idx}
                  onClick={() => milestone.achieved && !claimed && claimMilestoneReward(milestone)}
                  className={`p-2 rounded-lg text-center transition-all relative ${
                    milestone.achieved 
                      ? claimed
                        ? 'bg-green-100 dark:bg-green-900/30'
                        : 'bg-amber-100 dark:bg-amber-900/30 cursor-pointer hover:scale-105 animate-pulse' 
                      : 'bg-muted/50 opacity-50'
                  }`}
                  disabled={!milestone.achieved || claimed}
                >
                  <span className="text-2xl">{milestone.icon}</span>
                  <p className="text-xs font-medium mt-1">{milestone.days}j</p>
                  {claimed && (
                    <span className="absolute -top-1 -right-1 text-xs">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
