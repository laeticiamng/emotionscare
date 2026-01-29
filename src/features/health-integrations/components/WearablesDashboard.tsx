/**
 * Wearables Dashboard Page
 * Dashboard unifié pour tous les wearables connectés
 * MODULE 4 - EmotionsCare 2.0
 */

import React, { memo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Watch,
  Heart,
  Activity,
  Moon,
  Zap,
  TrendingUp,
  RefreshCw,
  Loader2,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Smartphone,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

// Types
interface WearableMetrics {
  heart_rate: { current: number; avg: number; min: number; max: number; unit: string; trend: string };
  hrv: { current: number; avg: number; min: number; max: number; unit: string; trend: string };
  stress: { current: number; level: string; unit: string; trend: string };
  sleep: { duration: number; quality: number; deep_percentage: number; rem_percentage: number; unit: string };
  activity: { steps: number; calories: number; active_minutes: number; goal_progress: number };
  readiness: { score: number; level: string; contributors: { sleep: number; activity: number; hrv: number } };
  body_battery: { current: number; start_of_day: number };
}

interface DashboardData {
  connected_providers: string[];
  available_providers: string[];
  metrics: WearableMetrics;
  hrv_history: Array<{ hour: number; value: number; timestamp: string }>;
  alerts: Array<{ type: string; title: string; message: string; icon: string; action?: string }>;
  last_sync: string;
  coherence_available: boolean;
}

const PROVIDER_INFO = {
  apple_watch: { name: 'Apple Watch', icon: '⌚', color: 'bg-blue-500' },
  garmin: { name: 'Garmin', icon: '🏃', color: 'bg-cyan-500' },
  oura: { name: 'Oura Ring', icon: '💍', color: 'bg-purple-500' },
  fitbit: { name: 'Fitbit', icon: '📱', color: 'bg-teal-500' },
  whoop: { name: 'Whoop', icon: '💪', color: 'bg-gray-800' },
};

// Hook pour les données du dashboard
function useWearablesDashboard() {
  return useQuery<DashboardData>({
    queryKey: ['wearables-dashboard'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('wearables-dashboard', {
        body: { action: 'dashboard' },
      });
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000, // Rafraîchir toutes les 30s
  });
}

// Hook pour HRV temps réel
function useRealtimeHRV() {
  return useQuery({
    queryKey: ['realtime-hrv'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('wearables-dashboard', {
        body: { action: 'hrv_realtime' },
      });
      if (error) throw error;
      return data;
    },
    refetchInterval: 1000, // Rafraîchir chaque seconde pour le temps réel
  });
}

// Composant métrique
const MetricCard: React.FC<{
  title: string;
  value: number | string;
  unit?: string;
  icon: React.ReactNode;
  trend?: string;
  color?: string;
  subtitle?: string;
}> = memo(({ title, value, unit, icon, trend, color = 'text-primary', subtitle }) => (
  <Card className="overflow-hidden">
    <CardContent className="pt-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={cn('text-2xl font-bold', color)}>{value}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className={cn('p-2 rounded-lg bg-muted', color.replace('text-', 'text-'))}>{icon}</div>
          {trend && (
            <Badge variant={trend === 'improving' ? 'default' : 'secondary'} className="text-xs">
              {trend === 'improving' ? '↑' : trend === 'declining' ? '↓' : '→'} {trend}
            </Badge>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
));

MetricCard.displayName = 'MetricCard';

// Composant HRV temps réel
const RealtimeHRVWidget: React.FC = memo(() => {
  const { data, isLoading } = useRealtimeHRV();

  if (isLoading || !data) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const coherenceColor =
    data.zone === 'high' ? 'text-green-500' : data.zone === 'medium' ? 'text-yellow-500' : 'text-red-500';

  return (
    <Card className="overflow-hidden border-2 border-primary/20">
      <CardHeader className="pb-2 bg-gradient-to-r from-primary/10 to-transparent">
        <CardTitle className="text-lg flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500 animate-pulse" />
          HRV Temps Réel
        </CardTitle>
        <CardDescription>Cohérence cardiaque en direct</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-red-500">{data.current.heart_rate}</p>
            <p className="text-xs text-muted-foreground">BPM</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-500">{data.current.hrv_ms}</p>
            <p className="text-xs text-muted-foreground">HRV (ms)</p>
          </div>
          <div>
            <p className={cn('text-3xl font-bold', coherenceColor)}>{data.current.coherence_score}</p>
            <p className="text-xs text-muted-foreground">Cohérence</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Zone de cohérence</span>
            <span className={coherenceColor}>{data.zone === 'high' ? 'Haute' : data.zone === 'medium' ? 'Moyenne' : 'Basse'}</span>
          </div>
          <Progress value={data.current.coherence_score} className="h-3" />
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
          <div className="bg-muted rounded-lg p-2">
            <span className="text-muted-foreground">RMSSD:</span>
            <span className="ml-1 font-medium">{data.metrics.rmssd} ms</span>
          </div>
          <div className="bg-muted rounded-lg p-2">
            <span className="text-muted-foreground">SDNN:</span>
            <span className="ml-1 font-medium">{data.metrics.sdnn} ms</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

RealtimeHRVWidget.displayName = 'RealtimeHRVWidget';

// Composant principal
const WearablesDashboard: React.FC = () => {
  const { data, isLoading, error, refetch } = useWearablesDashboard();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [syncing, setSyncing] = useState(false);

  const syncMutation = useMutation({
    mutationFn: async () => {
      setSyncing(true);
      const { data, error } = await supabase.functions.invoke('wearables-dashboard', {
        body: { action: 'sync' },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (result) => {
      toast({ title: 'Synchronisation réussie', description: `${result.results?.length || 0} appareils synchronisés` });
      queryClient.invalidateQueries({ queryKey: ['wearables-dashboard'] });
    },
    onError: () => {
      toast({ title: 'Erreur de synchronisation', variant: 'destructive' });
    },
    onSettled: () => setSyncing(false),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
          <p className="text-muted-foreground">Impossible de charger les données des wearables</p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            Réessayer
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { metrics, alerts, connected_providers, available_providers, hrv_history, last_sync } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Watch className="h-6 w-6 text-primary" />
            Dashboard Biométrique
          </h1>
          <p className="text-muted-foreground">
            {connected_providers.length} appareil(s) connecté(s) • Dernière sync: {new Date(last_sync).toLocaleTimeString('fr-FR')}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => syncMutation.mutate()} disabled={syncing}>
            {syncing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Synchronisation...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Synchroniser
              </>
            )}
          </Button>
          <Button size="sm">
            <Smartphone className="h-4 w-4 mr-2" />
            Connecter un appareil
          </Button>
        </div>
      </div>

      {/* Alertes */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  'border-l-4',
                  alert.type === 'alert' && 'border-l-red-500 bg-red-50 dark:bg-red-950/20',
                  alert.type === 'warning' && 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20',
                  alert.type === 'positive' && 'border-l-green-500 bg-green-50 dark:bg-green-950/20'
                )}
              >
                <CardContent className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{alert.icon}</span>
                    <div>
                      <p className="font-medium">{alert.title}</p>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                    </div>
                  </div>
                  {alert.action && (
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Appareils connectés */}
      <div className="flex flex-wrap gap-2">
        {connected_providers.map((provider) => {
          const info = PROVIDER_INFO[provider as keyof typeof PROVIDER_INFO];
          return (
            <Badge key={provider} variant="outline" className="px-3 py-1 gap-2">
              <span>{info?.icon}</span>
              <span>{info?.name}</span>
              <CheckCircle className="h-3 w-3 text-green-500" />
            </Badge>
          );
        })}
        {connected_providers.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucun appareil connecté. Connectez un wearable pour commencer.</p>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="hrv">HRV & Cohérence</TabsTrigger>
          <TabsTrigger value="sleep">Sommeil</TabsTrigger>
          <TabsTrigger value="activity">Activité</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Fréquence cardiaque"
              value={metrics.heart_rate.current}
              unit="bpm"
              icon={<Heart className="h-5 w-5 text-red-500" />}
              trend={metrics.heart_rate.trend}
              subtitle={`Min: ${metrics.heart_rate.min} | Max: ${metrics.heart_rate.max}`}
            />
            <MetricCard
              title="Variabilité (HRV)"
              value={metrics.hrv.current}
              unit="ms"
              icon={<Activity className="h-5 w-5 text-blue-500" />}
              trend={metrics.hrv.trend}
              color="text-blue-500"
              subtitle={`Moyenne: ${metrics.hrv.avg} ms`}
            />
            <MetricCard
              title="Niveau de stress"
              value={metrics.stress.current}
              unit="%"
              icon={<Zap className="h-5 w-5 text-yellow-500" />}
              trend={metrics.stress.trend}
              color={metrics.stress.current > 60 ? 'text-red-500' : 'text-yellow-500'}
              subtitle={metrics.stress.level}
            />
            <MetricCard
              title="Readiness"
              value={metrics.readiness.score}
              unit="/100"
              icon={<TrendingUp className="h-5 w-5 text-green-500" />}
              color="text-green-500"
              subtitle={metrics.readiness.level}
            />
          </div>

          {/* Body Battery */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Body Battery</CardTitle>
              <CardDescription>Votre niveau d'énergie actuel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Progress value={metrics.body_battery.current} className="h-4" />
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold">{metrics.body_battery.current}</span>
                  <span className="text-muted-foreground">%</span>
                  <p className="text-xs text-muted-foreground">Début: {metrics.body_battery.start_of_day}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* HRV Tab */}
        <TabsContent value="hrv" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <RealtimeHRVWidget />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Historique HRV (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-40 flex items-end gap-1">
                  {hrv_history.map((point, index) => (
                    <div
                      key={index}
                      className="flex-1 bg-primary/20 hover:bg-primary/40 transition-colors rounded-t"
                      style={{ height: `${(point.value / 100) * 100}%` }}
                      title={`${point.hour}h: ${point.value} ms`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>0h</span>
                  <span>6h</span>
                  <span>12h</span>
                  <span>18h</span>
                  <span>24h</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lancer une session de cohérence</CardTitle>
              <CardDescription>Entraînez votre variabilité cardiaque en temps réel</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <Heart className="h-4 w-4 mr-2" />
                Démarrer la cohérence cardiaque
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sleep Tab */}
        <TabsContent value="sleep" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <MetricCard
              title="Durée du sommeil"
              value={metrics.sleep.duration.toFixed(1)}
              unit="heures"
              icon={<Moon className="h-5 w-5 text-indigo-500" />}
              color="text-indigo-500"
            />
            <MetricCard
              title="Qualité du sommeil"
              value={metrics.sleep.quality}
              unit="%"
              icon={<TrendingUp className="h-5 w-5 text-purple-500" />}
              color="text-purple-500"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Phases de sommeil</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Sommeil profond</span>
                    <span>{metrics.sleep.deep_percentage}%</span>
                  </div>
                  <Progress value={metrics.sleep.deep_percentage} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Sommeil REM</span>
                    <span>{metrics.sleep.rem_percentage}%</span>
                  </div>
                  <Progress value={metrics.sleep.rem_percentage} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Sommeil léger</span>
                    <span>{100 - metrics.sleep.deep_percentage - metrics.sleep.rem_percentage}%</span>
                  </div>
                  <Progress
                    value={100 - metrics.sleep.deep_percentage - metrics.sleep.rem_percentage}
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              title="Pas"
              value={metrics.activity.steps.toLocaleString()}
              icon={<Activity className="h-5 w-5 text-green-500" />}
              color="text-green-500"
              subtitle={`Objectif: ${Math.round(metrics.activity.goal_progress)}%`}
            />
            <MetricCard
              title="Calories"
              value={metrics.activity.calories}
              unit="kcal"
              icon={<Zap className="h-5 w-5 text-orange-500" />}
              color="text-orange-500"
            />
            <MetricCard
              title="Minutes actives"
              value={metrics.activity.active_minutes}
              unit="min"
              icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
              color="text-blue-500"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Objectif quotidien</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Progression</span>
                  <span className="font-bold">{metrics.activity.goal_progress}%</span>
                </div>
                <Progress value={metrics.activity.goal_progress} className="h-4" />
                <p className="text-sm text-muted-foreground text-center">
                  {metrics.activity.goal_progress >= 100
                    ? '🎉 Objectif atteint !'
                    : `Il vous reste ${Math.round(10000 - metrics.activity.steps)} pas`}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default memo(WearablesDashboard);
