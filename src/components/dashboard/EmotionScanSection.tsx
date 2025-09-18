import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Activity, ArrowRight, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkline } from '@/COMPONENTS.reg';
import {
  EmotionScanHistoryEntry,
  deriveScore10,
  getEmotionScanHistory,
} from '@/services/emotionScan.service';

interface EmotionScanSectionProps {
  userId?: string;
  className?: string;
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function formatRelative(value: string) {
  const date = new Date(value);
  const now = Date.now();
  const diffMinutes = Math.max(0, Math.round((now - date.getTime()) / (1000 * 60)));

  if (diffMinutes < 1) {
    return "à l'instant";
  }
  if (diffMinutes < 60) {
    return `il y a ${diffMinutes} min`;
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return `il y a ${diffHours} h`;
  }

  const diffDays = Math.round(diffHours / 24);
  return `il y a ${diffDays} j`;
}

const EmptyState = () => (
  <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed p-6 text-left" role="status">
    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
      <Activity className="h-4 w-4" aria-hidden="true" />
      Aucun scan enregistré pour le moment
    </div>
    <p className="text-sm text-muted-foreground">
      Lancez un premier Emotion Scan pour commencer à suivre votre équilibre émotionnel.
    </p>
    <Button asChild size="sm">
      <Link to="/app/scan">Commencer un scan</Link>
    </Button>
  </div>
);

function TimelineSkeleton() {
  return (
    <div className="space-y-4" aria-hidden="true">
      <Skeleton className="h-16 w-full" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

function LatestScan({ entry }: { entry: EmotionScanHistoryEntry }) {
  const score10 = deriveScore10(entry.normalizedBalance).toFixed(1);

  return (
    <div className="rounded-lg border bg-muted/40 p-4" data-testid="emotion-scan-latest">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" aria-hidden="true" />
          <span>{formatRelative(entry.createdAt)}</span>
        </div>
        <Badge variant="secondary" className="capitalize" aria-label={`Humeur dominante ${entry.mood ?? 'indéterminée'}`}>
          {entry.mood ?? 'Indéterminé'}
        </Badge>
      </div>
      <div className="mt-3 flex flex-wrap items-baseline gap-3">
        <p className="text-3xl font-semibold" aria-label={`Score émotionnel ${score10} sur 10`}>
          {score10}
          <span className="text-base text-muted-foreground">/10</span>
        </p>
        <span className="text-sm text-muted-foreground">Confiance {Math.round(entry.confidence)}%</span>
      </div>
      {entry.summary && (
        <p className="mt-3 text-sm text-muted-foreground">
          {entry.summary}
        </p>
      )}
    </div>
  );
}

function Timeline({ entries }: { entries: EmotionScanHistoryEntry[] }) {
  return (
    <ol
      className="relative space-y-4 border-l border-border pl-5"
      aria-label="Timeline des scans émotionnels"
      data-testid="emotion-scan-timeline"
    >
      {entries.map((entry) => {
        const score = deriveScore10(entry.normalizedBalance).toFixed(1);
        return (
          <li key={entry.id} className="relative pl-3" data-testid="emotion-scan-timeline-item">
            <span className="absolute -left-5 top-2 h-2.5 w-2.5 rounded-full border border-background bg-primary" aria-hidden="true" />
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-medium">
              <span>{formatDate(entry.createdAt)}</span>
              <span>{score}/10</span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="capitalize">
                {entry.mood ?? 'Indéterminé'}
              </Badge>
              {entry.insights[0] && (
                <span className="text-xs text-muted-foreground">
                  {entry.insights[0]}
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

const EmotionScanSection: React.FC<EmotionScanSectionProps> = ({ userId, className }) => {
  const isAuthenticated = Boolean(userId);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['emotion-scan-history', userId],
    queryFn: () => getEmotionScanHistory(userId!, 12),
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });

  const history = React.useMemo(() => (data ?? []), [data]);
  const sparklineValues = React.useMemo(
    () => history.slice().reverse().map((entry) => entry.normalizedBalance),
    [history],
  );
  const timelineEntries = React.useMemo(() => history.slice(0, 6), [history]);
  const latestEntry = history[0];

  return (
    <Card className={className} data-testid="dashboard-emotion-scan">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold">Derniers scans émotionnels</CardTitle>
          <p className="text-sm text-muted-foreground">
            Visualisez l'évolution de votre équilibre émotionnel et revisitez vos derniers insights.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/app/scan" className="inline-flex items-center gap-1">
            Nouveau scan
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isAuthenticated && (
          <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
            Connectez-vous pour synchroniser vos résultats Emotion Scan avec le dashboard.
          </div>
        )}

        {isAuthenticated && isLoading && <TimelineSkeleton />}

        {isAuthenticated && isError && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive" role="alert">
            Impossible de récupérer votre historique de scans pour le moment.
          </div>
        )}

        {isAuthenticated && !isLoading && !isError && history.length === 0 && <EmptyState />}

        {isAuthenticated && !isLoading && !isError && history.length > 0 && (
          <div className="space-y-6">
            {latestEntry && <LatestScan entry={latestEntry} />}

            {sparklineValues.length > 1 && (
              <div className="rounded-lg border bg-muted/30 p-4" role="presentation">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Tendance des 12 derniers scans</span>
                  <span>{sparklineValues[sparklineValues.length - 1].toFixed(0)} / 100</span>
                </div>
                <div className="mt-3 overflow-x-auto">
                  <Sparkline values={sparklineValues} width={Math.max(240, sparklineValues.length * 28)} height={64} />
                </div>
              </div>
            )}

            {timelineEntries.length > 0 && <Timeline entries={timelineEntries} />}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionScanSection;
