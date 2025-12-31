/**
 * AuraHistoryChart - Historique d'évolution de l'aura utilisateur
 */
import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AuraHistoryEntry {
  weekStart: string;
  weekEnd: string;
  colorHue: number;
  luminosity: number;
  sizeScale: number;
}

interface AuraHistoryChartProps {
  history: AuraHistoryEntry[];
}

export const AuraHistoryChart = memo(function AuraHistoryChart({
  history,
}: AuraHistoryChartProps) {
  const sortedHistory = useMemo(() => {
    return [...history].sort(
      (a, b) => new Date(a.weekStart).getTime() - new Date(b.weekStart).getTime()
    );
  }, [history]);

  if (!sortedHistory.length) {
    return (
      <Card className="border-border">
        <CardContent className="p-6 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Pas encore d'historique d'aura disponible
          </p>
        </CardContent>
      </Card>
    );
  }

  const maxLuminosity = Math.max(...sortedHistory.map((h) => h.luminosity), 0.5);

  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-foreground text-lg">
          <TrendingUp className="h-5 w-5 text-primary" aria-hidden="true" />
          Évolution de votre aura
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2 h-32" role="img" aria-label="Graphique d'évolution">
          {sortedHistory.map((entry, index) => {
            const height = (entry.luminosity / maxLuminosity) * 100;
            const bgColor = `hsl(${entry.colorHue}, 70%, ${Math.round(entry.luminosity * 100)}%)`;

            return (
              <motion.div
                key={entry.weekStart}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: `${height}%`, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="flex-1 min-w-8 rounded-t-md relative group cursor-pointer"
                style={{ backgroundColor: bgColor }}
                title={`Semaine du ${format(new Date(entry.weekStart), 'd MMM', { locale: fr })}`}
              >
                {/* Tooltip on hover */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-popover text-popover-foreground px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg border border-border">
                    <p className="font-medium">
                      {format(new Date(entry.weekStart), 'd MMM', { locale: fr })}
                    </p>
                    <p className="text-muted-foreground">
                      Luminosité: {Math.round(entry.luminosity * 100)}%
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div className="flex gap-2 mt-2">
          {sortedHistory.map((entry) => (
            <div
              key={entry.weekStart}
              className="flex-1 text-center text-xs text-muted-foreground truncate"
            >
              {format(new Date(entry.weekStart), 'd/M', { locale: fr })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});
