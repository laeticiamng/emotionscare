/**
 * Composant principal du module breathing-vr
 * Version enrichie avec audio ambiant, statistiques et mode VR amélioré
 */

import { useState, useEffect, useCallback, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  Wind, Volume2, VolumeX, Headphones, 
  Timer, Zap, TrendingUp, Settings2, Sparkles 
} from 'lucide-react';
import { useBreathingVR } from '../useBreathingVR';
import { PatternSelector } from '../ui/PatternSelector';
import { BreathingScene } from '../ui/BreathingScene';
import { BreathingControls } from '../ui/BreathingControls';
import { meditationAudioService, type AmbientSoundType } from '@/services/meditationAudioService';
import { useHaptics } from '@/hooks/useHaptics';
import type { BreathingPattern } from '../types';

const PATTERN_INFO: Record<string, { name: string; description: string; benefits: string[] }> = {
  box: {
    name: 'Respiration carrée',
    description: '4-4-4-4 secondes',
    benefits: ['Calme le mental', 'Réduit l\'anxiété', 'Améliore la concentration']
  },
  coherence: {
    name: 'Cohérence cardiaque',
    description: '5 secondes inspiration/expiration',
    benefits: ['Équilibre le cœur', 'Réduit le stress', 'Améliore la variabilité cardiaque']
  }
};

const AMBIENT_OPTIONS: { id: AmbientSoundType; name: string; icon: string }[] = [
  { id: 'ocean', name: 'Océan', icon: '🌊' },
  { id: 'rain', name: 'Pluie', icon: '🌧️' },
  { id: 'forest', name: 'Forêt', icon: '🌲' },
  { id: 'tibetan_bowl', name: 'Bol tibétain', icon: '🔔' },
];

