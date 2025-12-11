import { memo, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Flame, TrendingUp, Calendar, Share2, Trophy, Target, Sparkles } from 'lucide-react';
import type { SanitizedNote } from '@/modules/journal/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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
}

const MILESTONES = [3, 7, 14, 30, 60, 100, 365];

export const JournalStreak = memo<JournalStreakProps>(({ notes, targetStreak = 30, onShare }) => {
  const { toast } = useToast();
  const [showCalendar, setShowCalendar] = useState(false);

  const streakData = useMemo((): StreakData => {
    if (notes.length === 0) {
      return { currentStreak: 0, maxStreak: 0, lastWriteDate: null, totalEntries: 0, averagePerWeek: 0 };
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

    return {
      currentStreak,
      maxStreak,
      lastWriteDate: new Date(uniqueDates[0]),
      totalEntries: notes.length,
      averagePerWeek,
    };
  }, [notes]);

  const isActiveToday = useMemo(() => {
    if (notes.length === 0) return false;
    const today = new Date().toDateString();
    return notes.some(n => new Date(n.created_at).toDateString() === today);
  }, [notes]);

  // Next milestone
  const nextMilestone = useMemo(() => {
    return MILESTONES.find(m => m > streakData.currentStreak) || MILESTONES[MILESTONES.length - 1];
  }, [streakData.currentStreak]);

  const progressToMilestone = useMemo(() => {
    const prevMilestone = MILESTONES.filter(m => m <= streakData.currentStreak).pop() || 0;
    const progress = ((streakData.currentStreak - prevMilestone) / (nextMilestone - prevMilestone)) * 100;
    return Math.min(100, Math.max(0, progress));
  }, [streakData.currentStreak, nextMilestone]);

  // Calendar data for last 28 days
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

  // Motivation messages
  const motivationMessage = useMemo(() => {
    if (streakData.currentStreak === 0) return null;
    if (streakData.currentStreak >= 100) return "🏆 Vous êtes légendaire !";
    if (streakData.currentStreak >= 30) return "🏆 Un mois complet ! Incroyable !";
    if (streakData.currentStreak >= 14) return "🌟 Deux semaines d'excellence !";
    if (streakData.currentStreak >= 7) return "🔥 Une semaine complète ! Bravo !";
    if (streakData.currentStreak >= 3) return "💪 Belle constance, continuez !";
    return "🌱 Bon début, gardez le rythme !";
  }, [streakData.currentStreak]);

  // Share functionality
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

  // Streak level for visual styling
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

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className={cn(
              'p-1.5 rounded-full',
              streakData.currentStreak > 0 
                ? `bg-gradient-to-br ${streakColors[streakLevel]}` 
                : 'bg-muted'
            )}>
              <Flame className={cn(
                'h-4 w-4',
                streakData.currentStreak > 0 ? 'text-white' : 'text-muted-foreground'
              )} />
            </div>
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
                    onClick={() => setShowCalendar(!showCalendar)}
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Voir le calendrier</TooltipContent>
              </Tooltip>
            </TooltipProvider>

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
        {/* Main streak display */}
        <div className="flex items-center justify-center py-4">
          <div className="text-center">
            <div className={cn(
              'text-6xl font-bold mb-1 transition-all duration-500 bg-clip-text',
              streakData.currentStreak > 0 
                ? `text-transparent bg-gradient-to-r ${streakColors[streakLevel]}` 
                : 'text-muted-foreground'
            )}>
              {streakData.currentStreak}
            </div>
            <div className="text-sm text-muted-foreground">
              jour{streakData.currentStreak > 1 ? 's' : ''} consécutif{streakData.currentStreak > 1 ? 's' : ''}
            </div>
            {motivationMessage && (
              <p className="mt-2 text-sm font-medium text-primary animate-fade-in">
                {motivationMessage}
              </p>
            )}
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
              <div 
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  `bg-gradient-to-r ${streakColors[streakLevel]}`
                )}
                style={{ width: `${progressToMilestone}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{streakData.currentStreak} jours</span>
              <span>{nextMilestone - streakData.currentStreak} jours restants</span>
            </div>
          </div>
        )}

        {/* Calendar view */}
        {showCalendar && (
          <div className="p-3 bg-muted/50 rounded-lg space-y-2 animate-fade-in">
            <div className="text-xs text-muted-foreground text-center mb-2">
              28 derniers jours
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarData.map((day, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
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
          </div>
        )}

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
          <div className="text-center p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <p className="text-sm text-orange-700 dark:text-orange-400">
              💪 Votre streak s'est arrêté. Écrivez aujourd'hui pour recommencer !
            </p>
          </div>
        )}

        {streakData.currentStreak > 0 && !isActiveToday && (
          <div className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              🔥 {streakData.currentStreak} jour{streakData.currentStreak > 1 ? 's' : ''} ! Écrivez aujourd'hui pour continuer !
            </p>
          </div>
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
