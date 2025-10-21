// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { musicService, type MusicPreset, type MusicSession } from '@/services/b2c/musicService';
import { MusicPlayer } from '@/components/b2c/MusicPlayer';
import { toast } from '@/hooks/use-toast';
import { Music, Play, Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';

const B2CMusicPage: React.FC = () => {
  const [presets, setPresets] = useState<MusicPreset[]>([]);
  const [sessions, setSessions] = useState<MusicSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingSession, setCreatingSession] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      // Refresh sessions every 10s to check status
      musicService.getUserMusicSessions(20).then(setSessions).catch((err) => logger.error('Error refreshing sessions', err as Error, 'MUSIC'));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [presetsData, sessionsData] = await Promise.all([
        musicService.getActivePresets(),
        musicService.getUserMusicSessions(20),
      ]);
      setPresets(presetsData);
      setSessions(sessionsData);
    } catch (error) {
      logger.error('Error loading music data', error as Error, 'MUSIC');
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les données',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (presetId: string) => {
    try {
      setCreatingSession(presetId);
      const session = await musicService.createMusicSession({
        preset_id: presetId,
      });

      toast({
        title: 'Session créée',
        description: 'Votre session musicale est en cours de génération',
      });

      setSessions([session, ...sessions]);
    } catch (error) {
      logger.error('Error creating session', error as Error, 'MUSIC');
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la session',
        variant: 'destructive',
      });
    } finally {
      setCreatingSession(null);
    }
  };

  const getStatusIcon = (status: MusicSession['status']) => {
    switch (status) {
      case 'pending':
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusLabel = (status: MusicSession['status']) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'processing':
        return 'En cours';
      case 'completed':
        return 'Terminée';
      case 'failed':
        return 'Échec';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Music className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Musicothérapie</h1>
        </div>
        <p className="text-muted-foreground">
          Créez des sessions musicales adaptées à votre état émotionnel
        </p>
      </div>

      {/* Presets */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Presets disponibles</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {presets.map((preset) => (
            <Card key={preset.id} className="p-5">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{preset.name}</h3>
                  {preset.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {preset.description}
                    </p>
                  )}
                </div>

                {preset.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {preset.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <Button
                  onClick={() => handleCreateSession(preset.id)}
                  disabled={creatingSession === preset.id}
                  className="w-full"
                >
                  {creatingSession === preset.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Créer une session
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Sessions History */}
      {sessions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Mes sessions</h2>
          </div>

          <div className="space-y-3">
            {sessions.map((session) => (
              <Card key={session.id} className="p-4 b2c-card">
                {session.status === 'completed' && session.artifact_url ? (
                  <MusicPlayer
                    audioUrl={session.artifact_url}
                    title={`Session du ${new Date(session.ts_start).toLocaleDateString('fr-FR')}`}
                    artist="EmotionsCare Therapy"
                  />
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {getStatusIcon(session.status)}
                      <div className="flex-1">
                        <p className="font-medium">Session musicale</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(session.ts_start).toLocaleString('fr-FR')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm px-3 py-1 rounded-full bg-muted">
                        {getStatusLabel(session.status)}
                      </span>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default B2CMusicPage;
