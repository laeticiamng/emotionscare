// @ts-nocheck

import { memo, useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Flame, TrendingUp, Calendar, Share2, Trophy, Target, Sparkles, 
  Download, BarChart3, Award, Zap, Bell, BellOff
} from 'lucide-react';
import type { SanitizedNote } from '@/modules/journal/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface JournalStreakProps {
  notes: SanitizedNote[];
  targetStreak?: number;
  onShare?: (streakData: StreakData) => void;
}

interface StreakData {
  currentStreak: number;
  maxStreak: number;
  lastWriteDate: Date | null;
  totalEntries: number;
  averagePerWeek: number;
  weeklyGoalProgress: number;
  monthlyStats: MonthlyStats[];
}

interface MonthlyStats {
  month: string;
  year: number;
  entries: number;
  longestStreak: number;
  averagePerWeek: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  requirement: number;
  type: 'streak' | 'total' | 'weekly';
}

const MILESTONES = [3, 7, 14, 30, 60, 100, 365];
const STORAGE_KEY = 'journal-streak-data';

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_entry', name: 'Premier pas', description: 'Écrire sa première entrée', icon: '🌱', unlocked: false, requirement: 1, type: 'total' },
  { id: 'week_streak', name: 'Semaine parfaite', description: '7 jours consécutifs', icon: '🔥', unlocked: false, requirement: 7, type: 'streak' },
  { id: 'two_weeks', name: 'Détermination', description: '14 jours consécutifs', icon: '💪', unlocked: false, requirement: 14, type: 'streak' },
  { id: 'month_streak', name: 'Engagement total', description: '30 jours consécutifs', icon: '🏆', unlocked: false, requirement: 30, type: 'streak' },
  { id: 'marathon', name: 'Marathonien', description: '100 jours consécutifs', icon: '👑', unlocked: false, requirement: 100, type: 'streak' },
  { id: 'legendary', name: 'Légende', description: '365 jours consécutifs', icon: '⭐', unlocked: false, requirement: 365, type: 'streak' },
  { id: 'prolific_10', name: 'Prolifique', description: '10 entrées au total', icon: '📝', unlocked: false, requirement: 10, type: 'total' },
  { id: 'prolific_50', name: 'Écrivain', description: '50 entrées au total', icon: '📚', unlocked: false, requirement: 50, type: 'total' },
  { id: 'prolific_100', name: 'Auteur', description: '100 entrées au total', icon: '🎖️', unlocked: false, requirement: 100, type: 'total' },
];

