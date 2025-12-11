import { memo, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, TrendingUp, Calendar } from 'lucide-react';
import type { SanitizedNote } from '@/modules/journal/types';

interface JournalStreakProps {
  notes: SanitizedNote[];
}

export const JournalStreak = memo<JournalStreakProps>(({ notes }) => {
  const streakData = useMemo(() => {
    if (notes.length === 0) {
      return { currentStreak: 0, maxStreak: 0, lastWriteDate: null };
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

    return {
      currentStreak,
      maxStreak,
      lastWriteDate: new Date(uniqueDates[0]),
    };
  }, [notes]);

  const isActiveToday = useMemo(() => {
    if (notes.length === 0) return false;
    const today = new Date().toDateString();
    return notes.some(n => new Date(n.created_at).toDateString() === today);
  }, [notes]);

  // Messages de motivation contextuels
  const motivationMessage = useMemo(() => {
    if (streakData.currentStreak === 0) return null;
    if (streakData.currentStreak >= 30) return "🏆 Vous êtes un maître de l'écriture!";
    if (streakData.currentStreak >= 14) return "🌟 Deux semaines d'excellence!";
    if (streakData.currentStreak >= 7) return "🔥 Une semaine complète! Bravo!";
    if (streakData.currentStreak >= 3) return "💪 Belle constance, continuez!";
    return "🌱 Bon début, gardez le rythme!";
  }, [streakData.currentStreak]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className={`h-5 w-5 transition-all duration-300 ${
            streakData.currentStreak > 0 
              ? 'text-orange-500 animate-pulse' 
              : 'text-muted-foreground'
          }`} />
          Streak d'écriture
        </CardTitle>
        <CardDescription>
          Maintenez votre constance pour améliorer votre streak
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className={`text-6xl font-bold mb-2 transition-all duration-500 ${
              streakData.currentStreak > 0 ? 'text-primary scale-100' : 'text-muted-foreground scale-95'
            }`}>
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1 text-center p-4 rounded-lg bg-muted/50">
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Record</span>
            </div>
            <div className="text-2xl font-bold">{streakData.maxStreak}</div>
            <div className="text-xs text-muted-foreground">jours</div>
          </div>

          <div className="space-y-1 text-center p-4 rounded-lg bg-muted/50">
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-xs">Statut</span>
            </div>
            <div className="text-2xl font-bold">
              {isActiveToday ? '✅' : '⏰'}
            </div>
            <div className="text-xs text-muted-foreground">
              {isActiveToday ? 'Écrit aujourd\'hui' : 'Pas encore écrit'}
            </div>
          </div>
        </div>

        {streakData.currentStreak === 0 && notes.length > 0 && (
          <div className="text-center p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <p className="text-sm text-orange-700 dark:text-orange-400">
              💪 Votre streak s'est arrêté. Écrivez aujourd'hui pour recommencer !
            </p>
          </div>
        )}

        {streakData.currentStreak > 0 && !isActiveToday && (
          <div className="text-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              🔥 {streakData.currentStreak} jour{streakData.currentStreak > 1 ? 's' : ''} ! Écrivez aujourd'hui pour continuer !
            </p>
          </div>
        )}

        {streakData.currentStreak >= 7 && (
          <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-sm text-green-700 dark:text-green-400">
              🎉 Incroyable ! Vous êtes sur une série de {streakData.currentStreak} jours !
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

JournalStreak.displayName = 'JournalStreak';
