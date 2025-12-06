// @ts-nocheck
import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Loader2, MessageSquareQuote } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { listFeed } from '@/services/journal/journalApi';
import type { SanitizedNote } from '@/modules/journal/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const withinLastDays = (isoDate: string, days: number) => {
  const target = new Date(isoDate).getTime();
  if (Number.isNaN(target)) return false;
  const now = Date.now();
  return target >= now - days * 24 * 60 * 60 * 1000;
};

const computeTopTag = (entries: SanitizedNote[]): string | null => {
  const counts = new Map<string, number>();
  entries.forEach((entry) => {
    entry.tags.forEach((tag) => {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    });
  });
  let top: string | null = null;
  let topCount = 0;
  counts.forEach((value, key) => {
    if (value > topCount) {
      topCount = value;
      top = key;
    }
  });
  return top;
};

const formatRelative = (isoDate: string) => {
  try {
    return formatDistanceToNow(new Date(isoDate), { addSuffix: true, locale: fr });
  } catch {
    return '';
  }
};

export const JournalSummaryCard: React.FC = () => {
  const { user } = useAuth();
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ['journal', 'feed', user?.id, 'dashboard'],
    queryFn: () => listFeed({ limit: 10 }),
    enabled: Boolean(user?.id),
    staleTime: 60 * 1000,
  });

  const entries = (data ?? []) as SanitizedNote[];

  const stats = useMemo(() => {
    if (!entries.length) {
      return { lastWeek: 0, topTag: null as string | null };
    }
    return {
      lastWeek: entries.filter((entry) => withinLastDays(entry.created_at, 7)).length,
      topTag: computeTopTag(entries),
    };
  }, [entries]);

  return (
    <Card data-testid="journal-summary-card" role="complementary" aria-live="polite">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="h-5 w-5 text-primary" aria-hidden="true" />
          Journal émotionnel
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Suivez vos dernières réflexions et accédez rapidement à votre journal sécurisé.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {!user?.id ? (
          <div className="rounded border border-dashed p-4 text-sm text-muted-foreground" role="status">
            Connectez-vous pour visualiser votre historique de notes.
          </div>
        ) : null}

        {user?.id && isLoading ? (
          <div className="space-y-3" data-testid="journal-summary-loading">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        ) : null}

        {user?.id && isError ? (
          <div className="rounded border border-destructive/30 bg-destructive/10 p-4 text-sm" role="alert">
            Impossible de récupérer les dernières notes.
          </div>
        ) : null}

        {user?.id && !isLoading && !isError ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border bg-card p-3">
              <p className="text-xs text-muted-foreground uppercase">Notes sur 7 jours</p>
              <p className="text-2xl font-semibold">{stats.lastWeek}</p>
            </div>
            <div className="rounded-lg border bg-card p-3">
              <p className="text-xs text-muted-foreground uppercase">Hashtag le plus fréquent</p>
              <p className="text-2xl font-semibold">
                {stats.topTag ? (
                  <span className="flex items-center gap-1 text-sm font-medium">
                    <Badge variant="secondary">#{stats.topTag}</Badge>
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">Aucun</span>
                )}
              </p>
            </div>
          </div>
        ) : null}

        {user?.id && !isLoading && !isError ? (
          <div className="space-y-3" aria-label="Dernières notes">
            {entries.slice(0, 3).map((entry) => (
              <div
                key={entry.id}
                data-testid="journal-summary-entry"
                className="rounded border bg-background/80 p-3"
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="uppercase">
                    {entry.mode === 'voice' ? 'Vocale' : 'Texte'}
                  </span>
                  <span>{formatRelative(entry.created_at)}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-foreground">
                  {entry.summary || entry.text}
                </p>
                {entry.tags.length ? (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {entry.tags.slice(0, 3).map((tag) => (
                      <Badge key={`${entry.id}-${tag}`} variant="outline" className="text-[10px]">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            {entries.length === 0 ? (
              <div className="rounded border border-dashed p-4 text-sm text-muted-foreground">
                Aucune note enregistrée pour le moment.
              </div>
            ) : null}
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MessageSquareQuote className="h-4 w-4" aria-hidden="true" />
          Notes synchronisées en temps réel
        </div>
        <Button asChild variant="ghost" size="sm" data-testid="journal-summary-cta">
          <Link to="/app/journal">
            {isFetching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            Ouvrir
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JournalSummaryCard;
