import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Activity, ArrowUpRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import {
  EmotionScanHistoryEntry,
  deriveScore10,
  getEmotionScanHistory,
} from '@/services/emotionScan.service';
import { cn } from '@/lib/utils';

interface RecentEmotionScansWidgetProps {
  className?: string;
}

const HISTORY_LIMIT = 10;

function formatDate(value: string): string {
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

function formatMood(label: string | null): string {
  if (!label) return 'Humeur inconnue';
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export default function RecentEmotionScansWidget({ className }: RecentEmotionScansWidgetProps) {
  const { user } = useAuth();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['recent-scans', user?.id],
    queryFn: () => getEmotionScanHistory(user!.id, HISTORY_LIMIT),
    enabled: Boolean(user?.id),
    staleTime: 60_000,
  });

  const entries = React.useMemo<EmotionScanHistoryEntry[]>(
    () => (user?.id ? data ?? [] : []),
    [data, user?.id],
  );

  const latest = entries[0];
  const previous = entries[1];
  const delta = latest && previous ? latest.normalizedBalance - previous.normalizedBalance : null;

  const averageBalance = entries.length
    ? entries.reduce((total, entry) => total + entry.normalizedBalance, 0) / entries.length
    : 0;
  const averageScore = deriveScore10(averageBalance);
  const confidenceAverage = entries.length
    ? Math.round(entries.reduce((total, entry) => total + entry.confidence, 0) / entries.length)
    : 0;

  return (
    <Card className={cn('shadow-sm', className)} data-testid="recent-scans-card">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Derniers scans émotionnels</CardTitle>
            <CardDescription>Vos {HISTORY_LIMIT} dernières analyses et leur évolution</CardDescription>
          </div>
          {latest ? (
            <div className="text-right">
              <Badge variant="outline" className="text-xs" aria-label="Score émotionnel le plus récent">
                {deriveScore10(latest.normalizedBalance).toFixed(1)}/10
              </Badge>
              {delta !== null && (
                <p
                  className={cn(
                    'mt-1 text-xs font-medium',
                    delta >= 0 ? 'text-emerald-500' : 'text-rose-500',
                  )}
                >
                  {delta >= 0 ? '+' : ''}{Math.round(delta)} pts
                </p>
              )}
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!user?.id ? (
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Connectez-vous pour retrouver vos analyses Emotion Scan récentes.</p>
            <Button variant="outline" asChild>
              <Link to="/login?redirect=/modules/emotion-scan">Se connecter</Link>
            </Button>
          </div>
        ) : isLoading ? (
          <div className="space-y-4" aria-live="polite">
            <Skeleton className="h-5 w-56" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-3 w-full" />
          </div>
        ) : isError ? (
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Impossible de charger l'historique des scans. Merci de réessayer.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Réessayer
            </Button>
          </div>
        ) : entries.length === 0 ? (
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Aucun scan enregistré pour le moment. Lancez un scan pour alimenter votre tableau de bord.</p>
            <Button asChild>
              <Link to="/modules/emotion-scan" className="inline-flex items-center gap-1">
                <Activity className="h-4 w-4" /> Lancer un Emotion Scan
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <section aria-label="Synthèse du dernier scan" className="rounded-lg border bg-muted/40 p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Dernier scan</p>
                  <p className="text-lg font-semibold capitalize">{formatMood(latest.mood)}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(latest.createdAt)}</p>
                </div>
                <div className="w-full max-w-[200px]">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Équilibre</span>
                    <span>{Math.round(latest.normalizedBalance)} / 100</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-muted" role="presentation">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.min(100, Math.max(0, latest.normalizedBalance))}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Confiance IA : {latest.confidence}%</p>
                </div>
              </div>
              {latest.insights.length > 0 && (
                <p className="mt-3 text-sm italic text-muted-foreground">
                  « {latest.insights[0]} »
                </p>
              )}
            </section>

            <section aria-label="Tendance globale" className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border bg-background p-4">
                <p className="text-sm text-muted-foreground">Score moyen (10 scans)</p>
                <p className="text-2xl font-semibold">{averageScore.toFixed(1)}/10</p>
              </div>
              <div className="rounded-lg border bg-background p-4">
                <p className="text-sm text-muted-foreground">Confiance moyenne</p>
                <p className="text-2xl font-semibold">{confidenceAverage}%</p>
              </div>
            </section>

            <section aria-label="Historique chronologique" className="relative">
              <span className="absolute left-2 top-3 bottom-2 w-px bg-border" aria-hidden />
              <ol className="space-y-4">
                {entries.slice(0, HISTORY_LIMIT).map((entry) => (
                  <li
                    key={entry.id}
                    className="relative rounded-lg border bg-background/70 p-4 pl-8"
                    data-testid="recent-scan-entry"
                  >
                    <span className="absolute left-1 top-5 h-2 w-2 -translate-x-1/2 rounded-full bg-primary" aria-hidden />
                    <div className="flex items-baseline justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium">{formatDate(entry.createdAt)}</p>
                        <p className="text-xs text-muted-foreground capitalize">{formatMood(entry.mood)}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs" aria-label="Score émotionnel">
                        {deriveScore10(entry.normalizedBalance).toFixed(1)}/10
                      </Badge>
                    </div>
                    {entry.summary && (
                      <p className="mt-2 text-xs text-muted-foreground">{entry.summary}</p>
                    )}
                    {entry.insights.length > 0 && (
                      <p className="mt-1 text-xs italic text-muted-foreground">
                        « {entry.insights[0]} »
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </section>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/modules/emotion-scan" className="inline-flex items-center gap-1">
                  Relancer un scan
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground">
                Historique mis à jour toutes les minutes.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
