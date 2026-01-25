import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Calendar, Filter, RefreshCw } from 'lucide-react';
import { useScanHistory } from '@/hooks/useScanHistory';
import { motion } from 'framer-motion';
import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';

type PeriodType = '7d' | '14d' | '30d' | '90d';

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

const getEmotionColor = (valence: number): string => {
  if (valence > 70) return '#10b981';
  if (valence > 50) return '#3b82f6';
  if (valence > 30) return '#f59e0b';
  return '#ef4444';
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
  const { data: history = [] } = useScanHistory(200);
  const [period, setPeriod] = useState<PeriodType>('7d');
  const [compareMode, setCompareMode] = useState(false);

  const periodDays = {
    '7d': 7,
    '14d': 14,
    '30d': 30,
    '90d': 90
  };

  const comparisonData = useMemo(() => {
    const today = new Date();
    const days = periodDays[period];
    const periodStart = subDays(today, days);
    const previousPeriodStart = subDays(periodStart, days);
    
    const currentPeriodScans = history.filter(s => {
      const d = new Date(s.created_at);
      return d >= periodStart && d <= today;
    });
    
    const previousPeriodScans = history.filter(s => {
      const d = new Date(s.created_at);
      return d >= previousPeriodStart && d < periodStart;
    });

    const calcAvg = (scans: any[], field: 'valence' | 'arousal') => 
      scans.length > 0 ? Math.round(scans.reduce((a, s) => a + s[field], 0) / scans.length) : 0;

    const currentValence = calcAvg(currentPeriodScans, 'valence');
    const previousValence = calcAvg(previousPeriodScans, 'valence');
    const currentArousal = calcAvg(currentPeriodScans, 'arousal');
    const previousArousal = calcAvg(previousPeriodScans, 'arousal');

    // Données par jour pour le graphique
    const dailyData: { date: string; valence: number; arousal: number; count: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = date.toDateString();
      const dayScans = currentPeriodScans.filter(s => new Date(s.created_at).toDateString() === dateStr);
      
      dailyData.push({
        date: format(date, 'dd/MM', { locale: fr }),
        valence: calcAvg(dayScans, 'valence'),
        arousal: calcAvg(dayScans, 'arousal'),
        count: dayScans.length
      });
    }

    return {
      metrics: [
        {
          label: 'Valence',
          today: currentValence,
          yesterday: previousValence,
          weekly: currentValence,
          change: previousValence > 0 ? Math.round(((currentValence - previousValence) / previousValence) * 100) : 0
        },
        {
          label: 'Arousal',
          today: currentArousal,
          yesterday: previousArousal,
          weekly: currentArousal,
          change: previousArousal > 0 ? Math.round(((currentArousal - previousArousal) / previousArousal) * 100) : 0
        }
      ],
      currentScans: currentPeriodScans.length,
      previousScans: previousPeriodScans.length,
      dailyData,
      chartData: currentPeriodScans.slice(0, 20).reverse().map((scan) => ({
        time: format(new Date(scan.created_at), 'HH:mm', { locale: fr }),
        valence: scan.valence,
        arousal: scan.arousal,
        emotion: getEmotionLabel(scan.valence, scan.arousal),
        color: getEmotionColor(scan.valence)
      }))
    };
  }, [history, period]);

  const hourlyData = useMemo(() => {
    if (history.length === 0) return [];

    const days = periodDays[period];
    const periodStart = subDays(new Date(), days);
    const periodScans = history.filter(s => new Date(s.created_at) >= periodStart);

    const grouped: { [key: string]: { valence: number[], arousal: number[] } } = {};

    periodScans.forEach(scan => {
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
        arousalAvg: Math.round(data.arousal.reduce((a, b) => a + b, 0) / data.arousal.length),
        count: data.valence.length
      }))
      .sort((a, b) => parseInt(a.hour) - parseInt(b.hour));
  }, [history, period]);

  const periodLabels = {
    '7d': '7 derniers jours',
    '14d': '14 derniers jours',
    '30d': '30 derniers jours',
    '90d': '3 derniers mois'
  };

  return (
    <div className="space-y-6">
      {/* Sélecteur de période et toggle comparaison */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={period} onValueChange={(v: PeriodType) => setPeriod(v)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 jours</SelectItem>
                <SelectItem value="14d">14 jours</SelectItem>
                <SelectItem value="30d">30 jours</SelectItem>
                <SelectItem value="90d">3 mois</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Toggle mode comparaison */}
          <Button
            variant={compareMode ? "default" : "outline"}
            size="sm"
            onClick={() => setCompareMode(!compareMode)}
            className="gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            {compareMode ? "Comparaison active" : "Comparer périodes"}
          </Button>
        </div>
        
        <Badge variant="outline">
          {comparisonData.currentScans} scans sur cette période
        </Badge>
      </div>
      
      {/* Bandeau comparaison si activé */}
      {compareMode && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 rounded-lg bg-primary/5 border border-primary/20"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Mode comparaison activé</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Comparer {periodLabels[period]} actuels vs précédents
            </p>
          </div>
        </motion.div>
      )}

      {/* Comparaison rapide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {comparisonData.metrics.map((metric, idx) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  {metric.label}
                  <MetricChange change={metric.change} />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <p className="text-xs text-muted-foreground mb-1">Période actuelle</p>
                    <p className="text-3xl font-bold text-primary">{metric.today}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground mb-1">Période précédente</p>
                    <p className="text-3xl font-bold">{metric.yesterday}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Comparaison avec les {periodDays[period]} jours précédents
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Graphiques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Analyse détaillée - {periodLabels[period]}
          </CardTitle>
          <CardDescription>Évolution de vos émotions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="daily" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="daily">Par jour</TabsTrigger>
              <TabsTrigger value="timeline">Chronologie</TabsTrigger>
              <TabsTrigger value="hourly">Par heure</TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="mt-4">
              {comparisonData.dailyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={comparisonData.dailyData}>
                    <defs>
                      <linearGradient id="valenceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="arousalGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#888" />
                    <YAxis tick={{ fontSize: 11 }} stroke="#888" domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number, name: string) => [
                        `${Math.round(value)}%`,
                        name === 'valence' ? 'Valence' : name === 'arousal' ? 'Arousal' : 'Scans'
                      ]}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="valence"
                      stroke="#3b82f6"
                      fill="url(#valenceGradient)"
                      strokeWidth={2}
                      name="Valence"
                    />
                    <Area
                      type="monotone"
                      dataKey="arousal"
                      stroke="#f59e0b"
                      fill="url(#arousalGradient)"
                      strokeWidth={2}
                      name="Arousal"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <p>Aucune donnée disponible pour cette période</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="timeline" className="mt-4">
              {comparisonData.chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={comparisonData.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="#888" />
                    <YAxis tick={{ fontSize: 11 }} stroke="#888" domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [`${Math.round(value)}%`, '']}
                      labelFormatter={(label) => `Heure: ${label}`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="valence"
                      stroke="#3b82f6"
                      dot={{ fill: '#3b82f6', r: 3 }}
                      strokeWidth={2}
                      name="Valence"
                    />
                    <Line
                      type="monotone"
                      dataKey="arousal"
                      stroke="#f59e0b"
                      dot={{ fill: '#f59e0b', r: 3 }}
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
                    <XAxis dataKey="hour" tick={{ fontSize: 11 }} stroke="#888" />
                    <YAxis tick={{ fontSize: 11 }} stroke="#888" domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number, name: string) => [
                        `${Math.round(value)}%`,
                        name === 'valenceAvg' ? 'Valence moyenne' : name === 'arousalAvg' ? 'Arousal moyen' : 'Scans'
                      ]}
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
            Récapitulatif de la période
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-lg bg-primary/10 text-center"
            >
              <p className="text-xs text-muted-foreground mb-1">Scans période actuelle</p>
              <p className="text-3xl font-semibold text-primary">{comparisonData.currentScans}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-lg bg-muted text-center"
            >
              <p className="text-xs text-muted-foreground mb-1">Scans période précédente</p>
              <p className="text-3xl font-semibold">{comparisonData.previousScans}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-lg bg-green-500/10 text-center"
            >
              <p className="text-xs text-muted-foreground mb-1">Valence moyenne</p>
              <p className="text-3xl font-semibold text-green-600">{comparisonData.metrics[0].today}%</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-lg bg-amber-500/10 text-center"
            >
              <p className="text-xs text-muted-foreground mb-1">Arousal moyen</p>
              <p className="text-3xl font-semibold text-amber-600">{comparisonData.metrics[1].today}%</p>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotionComparisonView;
