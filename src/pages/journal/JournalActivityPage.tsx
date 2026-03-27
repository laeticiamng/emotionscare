// @ts-nocheck
/**
 * JournalActivityPage - Activité et streaks enrichis
 */
import { memo } from 'react';
import { useJournalEnriched } from '@/modules/journal/useJournalEnriched';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { JournalHeatmap } from '@/components/journal/JournalHeatmap';
import { JournalStreak } from '@/components/journal/JournalStreak';
import { JournalPersonalStats } from '@/components/journal/JournalPersonalStats';
import { Activity, Flame, Calendar, TrendingUp, Target } from 'lucide-react';

const JournalActivityPage = memo(() => {
  const { notes, isLoading } = useJournalEnriched();
  const now = new Date();

  // Calculate activity stats
  const thisMonth = notes.filter(n => {
    const date = new Date(n.created_at);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });
  const lastMonth = notes.filter(n => {
    const date = new Date(n.created_at);
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
    return date.getMonth() === lastMonthDate.getMonth() && date.getFullYear() === lastMonthDate.getFullYear();
  });
  
  const growth = lastMonth.length > 0 
    ? Math.round(((thisMonth.length - lastMonth.length) / lastMonth.length) * 100)
    : thisMonth.length > 0 ? 100 : 0;

  // Streak calculation
  const sortedDates = [...new Set(notes.map(n => new Date(n.created_at).toDateString()))]
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  let currentStreak = 0;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  if (sortedDates[0] === today || sortedDates[0] === yesterday) {
    currentStreak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);
      const diff = Math.floor((prev.getTime() - curr.getTime()) / 86400000);
      if (diff === 1) currentStreak++;
      else break;
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Activity className="h-7 w-7 text-primary" aria-hidden="true" />
          Activité
        </h1>
        <p className="text-muted-foreground mt-1">
          Visualisez votre constance d'écriture
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Flame className="h-5 w-5 text-orange-500" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold">{currentStreak}</p>
                <p className="text-xs text-muted-foreground">Jours consécutifs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold">{thisMonth.length}</p>
                <p className="text-xs text-muted-foreground">Ce mois</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <TrendingUp className="h-5 w-5 text-success" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold flex items-center gap-1">
                  {growth > 0 ? '+' : ''}{growth}%
                </p>
                <p className="text-xs text-muted-foreground">vs mois dernier</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Target className="h-5 w-5 text-secondary" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold">{notes.length}</p>
                <p className="text-xs text-muted-foreground">Total notes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Streak & Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        <JournalStreak notes={notes} />
        <JournalPersonalStats notes={notes} />
      </div>

      {/* Heatmap */}
      <JournalHeatmap notes={notes} year={now.getFullYear()} />
    </div>
  );
});

JournalActivityPage.displayName = 'JournalActivityPage';

export default JournalActivityPage;
