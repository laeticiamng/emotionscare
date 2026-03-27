// @ts-nocheck
/**
 * JournalGoalsPage - Objectifs d'écriture enrichis
 */
import { memo, useMemo } from 'react';
import { useJournalEnriched } from '@/modules/journal/useJournalEnriched';
import { JournalWritingGoals } from '@/components/journal/JournalWritingGoals';
import { JournalAchievements } from '@/components/journal/JournalAchievements';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Target, Trophy, Flame, Calendar, CheckCircle } from 'lucide-react';

const JournalGoalsPage = memo(() => {
  const { notes, isLoading } = useJournalEnriched();

  // Calculate goals progress
  const goals = useMemo(() => {
    const now = new Date();
    const thisWeek = notes.filter(n => {
      const date = new Date(n.created_at);
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return date >= weekAgo;
    });
    
    const thisMonth = notes.filter(n => {
      const date = new Date(n.created_at);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });

    // Default goals
    const weeklyGoal = 7; // 1 note per day
    const monthlyGoal = 20;
    const wordsGoal = 1000;

    const totalWordsThisMonth = thisMonth.reduce((acc, n) => 
      acc + (n.text?.split(/\s+/).length || 0), 0
    );

    return {
      weekly: { current: thisWeek.length, target: weeklyGoal },
      monthly: { current: thisMonth.length, target: monthlyGoal },
      words: { current: totalWordsThisMonth, target: wordsGoal },
    };
  }, [notes]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Target className="h-7 w-7 text-primary" aria-hidden="true" />
          Objectifs
        </h1>
        <p className="text-muted-foreground mt-1">
          Suivez vos objectifs d'écriture
        </p>
      </header>

      {/* Goals Progress */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" aria-hidden="true" />
              Objectif hebdo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{goals.weekly.current} / {goals.weekly.target} notes</span>
                <Badge variant={goals.weekly.current >= goals.weekly.target ? 'default' : 'secondary'}>
                  {Math.round((goals.weekly.current / goals.weekly.target) * 100)}%
                </Badge>
              </div>
              <Progress value={Math.min(100, (goals.weekly.current / goals.weekly.target) * 100)} />
              {goals.weekly.current >= goals.weekly.target && (
                <p className="text-xs text-success flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Objectif atteint !
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" aria-hidden="true" />
              Objectif mensuel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{goals.monthly.current} / {goals.monthly.target} notes</span>
                <Badge variant={goals.monthly.current >= goals.monthly.target ? 'default' : 'secondary'}>
                  {Math.round((goals.monthly.current / goals.monthly.target) * 100)}%
                </Badge>
              </div>
              <Progress value={Math.min(100, (goals.monthly.current / goals.monthly.target) * 100)} />
              {goals.monthly.current >= goals.monthly.target && (
                <p className="text-xs text-success flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Objectif atteint !
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" aria-hidden="true" />
              Mots ce mois
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{goals.words.current.toLocaleString()} / {goals.words.target.toLocaleString()}</span>
                <Badge variant={goals.words.current >= goals.words.target ? 'default' : 'secondary'}>
                  {Math.round((goals.words.current / goals.words.target) * 100)}%
                </Badge>
              </div>
              <Progress value={Math.min(100, (goals.words.current / goals.words.target) * 100)} />
              {goals.words.current >= goals.words.target && (
                <p className="text-xs text-success flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Objectif atteint !
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Writing Goals Component */}
      <JournalWritingGoals notes={notes} />
      
      {/* Achievements */}
      <JournalAchievements notes={notes} />
    </div>
  );
});

JournalGoalsPage.displayName = 'JournalGoalsPage';

export default JournalGoalsPage;
