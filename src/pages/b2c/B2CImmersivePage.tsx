// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { immersiveService } from '@/services/b2c/immersiveService';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Loader2, Eye, History } from 'lucide-react';
import { VRViewer } from '@/components/b2c/VRViewer';

type SessionType = 'vr' | 'ambilight' | 'audio';

const B2CImmersivePage: React.FC = () => {
  const { toast } = useToast();
  const [type, setType] = useState<SessionType>('vr');
  const [theme, setTheme] = useState('forest');
  const [intensity, setIntensity] = useState(0.7);
  const [duration, setDuration] = useState(10);
  const [isStarting, setIsStarting] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [currentOutcome, setCurrentOutcome] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const sessions = await immersiveService.getUserSessions(10);
      setHistory(sessions);
    } catch (error) {
      logger.error('Error loading history', error as Error, 'UI');
    }
  };

  const handleStartSession = async () => {
    try {
      setIsStarting(true);
      setIsActive(true);
      setCurrentOutcome(null);

      const result = await immersiveService.startSession({
        type,
        params: {
          duration_minutes: duration,
          intensity,
          theme,
        },
      });

      toast({
        title: 'Session démarrée',
        description: `Votre session ${type} a commencé`,
      });

      // Simuler la durée de la session
      setTimeout(() => {
        setCurrentOutcome(result.outcome);
        setIsActive(false);
        loadHistory();
        
        toast({
          title: 'Session terminée',
          description: 'Votre expérience immersive est complète',
        });
      }, duration * 1000); // Simuler en secondes pour le démo (normalement minutes)

    } catch (error) {
      logger.error('Error starting session', error as Error, 'UI');
      toast({
        title: 'Erreur',
        description: 'Impossible de démarrer la session',
        variant: 'destructive',
      });
      setIsActive(false);
    } finally {
      setIsStarting(false);
    }
  };

  const themes = [
    { value: 'forest', label: 'Forêt' },
    { value: 'ocean', label: 'Océan' },
    { value: 'sunset', label: 'Coucher de soleil' },
    { value: 'night', label: 'Nuit étoilée' },
    { value: 'calm', label: 'Calme & Zen' },
  ];

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Expériences Immersives</h1>
        </div>
        <p className="text-muted-foreground">
          Plongez dans des environnements apaisants et régénérants
        </p>
      </div>

      {/* VR Viewer */}
      {isActive && (
        <VRViewer
          type={type}
          theme={theme}
          intensity={intensity}
          onIntensityChange={setIntensity}
          isActive={isActive}
        />
      )}

      {/* Outcome Display */}
      {currentOutcome && !isActive && (
        <Card className="b2c-card border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Résultat de votre session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{currentOutcome}</p>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Configuration */}
        <Card className="b2c-card">
          <CardHeader>
            <CardTitle>Configuration de la séance</CardTitle>
            <CardDescription>
              Personnalisez votre expérience immersive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Type Selection */}
            <div className="space-y-2">
              <Label>Type d'expérience</Label>
              <Select value={type} onValueChange={(v) => setType(v as SessionType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vr">Réalité Virtuelle (VR)</SelectItem>
                  <SelectItem value="ambilight">Ambilight</SelectItem>
                  <SelectItem value="audio">Audio Immersif</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Theme Selection */}
            <div className="space-y-2">
              <Label>Thème</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {themes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label>Durée (minutes)</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[duration]}
                  onValueChange={([v]) => setDuration(v)}
                  min={5}
                  max={30}
                  step={5}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-12 text-right">{duration} min</span>
              </div>
            </div>

            {/* Intensity */}
            <div className="space-y-2">
              <Label>Intensité</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[intensity]}
                  onValueChange={([v]) => setIntensity(v)}
                  min={0.1}
                  max={1}
                  step={0.1}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-12 text-right">
                  {Math.round(intensity * 100)}%
                </span>
              </div>
            </div>

            {/* Start Button */}
            <Button
              onClick={handleStartSession}
              disabled={isStarting || isActive}
              className="w-full"
              size="lg"
            >
              {isStarting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Démarrage...
                </>
              ) : isActive ? (
                <>
                  <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
                  Session en cours...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Démarrer l'expérience
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Historique
            </CardTitle>
            <CardDescription>
              Vos sessions précédentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {history.length > 0 ? (
              <div className="space-y-3">
                {history.map((session) => (
                  <div
                    key={session.id}
                    className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium capitalize">{session.type}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(session.ts_start).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    {session.outcome_text && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {session.outcome_text}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Aucune session précédente
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2CImmersivePage;
