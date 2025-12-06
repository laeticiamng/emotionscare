import { memo, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Clock, Hash, TrendingUp } from 'lucide-react';
import type { SanitizedNote } from '@/modules/journal/types';

interface JournalPersonalStatsProps {
  notes: SanitizedNote[];
}

export const JournalPersonalStats = memo<JournalPersonalStatsProps>(({ notes }) => {
  const stats = useMemo(() => {
    if (notes.length === 0) {
      return {
        totalNotes: 0,
        totalWords: 0,
        avgLength: 0,
        uniqueTags: 0,
        favoriteTag: null,
        mostProductiveDay: null,
        avgNotesPerDay: 0,
      };
    }

    const totalWords = notes.reduce((sum, note) => sum + note.text.split(/\s+/).filter(w => w).length, 0);
    const avgLength = Math.round(totalWords / notes.length);

    const allTags = notes.flatMap(n => n.tags);
    const uniqueTags = new Set(allTags).size;
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const favoriteTag = Object.keys(tagCounts).length > 0
      ? Object.entries(tagCounts).sort(([, a], [, b]) => b - a)[0][0]
      : null;

    const dayOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const dayCounts = notes.reduce((acc, note) => {
      const day = dayOfWeek[new Date(note.created_at).getDay()];
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const mostProductiveDay = Object.keys(dayCounts).length > 0
      ? Object.entries(dayCounts).sort(([, a], [, b]) => b - a)[0][0]
      : null;

    const dates = notes.map(n => new Date(n.created_at).toDateString());
    const uniqueDates = new Set(dates).size;
    const avgNotesPerDay = uniqueDates > 0 ? (notes.length / uniqueDates).toFixed(1) : '0';

    return {
      totalNotes: notes.length,
      totalWords,
      avgLength,
      uniqueTags,
      favoriteTag,
      mostProductiveDay,
      avgNotesPerDay,
    };
  }, [notes]);

  const statItems = [
    {
      label: 'Notes écrites',
      value: stats.totalNotes,
      icon: BarChart3,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Mots totaux',
      value: stats.totalWords.toLocaleString(),
      icon: TrendingUp,
      color: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Longueur moyenne',
      value: `${stats.avgLength} mots`,
      icon: Clock,
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      label: 'Tags uniques',
      value: stats.uniqueTags,
      icon: Hash,
      color: 'text-orange-600 dark:text-orange-400',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Statistiques personnelles
        </CardTitle>
        <CardDescription>
          Vos métriques d'écriture en un coup d'œil
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {statItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="space-y-2 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${item.color}`} />
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </div>
                <div className="text-2xl font-bold">{item.value}</div>
              </div>
            );
          })}
        </div>

        {notes.length > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="text-sm font-semibold text-muted-foreground">Insights</h4>
            
            <div className="space-y-2">
              {stats.favoriteTag && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tag préféré</span>
                  <span className="font-medium">#{stats.favoriteTag}</span>
                </div>
              )}
              
              {stats.mostProductiveDay && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Jour le plus productif</span>
                  <span className="font-medium">{stats.mostProductiveDay}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Notes par jour (moy.)</span>
                <span className="font-medium">{stats.avgNotesPerDay}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

JournalPersonalStats.displayName = 'JournalPersonalStats';
