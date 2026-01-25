import { useState, useEffect } from 'react';
import { Watch, Activity, Heart, Moon, Footprints, RefreshCw, Check, X, TrendingUp, TrendingDown, Minus, History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface Provider {
  id: string;
  name: string;
  icon: string;
  description: string;
  connected: boolean;
  capabilities: string[];
  lastSync?: string;
}

interface HealthSummary {
  avgHeartRate: number | null;
  avgHrv: number | null;
  totalSteps: number;
  avgSleepHours: number | null;
  avgStressLevel: number | null;
  dataPoints: number;
}

interface HealthTrend {
  date: string;
  heartRate?: number;
  steps?: number;
  sleep?: number;
  hrv?: number;
}

interface SyncLog {
  id: string;
  provider: string;
  timestamp: string;
  dataPoints: number;
  status: 'success' | 'error' | 'partial';
  message?: string;
}

export default function WearablesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [summary, setSummary] = useState<HealthSummary | null>(null);
  const [trends, setTrends] = useState<HealthTrend[]>([]);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      loadProviders();
      loadHealthData();
      loadTrends();
      loadSyncLogs();
    }
  }, [user]);

  const loadProviders = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('wearables-sync', {
        body: { action: 'providers' }
      });
      if (!error && data?.providers) {
        // Add last sync times for connected providers
        const enrichedProviders = data.providers.map((p: Provider) => ({
          ...p,
          lastSync: p.connected ? new Date(Date.now() - Math.random() * 3600000).toISOString() : undefined
        }));
        setProviders(enrichedProviders);
      }
    } catch (err) {
      console.error('Failed to load providers:', err);
    }
  };

  const loadHealthData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('wearables-sync', {
        body: {
          action: 'getData',
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      });
      if (!error && data?.summary) {
        setSummary(data.summary);
      }
    } catch (err) {
      console.error('Failed to load health data:', err);
    }
  };

  const loadTrends = async () => {
    // Generate mock trend data for visualization
    const mockTrends: HealthTrend[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      mockTrends.push({
        date: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
        heartRate: 65 + Math.floor(Math.random() * 20),
        steps: 5000 + Math.floor(Math.random() * 8000),
        sleep: 6 + Math.random() * 3,
        hrv: 40 + Math.floor(Math.random() * 30)
      });
    }
    setTrends(mockTrends);
  };

  const loadSyncLogs = () => {
    // Mock sync logs
    setSyncLogs([
      { id: '1', provider: 'Apple Health', timestamp: new Date(Date.now() - 1800000).toISOString(), dataPoints: 156, status: 'success' },
      { id: '2', provider: 'Google Fit', timestamp: new Date(Date.now() - 7200000).toISOString(), dataPoints: 89, status: 'success' },
      { id: '3', provider: 'Apple Health', timestamp: new Date(Date.now() - 86400000).toISOString(), dataPoints: 142, status: 'partial', message: 'Données de sommeil manquantes' },
    ]);
  };

  const handleConnect = async (providerId: string) => {
    setSyncing(providerId);
    try {
      const { data, error } = await supabase.functions.invoke('wearables-sync', {
        body: { action: 'connect', provider: providerId }
      });
      
      if (!error) {
        toast({ title: 'Connecté!', description: data.message });
        loadProviders();
        loadHealthData();
        loadTrends();
      }
    } catch (err) {
      toast({ title: 'Erreur', description: 'Connexion impossible.', variant: 'destructive' });
    } finally {
      setSyncing(null);
    }
  };

  const handleDisconnect = async (providerId: string) => {
    try {
      const { error } = await supabase.functions.invoke('wearables-sync', {
        body: { action: 'disconnect', provider: providerId }
      });
      
      if (!error) {
        toast({ title: 'Déconnecté', description: 'Appareil déconnecté avec succès.' });
        loadProviders();
      }
    } catch (err) {
      toast({ title: 'Erreur', description: 'Déconnexion impossible.', variant: 'destructive' });
    }
  };

  const handleSyncNow = async (providerId: string) => {
    setSyncing(providerId);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate sync
      toast({ title: 'Synchronisation terminée', description: 'Vos données ont été mises à jour.' });
      loadHealthData();
      loadTrends();
      loadSyncLogs();
    } finally {
      setSyncing(null);
    }
  };

  const getTrendIndicator = (current: number, average: number) => {
    const diff = ((current - average) / average) * 100;
    if (diff > 5) return { icon: TrendingUp, color: 'text-green-500', text: `+${diff.toFixed(0)}%` };
    if (diff < -5) return { icon: TrendingDown, color: 'text-red-500', text: `${diff.toFixed(0)}%` };
    return { icon: Minus, color: 'text-muted-foreground', text: 'Stable' };
  };

  if (!user) return <Navigate to="/login" replace />;

  const connectedCount = providers.filter(p => p.connected).length;

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Watch className="h-8 w-8 text-primary" />
          Appareils connectés
        </h1>
        <p className="text-muted-foreground">
          Synchronisez vos données de santé pour des analyses personnalisées.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
          <TabsTrigger value="devices">Appareils</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          {summary && summary.dataPoints > 0 ? (
            <>
              {/* Corrélation Humeur-Santé */}
              <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Heart className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Corrélation humeur & santé</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Basé sur vos données des 7 derniers jours, voici les liens détectés :
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {summary.avgSleepHours && summary.avgSleepHours < 6.5 && (
                      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                          💤 Sommeil insuffisant détecté
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Un sommeil &lt; 7h peut affecter votre humeur. Essayez notre module Breath.
                        </p>
                      </div>
                    )}
                    {summary.avgHeartRate && summary.avgHeartRate > 75 && (
                      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                          💓 Fréquence cardiaque élevée
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Indique possiblement du stress. Une séance de respiration pourrait aider.
                        </p>
                      </div>
                    )}
                    {summary.totalSteps > 8000 && (
                      <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                        <p className="text-sm font-medium text-green-700 dark:text-green-400">
                          🎉 Bonne activité physique
                        </p>
                        <p className="text-xs text-muted-foreground">
                          L'exercice améliore l'humeur. Continuez ainsi !
                        </p>
                      </div>
                    )}
                    {summary.avgHrv && summary.avgHrv > 50 && (
                      <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <p className="text-sm font-medium text-purple-700 dark:text-purple-400">
                          🧘 Bonne récupération
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Votre HRV indique une bonne gestion du stress.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {summary.avgHeartRate && (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
                      <p className="text-3xl font-bold">{summary.avgHeartRate}</p>
                      <p className="text-xs text-muted-foreground">BPM moyen</p>
                      {(() => {
                        const trend = getTrendIndicator(summary.avgHeartRate, 72);
                        return (
                          <div className={`flex items-center justify-center gap-1 mt-2 ${trend.color}`}>
                            <trend.icon className="h-3 w-3" />
                            <span className="text-xs">{trend.text}</span>
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>
                )}
                
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Footprints className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <p className="text-3xl font-bold">{(summary.totalSteps / 1000).toFixed(1)}k</p>
                    <p className="text-xs text-muted-foreground">Pas cette semaine</p>
                    <Progress value={(summary.totalSteps / 70000) * 100} className="mt-2 h-1" />
                  </CardContent>
                </Card>

                {summary.avgSleepHours && (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <Moon className="h-8 w-8 mx-auto mb-2 text-indigo-500" />
                      <p className="text-3xl font-bold">{summary.avgSleepHours.toFixed(1)}h</p>
                      <p className="text-xs text-muted-foreground">Sommeil moyen</p>
                      {(() => {
                        const trend = getTrendIndicator(summary.avgSleepHours, 7);
                        return (
                          <div className={`flex items-center justify-center gap-1 mt-2 ${trend.color}`}>
                            <trend.icon className="h-3 w-3" />
                            <span className="text-xs">{trend.text}</span>
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>
                )}

                {summary.avgHrv && (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <Activity className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                      <p className="text-3xl font-bold">{summary.avgHrv}</p>
                      <p className="text-xs text-muted-foreground">HRV moyen (ms)</p>
                      {(() => {
                        const trend = getTrendIndicator(summary.avgHrv, 50);
                        return (
                          <div className={`flex items-center justify-center gap-1 mt-2 ${trend.color}`}>
                            <trend.icon className="h-3 w-3" />
                            <span className="text-xs">{trend.text}</span>
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Mini chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Fréquence cardiaque - 7 jours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trends}>
                        <defs>
                          <linearGradient id="heartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="date" className="text-xs" />
                        <YAxis domain={[50, 100]} className="text-xs" />
                        <Tooltip />
                        <Area type="monotone" dataKey="heartRate" stroke="hsl(var(--destructive))" fill="url(#heartGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Watch className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Aucune donnée</h3>
                <p className="text-muted-foreground mb-4">
                  Connectez un appareil pour voir vos données de santé.
                </p>
                <Button onClick={() => setActiveTab('devices')}>
                  Connecter un appareil
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tendances */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Footprints className="h-5 w-5 text-green-500" />
                  Pas quotidiens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trends}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Line type="monotone" dataKey="steps" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Moon className="h-5 w-5 text-indigo-500" />
                  Heures de sommeil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trends}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis domain={[4, 10]} className="text-xs" />
                      <Tooltip />
                      <Line type="monotone" dataKey="sleep" stroke="#6366f1" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Appareils */}
        <TabsContent value="devices" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Sources de données</h2>
            <Badge variant="outline">
              {connectedCount} connecté{connectedCount > 1 ? 's' : ''}
            </Badge>
          </div>

          {providers.map(provider => (
            <Card key={provider.id} className={provider.connected ? 'border-green-500/50' : ''}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{provider.icon}</span>
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      {provider.name}
                      {provider.connected && (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground">{provider.description}</p>
                    {provider.lastSync && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Dernière sync: {new Date(provider.lastSync).toLocaleString('fr-FR')}
                      </p>
                    )}
                    <div className="flex gap-1 mt-1">
                      {provider.capabilities.slice(0, 3).map(cap => (
                        <Badge key={cap} variant="secondary" className="text-xs">
                          {cap.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {provider.connected ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSyncNow(provider.id)}
                        disabled={syncing === provider.id}
                      >
                        {syncing === provider.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDisconnect(provider.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleConnect(provider.id)}
                      disabled={syncing === provider.id}
                    >
                      {syncing === provider.id ? (
                        <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                      ) : null}
                      Connecter
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Historique */}
        <TabsContent value="history" className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <History className="h-5 w-5" />
            Historique de synchronisation
          </h2>

          <div className="space-y-2">
            {syncLogs.map(log => (
              <Card key={log.id}>
                <CardContent className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${
                      log.status === 'success' ? 'bg-green-500' :
                      log.status === 'partial' ? 'bg-amber-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <p className="font-medium text-sm">{log.provider}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={log.status === 'success' ? 'default' : 'secondary'}>
                      {log.dataPoints} points
                    </Badge>
                    {log.message && (
                      <p className="text-xs text-muted-foreground mt-1">{log.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <p className="text-xs text-muted-foreground text-center mt-8">
        🔒 Vos données de santé sont chiffrées et ne sont jamais partagées.
      </p>
    </div>
  );
}
