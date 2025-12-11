import React, { useState, useEffect } from 'react';
import { Watch, Activity, Heart, Moon, Footprints, RefreshCw, Check, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface Provider {
  id: string;
  name: string;
  icon: string;
  description: string;
  connected: boolean;
  capabilities: string[];
}

interface HealthSummary {
  avgHeartRate: number | null;
  avgHrv: number | null;
  totalSteps: number;
  avgSleepHours: number | null;
  avgStressLevel: number | null;
  dataPoints: number;
}

export default function WearablesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [summary, setSummary] = useState<HealthSummary | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadProviders();
      loadHealthData();
    }
  }, [user]);

  const loadProviders = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('wearables-sync', {
        body: { action: 'providers' }
      });
      if (!error && data?.providers) {
        setProviders(data.providers);
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

  const handleConnect = async (providerId: string) => {
    setSyncing(providerId);
    try {
      const { data, error } = await supabase.functions.invoke('wearables-sync', {
        body: { action: 'connect', provider: providerId }
      });
      
      if (!error) {
        toast({ title: 'Connecté!', description: data.message });
        loadProviders();
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

      {/* Résumé santé */}
      {summary && summary.dataPoints > 0 && (
        <Card className="mb-6 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="text-lg">Résumé de la semaine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {summary.avgHeartRate && (
                <div className="text-center">
                  <Heart className="h-6 w-6 mx-auto mb-1 text-red-500" />
                  <p className="text-2xl font-bold">{summary.avgHeartRate}</p>
                  <p className="text-xs text-muted-foreground">BPM moyen</p>
                </div>
              )}
              <div className="text-center">
                <Footprints className="h-6 w-6 mx-auto mb-1 text-green-500" />
                <p className="text-2xl font-bold">{summary.totalSteps.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Pas total</p>
              </div>
              {summary.avgSleepHours && (
                <div className="text-center">
                  <Moon className="h-6 w-6 mx-auto mb-1 text-indigo-500" />
                  <p className="text-2xl font-bold">{summary.avgSleepHours}h</p>
                  <p className="text-xs text-muted-foreground">Sommeil moyen</p>
                </div>
              )}
              {summary.avgHrv && (
                <div className="text-center">
                  <Activity className="h-6 w-6 mx-auto mb-1 text-purple-500" />
                  <p className="text-2xl font-bold">{summary.avgHrv}</p>
                  <p className="text-xs text-muted-foreground">HRV moyen</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des providers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
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
                  <div className="flex gap-1 mt-1">
                    {provider.capabilities.slice(0, 3).map(cap => (
                      <Badge key={cap} variant="secondary" className="text-xs">
                        {cap.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                {provider.connected ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDisconnect(provider.id)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Déconnecter
                  </Button>
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
      </div>

      <p className="text-xs text-muted-foreground text-center mt-8">
        🔒 Vos données de santé sont chiffrées et ne sont jamais partagées.
      </p>
    </div>
  );
}
