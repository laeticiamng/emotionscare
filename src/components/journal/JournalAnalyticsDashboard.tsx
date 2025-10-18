import { memo, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BarChart3, PieChart, TrendingUp, Calendar } from 'lucide-react';
import type { SanitizedNote } from '@/modules/journal/types';
import { format, parseISO, startOfMonth, endOfMonth, subMonths, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';

interface JournalAnalyticsDashboardProps {
  notes: SanitizedNote[];
  className?: string;
}

/**
 * Dashboard d'analytics complet pour le journal
 * Vue d'ensemble avec graphiques et statistiques
 */
export const JournalAnalyticsDashboard = memo<JournalAnalyticsDashboardProps>(({
  notes,
  className = '',
}) => {
  const analytics = useMemo(() => {
    if (notes.length === 0) {
      return {
        totalNotes: 0,
        totalWords: 0,
        avgLength: 0,
        uniqueTags: 0,
        tagsDistribution: [],
        monthlyDistribution: [],
        weekdayDistribution: [],
        longestNote: null,
        shortestNote: null,
      };
    }

    // Statistiques générales
    const totalWords = notes.reduce((sum, note) => {
      return sum + note.text.split(/\s+/).filter(w => w.length > 0).length;
    }, 0);

    const avgLength = totalWords / notes.length;

    // Tags
    const tagCounts = new Map<string, number>();
    notes.forEach(note => {
      note.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    const tagsDistribution = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));

    // Distribution mensuelle (12 derniers mois)
    const monthlyDistribution = Array.from({ length: 12 }, (_, i) => {
      const month = subMonths(new Date(), 11 - i);
      const start = startOfMonth(month);
      const end = endOfMonth(month);
      
      const monthNotes = notes.filter(note => {
        const noteDate = parseISO(note.created_at);
        return isWithinInterval(noteDate, { start, end });
      });

      return {
        month: format(month, 'MMM', { locale: fr }),
        count: monthNotes.length,
      };
    });

    // Distribution par jour de la semaine
    const weekdayCounts = new Map<number, number>();
    notes.forEach(note => {
      const day = parseISO(note.created_at).getDay();
      weekdayCounts.set(day, (weekdayCounts.get(day) || 0) + 1);
    });

    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const weekdayDistribution = Array.from({ length: 7 }, (_, i) => ({
      day: dayNames[i],
      count: weekdayCounts.get(i) || 0,
    }));

    // Notes extrêmes
    const notesWithLength = notes.map(note => ({
      ...note,
      wordCount: note.text.split(/\s+/).filter(w => w.length > 0).length,
    }));

    const longestNote = notesWithLength.reduce((max, note) =>
      note.wordCount > max.wordCount ? note : max
    );

    const shortestNote = notesWithLength.reduce((min, note) =>
      note.wordCount < min.wordCount ? note : min
    );

    return {
      totalNotes: notes.length,
      totalWords,
      avgLength,
      uniqueTags: tagCounts.size,
      tagsDistribution,
      monthlyDistribution,
      weekdayDistribution,
      longestNote,
      shortestNote,
    };
  }, [notes]);

  const getBarHeight = (count: number, max: number) => {
    return Math.max((count / max) * 100, 5);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" aria-hidden="true" />
          Tableau de bord analytique
        </CardTitle>
        <CardDescription>
          Vue d'ensemble complète de votre activité d'écriture
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="tags">Tags</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg border bg-card/50">
                <div className="text-2xl font-bold">{analytics.totalNotes}</div>
                <div className="text-xs text-muted-foreground">Notes totales</div>
              </div>
              <div className="p-4 rounded-lg border bg-card/50">
                <div className="text-2xl font-bold">{analytics.totalWords.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Mots écrits</div>
              </div>
              <div className="p-4 rounded-lg border bg-card/50">
                <div className="text-2xl font-bold">{Math.round(analytics.avgLength)}</div>
                <div className="text-xs text-muted-foreground">Mots/note</div>
              </div>
              <div className="p-4 rounded-lg border bg-card/50">
                <div className="text-2xl font-bold">{analytics.uniqueTags}</div>
                <div className="text-xs text-muted-foreground">Tags uniques</div>
              </div>
            </div>

            {analytics.longestNote && analytics.shortestNote && (
              <div className="space-y-3">
                <div className="p-4 rounded-lg border bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" aria-hidden="true" />
                    <h4 className="font-medium text-sm">Note la plus longue</h4>
                    <Badge variant="secondary">{analytics.longestNote.wordCount} mots</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {analytics.longestNote.text}
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-blue-600 rotate-180" aria-hidden="true" />
                    <h4 className="font-medium text-sm">Note la plus courte</h4>
                    <Badge variant="secondary">{analytics.shortestNote.wordCount} mots</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {analytics.shortestNote.text}
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Tags */}
          <TabsContent value="tags" className="space-y-4">
            <h3 className="font-medium text-sm flex items-center gap-2">
              <PieChart className="h-4 w-4" aria-hidden="true" />
              Top 10 des tags les plus utilisés
            </h3>
            {analytics.tagsDistribution.length > 0 ? (
              <div className="space-y-2">
                {analytics.tagsDistribution.map((item, index) => {
                  const max = analytics.tagsDistribution[0].count;
                  const percentage = (item.count / max) * 100;

                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">#{item.tag}</span>
                        <span className="text-muted-foreground">{item.count} fois</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucun tag utilisé
              </p>
            )}
          </TabsContent>

          {/* Timeline */}
          <TabsContent value="timeline" className="space-y-4">
            <h3 className="font-medium text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              Évolution sur 12 mois
            </h3>
            <div className="h-64 flex items-end justify-between gap-2">
              {analytics.monthlyDistribution.map((item, index) => {
                const maxCount = Math.max(...analytics.monthlyDistribution.map(d => d.count), 1);
                const height = getBarHeight(item.count, maxCount);

                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex-1 flex items-end">
                      <div
                        className="w-full bg-primary rounded-t transition-all hover:bg-primary/80"
                        style={{ height: `${height}%` }}
                        title={`${item.month}: ${item.count} notes`}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">{item.month}</div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Patterns */}
          <TabsContent value="patterns" className="space-y-4">
            <h3 className="font-medium text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" aria-hidden="true" />
              Distribution par jour de la semaine
            </h3>
            <div className="space-y-2">
              {analytics.weekdayDistribution.map((item, index) => {
                const maxCount = Math.max(...analytics.weekdayDistribution.map(d => d.count), 1);
                const percentage = (item.count / maxCount) * 100;

                return (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium w-12">{item.day}</span>
                      <span className="text-muted-foreground">{item.count} notes</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
});

JournalAnalyticsDashboard.displayName = 'JournalAnalyticsDashboard';
