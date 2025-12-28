/**
 * External Integrations Panel - Intégrations streaming
 * Spotify, Apple Music, YouTube Music, SoundCloud
 */

import React, { useState, useEffect } from 'react';
import { useMusicSettings } from '@/hooks/music/useMusicSettings';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Link2,
  Unlink,
  Music,
  RefreshCw,
  Check,
  X,
  ExternalLink,
  Import,
  Download,
  Cloud,
  Settings,
  ArrowRight,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Integration {
  id: string;
  name: string;
  icon: string;
  color: string;
  connected: boolean;
  username?: string;
  syncEnabled: boolean;
  lastSync?: Date;
  playlistCount?: number;
  trackCount?: number;
}

const INTEGRATIONS: Integration[] = [
  {
    id: 'spotify',
    name: 'Spotify',
    icon: '🎵',
    color: '#1DB954',
    connected: false,
    syncEnabled: false,
  },
  {
    id: 'apple_music',
    name: 'Apple Music',
    icon: '🍎',
    color: '#FA243C',
    connected: false,
    syncEnabled: false,
  },
  {
    id: 'youtube_music',
    name: 'YouTube Music',
    icon: '▶️',
    color: '#FF0000',
    connected: false,
    syncEnabled: false,
  },
  {
    id: 'soundcloud',
    name: 'SoundCloud',
    icon: '☁️',
    color: '#FF5500',
    connected: false,
    syncEnabled: false,
  },
];

// Note: Ces intégrations sont prévues pour une version future

