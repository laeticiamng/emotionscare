import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Calendar } from 'lucide-react';
import { useScanHistory } from '@/hooks/useScanHistory';

interface ComparisonMetrics {
  label: string;
  today: number;
  yesterday: number;
  weekly: number;
  change: number;
}

const getEmotionLabel = (valence: number, arousal: number): string => {
  if (valence > 60 && arousal > 60) return 'Énergique et positif';
  if (valence > 60 && arousal <= 60) return 'Calme et serein';
  if (valence <= 40 && arousal > 60) return 'Tension ressentie';
  if (valence <= 40 && arousal <= 60) return 'Apaisement recherché';
  return 'Neutre';
};

const MetricChange: React.FC<{ change: number }> = ({ change }) => {
  const isPositive = change > 0;
  return (
    <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
      {isPositive ? (
        <ArrowUpRight className="w-4 h-4" />
      ) : (
        <ArrowDownRight className="w-4 h-4" />
      )}
      <span className="text-sm font-semibold">{Math.abs(change)}%</span>
    </div>
  );
};

export const EmotionComparisonView: React.FC = () => {
  const { data: history = [] } = useScanHistory(60);

  const comparisonData = useMemo(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const getTodayScans = (d: Date) => {
      const dateStr = d.toDateString();
      return history.filter(s => new Date(s.created_at).toDateString() === dateStr);
    };

    const todayScans = getTodayScans(today);
    const yesterdayScans = getTodayScans(yesterday);
    const weekScans = history.filter(s => {
      const d = new Date(s.created_at);
      return d >= weekAgo && d < today;
    });

    const calcAvg = (scans: any[]) => scans.length > 0 ? Math.round(scans.reduce((a, s) => a + s.valence, 0) / scans.length) : 0;
    const calcArousal = (scans: any[]) => scans.length > 0 ? Math.round(scans.reduce((a, s) => a + s.arousal, 0) / scans.length) : 0;

    const todayValence = calcAvg(todayScans);
    const yesterdayValence = calcAvg(yesterdayScans);
    const weekValence = calcAvg(weekScans);

    const todayArousal = calcArousal(todayScans);
    const yesterdayArousal = calcArousal(yesterdayScans);
    const weekArousal = calcArousal(weekScans);

    return {
      metrics: [
        {
          label: 'Valence',
          today: todayValence,
          yesterday: yesterdayValence,
          weekly: weekValence,
          change: yesterdayValence > 0 ? Math.round(((todayValence - yesterdayValence) / yesterdayValence) * 100) : 0
        },
        {
          label: 'Arousal',
          today: todayArousal,
          yesterday: yesterdayArousal,
          weekly: weekArousal,
          change: yesterdayArousal > 0 ? Math.round(((todayArousal - yesterdayArousal) / yesterdayArousal) * 100) : 0
        }
      ],
      todayScans: todayScans.length,
      weekScans: weekScans.length,
      chartData: history.slice(0, 14).reverse().map((scan) => ({
        time: new Date(scan.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        valence: scan.valence,
        arousal: scan.arousal,
        emotion: getEmotionLabel(scan.valence, scan.arousal)
      }))
    };
  }, [history]);

  const hourlyData = useMemo(() => {
    if (history.length === 0) return [];

    const grouped: { [key: string]: { valence: number[], arousal: number[] } } = {};

    history.forEach(scan => {
      const date = new Date(scan.created_at);
      const hour = `${date.getHours()}:00`;

      if (!grouped[hour]) {
        grouped[hour] = { valence: [], arousal: [] };
      }
      grouped[hour].valence.push(scan.valence);
      grouped[hour].arousal.push(scan.arousal);
    });

    return Object.entries(grouped)
      .map(([hour, data]) => ({
        hour,
        valenceAvg: Math.round(data.valence.reduce((a, b) => a + b, 0) / data.valence.length),
        arousalAvg: Math.round(data.arousal.reduce((a, b) => a + b, 0) / data.arousal.length)
      }))
      .reverse();
  }, [history]);

  return (
    <div className="space-y-6">
      {/* Comparaison rapide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {comparisonData.metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{metric.label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Aujourd'hui</p>
                  <p className="text-2xl font-semibold">{metric.today}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Hier</p>
                  <p className="text-2xl font-semibold">{metric.yesterday}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">7 jours</p>
                  <p className="text-2xl font-semibold">{metric.weekly}</p>
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Vs hier</span>
                  <MetricChange change={metric.change} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Graphiques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Analyse détaillée
          </CardTitle>
          <CardDescription>Tendances et patterns détectés</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="timeline">Chronologie</TabsTrigger>
              <TabsTrigger value="hourly">Par heure</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="mt-4">
              {comparisonData.chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={comparisonData.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 12 }}
                      stroke="#888"
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      stroke="#888"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                      }}
                      formatter={(value) => [Math.round(value as number), '']}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="valence"
                      stroke="#3b82f6"
                      dot={false}
                      strokeWidth={2}
                      name="Valence"
                    />
                    <Line
                      type="monotone"
                      dataKey="arousal"
                      stroke="#f59e0b"
                      dot={false}
                      strokeWidth={2}
                      name="Arousal"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <p>Aucune donnée disponible</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="hourly" className="mt-4">
              {hourlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="hour"
                      tick={{ fontSize: 12 }}
                      stroke="#888"
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      stroke="#888"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="valenceAvg"
                      fill="#3b82f6"
                      name="Valence moyenne"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="arousalAvg"
                      fill="#f59e0b"
                      name="Arousal moyen"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <p>Aucune donnée disponible</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Statistiques générales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Récapitulatif
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Scans aujourd'hui</p>
              <p className="text-3xl font-semibold">{comparisonData.todayScans}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Scans cette semaine</p>
              <p className="text-3xl font-semibold">{comparisonData.weekScans}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotionComparisonView;
