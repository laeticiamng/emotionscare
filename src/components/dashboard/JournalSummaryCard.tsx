import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { NotebookPen, Loader2, Tag, ArrowRight, Sparkles } from 'lucide-react';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { fetchJournalFeed, type JournalFeedEntry } from '@/services/journalFeed.service';

type JournalSummaryCardProps = {
  userId?: string;
};

const formatDateTime = (iso: string) => {
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
};

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

const computeTopTags = (entries: JournalFeedEntry[]) => {
  const counts = new Map<string, number>();
  entries.forEach((entry) => {
    entry.tags.forEach((tag) => {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    });
  });
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 3);
};

export const JournalSummaryCard: React.FC<JournalSummaryCardProps> = ({ userId }) => {
  const {
    data: entries = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['journal-feed-summary', userId],
    queryFn: fetchJournalFeed,
    enabled: Boolean(userId),
    staleTime: 60_000,
  });

  const latestEntry = entries[0];
  const { recentCount, uniqueTags, topTags } = useMemo(() => {
    const now = Date.now();
    const recent = entries.filter((entry) => now - new Date(entry.timestamp).getTime() <= THIRTY_DAYS).length;
    const tagSet = new Set<string>();
    entries.forEach((entry) => entry.tags.forEach((tag) => tagSet.add(tag)));
    return {
      recentCount: recent,
      uniqueTags: tagSet.size,
      topTags: computeTopTags(entries),
    };
  }, [entries]);

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <NotebookPen className="h-4 w-4 text-primary" aria-hidden="true" />
          <span>Journal récent</span>
        </CardTitle>
        <CardDescription>Un aperçu des dernières réflexions consignées.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!userId && (
          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            <p>Connectez-vous pour retrouver vos entrées et vos tags favoris.</p>
            <Button asChild size="sm">
              <Link to="/login">Se connecter</Link>
            </Button>
          </div>
        )}

        {userId && isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground" aria-live="polite">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span>Chargement du journal…</span>
          </div>
        )}

        {userId && isError && (
          <p role="alert" className="text-sm text-destructive">
            {(error as Error)?.message ?? 'Impossible de charger le résumé du journal.'}
          </p>
        )}

        {userId && !isLoading && !isError && !entries.length && (
          <div className="flex items-center gap-3 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            <span>Commencez une première entrée pour activer le suivi de vos émotions.</span>
          </div>
        )}

        {userId && latestEntry && (
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Dernière entrée</span>
                <time dateTime={latestEntry.timestamp}>{formatDateTime(latestEntry.timestamp)}</time>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground">
                {latestEntry.summary ?? latestEntry.text}
              </p>
              {latestEntry.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2" aria-label="Tags de la dernière entrée">
                  {latestEntry.tags.slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs uppercase tracking-wide">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-3 rounded-lg border p-4 sm:grid-cols-3">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Entrées (30 derniers jours)</p>
                <p className="text-lg font-semibold text-foreground">{recentCount}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Tags actifs</p>
                <p className="text-lg font-semibold text-foreground">{uniqueTags}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Top tags</p>
                <div className="flex flex-wrap gap-2">
                  {topTags.length ? (
                    topTags.map(([tag, count]) => (
                      <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs">
                        <Tag className="h-3 w-3" aria-hidden="true" />
                        <span>#{tag}</span>
                        <span className="text-muted-foreground">×{count}</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">Aucun tag récurrent</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 rounded-lg bg-muted/40 p-3 text-sm">
              <div className="text-muted-foreground">
                <p className="font-medium text-foreground">Poursuivre l'écriture</p>
                <p>Enrichissez votre progression émotionnelle quotidienne.</p>
              </div>
              <Button asChild size="sm" variant="secondary">
                <Link to="/app/journal" className="inline-flex items-center gap-1">
                  Ouvrir <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JournalSummaryCard;