export const ExternalIntegrationsPanel: React.FC = () => {
  const { toast } = useToast();
  
  // Persist integrations state with useMusicSettings
  const { value: savedIntegrations, setValue: setSavedIntegrations } = useMusicSettings<Integration[]>({
    key: 'music:integrations' as any,
    defaultValue: INTEGRATIONS,
  });
  
  const [integrations, setIntegrations] = useState<Integration[]>(savedIntegrations || INTEGRATIONS);
  const [importing, setImporting] = useState<string | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [showSettings, setShowSettings] = useState<string | null>(null);

  // Sync with saved state
  useEffect(() => {
    if (savedIntegrations) {
      setIntegrations(savedIntegrations);
    }
  }, [savedIntegrations]);

  // Save integrations when they change
  const updateIntegrations = (newIntegrations: Integration[]) => {
    setIntegrations(newIntegrations);
    setSavedIntegrations(newIntegrations);
  };

  const handleConnect = async (integrationId: string) => {
    const integration = integrations.find((i) => i.id === integrationId);
    if (!integration) return;

    // NOTE: Real OAuth would require backend edge functions with provider credentials
    // This shows the intended flow - actual implementation needs:
    // 1. Edge function to initiate OAuth (redirect to provider)
    // 2. Callback handler to exchange code for tokens
    // 3. Secure token storage
    
    toast({
      title: '⚠️ Configuration requise',
      description: `L'intégration ${integration.name} nécessite une configuration OAuth côté serveur.`,
    });

    // For demo/development, simulate connection after user sees the message
    const userConfirmed = window.confirm(
      `Simuler la connexion à ${integration.name} ? (En production, cela ouvrirait le flux OAuth réel)`
    );
    
    if (userConfirmed) {
      updateIntegrations(
        integrations.map((i) =>
          i.id === integrationId
            ? {
                ...i,
                connected: true,
                username: 'demo_user@example.com',
                lastSync: new Date(),
                playlistCount: Math.floor(Math.random() * 30) + 5,
                trackCount: Math.floor(Math.random() * 1000) + 100,
              }
            : i
        )
      );
      toast({
        title: '✅ Connecté (démo)',
        description: `${integration.name} connecté en mode démonstration`,
      });
    }
  };

  const handleDisconnect = (integrationId: string) => {
    const integration = integrations.find((i) => i.id === integrationId);
    if (!integration) return;

    updateIntegrations(
      integrations.map((i) =>
        i.id === integrationId
          ? { ...i, connected: false, username: undefined, syncEnabled: false }
          : i
      )
    );
    toast({
      title: '🔓 Déconnecté',
      description: `${integration.name} a été déconnecté`,
    });
  };

  const handleSync = async (integrationId: string) => {
    const integration = integrations.find((i) => i.id === integrationId);
    if (!integration) return;

    setImporting(integrationId);
    setImportProgress(0);

    // Simulate sync progress
    const interval = setInterval(() => {
      setImportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setImporting(null);
          setIntegrations((prev) =>
            prev.map((i) =>
              i.id === integrationId ? { ...i, lastSync: new Date() } : i
            )
          );
          toast({
            title: '✅ Synchronisation terminée',
            description: `${integration.playlistCount} playlists importées`,
          });
          return 0;
        }
        return prev + 20;
      });
    }, 500);
  };

  const handleToggleSync = (integrationId: string, enabled: boolean) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === integrationId ? { ...i, syncEnabled: enabled } : i
      )
    );
    toast({
      title: enabled ? '🔄 Sync activée' : '⏸️ Sync désactivée',
      duration: 1500,
    });
  };

  const formatLastSync = (date?: Date) => {
    if (!date) return 'Jamais';
    const diff = Date.now() - date.getTime();
    if (diff < 60000) return 'À l\'instant';
    if (diff < 3600000) return `Il y a ${Math.floor(diff / 60000)} min`;
    if (diff < 86400000) return `Il y a ${Math.floor(diff / 3600000)} h`;
    return date.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5 text-primary" />
          Intégrations streaming
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {integrations.map((integration) => (
          <motion.div
            key={integration.id}
            layout
            className="rounded-lg border overflow-hidden"
          >
            <div className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center text-xl"
                    style={{ background: `${integration.color}20` }}
                  >
                    {integration.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{integration.name}</p>
                      {integration.connected && (
                        <Badge variant="secondary" className="text-xs h-5">
                          <Check className="h-3 w-3 mr-1" />
                          Connecté
                        </Badge>
                      )}
                    </div>
                    {integration.connected && integration.username && (
                      <p className="text-xs text-muted-foreground">
                        {integration.username}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {integration.connected ? (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setShowSettings(
                            showSettings === integration.id ? null : integration.id
                          )
                        }
                        className="h-8 w-8 p-0"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSync(integration.id)}
                        disabled={importing === integration.id}
                        className="h-8 gap-1"
                      >
                        <RefreshCw
                          className={`h-3 w-3 ${
                            importing === integration.id ? 'animate-spin' : ''
                          }`}
                        />
                        Sync
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleConnect(integration.id)}
                      style={{ background: integration.color }}
                      className="h-8 gap-1 text-white hover:opacity-90"
                    >
                      <Link2 className="h-3 w-3" />
                      Connecter
                    </Button>
                  )}
                </div>
              </div>

              {/* Import Progress */}
              {importing === integration.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 space-y-1"
                >
                  <Progress value={importProgress} className="h-1.5" />
                  <p className="text-xs text-muted-foreground text-center">
                    Importation en cours... {importProgress}%
                  </p>
                </motion.div>
              )}
            </div>

            {/* Settings Panel */}
            <AnimatePresence>
              {showSettings === integration.id && integration.connected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t bg-muted/20 p-3 space-y-3"
                >
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded bg-background">
                      <p className="text-lg font-bold">{integration.playlistCount}</p>
                      <p className="text-[10px] text-muted-foreground">Playlists</p>
                    </div>
                    <div className="p-2 rounded bg-background">
                      <p className="text-lg font-bold">{integration.trackCount}</p>
                      <p className="text-[10px] text-muted-foreground">Titres</p>
                    </div>
                    <div className="p-2 rounded bg-background">
                      <p className="text-xs font-medium">{formatLastSync(integration.lastSync)}</p>
                      <p className="text-[10px] text-muted-foreground">Dernière sync</p>
                    </div>
                  </div>

                  {/* Sync Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Synchronisation auto</p>
                      <p className="text-xs text-muted-foreground">
                        Sync quotidienne des playlists
                      </p>
                    </div>
                    <Switch
                      checked={integration.syncEnabled}
                      onCheckedChange={(v) => handleToggleSync(integration.id, v)}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 gap-1 text-xs"
                      onClick={() => {
                        toast({
                          title: '📥 Import en cours',
                          description: `Import des playlists depuis ${integration.name}...`,
                        });
                        handleSync(integration.id);
                      }}
                    >
                      <Import className="h-3 w-3" />
                      Importer
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 gap-1 text-xs"
                      onClick={() => {
                        toast({
                          title: '📤 Export',
                          description: `Export vers ${integration.name} disponible prochainement`,
                        });
                      }}
                    >
                      <Download className="h-3 w-3" />
                      Exporter
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDisconnect(integration.id)}
                      className="gap-1 text-xs"
                    >
                      <Unlink className="h-3 w-3" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {/* Info */}
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <p className="text-xs text-muted-foreground">
            Connectez vos services de streaming pour synchroniser vos playlists et
            accéder à toute votre musique en un seul endroit.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExternalIntegrationsPanel;
