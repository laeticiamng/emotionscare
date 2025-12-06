import { useState, useEffect, useMemo } from 'react';
import { logger } from '@/lib/logger';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Download,
  FileText,
  Sheet,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface WeeklyStats {
  sessions: number;
  sessionsChange: number;
  goalsAchieved: number;
  totalGoals: number;
  goalsChange: number;
  avgSessionTime: number;
  sessionTimeChange: number;
  wellnessScore: number;
  wellnessScoreChange: number;
}

interface DailyActivity {
  date: string;
  sessions: number;
  duration: number;
  wellnessScore: number;
}

export default function WeeklyReportPage() {
  const [loading, setLoading] = useState(false);

  // Calculate current week date range
  const { startDate, endDate, weekDates } = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Monday as start of week

    const start = new Date(today);
    start.setDate(today.getDate() + diff);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    // Generate dates for each day of the week
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }

    return { startDate: start, endDate: end, weekDates: dates };
  }, []);

  // Format date range for display
  const dateRangeText = useMemo(() => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };
    return `Semaine du ${startDate.toLocaleDateString('fr-FR', options)} au ${endDate.toLocaleDateString('fr-FR', options)}`;
  }, [startDate, endDate]);

  // Generate mock data based on current week
  const stats: WeeklyStats = useMemo(() => {
    // Use current date as seed for consistent but varied data
    const seed = startDate.getTime() % 100;
    return {
      sessions: 10 + (seed % 8),
      sessionsChange: -10 + (seed % 30),
      goalsAchieved: 6 + (seed % 4),
      totalGoals: 10,
      goalsChange: -2 + (seed % 5),
      avgSessionTime: 20 + (seed % 15),
      sessionTimeChange: -8 + (seed % 15),
      wellnessScore: 7.5 + (seed % 15) / 10,
      wellnessScoreChange: -0.5 + (seed % 15) / 10,
    };
  }, [startDate]);

  const dailyActivities: DailyActivity[] = useMemo(() => {
    return weekDates.map((date, index) => {
      const seed = (date.getTime() % 100) + index;
      return {
        date: date.toLocaleDateString('fr-FR', {
          weekday: 'long',
          day: 'numeric',
          month: 'short',
        }),
        sessions: Math.floor(1 + (seed % 3)),
        duration: Math.floor(15 + (seed % 30)),
        wellnessScore: 6 + (seed % 4) + Math.random(),
      };
    });
  }, [weekDates]);

  // Generate summary text
  const summaryText = useMemo(() => {
    const trend =
      stats.sessionsChange >= 0
        ? 'augmenté'
        : 'diminué';
    const sessionTrend = Math.abs(stats.sessionsChange);
    const scoreTrend =
      stats.wellnessScoreChange >= 0
        ? 'progressé'
        : 'diminué';

    return `Cette semaine, vous avez ${trend} votre activité de ${sessionTrend}% avec ${stats.sessions} sessions complétées. Vous avez atteint ${stats.goalsAchieved} de vos ${stats.totalGoals} objectifs hebdomadaires. Votre score de bien-être a ${scoreTrend} de ${Math.abs(stats.wellnessScoreChange).toFixed(1)} point pour atteindre ${stats.wellnessScore.toFixed(1)}/10. ${stats.wellnessScore >= 8 ? 'Excellent travail !' : 'Continuez vos efforts !'}`;
  }, [stats]);

  const downloadCSV = () => {
    setLoading(true);

    try {
      // Prepare CSV content
      const headers = ['Métrique', 'Valeur', 'Variation'];
      const rows = [
        ['Sessions', stats.sessions.toString(), `${stats.sessionsChange > 0 ? '+' : ''}${stats.sessionsChange}%`],
        [
          'Objectifs atteints',
          `${stats.goalsAchieved}/${stats.totalGoals}`,
          `${stats.goalsChange > 0 ? '+' : ''}${stats.goalsChange}`,
        ],
        [
          'Temps moyen/session',
          `${stats.avgSessionTime}min`,
          `${stats.sessionTimeChange > 0 ? '+' : ''}${stats.sessionTimeChange}min`,
        ],
        [
          'Score bien-être',
          `${stats.wellnessScore.toFixed(1)}/10`,
          `${stats.wellnessScoreChange > 0 ? '+' : ''}${stats.wellnessScoreChange.toFixed(1)}`,
        ],
      ];

      const csvContent = [
        `Rapport Hebdomadaire - ${dateRangeText}`,
        '',
        headers.join(','),
        ...rows.map((row) => row.join(',')),
        '',
        'Activités quotidiennes',
        'Date,Sessions,Durée (min),Score bien-être',
        ...dailyActivities.map(
          (activity) =>
            `${activity.date},${activity.sessions},${activity.duration},${activity.wellnessScore.toFixed(1)}`
        ),
        '',
        'Résumé',
        `"${summaryText}"`,
      ].join('\n');

      // Create blob and download
      const blob = new Blob(['\ufeff' + csvContent], {
        type: 'text/csv;charset=utf-8;',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rapport-hebdomadaire-${startDate.toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: 'Export réussi',
        description: 'Le rapport CSV a été téléchargé',
        variant: 'success',
      });
    } catch (error) {
      logger.error('Error exporting CSV', error instanceof Error ? error : new Error(String(error)), 'EXPORT');
      toast({
        title: 'Erreur',
        description: "Impossible d'exporter le rapport",
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    setLoading(true);

    try {
      // Create formatted text content (PDF-like)
      const content = [
        '═══════════════════════════════════════════════════════════',
        '                  RAPPORT HEBDOMADAIRE',
        `                  ${dateRangeText}`,
        '═══════════════════════════════════════════════════════════',
        '',
        'STATISTIQUES PRINCIPALES',
        '─────────────────────────────────────────────────────────',
        '',
        `Sessions complétées: ${stats.sessions}`,
        `Variation: ${stats.sessionsChange > 0 ? '+' : ''}${stats.sessionsChange}% vs semaine précédente`,
        '',
        `Objectifs atteints: ${stats.goalsAchieved}/${stats.totalGoals}`,
        `Variation: ${stats.goalsChange > 0 ? '+' : ''}${stats.goalsChange} vs semaine précédente`,
        '',
        `Temps moyen par session: ${stats.avgSessionTime} minutes`,
        `Variation: ${stats.sessionTimeChange > 0 ? '+' : ''}${stats.sessionTimeChange} minutes`,
        '',
        `Score bien-être: ${stats.wellnessScore.toFixed(1)}/10`,
        `Variation: ${stats.wellnessScoreChange > 0 ? '+' : ''}${stats.wellnessScoreChange.toFixed(1)} points`,
        '',
        'ACTIVITÉS QUOTIDIENNES',
        '─────────────────────────────────────────────────────────',
        '',
        ...dailyActivities.map(
          (activity) =>
            `${activity.date}\n  Sessions: ${activity.sessions} | Durée: ${activity.duration}min | Score: ${activity.wellnessScore.toFixed(1)}/10`
        ),
        '',
        'RÉSUMÉ',
        '─────────────────────────────────────────────────────────',
        '',
        summaryText,
        '',
        '═══════════════════════════════════════════════════════════',
        `Généré le ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
        '═══════════════════════════════════════════════════════════',
      ].join('\n');

      // Create blob and download
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rapport-hebdomadaire-${startDate.toISOString().split('T')[0]}.txt`;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: 'Export réussi',
        description: 'Le rapport a été téléchargé',
        variant: 'success',
      });
    } catch (error) {
      logger.error('Error exporting PDF', error instanceof Error ? error : new Error(String(error)), 'EXPORT');
      toast({
        title: 'Erreur',
        description: "Impossible d'exporter le rapport",
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Rapport Hebdomadaire</h1>
          <p className="text-muted-foreground">{dateRangeText}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={loading}>
              <Download className="h-4 w-4 mr-2" />
              {loading ? 'Téléchargement...' : 'Télécharger le rapport'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={downloadCSV}>
              <Sheet className="h-4 w-4 mr-2" />
              Exporter en CSV (Excel)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={downloadPDF}>
              <FileText className="h-4 w-4 mr-2" />
              Exporter en TXT (PDF)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Activity className="h-8 w-8 text-primary" />
            {stats.sessionsChange >= 0 ? (
              <TrendingUp className="h-5 w-5 text-green-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-orange-500" />
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Sessions</p>
            <p className="text-3xl font-bold">{stats.sessions}</p>
            <p
              className={`text-xs ${stats.sessionsChange >= 0 ? 'text-green-500' : 'text-orange-500'}`}
            >
              {stats.sessionsChange > 0 ? '+' : ''}
              {stats.sessionsChange}% vs semaine dernière
            </p>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Target className="h-8 w-8 text-primary" />
            {stats.goalsChange >= 0 ? (
              <TrendingUp className="h-5 w-5 text-green-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-orange-500" />
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Objectifs atteints</p>
            <p className="text-3xl font-bold">
              {stats.goalsAchieved}/{stats.totalGoals}
            </p>
            <p
              className={`text-xs ${stats.goalsChange >= 0 ? 'text-green-500' : 'text-orange-500'}`}
            >
              {stats.goalsChange > 0 ? '+' : ''}
              {stats.goalsChange} vs semaine dernière
            </p>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Activity className="h-8 w-8 text-primary" />
            {stats.sessionTimeChange >= 0 ? (
              <TrendingUp className="h-5 w-5 text-green-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-orange-500" />
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Temps moyen/session</p>
            <p className="text-3xl font-bold">{stats.avgSessionTime}min</p>
            <p
              className={`text-xs ${stats.sessionTimeChange >= 0 ? 'text-green-500' : 'text-orange-500'}`}
            >
              {stats.sessionTimeChange > 0 ? '+' : ''}
              {stats.sessionTimeChange}min vs semaine dernière
            </p>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Activity className="h-8 w-8 text-primary" />
            {stats.wellnessScoreChange >= 0 ? (
              <TrendingUp className="h-5 w-5 text-green-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-orange-500" />
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Score bien-être</p>
            <p className="text-3xl font-bold">{stats.wellnessScore.toFixed(1)}/10</p>
            <p
              className={`text-xs ${stats.wellnessScoreChange >= 0 ? 'text-green-500' : 'text-orange-500'}`}
            >
              {stats.wellnessScoreChange > 0 ? '+' : ''}
              {stats.wellnessScoreChange.toFixed(1)} vs semaine dernière
            </p>
          </div>
        </Card>
      </div>

      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-lg">Résumé de la semaine</h3>
        <p className="text-muted-foreground">{summaryText}</p>
      </Card>

      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-lg">Activités quotidiennes</h3>
        <div className="space-y-3">
          {dailyActivities.map((activity) => (
            <div
              key={activity.date}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
            >
              <div>
                <p className="font-medium">{activity.date}</p>
                <p className="text-sm text-muted-foreground">
                  {activity.sessions} session{activity.sessions > 1 ? 's' : ''} •{' '}
                  {activity.duration} minutes
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Score</p>
                <p className="font-semibold">{activity.wellnessScore.toFixed(1)}/10</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
