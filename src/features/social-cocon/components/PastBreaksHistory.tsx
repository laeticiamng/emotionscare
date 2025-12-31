import React, { memo } from 'react';
import { History, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { usePastBreaks } from '../hooks/usePastBreaks';

export interface PastBreaksHistoryProps {
  limit?: number;
}

const formatBreakDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const PastBreaksHistory: React.FC<PastBreaksHistoryProps> = memo(({ limit = 5 }) => {
  const { pastBreaks, isLoading, error } = usePastBreaks({ limit, enabled: true });

  return (
    <Card className="border-slate-100">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-slate-500" aria-hidden="true" />
          <CardTitle className="text-base">Historique des pauses</CardTitle>
        </div>
        <CardDescription className="text-xs">
          Vos dernières pauses partagées.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2" aria-live="polite" aria-busy="true">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : error ? (
          <p className="text-sm text-muted-foreground">
            Impossible de charger l'historique.
          </p>
        ) : pastBreaks.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucune pause passée. Planifiez-en une pour commencer.
          </p>
        ) : (
          <ul className="space-y-2" aria-label="Liste des pauses passées">
            {pastBreaks.map((brk) => (
              <li
                key={brk.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  <span className="font-medium text-slate-800">
                    {formatBreakDate(brk.startsAt)}
                  </span>
                </div>
                <span className="text-muted-foreground">
                  {brk.durationMinutes} min
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
});

PastBreaksHistory.displayName = 'PastBreaksHistory';

export default PastBreaksHistory;
