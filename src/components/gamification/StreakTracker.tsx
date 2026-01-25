import { useState, useEffect } from 'react';
import { Flame, Trophy, Calendar, Star, Bell, TrendingUp, Gift, Share2, Sparkles, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { pushNotificationService } from '@/lib/notifications/pushNotifications';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  lastActivityDate: string | null;
  streakAtRisk: boolean;
  nextMilestone: number;
  milestoneProgress: number;
  freezesAvailable: number;
  weeklyGoal: number;
  weeklyProgress: number;
}

interface StreakMilestone {
  days: number;
  reward: string;
  icon: string;
  xpBonus: number;
  achieved: boolean;
}

interface ActivityDay {
  date: string;
  hasActivity: boolean;
  isToday: boolean;
  isFuture: boolean;
}

const MILESTONES: Omit<StreakMilestone, 'achieved'>[] = [
  { days: 3, reward: 'Badge Débutant', icon: '🌱', xpBonus: 50 },
  { days: 7, reward: 'Badge Régulier', icon: '🔥', xpBonus: 100 },
  { days: 14, reward: 'Badge Déterminé', icon: '💪', xpBonus: 200 },
  { days: 30, reward: 'Badge Expert', icon: '⭐', xpBonus: 500 },
  { days: 60, reward: 'Badge Maître', icon: '🏆', xpBonus: 1000 },
  { days: 100, reward: 'Badge Légende', icon: '👑', xpBonus: 2000 },
];