export const JournalStreak = memo<JournalStreakProps>(({ notes, targetStreak = 30, onShare }) => {
  const { toast } = useToast();
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [weeklyGoal, setWeeklyGoal] = useState(5);
  const [hasReminder, setHasReminder] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  // Load saved settings
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setWeeklyGoal(data.weeklyGoal || 5);
      setHasReminder(data.hasReminder || false);
      if (data.achievements) {
        setAchievements(data.achievements);
      }
    }
  }, []);

  // Save settings
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      weeklyGoal,
      hasReminder,
      achievements
    }));
  }, [weeklyGoal, hasReminder, achievements]);

  const streakData = useMemo((): StreakData => {
    if (notes.length === 0) {
      return { 
        currentStreak: 0, maxStreak: 0, lastWriteDate: null, 
        totalEntries: 0, averagePerWeek: 0, weeklyGoalProgress: 0,
        monthlyStats: []
      };
    }

    const sortedDates = notes
      .map(n => new Date(n.created_at).toDateString())
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    const uniqueDates = Array.from(new Set(sortedDates));

    let maxStreak = 0;
    let tempStreak = 1;
    
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const diff = (new Date(uniqueDates[i]).getTime() - new Date(uniqueDates[i + 1]).getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        tempStreak++;
      } else {
        maxStreak = Math.max(maxStreak, tempStreak);
        tempStreak = 1;
      }
    }
    maxStreak = Math.max(maxStreak, tempStreak);

    let currentStreak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
      currentStreak = 1;
      for (let i = 0; i < uniqueDates.length - 1; i++) {
        const diff = (new Date(uniqueDates[i]).getTime() - new Date(uniqueDates[i + 1]).getTime()) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Calculate average per week
    const oldestDate = new Date(uniqueDates[uniqueDates.length - 1]);
    const weeks = Math.max(1, (Date.now() - oldestDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
    const averagePerWeek = Math.round((notes.length / weeks) * 10) / 10;

    // Weekly goal progress (current week)
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const thisWeekEntries = notes.filter(n => new Date(n.created_at) >= startOfWeek).length;
    const weeklyGoalProgress = Math.min(100, (thisWeekEntries / weeklyGoal) * 100);

    // Monthly stats
    const monthlyMap = new Map<string, { entries: number; dates: string[] }>();
    notes.forEach(note => {
      const date = new Date(note.created_at);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const existing = monthlyMap.get(key) || { entries: 0, dates: [] };
      existing.entries++;
      existing.dates.push(date.toDateString());
      monthlyMap.set(key, existing);
    });

    const monthlyStats: MonthlyStats[] = Array.from(monthlyMap.entries()).map(([key, data]) => {
      const [year, month] = key.split('-').map(Number);
      const uniqueDatesMonth = Array.from(new Set(data.dates));
      
      let longestStreak = 0;
      let tempStreakMonth = 1;
      for (let i = 0; i < uniqueDatesMonth.length - 1; i++) {
        const diff = (new Date(uniqueDatesMonth[i]).getTime() - new Date(uniqueDatesMonth[i + 1]).getTime()) / (1000 * 60 * 60 * 24);
        if (Math.abs(diff) === 1) {
          tempStreakMonth++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreakMonth);
          tempStreakMonth = 1;
        }
      }
      longestStreak = Math.max(longestStreak, tempStreakMonth);

      const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
      
      return {
        month: monthNames[month],
        year,
        entries: data.entries,
        longestStreak,
        averagePerWeek: Math.round((data.entries / 4) * 10) / 10
      };
    }).sort((a, b) => b.year - a.year || ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'].indexOf(b.month) - ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'].indexOf(a.month));

    return {
      currentStreak,
      maxStreak,
      lastWriteDate: new Date(uniqueDates[0]),
      totalEntries: notes.length,
      averagePerWeek,
      weeklyGoalProgress,
      monthlyStats: monthlyStats.slice(0, 6)
    };
  }, [notes, weeklyGoal]);

  // Check achievements
  useEffect(() => {
    const updatedAchievements = achievements.map(ach => {
      if (ach.unlocked) return ach;
      
      let shouldUnlock = false;
      if (ach.type === 'streak' && streakData.currentStreak >= ach.requirement) {
        shouldUnlock = true;
      } else if (ach.type === 'total' && streakData.totalEntries >= ach.requirement) {
        shouldUnlock = true;
      }
      
      if (shouldUnlock) {
        setNewAchievement({ ...ach, unlocked: true, unlockedAt: new Date() });
        return { ...ach, unlocked: true, unlockedAt: new Date() };
      }
      return ach;
    });
    
    if (JSON.stringify(updatedAchievements) !== JSON.stringify(achievements)) {
      setAchievements(updatedAchievements);
    }
  }, [streakData.currentStreak, streakData.totalEntries]);

  // Show achievement notification
  useEffect(() => {
    if (newAchievement) {
      toast({
        title: `🎉 Succès débloqué: ${newAchievement.name}`,
        description: newAchievement.description,
      });
      setTimeout(() => setNewAchievement(null), 3000);
    }
  }, [newAchievement]);

  const isActiveToday = useMemo(() => {
    if (notes.length === 0) return false;
    const today = new Date().toDateString();
    return notes.some(n => new Date(n.created_at).toDateString() === today);
  }, [notes]);

  const nextMilestone = useMemo(() => {
    return MILESTONES.find(m => m > streakData.currentStreak) || MILESTONES[MILESTONES.length - 1];
  }, [streakData.currentStreak]);

  const progressToMilestone = useMemo(() => {
    const prevMilestone = MILESTONES.filter(m => m <= streakData.currentStreak).pop() || 0;
    const progress = ((streakData.currentStreak - prevMilestone) / (nextMilestone - prevMilestone)) * 100;
    return Math.min(100, Math.max(0, progress));
  }, [streakData.currentStreak, nextMilestone]);

  const calendarData = useMemo(() => {
    const days: { date: Date; hasEntry: boolean; count: number }[] = [];
    const today = new Date();
    
    for (let i = 27; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const entriesForDay = notes.filter(n => new Date(n.created_at).toDateString() === dateStr);
      
      days.push({
        date,
        hasEntry: entriesForDay.length > 0,
        count: entriesForDay.length,
      });
    }
    
    return days;
  }, [notes]);

  const motivationMessage = useMemo(() => {
    if (streakData.currentStreak === 0) return null;
    if (streakData.currentStreak >= 100) return "🏆 Vous êtes légendaire !";
    if (streakData.currentStreak >= 30) return "🏆 Un mois complet ! Incroyable !";
    if (streakData.currentStreak >= 14) return "🌟 Deux semaines d'excellence !";
    if (streakData.currentStreak >= 7) return "🔥 Une semaine complète ! Bravo !";
    if (streakData.currentStreak >= 3) return "💪 Belle constance, continuez !";
    return "🌱 Bon début, gardez le rythme !";
  }, [streakData.currentStreak]);

  const handleShare = () => {
    if (onShare) {
      onShare(streakData);
    } else {
      const text = `🔥 J'ai une série de ${streakData.currentStreak} jours d'écriture dans mon journal ! Mon record : ${streakData.maxStreak} jours. #JournalStreak`;
      
      if (navigator.share) {
        navigator.share({ text }).catch(() => {});
      } else {
        navigator.clipboard.writeText(text);
        toast({
          title: 'Copié !',
          description: 'Votre streak a été copié dans le presse-papiers',
        });
      }
    }
  };

  const handleExport = () => {
    const exportData = {
      streak: streakData,
      achievements: achievements.filter(a => a.unlocked),
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `journal-streak-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Exporté !',
      description: 'Vos statistiques ont été exportées',
    });
  };

  const toggleReminder = () => {
    setHasReminder(!hasReminder);
    toast({
      title: hasReminder ? 'Rappel désactivé' : 'Rappel activé',
      description: hasReminder ? '' : 'Vous recevrez un rappel quotidien'
    });
  };

  const streakLevel = useMemo(() => {
    if (streakData.currentStreak >= 30) return 'legendary';
    if (streakData.currentStreak >= 14) return 'epic';
    if (streakData.currentStreak >= 7) return 'rare';
    if (streakData.currentStreak >= 3) return 'common';
    return 'none';
  }, [streakData.currentStreak]);

  const streakColors = {
    legendary: 'from-amber-500 to-orange-600',
    epic: 'from-purple-500 to-pink-500',
    rare: 'from-blue-500 to-cyan-500',
    common: 'from-green-500 to-emerald-500',
    none: 'from-slate-400 to-slate-500',
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <motion.div 
              animate={streakData.currentStreak > 0 ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              className={cn(
                'p-1.5 rounded-full',
                streakData.currentStreak > 0 
                  ? `bg-gradient-to-br ${streakColors[streakLevel]}` 
                  : 'bg-muted'
              )}
            >
              <Flame className={cn(
                'h-4 w-4',
                streakData.currentStreak > 0 ? 'text-white' : 'text-muted-foreground'
              )} />
            </motion.div>
            Streak d'écriture
          </CardTitle>
          
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={toggleReminder}
                  >
                    {hasReminder ? (
                      <Bell className="h-4 w-4 text-primary" />
                    ) : (
                      <BellOff className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{hasReminder ? 'Désactiver rappel' : 'Activer rappel'}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setShowCalendar(!showCalendar)}
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Voir le calendrier</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Dialog open={showDetails} onOpenChange={setShowDetails}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Statistiques détaillées
                  </DialogTitle>
                </DialogHeader>
                
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full">
                    <TabsTrigger value="overview" className="flex-1">Aperçu</TabsTrigger>
                    <TabsTrigger value="achievements" className="flex-1">Succès</TabsTrigger>
                    <TabsTrigger value="history" className="flex-1">Historique</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-muted/50 text-center">
                        <Flame className="h-5 w-5 mx-auto mb-1 text-orange-500" />
                        <div className="text-2xl font-bold">{streakData.currentStreak}</div>
                        <div className="text-xs text-muted-foreground">Streak actuel</div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50 text-center">
                        <Trophy className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
                        <div className="text-2xl font-bold">{streakData.maxStreak}</div>
                        <div className="text-xs text-muted-foreground">Record</div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50 text-center">
                        <Sparkles className="h-5 w-5 mx-auto mb-1 text-purple-500" />
                        <div className="text-2xl font-bold">{streakData.totalEntries}</div>
                        <div className="text-xs text-muted-foreground">Total entrées</div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50 text-center">
                        <TrendingUp className="h-5 w-5 mx-auto mb-1 text-green-500" />
                        <div className="text-2xl font-bold">{streakData.averagePerWeek}</div>
                        <div className="text-xs text-muted-foreground">Moyenne/semaine</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          Objectif semaine ({weeklyGoal} entrées)
                        </span>
                        <span className="font-medium">{Math.round(streakData.weeklyGoalProgress)}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${streakData.weeklyGoalProgress}%` }}
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <select 
                        value={weeklyGoal}
                        onChange={(e) => setWeeklyGoal(Number(e.target.value))}
                        className="flex-1 p-2 rounded-lg bg-muted/50 text-sm"
                      >
                        {[3, 5, 7].map(n => (
                          <option key={n} value={n}>{n} entrées/semaine</option>
                        ))}
                      </select>
                      <Button variant="outline" size="sm" onClick={handleExport}>
                        <Download className="h-4 w-4 mr-1" />
                        Exporter
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="achievements" className="mt-4">
                    <div className="grid grid-cols-3 gap-2">
                      {achievements.map(ach => (
                        <TooltipProvider key={ach.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className={cn(
                                'p-3 rounded-lg text-center transition-all',
                                ach.unlocked 
                                  ? 'bg-primary/10 border border-primary/30' 
                                  : 'bg-muted/30 opacity-50'
                              )}>
                                <div className="text-2xl mb-1">{ach.icon}</div>
                                <div className="text-xs font-medium truncate">{ach.name}</div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="font-medium">{ach.name}</p>
                              <p className="text-xs text-muted-foreground">{ach.description}</p>
                              {!ach.unlocked && (
                                <p className="text-xs text-primary mt-1">
                                  {ach.type === 'streak' ? `${ach.requirement} jours consécutifs` : `${ach.requirement} entrées`}
                                </p>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                    <div className="mt-3 text-center text-sm text-muted-foreground">
                      {unlockedAchievements.length}/{achievements.length} débloqués
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="history" className="mt-4">
                    <div className="space-y-2">
                      {streakData.monthlyStats.length > 0 ? (
                        streakData.monthlyStats.map((stat, index) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div>
                              <div className="font-medium">{stat.month} {stat.year}</div>
                              <div className="text-xs text-muted-foreground">{stat.entries} entrées</div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1 text-sm">
                                <Flame className="h-3 w-3 text-orange-500" />
                                {stat.longestStreak} jours
                              </div>
                              <div className="text-xs text-muted-foreground">
                                ~{stat.averagePerWeek}/semaine
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          Pas encore de données
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>

            {streakData.currentStreak > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Partager</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        <CardDescription>
          Maintenez votre constance pour atteindre vos objectifs
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* New achievement notification */}
        <AnimatePresence>
          {newAchievement && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-3 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-center"
            >
              <div className="text-2xl mb-1">{newAchievement.icon}</div>
              <div className="font-medium">{newAchievement.name}</div>
              <div className="text-xs text-muted-foreground">{newAchievement.description}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main streak display */}
        <div className="flex items-center justify-center py-4">
          <motion.div 
            className="text-center"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <motion.div 
              className={cn(
                'text-6xl font-bold mb-1 transition-all duration-500 bg-clip-text',
                streakData.currentStreak > 0 
                  ? `text-transparent bg-gradient-to-r ${streakColors[streakLevel]}` 
                  : 'text-muted-foreground'
              )}
              key={streakData.currentStreak}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              {streakData.currentStreak}
            </motion.div>
            <div className="text-sm text-muted-foreground">
              jour{streakData.currentStreak > 1 ? 's' : ''} consécutif{streakData.currentStreak > 1 ? 's' : ''}
            </div>
            {motivationMessage && (
              <motion.p 
                className="mt-2 text-sm font-medium text-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {motivationMessage}
              </motion.p>
            )}
          </motion.div>
        </div>

        {/* Weekly goal progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Objectif semaine
            </span>
            <span className="font-medium">{Math.round(streakData.weeklyGoalProgress)}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${streakData.weeklyGoalProgress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
            />
          </div>
        </div>

        {/* Progress to next milestone */}
        {streakData.currentStreak > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <Target className="h-3 w-3" />
                Prochain palier
              </span>
              <span className="font-medium">{nextMilestone} jours</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressToMilestone}%` }}
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  `bg-gradient-to-r ${streakColors[streakLevel]}`
                )}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{streakData.currentStreak} jours</span>
              <span>{nextMilestone - streakData.currentStreak} jours restants</span>
            </div>
          </div>
        )}

        {/* Unlocked achievements preview */}
        {unlockedAchievements.length > 0 && (
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-1">
              {unlockedAchievements.slice(0, 5).map(ach => (
                <TooltipProvider key={ach.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-lg cursor-pointer">{ach.icon}</span>
                    </TooltipTrigger>
                    <TooltipContent>{ach.name}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
              {unlockedAchievements.length > 5 && (
                <Badge variant="secondary" className="text-xs">
                  +{unlockedAchievements.length - 5}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Calendar view */}
        <AnimatePresence>
          {showCalendar && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="p-3 bg-muted/50 rounded-lg space-y-2"
            >
              <div className="text-xs text-muted-foreground text-center mb-2">
                28 derniers jours
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarData.map((day, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.02 }}
                          className={cn(
                            'aspect-square rounded-sm transition-all',
                            day.hasEntry 
                              ? day.count > 1
                                ? `bg-gradient-to-br ${streakColors[streakLevel]} shadow-sm`
                                : 'bg-primary/60'
                              : 'bg-muted-foreground/20'
                          )}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="text-xs">
                          {day.date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {day.count} entrée{day.count > 1 ? 's' : ''}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Trophy className="h-3 w-3" />
            </div>
            <div className="text-xl font-bold">{streakData.maxStreak}</div>
            <div className="text-xs text-muted-foreground">Record</div>
          </div>

          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Sparkles className="h-3 w-3" />
            </div>
            <div className="text-xl font-bold">{streakData.totalEntries}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>

          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <TrendingUp className="h-3 w-3" />
            </div>
            <div className="text-xl font-bold">{streakData.averagePerWeek}</div>
            <div className="text-xs text-muted-foreground">/semaine</div>
          </div>
        </div>

        {/* Status alerts */}
        {streakData.currentStreak === 0 && notes.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-3 rounded-lg bg-orange-500/10 border border-orange-500/20"
          >
            <p className="text-sm text-orange-700 dark:text-orange-400">
              💪 Votre streak s'est arrêté. Écrivez aujourd'hui pour recommencer !
            </p>
          </motion.div>
        )}

        {streakData.currentStreak > 0 && !isActiveToday && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20"
          >
            <p className="text-sm text-blue-700 dark:text-blue-400">
              🔥 {streakData.currentStreak} jour{streakData.currentStreak > 1 ? 's' : ''} ! Écrivez aujourd'hui pour continuer !
            </p>
          </motion.div>
        )}

        {isActiveToday && (
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400">
              ✅ Écrit aujourd'hui
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

JournalStreak.displayName = 'JournalStreak';

export default JournalStreak;
