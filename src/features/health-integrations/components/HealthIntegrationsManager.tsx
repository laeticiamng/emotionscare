/**
 * Composant principal pour gérer les intégrations santé
 * Phase 3 - Excellence
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import {
  Activity,
  Heart,
  TrendingUp,
  Loader2,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import type { HealthProvider, HealthConnection } from '@/types/health-integrations';
import * as healthService from '@/services/health-integrations/health-integrations.service';
import { useAuth } from '@/contexts/AuthContext';

const PROVIDER_CONFIG = {
  google_fit: {
    name: 'Google Fit',
    icon: Activity,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    description: 'Synchronisez vos données d\'activité, fréquence cardiaque et sommeil depuis Google Fit',
  },
  apple_health: {
    name: 'Apple Health',
    icon: Heart,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    description: 'Accédez à vos données santé depuis l\'app Santé d\'Apple (iOS uniquement)',
  },
  withings: {
    name: 'Withings',
    icon: TrendingUp,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    description: 'Connectez vos appareils Withings pour un suivi complet de votre santé',
  },
} as const;

export function HealthIntegrationsManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [connections, setConnections] = useState<HealthConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<HealthProvider | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadConnections();
    }
  }, [user?.id]);

  const loadConnections = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const data = await healthService.getHealthConnections(user.id);
      setConnections(data);
    } catch (error) {
      console.error('Failed to load connections:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les intégrations santé',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (provider: HealthProvider) => {
    if (!user?.id) return;

    try {
      const result = await healthService.connectProvider(user.id, provider);

      if (typeof result === 'string') {
        // OAuth URL - rediriger
        window.location.href = result;
      } else {
        // Connection créée directement (Apple Health)
        await loadConnections();
        toast({
          title: 'Connecté',
          description: `${PROVIDER_CONFIG[provider].name} a été connecté avec succès`,
        });
      }
    } catch (error) {
      console.error('Failed to connect:', error);
      toast({
        title: 'Erreur de connexion',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: 'destructive',
      });
    }
  };

  const handleDisconnect = async (provider: HealthProvider) => {
    if (!user?.id) return;

    try {
      await healthService.disconnectProvider(user.id, provider);
      await loadConnections();
      toast({
        title: 'Déconnecté',
        description: `${PROVIDER_CONFIG[provider].name} a été déconnecté`,
      });
    } catch (error) {
      console.error('Failed to disconnect:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de déconnecter le service',
        variant: 'destructive',
      });
    }
  };

  const handleSync = async (provider: HealthProvider) => {
    if (!user?.id) return;

    try {
      setSyncing(provider);
      const result = await healthService.syncProvider(user.id, provider);

      toast({
        title: 'Synchronisation réussie',
        description: `${result.metrics_synced} métriques synchronisées depuis ${PROVIDER_CONFIG[provider].name}`,
      });

      await loadConnections();
    } catch (error) {
      console.error('Failed to sync:', error);
      toast({
        title: 'Erreur de synchronisation',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setSyncing(null);
    }
  };

  const getConnection = (provider: HealthProvider) => {
    return connections.find((c) => c.provider === provider);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Intégrations Santé</h2>
        <p className="text-muted-foreground">
          Connectez vos applications et appareils santé pour un suivi complet
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        {(Object.keys(PROVIDER_CONFIG) as HealthProvider[]).map((provider) => {
          const config = PROVIDER_CONFIG[provider];
          const connection = getConnection(provider);
          const Icon = config.icon;
          const isConnected = connection?.is_connected || false;
          const isSyncing = syncing === provider;

          return (
            <Card key={provider} className="overflow-hidden">
              <CardHeader className={`${config.bgColor} pb-4`}>
                <div className="flex items-center justify-between">
                  <Icon className={`h-8 w-8 ${config.color}`} />
                  {isConnected ? (
                    <Badge variant="outline" className="bg-white">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Connecté
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-white">
                      <XCircle className="mr-1 h-3 w-3" />
                      Non connecté
                    </Badge>
                  )}
                </div>
                <CardTitle className="mt-4">{config.name}</CardTitle>
                <CardDescription className="text-foreground/70">
                  {config.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6">
                {isConnected ? (
                  <div className="space-y-4">
                    {connection?.last_sync_at && (
                      <div className="text-sm text-muted-foreground">
                        Dernière sync:{' '}
                        {new Date(connection.last_sync_at).toLocaleString('fr-FR')}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleSync(provider)}
                        disabled={isSyncing}
                      >
                        {isSyncing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Synchronisation...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Synchroniser
                          </>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnect(provider)}
                      >
                        Déconnecter
                      </Button>
                    </div>

                      <div className="space-y-2">
                      <div className="text-sm font-medium">Types de données</div>
                      <div className="flex flex-wrap gap-1">
                        {connection?.enabled_data_types?.map((type) => (
                          <Badge key={type} variant="secondary" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button onClick={() => handleConnect(provider)} className="w-full">
                    Connecter {config.name}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {connections.some((c) => c.is_connected) && (
        <Card>
          <CardHeader>
            <CardTitle>Synchronisation automatique</CardTitle>
            <CardDescription>
              Synchronisez automatiquement vos données à intervalles réguliers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Activer la synchronisation automatique</div>
                <div className="text-sm text-muted-foreground">
                  Vos données seront synchronisées toutes les heures
                </div>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