export const BreathingVRMain = memo(function BreathingVRMain() {
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>('box');
  const [selectedAmbient, setSelectedAmbient] = useState<AmbientSoundType | null>(null);
  const [ambientVolume, setAmbientVolume] = useState(0.4);
  const [showSettings, setShowSettings] = useState(false);
  const [sessionStats, setSessionStats] = useState({ totalSessions: 0, totalMinutes: 0, streak: 0 });
  
  const haptics = useHaptics();
  
  const {
    status,
    currentPhase,
    phaseProgress,
    cyclesCompleted,
    elapsedTime,
    startBreathing,
    pauseBreathing,
    resumeBreathing,
    completeBreathing
  } = useBreathingVR();

  // Charger stats depuis localStorage
  useEffect(() => {
    const stored = localStorage.getItem('breathingVR_stats');
    if (stored) {
      try {
        setSessionStats(JSON.parse(stored));
      } catch {}
    }
  }, []);

  // Haptic feedback synchronisé avec la respiration
  useEffect(() => {
    if (status === 'active') {
      haptics.trigger('breathe');
    }
  }, [currentPhase, status, haptics]);

  // Jouer cloche au début et fin
  useEffect(() => {
    if (status === 'active' && cyclesCompleted === 0 && phaseProgress < 0.1) {
      meditationAudioService.playBell('start');
    }
  }, [status, cyclesCompleted, phaseProgress]);

  const handleStart = useCallback(() => {
    // Jouer son ambiant si sélectionné
    if (selectedAmbient) {
      meditationAudioService.playAmbient(selectedAmbient, ambientVolume);
    }
    meditationAudioService.playBell('start');
    startBreathing(selectedPattern, false);
  }, [selectedPattern, selectedAmbient, ambientVolume, startBreathing]);

  const handleComplete = useCallback(() => {
    meditationAudioService.playBell('end');
    meditationAudioService.stopAmbient();
    
    // Sauvegarder stats
    const newStats = {
      totalSessions: sessionStats.totalSessions + 1,
      totalMinutes: sessionStats.totalMinutes + Math.round(elapsedTime / 60),
      streak: sessionStats.streak + 1, // Simplifié
    };
    setSessionStats(newStats);
    localStorage.setItem('breathingVR_stats', JSON.stringify(newStats));
    
    completeBreathing();
  }, [elapsedTime, sessionStats, completeBreathing]);

  const toggleAmbient = useCallback((soundId: AmbientSoundType) => {
    if (selectedAmbient === soundId) {
      setSelectedAmbient(null);
      meditationAudioService.stopAmbient();
    } else {
      setSelectedAmbient(soundId);
      if (status === 'active') {
        meditationAudioService.playAmbient(soundId, ambientVolume);
      }
    }
  }, [selectedAmbient, status, ambientVolume]);

  const handleVolumeChange = useCallback((value: number[]) => {
    const vol = value[0];
    setAmbientVolume(vol);
    meditationAudioService.setAmbientVolume(vol);
  }, []);

  const isIdle = status === 'idle';
  const patternInfo = PATTERN_INFO[selectedPattern];

  return (
    <div className="container max-w-5xl mx-auto py-8 space-y-6">
      {/* Stats Header */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/20 to-primary/5">
          <CardContent className="pt-4 text-center">
            <Timer className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-2xl font-bold">{sessionStats.totalSessions}</p>
            <p className="text-xs text-muted-foreground">Sessions</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-500/5">
          <CardContent className="pt-4 text-center">
            <TrendingUp className="h-5 w-5 mx-auto mb-1 text-blue-500" />
            <p className="text-2xl font-bold">{sessionStats.totalMinutes}</p>
            <p className="text-xs text-muted-foreground">Minutes</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500/20 to-orange-500/5">
          <CardContent className="pt-4 text-center">
            <Zap className="h-5 w-5 mx-auto mb-1 text-orange-500" />
            <p className="text-2xl font-bold">{sessionStats.streak}</p>
            <p className="text-xs text-muted-foreground">Série</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wind className="h-5 w-5 text-primary" />
              Respiration Guidée VR
            </CardTitle>
            <div className="flex gap-2">
              {status === 'active' && (
                <Badge variant="secondary" className="animate-pulse">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {cyclesCompleted} cycles
                </Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isIdle && (
            <>
              {/* Pattern Selection */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Choisissez votre technique</h3>
                <PatternSelector
                  selected={selectedPattern}
                  onSelect={setSelectedPattern}
                />
                
                {patternInfo && (
                  <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                    <p className="text-sm font-medium">{patternInfo.name}</p>
                    <p className="text-xs text-muted-foreground">{patternInfo.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {patternInfo.benefits.map((b, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {b}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Ambient Sound Selection */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Headphones className="h-4 w-4" />
                  Son ambiant (optionnel)
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {AMBIENT_OPTIONS.map(({ id, name, icon }) => (
                    <Button
                      key={id}
                      variant={selectedAmbient === id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleAmbient(id)}
                      className="gap-1"
                    >
                      <span>{icon}</span>
                      {name}
                    </Button>
                  ))}
                </div>
                
                {selectedAmbient && (
                  <div className="flex items-center gap-3">
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                    <Slider
                      value={[ambientVolume]}
                      onValueChange={handleVolumeChange}
                      max={1}
                      step={0.1}
                      className="flex-1"
                    />
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>

              <Button onClick={handleStart} size="lg" className="w-full">
                <Wind className="mr-2 h-5 w-5" />
                Démarrer la session
              </Button>
            </>
          )}

          {!isIdle && (
            <>
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{currentPhase}</span>
                  <span>{Math.floor(elapsedTime / 60)}:{String(elapsedTime % 60).padStart(2, '0')}</span>
                </div>
                <Progress value={phaseProgress * 100} className="h-2" />
              </div>
              
              <BreathingScene phase={currentPhase} progress={phaseProgress} />
              
              <BreathingControls
                status={status}
                currentPhase={currentPhase}
                cyclesCompleted={cyclesCompleted}
                elapsedTime={elapsedTime}
                onPause={pauseBreathing}
                onResume={resumeBreathing}
                onComplete={handleComplete}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
});

export default BreathingVRMain;
