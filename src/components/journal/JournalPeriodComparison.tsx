import { memo, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Calendar, FileText, Hash, Activity } from 'lucide-react';
import type { SanitizedNote } from '@/modules/journal/types';
import { format, parseISO, startOfMonth, endOfMonth, subMonths, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';

interface JournalPeriodComparisonProps {
  notes: SanitizedNote[];
  className?: string;
}

interface PeriodStats {
  notesCount: number;
  totalWords: number;
  avgLength: number;
  uniqueTags: number;
  activeDays: number;
}

/**
 * Composant de comparaison entre deux périodes
 * Compare le mois en cours avec le mois précédent
 */
export const JournalPeriodComparison = memo<JournalPeriodComparisonProps>(({ notes, className = '' }) => {
  const { currentPeriod, previousPeriod, comparison } = useMemo(() => {
    const now = new Date();
    const currentStart = startOfMonth(now);
    const currentEnd = endOfMonth(now);
    
    const prevStart = startOfMonth(subMonths(now, 1));
    const prevEnd = endOfMonth(subMonths(now, 1));

    const calculateStats = (start: Date, end: Date): PeriodStats => {
      const periodNotes = notes.filter(note => {
        const noteDate = parseISO(note.created_at);
        return isWithinInterval(noteDate, { start, end });
      });

      const totalWords = periodNotes.reduce((sum, note) => {
        return sum + note.text.split(/\s+/).filter(w => w.length > 0).length;
      }, 0);

      const uniqueTags = new Set(periodNotes.flatMap(note => note.tags)).size;

      const activeDaysSet = new Set(
        periodNotes.map(note => format(parseISO(note.created_at), 'yyyy-MM-dd'))
      );

      return {
        notesCount: periodNotes.length,
        totalWords,
        avgLength: periodNotes.length > 0 ? totalWords / periodNotes.length : 0,
        uniqueTags,
        activeDays: activeDaysSet.size,
      };
    };

    const currentStats = calculateStats(currentStart, currentEnd);
    const previousStats = calculateStats(prevStart, prevEnd);

    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    return {
      currentPeriod: {
        label: format(now, 'MMMM yyyy', { locale: fr }),
        stats: currentStats,
      },
      previousPeriod: {
        label: format(subMonths(now, 1), 'MMMM yyyy', { locale: fr }),
        stats: previousStats,
      },
      comparison: {
        notesChange: calculateChange(currentStats.notesCount, previousStats.notesCount),
        wordsChange: calculateChange(currentStats.totalWords, previousStats.totalWords),
        avgLengthChange: calculateChange(currentStats.avgLength, previousStats.avgLength),
        tagsChange: calculateChange(currentStats.uniqueTags, previousStats.uniqueTags),
        activeDaysChange: calculateChange(currentStats.activeDays, previousStats.activeDays),
      },
    };
  }, [notes]);

  const getTrendIcon = (change: number) => {
    if (change > 5) return TrendingUp;
    if (change < -5) return TrendingDown;
    return Minus;
  };

  const getTrendColor = (change: number) => {
    if (change > 5) return 'text-green-600 dark:text-green-400';
    if (change < -5) return 'text-red-600 dark:text-red-400';
    return 'text-muted-foreground';
  };

  const formatChange = (change: number) => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  const metrics = [
    {
      label: 'Notes écrites',
      icon: FileText,
      current: currentPeriod.stats.notesCount,
      previous: previousPeriod.stats.notesCount,
      change: comparison.notesChange,
    },
    {
      label: 'Mots écrits',
      icon: Activity,
      current: currentPeriod.stats.totalWords,
      previous: previousPeriod.stats.totalWords,
      change: comparison.wordsChange,
    },
    {
      label: 'Longueur moyenne',
      icon: FileText,
      current: Math.round(currentPeriod.stats.avgLength),
      previous: Math.round(previousPeriod.stats.avgLength),
      change: comparison.avgLengthChange,
      suffix: ' mots',
    },
    {
      label: 'Tags uniques',
      icon: Hash,
      current: currentPeriod.stats.uniqueTags,
      previous: previousPeriod.stats.uniqueTags,
      change: comparison.tagsChange,
    },
    {
      label: 'Jours actifs',
      icon: Calendar,
      current: currentPeriod.stats.activeDays,
      previous: previousPeriod.stats.activeDays,
      change: comparison.activeDaysChange,
    },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" aria-hidden="true" />
              Comparaison des périodes
            </CardTitle>
            <CardDescription>
              {currentPeriod.label} vs {previousPeriod.label}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric, index) => {
            const TrendIcon = getTrendIcon(metric.change);
            const trendColor = getTrendColor(metric.change);
            const MetricIcon = metric.icon;

            return (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border bg-card/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 p-2 rounded-lg bg-muted">
                    <MetricIcon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{metric.label}</div>
                    <div className="text-xs text-muted-foreground">
                      Précédent : {metric.previous}{metric.suffix || ''}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {metric.current}{metric.suffix || ''}
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
                      <TrendIcon className="h-3 w-3" aria-hidden="true" />
                      <span>{formatChange(metric.change)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Résumé */}
        <div className="mt-6 p-4 rounded-lg bg-muted/50">
          <h4 className="font-medium text-sm mb-2">📊 Résumé</h4>
          <p className="text-sm text-muted-foreground">
            {comparison.notesChange > 10 && (
              <>Excellente progression ! Vous écrivez beaucoup plus ce mois-ci. </>
            )}
            {comparison.notesChange < -10 && (
              <>Votre activité a diminué ce mois-ci. Prenez un moment pour vous reconnecter. </>
            )}
            {Math.abs(comparison.notesChange) <= 10 && (
              <>Votre rythme d'écriture reste stable. </>
            )}
            {comparison.activeDaysChange > 20 && (
              <>Votre constance s'améliore nettement. </>
            )}
            {comparison.avgLengthChange > 20 && (
              <>Vos notes sont plus détaillées qu'avant. </>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
});

JournalPeriodComparison.displayName = 'JournalPeriodComparison';
