/**
 * Composants UI pour VR Nebula
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, Glasses, Wind, Activity, Timer, Trophy } from 'lucide-react';
import { useVRNebula } from '../useVRNebula';
import type { NebulaScene, BreathingPattern, VRNebulaStats } from '../types';

const SCENE_OPTIONS: { value: NebulaScene; label: string; description: string }[] = [
  { value: 'cosmos', label: 'Cosmos', description: 'Couleurs cosmiques apaisantes' },
  { value: 'aurora', label: 'Aurore Boréale', description: 'Lumières dansantes du nord' },
  { value: 'galaxy', label: 'Galaxie', description: 'Immensité stellaire calme' },
  { value: 'ocean', label: 'Océan cosmique', description: 'Vagues de lumière spatiale' },
];

const PATTERN_OPTIONS: { value: BreathingPattern; label: string; description: string }[] = [
  { value: 'box', label: 'Carré (4-4-4-4)', description: 'Équilibre et stabilité' },
  { value: 'relax', label: 'Relaxation (4-7-8)', description: 'Détente profonde' },
  { value: 'energize', label: 'Énergisant (4-4-2)', description: 'Boost d\'énergie' },
  { value: 'coherence', label: 'Cohérence (5-5)', description: 'Cohérence cardiaque' },
];

export const VRNebulaSessionPanel: React.FC = () => {
  const {
    currentSession,
    isSessionActive,
    startSession,
    endSession,
    cancelSession,
    isStartingSession,
    isEndingSession,
  } = useVRNebula();

  const [selectedScene, setSelectedScene] = useState<NebulaScene>('cosmos');
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>('coherence');
  const [vrModeEnabled, setVrModeEnabled] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isSessionActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds(s => s + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isSessionActive, isPaused]);

  const handleStart = async () => {
    setElapsedSeconds(0);
    setCyclesCompleted(0);
    await startSession(selectedScene, selectedPattern, vrModeEnabled);
  };

  const handleComplete = async () => {
    await endSession(elapsedSeconds, cyclesCompleted);
    setElapsedSeconds(0);
    setCyclesCompleted(0);
  };

  const handleCancel = () => {
    cancelSession();
    setElapsedSeconds(0);
    setCyclesCompleted(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isSessionActive) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary animate-pulse" />
            Session en cours
          </CardTitle>
          <CardDescription>
            {SCENE_OPTIONS.find(s => s.value === currentSession?.scene)?.label} - 
            {PATTERN_OPTIONS.find(p => p.value === currentSession?.breathing_pattern)?.label}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <div className="text-5xl font-mono font-bold text-primary">
              {formatTime(elapsedSeconds)}
            </div>
          </div>

          <div className="flex justify-center items-center gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold">{cyclesCompleted}</p>
              <p className="text-sm text-muted-foreground">Cycles</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCyclesCompleted(c => c + 1)}
            >
              +1 cycle
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsPaused(!isPaused)}
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleCancel}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button
              className="flex-1"
              onClick={handleComplete}
              disabled={isEndingSession || elapsedSeconds < 30}
            >
              Terminer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind className="h-5 w-5" />
          Nouvelle session VR Nebula
        </CardTitle>
        <CardDescription>
          Respiration guidée immersive dans l'espace
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Environnement</Label>
          <Select value={selectedScene} onValueChange={(v) => setSelectedScene(v as NebulaScene)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SCENE_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  <div>
                    <div className="font-medium">{opt.label}</div>
                    <div className="text-xs text-muted-foreground">{opt.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Pattern respiratoire</Label>
          <Select value={selectedPattern} onValueChange={(v) => setSelectedPattern(v as BreathingPattern)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PATTERN_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  <div>
                    <div className="font-medium">{opt.label}</div>
                    <div className="text-xs text-muted-foreground">{opt.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-2">
            <Glasses className="h-4 w-4" />
            <Label htmlFor="vr-mode">Mode VR</Label>
          </div>
          <Switch
            id="vr-mode"
            checked={vrModeEnabled}
            onCheckedChange={setVrModeEnabled}
          />
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={handleStart}
          disabled={isStartingSession}
        >
          <Play className="h-4 w-4 mr-2" />
          Démarrer la session
        </Button>
      </CardContent>
    </Card>
  );
};

export const VRNebulaStatsPanel: React.FC<{ stats?: VRNebulaStats }> = ({ stats }) => {
  if (!stats) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Chargement des statistiques...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Statistiques
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-2xl font-bold">{stats.total_sessions}</p>
            <p className="text-xs text-muted-foreground">Sessions totales</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-2xl font-bold">{Math.round(stats.total_minutes)}</p>
            <p className="text-xs text-muted-foreground">Minutes</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-2xl font-bold">{stats.total_breaths}</p>
            <p className="text-xs text-muted-foreground">Cycles respiratoires</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-2xl font-bold">{stats.current_streak_days}</p>
            <p className="text-xs text-muted-foreground">Jours de suite</p>
          </div>
        </div>

        {stats.average_coherence > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Cohérence moyenne</span>
              <span className="font-medium">{Math.round(stats.average_coherence)}%</span>
            </div>
            <Progress value={stats.average_coherence} />
          </div>
        )}

        {stats.favorite_scene && (
          <div className="flex items-center justify-between p-2 rounded-lg border">
            <span className="text-sm">Scène favorite</span>
            <Badge variant="secondary">
              {SCENE_OPTIONS.find(s => s.value === stats.favorite_scene)?.label || stats.favorite_scene}
            </Badge>
          </div>
        )}

        {stats.favorite_pattern && (
          <div className="flex items-center justify-between p-2 rounded-lg border">
            <span className="text-sm">Pattern favori</span>
            <Badge variant="secondary">
              {PATTERN_OPTIONS.find(p => p.value === stats.favorite_pattern)?.label || stats.favorite_pattern}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const VRNebulaHistoryPanel: React.FC = () => {
  const { recentSessions, isLoadingRecent } = useVRNebula();

  if (isLoadingRecent) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Chargement de l'historique...
        </CardContent>
      </Card>
    );
  }

  if (!recentSessions.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Historique
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center text-muted-foreground">
          Aucune session récente. Commencez votre première exploration !
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5" />
          Sessions récentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {recentSessions.slice(0, 5).map((session) => (
            <li key={session.id} className="flex items-center justify-between p-2 rounded-lg border">
              <div>
                <p className="font-medium text-sm">
                  {SCENE_OPTIONS.find(s => s.value === session.scene)?.label || session.scene}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(session.created_at).toLocaleDateString('fr-FR')} - {Math.round((session.duration_s || 0) / 60)} min
                </p>
              </div>
              {session.coherence_score && (
                <Badge variant="outline">{Math.round(session.coherence_score)}%</Badge>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
