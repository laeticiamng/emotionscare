import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Calendar, TrendingUp, TrendingDown, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { useGDPRScoreHistory, TimePeriod } from '@/hooks/useGDPRScoreHistory';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Tableau de bord temps réel avec graphiques animés pour le monitoring RGPD
 */
export const GDPRRealtimeDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('7d');
  const { history, metrics, isLoading } = useGDPRScoreHistory(selectedPeriod);

  const periods: { value: TimePeriod; label: string }[] = [
    { value: '24h', label: '24 heures' },
    { value: '7d', label: '7 jours' },
    { value: '30d', label: '30 jours' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const latestScore = history[history.length - 1]?.score || 0;
  const previousScore = history[history.length - 2]?.score || latestScore;
  const scoreDelta = latestScore - previousScore;

  // Formatter pour les dates selon la période
  const formatXAxis = (timestamp: string) => {
    const date = new Date(timestamp);
    if (selectedPeriod === '24h') {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec sélecteur de période */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Évolution en temps réel</h2>
          <Badge variant="outline" className="text-xs">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
            Live
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {periods.map((period) => (
            <Button
              key={period.value}
              size="sm"
              variant={selectedPeriod === period.value ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod(period.value)}
            >
              {period.label}
            </Button>
          ))}
        </div>
      </div>

      {/* KPIs animés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatedKPI
          label="Score actuel"
          value={latestScore}
          suffix="/100"
          delta={scoreDelta}
          icon={scoreDelta >= 0 ? TrendingUp : TrendingDown}
          color={latestScore >= 80 ? 'green' : latestScore >= 60 ? 'orange' : 'red'}
        />
        <AnimatedKPI
          label="Consentements"
          value={metrics?.activeConsents || 0}
          icon={CheckCircle}
          color="blue"
        />
        <AnimatedKPI
          label="Exports en attente"
          value={metrics?.pendingExports || 0}
          icon={Activity}
          color={metrics?.pendingExports === 0 ? 'green' : 'orange'}
        />
        <AnimatedKPI
          label="Alertes critiques"
          value={metrics?.criticalAlerts || 0}
          icon={AlertCircle}
          color={metrics?.criticalAlerts === 0 ? 'green' : 'red'}
        />
      </div>

      {/* Graphique d'évolution du score */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution du Score de Conformité RGPD</CardTitle>
          <CardDescription>
            Suivi en temps réel du score global sur les {periods.find((p) => p.value === selectedPeriod)?.label.toLowerCase()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={history}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatXAxis}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis
                domain={[0, 100]}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`${value}/100`, 'Score']}
                labelFormatter={(label) => new Date(label).toLocaleString('fr-FR')}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#scoreGradient)"
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Graphiques détaillés */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Taux de consentement */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Taux de Consentement</CardTitle>
            <CardDescription>Évolution du pourcentage de consentements actifs</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatXAxis}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`${value}%`, 'Taux']}
                />
                <Line
                  type="monotone"
                  dataKey="consentRate"
                  stroke="hsl(142 76% 36%)"
                  strokeWidth={2}
                  dot={false}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vitesse de traitement */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vitesse de Traitement</CardTitle>
            <CardDescription>Performance des exports et suppressions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={history.slice(-10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatXAxis}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`${value}%`, '']}
                />
                <Legend />
                <Bar
                  dataKey="exportSpeed"
                  fill="hsl(221 83% 53%)"
                  name="Exports"
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                />
                <Bar
                  dataKey="deletionSpeed"
                  fill="hsl(262 83% 58%)"
                  name="Suppressions"
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Graphique des alertes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Historique des Alertes</CardTitle>
          <CardDescription>Nombre d'alertes détectées sur la période</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatXAxis}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [value, 'Alertes']}
              />
              <Bar
                dataKey="alertsCount"
                fill="hsl(0 84% 60%)"
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

/**
 * Composant KPI animé
 */
interface AnimatedKPIProps {
  label: string;
  value: number;
  suffix?: string;
  delta?: number;
  icon: React.FC<{ className?: string }>;
  color: 'green' | 'red' | 'orange' | 'blue';
}

const AnimatedKPI: React.FC<AnimatedKPIProps> = ({
  label,
  value,
  suffix,
  delta,
  icon: Icon,
  color,
}) => {
  const colorClasses = {
    green: 'text-green-600 bg-green-50 dark:bg-green-950',
    red: 'text-red-600 bg-red-50 dark:bg-red-950',
    orange: 'text-orange-600 bg-orange-50 dark:bg-orange-950',
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-950',
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">{label}</p>
              <div className="flex items-baseline gap-2">
                <motion.span
                  key={value}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-3xl font-bold text-foreground"
                >
                  {value}
                </motion.span>
                {suffix && <span className="text-lg text-muted-foreground">{suffix}</span>}
              </div>
              {delta !== undefined && delta !== 0 && (
                <div className="flex items-center gap-1 mt-2">
                  {delta > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      delta > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {delta > 0 ? '+' : ''}
                    {delta}
                  </span>
                </div>
              )}
            </div>
            <div className={`p-3 rounded-full ${colorClasses[color]}`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GDPRRealtimeDashboard;
