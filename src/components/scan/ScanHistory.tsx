// @ts-nocheck
import React, { useState } from 'react';
import { Clock, TrendingUp, Activity, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useScanHistory } from '@/hooks/useScanHistory';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { scanAnalytics } from '@/lib/analytics/scanEvents';

const getEmotionColor = (valence: number, arousal: number) => {
  if (valence > 60 && arousal > 60) return 'text-green-500';
  if (valence > 60 && arousal <= 60) return 'text-blue-500';
  if (valence <= 40 && arousal > 60) return 'text-orange-500';
  return 'text-slate-500';
};

const getEmotionLabel = (valence: number, arousal: number) => {
  if (valence > 60 && arousal > 60) return 'Énergique et positif';
  if (valence > 60 && arousal <= 60) return 'Calme et serein';
  if (valence <= 40 && arousal > 60) return 'Tension ressentie';
  if (valence <= 40 && arousal <= 60) return 'Apaisement recherché';
  return 'État neutre';
};

const getSourceLabel = (source: string) => {
  switch (source) {
    case 'scan_camera':
      return '(Vidéo)';
    case 'SAM':
      return '(Texte)';
    case 'scan_sliders':
      return '(Manuel)';
    case 'voice':
      return '(Vocal)';
    default:
      return '';
  }
};

export const ScanHistory: React.FC = () => {
  const [limit, setLimit] = useState(3);
  const { data: history, isLoading } = useScanHistory(limit);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpanded = () => {
    if (!isExpanded) {
      setLimit(10);
      scanAnalytics.historyViewed(history?.length || 0);
    } else {
      setLimit(3);
    }
    setIsExpanded(!isExpanded);
  };

  // Show skeleton longer to prevent flash
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!history || history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Historique récent
          </CardTitle>
          <CardDescription>
            Vos 3 derniers scans apparaîtront ici
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-6">
            Aucun scan enregistré pour le moment
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Historique récent
            </CardTitle>
            <CardDescription>
              {isExpanded ? 'Vos 10 derniers états émotionnels' : 'Vos 3 derniers états émotionnels'}
            </CardDescription>
          </div>
          {history && history.length > 3 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleExpanded}
              className="gap-1"
            >
              {isExpanded ? 'Voir moins' : 'Voir plus'}
              <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
      {history.map((scan, index) => {
        const emotionColor = getEmotionColor(scan.valence, scan.arousal);
        const emotionLabel = getEmotionLabel(scan.valence, scan.arousal);
        const sourceLabel = getSourceLabel(scan.source);
        const timeAgo = formatDistanceToNow(new Date(scan.created_at), {
          addSuffix: true,
          locale: fr,
        });

        return (
          <div
            key={scan.id}
            className="flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-accent/5"
          >
            <div className={`flex-shrink-0 ${emotionColor}`}>
              {index === 0 ? (
                <TrendingUp className="h-5 w-5" />
              ) : (
                <Activity className="h-5 w-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${emotionColor}`}>
                {emotionLabel} <span className="text-xs text-muted-foreground font-normal">{sourceLabel}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {timeAgo}
                {scan.summary && ` · ${scan.summary}`}
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              <div className="text-xs text-muted-foreground">
                V:{Math.round(scan.valence)} A:{Math.round(scan.arousal)}
              </div>
            </div>
          </div>
        );
      })}
    </CardContent>
  </Card>
  );
};