const FREEZES_KEY = 'streak_freezes';
const WEEKLY_GOAL_KEY = 'streak_weekly_goal';

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
    freezesAvailable: 2,
    weeklyGoal: 5,
    weeklyProgress: 0,
  });
  const [milestones, setMilestones] = useState<StreakMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [activityDays, setActivityDays] = useState<ActivityDay[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (user) {
      loadStreakData();
      checkStreakNotifications();
      loadFreezes();
    }
  }, [user]);

  const loadFreezes = () => {
    const stored = localStorage.getItem(FREEZES_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      setStreakData(prev => ({ ...prev, freezesAvailable: data.count || 2 }));
    }
    
    const goalStored = localStorage.getItem(WEEKLY_GOAL_KEY);
    if (goalStored) {
      setStreakData(prev => ({ ...prev, weeklyGoal: parseInt(goalStored) || 5 }));
    }
  };

  const loadStreakData = async () => {
    setLoading(true);
    try {
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

        const nextMilestone = MILESTONES.find(m => m.days > streak.current)?.days || 100;
        const prevMilestone = MILESTONES.filter(m => m.days <= streak.current).pop()?.days || 0;
        const milestoneProgress = ((streak.current - prevMilestone) / (nextMilestone - prevMilestone)) * 100;

        // Calculate weekly progress
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        weekStart.setHours(0, 0, 0, 0);
        const weeklyActivities = activities.filter(a => new Date(a.ts) >= weekStart);
        const uniqueWeekDays = new Set(weeklyActivities.map(a => new Date(a.ts).toDateString())).size;

        setStreakData(prev => ({
          ...prev,
          currentStreak: streak.current,
          longestStreak: streak.longest,
          totalDays: activities.length,
          lastActivityDate: activities[0].ts,
          streakAtRisk,
          nextMilestone,
          milestoneProgress,
          weeklyProgress: uniqueWeekDays,
        }));

        setMilestones(MILESTONES.map(m => ({
          ...m,
          achieved: streak.current >= m.days,
        })));

        // Build calendar data
        buildCalendarData(activities.map(a => a.ts));

        // Check for milestone celebration
        const justReachedMilestone = MILESTONES.find(m => m.days === streak.current);
        if (justReachedMilestone && !localStorage.getItem(`celebrated_${streak.current}`)) {
          celebrateMilestone(justReachedMilestone);
          localStorage.setItem(`celebrated_${streak.current}`, 'true');
        }
      }
    } catch (err) {
      console.error('Failed to load streak data:', err);
    } finally {
      setLoading(false);
    }
  };

  const buildCalendarData = (dates: string[]) => {
    const activitySet = new Set(dates.map(d => new Date(d).toDateString()));
    const today = new Date();
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days: ActivityDay[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        date: date.toDateString(),
        hasActivity: activitySet.has(date.toDateString()),
        isToday: date.toDateString() === today.toDateString(),
        isFuture: date > today,
      });
    }
    setActivityDays(days);
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

  const celebrateMilestone = (milestone: Omit<StreakMilestone, 'achieved'>) => {
    setShowCelebration(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1'],
    });
    
    toast({
      title: `${milestone.icon} Félicitations!`,
      description: `Vous avez atteint ${milestone.days} jours! +${milestone.xpBonus} XP`,
    });
    
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const useStreakFreeze = () => {
    if (streakData.freezesAvailable <= 0) {
      toast({
        title: 'Pas de gel disponible',
        description: 'Vous avez utilisé tous vos gels de série.',
        variant: 'destructive',
      });
      return;
    }
    
    const newCount = streakData.freezesAvailable - 1;
    localStorage.setItem(FREEZES_KEY, JSON.stringify({ count: newCount }));
    setStreakData(prev => ({ ...prev, freezesAvailable: newCount }));
    
    toast({
      title: '❄️ Série gelée!',
      description: 'Votre série est protégée pour aujourd\'hui.',
    });
  };

  const shareStreak = async () => {
    const text = `🔥 J'ai une série de ${streakData.currentStreak} jours sur EmotionsCare! Mon record: ${streakData.longestStreak} jours. #BienEtre #EmotionsCare`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        navigator.clipboard.writeText(text);
        toast({ title: 'Copié!', description: 'Texte copié dans le presse-papier.' });
      }
    } else {
      navigator.clipboard.writeText(text);
      toast({ title: 'Copié!', description: 'Texte copié dans le presse-papier.' });
    }
  };

  const claimMilestoneReward = (milestone: StreakMilestone) => {
    const claimed = localStorage.getItem(`milestone_claimed_${milestone.days}`);
    if (claimed) {
      toast({
        title: 'Déjà réclamé',
        description: `Vous avez déjà réclamé la récompense des ${milestone.days} jours`,
      });
      return;
    }
    
    localStorage.setItem(`milestone_claimed_${milestone.days}`, 'true');
    
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
    
    toast({
      title: `${milestone.icon} Félicitations!`,
      description: `Vous avez débloqué: ${milestone.reward} (+${milestone.xpBonus} XP)`,
    });
  };
  
  const isMilestoneClaimed = (days: number) => {
    return localStorage.getItem(`milestone_claimed_${days}`) === 'true';
  };

  const changeMonth = (delta: number) => {
    const newMonth = new Date(calendarMonth);
    newMonth.setMonth(newMonth.getMonth() + delta);
    setCalendarMonth(newMonth);
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
    <TooltipProvider>
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-6 w-6 text-orange-500" />
                Votre série
              </CardTitle>
              <CardDescription>
                Maintenez votre régularité pour débloquer des récompenses
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {streakData.streakAtRisk && streakData.freezesAvailable > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={useStreakFreeze}>
                      ❄️ Geler ({streakData.freezesAvailable})
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Protéger votre série pour aujourd'hui</TooltipContent>
                </Tooltip>
              )}
              <Button variant="ghost" size="sm" onClick={shareStreak}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-6">
          {/* Celebration overlay */}
          <AnimatePresence>
            {showCelebration && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10"
              >
                <div className="text-center">
                  <Sparkles className="h-16 w-16 mx-auto text-yellow-500 animate-pulse" />
                  <p className="text-2xl font-bold mt-4">Nouveau palier atteint!</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Current streak */}
          <div className="text-center">
            <motion.div 
              className="inline-flex items-center justify-center gap-2 mb-2"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-6xl font-bold text-orange-500">
                {streakData.currentStreak}
              </span>
              <Flame className="h-10 w-10 text-orange-500" />
            </motion.div>
            <p className="text-muted-foreground">jours d'affilée</p>
            
            {streakData.streakAtRisk && (
              <Badge variant="destructive" className="mt-2 animate-pulse">
                <Bell className="h-3 w-3 mr-1" />
                À risque - Faites une activité aujourd'hui!
              </Badge>
            )}
          </div>

          {/* Weekly goal */}
          <div className="p-4 bg-primary/5 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Objectif hebdomadaire</span>
              </div>
              <span className="text-sm font-bold">{streakData.weeklyProgress}/{streakData.weeklyGoal} jours</span>
            </div>
            <Progress value={(streakData.weeklyProgress / streakData.weeklyGoal) * 100} className="h-2" />
            {streakData.weeklyProgress >= streakData.weeklyGoal && (
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Objectif atteint cette semaine!
              </p>
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

          {/* Calendar heatmap */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Calendrier d'activité
              </h4>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => changeMonth(-1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm w-24 text-center">
                  {calendarMonth.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                </span>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => changeMonth(1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                <div key={i} className="text-center text-xs text-muted-foreground font-medium py-1">
                  {d}
                </div>
              ))}
              {/* Padding for first day of month */}
              {Array.from({ length: new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay() || 7 }).slice(1).map((_, i) => (
                <div key={`pad-${i}`} />
              ))}
              {activityDays.map((day, i) => (
                <Tooltip key={i}>
                  <TooltipTrigger asChild>
                    <div
                      className={`
                        aspect-square rounded-sm flex items-center justify-center text-xs transition-colors cursor-default
                        ${day.hasActivity ? 'bg-orange-500 text-white' : 'bg-muted/50'}
                        ${day.isToday ? 'ring-2 ring-primary' : ''}
                        ${day.isFuture ? 'opacity-30' : ''}
                      `}
                    >
                      {new Date(day.date).getDate()}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    {day.hasActivity ? ' ✓' : ''}
                  </TooltipContent>
                </Tooltip>
              ))}
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
                  <Tooltip key={idx}>
                    <TooltipTrigger asChild>
                      <motion.button
                        onClick={() => milestone.achieved && !claimed && claimMilestoneReward(milestone)}
                        whileHover={{ scale: milestone.achieved && !claimed ? 1.1 : 1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-2 rounded-lg text-center transition-all relative ${
                          milestone.achieved 
                            ? claimed
                              ? 'bg-green-100 dark:bg-green-900/30'
                              : 'bg-amber-100 dark:bg-amber-900/30 cursor-pointer animate-pulse' 
                            : 'bg-muted/50 opacity-50'
                        }`}
                        disabled={!milestone.achieved || claimed}
                      >
                        <span className="text-2xl">{milestone.icon}</span>
                        <p className="text-xs font-medium mt-1">{milestone.days}j</p>
                        {claimed && (
                          <span className="absolute -top-1 -right-1 text-xs bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center">✓</span>
                        )}
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">{milestone.reward}</p>
                      <p className="text-xs text-muted-foreground">+{milestone.xpBonus} XP</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>

          {/* Prediction */}
          {streakData.currentStreak > 0 && (
            <div className="p-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span>
                  À ce rythme, vous atteindrez <strong>{streakData.nextMilestone} jours</strong> le{' '}
                  {new Date(Date.now() + (streakData.nextMilestone - streakData.currentStreak) * 86400000)
                    .toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
