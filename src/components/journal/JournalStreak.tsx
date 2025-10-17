import { useMemo } from 'react';
import { Flame, Award, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { SanitizedNote } from '@/modules/journal/types';

interface JournalStreakProps {
  notes: SanitizedNote[];
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  thisWeekCount: number;
  weeklyGoal: number;
  nextMilestone: number;
}

/**
 * Composant de suivi des séries de journaling
 * Affiche les statistiques de régularité et encourage la pratique quotidienne
 */
export function JournalStreak({ notes }: JournalStreakProps) {
  const streakData = useMemo((): StreakData => {
    if (notes.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        totalDays: 0,
        thisWeekCount: 0,
        weeklyGoal: 7,
        nextMilestone: 7,
      };
    }

    // Grouper les notes par jour
    const daysSet = new Set<string>();
    notes.forEach(note => {
      const date = new Date(note.created_at);
      const dayKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      daysSet.add(dayKey);
    });

    const sortedDays = Array.from(daysSet)
      .map(key => {
        const [year, month, day] = key.split('-').map(Number);
        return new Date(year, month - 1, day);
      })
      .sort((a, b) => b.getTime() - a.getTime()); // Plus récent en premier

    // Calculer la série actuelle
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedDays.length; i++) {
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);

      const actualDate = new Date(sortedDays[i]);
      actualDate.setHours(0, 0, 0, 0);

      if (actualDate.getTime() === expectedDate.getTime()) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculer la plus longue série
    let longestStreak = 0;
    let tempStreak = 1;

    for (let i = 1; i < sortedDays.length; i++) {
      const prevDay = new Date(sortedDays[i - 1]);
      const currDay = new Date(sortedDays[i]);
      
      const diffTime = Math.abs(prevDay.getTime() - currDay.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    // Notes de cette semaine
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeekCount = notes.filter(note => 
      new Date(note.created_at) >= oneWeekAgo
    ).length;

    // Prochain jalon
    const milestones = [7, 14, 30, 60, 90, 180, 365];
    const nextMilestone = milestones.find(m => m > currentStreak) || currentStreak + 100;

    return {
      currentStreak,
      longestStreak,
      totalDays: daysSet.size,
      thisWeekCount,
      weeklyGoal: 7,
      nextMilestone,
    };
  }, [notes]);

  const getStreakLevel = () => {
    if (streakData.currentStreak >= 365) return { label: 'Légendaire', color: 'text-purple-600' };
    if (streakData.currentStreak >= 180) return { label: 'Héroïque', color: 'text-orange-600' };
    if (streakData.currentStreak >= 90) return { label: 'Expert', color: 'text-blue-600' };
    if (streakData.currentStreak >= 30) return { label: 'Engagé', color: 'text-green-600' };
    if (streakData.currentStreak >= 7) return { label: 'Régulier', color: 'text-teal-600' };
    return { label: 'Débutant', color: 'text-gray-600' };
  };

  const weeklyProgress = Math.min((streakData.thisWeekCount / streakData.weeklyGoal) * 100, 100);
  const milestoneProgress = (streakData.currentStreak / streakData.nextMilestone) * 100;
  const level = getStreakLevel();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Série de journaling
            </CardTitle>
            <CardDescription>
              Maintenez votre pratique quotidienne
            </CardDescription>
          </div>
          <Badge className={level.color} variant="secondary">
            {level.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Série actuelle */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-baseline gap-2">
            <span className="text-5xl font-bold text-primary">
              {streakData.currentStreak}
            </span>
            <span className="text-2xl text-muted-foreground">
              {streakData.currentStreak <= 1 ? 'jour' : 'jours'}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {streakData.currentStreak > 0 
              ? 'Continuez votre élan !' 
              : 'Commencez votre série aujourd\'hui'}
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1 text-center">
            <div className="flex items-center justify-center gap-1">
              <Award className="h-4 w-4 text-yellow-600" />
              <span className="text-2xl font-semibold">
                {streakData.longestStreak}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Record</p>
          </div>
          
          <div className="space-y-1 text-center">
            <div className="flex items-center justify-center gap-1">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-2xl font-semibold">
                {streakData.totalDays}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Jours total</p>
          </div>
          
          <div className="space-y-1 text-center">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-2xl font-semibold">
                {streakData.thisWeekCount}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Cette semaine</p>
          </div>
        </div>

        {/* Progression hebdomadaire */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Objectif hebdomadaire</span>
            <span className="text-muted-foreground">
              {streakData.thisWeekCount}/{streakData.weeklyGoal}
            </span>
          </div>
          <Progress value={weeklyProgress} className="h-2" />
          {weeklyProgress === 100 && (
            <p className="text-xs text-green-600 font-medium">
              🎉 Objectif atteint cette semaine !
            </p>
          )}
        </div>

        {/* Prochain jalon */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Prochain jalon</span>
            <span className="text-muted-foreground">
              {streakData.currentStreak}/{streakData.nextMilestone}
            </span>
          </div>
          <Progress value={milestoneProgress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Plus que {streakData.nextMilestone - streakData.currentStreak} jour
            {streakData.nextMilestone - streakData.currentStreak > 1 ? 's' : ''} !
          </p>
        </div>

        {/* Encouragement */}
        <div className="pt-4 border-t">
          <p className="text-sm text-center text-muted-foreground italic">
            {streakData.currentStreak === 0 && 
              "Écrivez votre première note aujourd'hui pour démarrer votre série !"
            }
            {streakData.currentStreak >= 1 && streakData.currentStreak < 7 && 
              "Bon début ! Continuez pour atteindre 7 jours."
            }
            {streakData.currentStreak >= 7 && streakData.currentStreak < 30 && 
              "Excellent ! Vous développez une belle habitude."
            }
            {streakData.currentStreak >= 30 && streakData.currentStreak < 90 && 
              "Impressionnant ! Votre pratique est bien ancrée."
            }
            {streakData.currentStreak >= 90 && 
              "Incroyable engagement ! Vous êtes un modèle de régularité."
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
