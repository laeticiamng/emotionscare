import { memo, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, TrendingDown, Activity, Calendar, Hash } from 'lucide-react';
import type { SanitizedNote } from '@/modules/journal/types';
import { parseISO, startOfWeek, endOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';

interface JournalAIInsightsProps {
  notes: SanitizedNote[];
  className?: string;
}

interface Insight {
  type: 'trend' | 'pattern' | 'recommendation';
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  severity: 'info' | 'success' | 'warning';
}

/**
 * Composant d'insights IA pour le journal
 * Analyse les patterns et tendances dans les notes
 */
export const JournalAIInsights = memo<JournalAIInsightsProps>(({ notes, className = '' }) => {
  const insights = useMemo<Insight[]>(() => {
    if (notes.length === 0) return [];

    const results: Insight[] = [];
    const now = new Date();
    const recentNotes = notes.filter(note => {
      const noteDate = parseISO(note.created_at);
      const daysDiff = Math.floor((now.getTime() - noteDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff <= 30;
    });

    // Analyser la fréquence d'écriture
    const weekStart = startOfWeek(now, { locale: fr });
    const weekEnd = endOfWeek(now, { locale: fr });
    const thisWeekNotes = notes.filter(note => {
      const noteDate = parseISO(note.created_at);
      return noteDate >= weekStart && noteDate <= weekEnd;
    });

    if (thisWeekNotes.length >= 5) {
      results.push({
        type: 'trend',
        title: 'Écriture régulière',
        description: `Vous avez écrit ${thisWeekNotes.length} notes cette semaine. Excellente constance !`,
        icon: TrendingUp,
        severity: 'success',
      });
    } else if (thisWeekNotes.length <= 1 && notes.length > 10) {
      results.push({
        type: 'recommendation',
        title: 'Activité en baisse',
        description: 'Votre fréquence d\'écriture a diminué cette semaine. Prenez un moment pour vous reconnecter.',
        icon: TrendingDown,
        severity: 'warning',
      });
    }

    // Analyser les patterns de tags
    const tagFrequency = new Map<string, number>();
    recentNotes.forEach(note => {
      note.tags.forEach(tag => {
        tagFrequency.set(tag, (tagFrequency.get(tag) || 0) + 1);
      });
    });

    const sortedTags = Array.from(tagFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    if (sortedTags.length > 0) {
      const topTag = sortedTags[0];
      results.push({
        type: 'pattern',
        title: 'Thème récurrent',
        description: `Le tag "${topTag[0]}" apparaît ${topTag[1]} fois dans vos notes récentes. C'est un sujet important pour vous.`,
        icon: Hash,
        severity: 'info',
      });
    }

    // Analyser la longueur des notes
    const avgLength = recentNotes.reduce((sum, note) => sum + note.text.length, 0) / recentNotes.length;
    const lastWeekNotes = recentNotes.slice(0, 7);
    const lastWeekAvg = lastWeekNotes.length > 0
      ? lastWeekNotes.reduce((sum, note) => sum + note.text.length, 0) / lastWeekNotes.length
      : avgLength;

    if (lastWeekAvg > avgLength * 1.3) {
      results.push({
        type: 'trend',
        title: 'Notes plus détaillées',
        description: 'Vos notes récentes sont plus longues que d\'habitude. Vous prenez plus de temps pour vous exprimer.',
        icon: Activity,
        severity: 'success',
      });
    }

    // Analyser les jours préférés
    const dayFrequency = new Map<number, number>();
    recentNotes.forEach(note => {
      const day = parseISO(note.created_at).getDay();
      dayFrequency.set(day, (dayFrequency.get(day) || 0) + 1);
    });

    const mostFrequentDay = Array.from(dayFrequency.entries())
      .sort((a, b) => b[1] - a[1])[0];

    if (mostFrequentDay && mostFrequentDay[1] >= 3) {
      const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
      results.push({
        type: 'pattern',
        title: 'Jour d\'écriture préféré',
        description: `Vous écrivez souvent le ${dayNames[mostFrequentDay[0]]}. C'est votre moment de réflexion.`,
        icon: Calendar,
        severity: 'info',
      });
    }

    // Recommandations basées sur l'activité
    if (notes.length >= 20 && results.length < 3) {
      results.push({
        type: 'recommendation',
        title: 'Explorer vos notes',
        description: 'Vous avez accumulé beaucoup de contenu. Relisez vos anciennes notes pour observer votre évolution.',
        icon: Sparkles,
        severity: 'info',
      });
    }

    return results;
  }, [notes]);

  const getIconColor = (severity: Insight['severity']) => {
    switch (severity) {
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
        return 'text-orange-600 dark:text-orange-400';
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  const getBadgeVariant = (type: Insight['type']) => {
    switch (type) {
      case 'trend':
        return 'default';
      case 'pattern':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (insights.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
            Insights IA
          </CardTitle>
          <CardDescription>
            Analyses et recommandations personnalisées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Continuez à écrire pour obtenir des insights personnalisés sur vos habitudes et patterns.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" aria-hidden="true" />
          Insights IA
        </CardTitle>
        <CardDescription>
          Analyses et recommandations personnalisées
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div
                key={index}
                className="flex gap-3 p-4 rounded-lg border bg-card/50"
              >
                <div className={`flex-shrink-0 ${getIconColor(insight.severity)}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <Badge variant={getBadgeVariant(insight.type)} className="text-xs">
                      {insight.type === 'trend' && 'Tendance'}
                      {insight.type === 'pattern' && 'Pattern'}
                      {insight.type === 'recommendation' && 'Conseil'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {insight.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
});

JournalAIInsights.displayName = 'JournalAIInsights';
