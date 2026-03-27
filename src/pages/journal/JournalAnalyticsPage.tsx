// @ts-nocheck
/**
 * JournalAnalyticsPage - Dashboard Analytics enrichi
 */
import { memo, useMemo } from 'react';
import { useJournalEnriched } from '@/modules/journal/useJournalEnriched';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { JournalAnalyticsDashboard } from '@/components/journal/JournalAnalyticsDashboard';
import { JournalAIInsights } from '@/components/journal/JournalAIInsights';
import { JournalPeriodComparison } from '@/components/journal/JournalPeriodComparison';
import { JournalWordCloud } from '@/components/journal/JournalWordCloud';
import { BarChart3, TrendingUp, Brain, FileText, Sparkles } from 'lucide-react';

const JournalAnalyticsPage = memo(() => {
  const { notes, isLoading } = useJournalEnriched();

  // Calculate analytics
  const analytics = useMemo(() => {
    const totalWords = notes.reduce((acc, n) => acc + (n.text?.split(/\s+/).length || 0), 0);
    const avgWords = notes.length > 0 ? Math.round(totalWords / notes.length) : 0;
    
    const tagCounts = notes.reduce((acc, n) => {
      (n.tags || []).forEach(tag => acc.set(tag, (acc.get(tag) || 0) + 1));
      return acc;
    }, new Map<string, number>());
    
    const topTags = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Activity by day of week
    const dayStats = notes.reduce((acc, n) => {
      const day = new Date(n.created_at).getDay();
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const mostActiveDay = Object.entries(dayStats)
      .sort((a, b) => b[1] - a[1])[0];
    
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

    return {
      totalWords,
      avgWords,
      topTags,
      mostActiveDay: mostActiveDay ? days[parseInt(mostActiveDay[0])] : '-',
      uniqueTags: tagCounts.size,
    };
  }, [notes]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
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
          <BarChart3 className="h-7 w-7 text-primary" aria-hidden="true" />
          Analytics
        </h1>
        <p className="text-muted-foreground mt-1">
          Vue d'ensemble de votre activité d'écriture
        </p>
      </header>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold">{analytics.totalWords.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Mots écrits</p>
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
                <p className="text-2xl font-bold">{analytics.avgWords}</p>
                <p className="text-xs text-muted-foreground">Mots/note</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Sparkles className="h-5 w-5 text-secondary" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold">{analytics.uniqueTags}</p>
                <p className="text-xs text-muted-foreground">Tags uniques</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Brain className="h-5 w-5 text-orange-500" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold">{analytics.mostActiveDay}</p>
                <p className="text-xs text-muted-foreground">Jour le plus actif</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Tags */}
      {analytics.topTags.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Tags les plus utilisés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analytics.topTags.map(([tag, count]) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  #{tag}
                  <span className="text-muted-foreground">({count})</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Insights */}
      <JournalAIInsights notes={notes} />
      
      {/* Period Comparison */}
      <JournalPeriodComparison notes={notes} />

      {/* Word Cloud & Dashboard */}
      <div className="grid gap-6 lg:grid-cols-2">
        <JournalWordCloud notes={notes} maxWords={50} />
        <JournalAnalyticsDashboard notes={notes} />
      </div>
    </div>
  );
});

JournalAnalyticsPage.displayName = 'JournalAnalyticsPage';

export default JournalAnalyticsPage;
