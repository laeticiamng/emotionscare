import React from 'react';
import { X, Download, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useScanHistory } from '@/hooks/useScanHistory';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useToast } from '@/hooks/use-toast';

const getEmotionColor = (valence: number, arousal: number) => {
  if (valence > 60 && arousal > 60) return '#10b981';
  if (valence > 60 && arousal <= 60) return '#3b82f6';
  if (valence <= 40 && arousal > 60) return '#f97316';
  return '#64748b';
};

const getEmotionLabel = (valence: number, arousal: number) => {
  if (valence > 60 && arousal > 60) return 'Énergique et positif';
  if (valence > 60 && arousal <= 60) return 'Calme et serein';
  if (valence <= 40 && arousal > 60) return 'Tension ressentie';
  if (valence <= 40 && arousal <= 60) return 'Apaisement recherché';
  return 'État neutre';
};

interface ScanHistoryExpandedProps {
  open: boolean;
  onClose: () => void;
}

export const ScanHistoryExpanded: React.FC<ScanHistoryExpandedProps> = ({ open, onClose }) => {
  const { toast } = useToast();
  const { data: history, isLoading } = useScanHistory(20);

  const handleExportCSV = () => {
    if (!history || history.length === 0) {
      toast({
        title: 'Aucune donnée',
        description: 'Il n\'y a pas de scans à exporter',
        variant: 'destructive',
      });
      return;
    }

    const csv = [
      ['Date', 'Heure', 'Valence', 'Arousal', 'État émotionnel', 'Résumé'].join(','),
      ...history.map(scan => [
        format(new Date(scan.created_at), 'dd/MM/yyyy', { locale: fr }),
        format(new Date(scan.created_at), 'HH:mm:ss', { locale: fr }),
        scan.valence,
        scan.arousal,
        `"${getEmotionLabel(scan.valence, scan.arousal)}"`,
        `"${scan.summary || ''}"`,
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `scan-history-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();

    toast({
      title: 'Export réussi',
      description: `${history.length} scans exportés en CSV`,
    });
  };

  const handleExportJSON = () => {
    if (!history || history.length === 0) {
      toast({
        title: 'Aucune donnée',
        description: 'Il n\'y a pas de scans à exporter',
        variant: 'destructive',
      });
      return;
    }

    const json = JSON.stringify(history, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `scan-history-${format(new Date(), 'yyyy-MM-dd')}.json`;
    link.click();

    toast({
      title: 'Export réussi',
      description: `${history.length} scans exportés en JSON`,
    });
  };

  const chartData = history?.map(scan => ({
    date: format(new Date(scan.created_at), 'HH:mm', { locale: fr }),
    valence: scan.valence,
    arousal: scan.arousal,
    timestamp: new Date(scan.created_at).getTime(),
  })).reverse() || [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Historique complet des scans
            </DialogTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                disabled={!history || history.length === 0}
              >
                <Download className="h-4 w-4 mr-1" />
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportJSON}
                disabled={!history || history.length === 0}
              >
                <Download className="h-4 w-4 mr-1" />
                JSON
              </Button>
            </div>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        ) : !history || history.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <p>Aucun scan enregistré pour le moment</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Graphique d'évolution */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Évolution émotionnelle</h3>
              <div className="rounded-lg border bg-card p-4">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="valence"
                      stroke="#3b82f6"
                      name="Valence"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="arousal"
                      stroke="#f97316"
                      name="Arousal"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Liste des scans */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">
                {history.length} scan{history.length > 1 ? 's' : ''} enregistré{history.length > 1 ? 's' : ''}
              </h3>
              <div className="space-y-2">
                {history.map((scan) => {
                  const color = getEmotionColor(scan.valence, scan.arousal);
                  const label = getEmotionLabel(scan.valence, scan.arousal);
                  const timeAgo = formatDistanceToNow(new Date(scan.created_at), {
                    addSuffix: true,
                    locale: fr,
                  });
                  const dateTime = format(new Date(scan.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr });

                  return (
                    <div
                      key={scan.id}
                      className="flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-accent/5"
                    >
                      <div
                        className="h-3 w-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium" style={{ color }}>
                          {label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {dateTime} · {timeAgo}
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
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
