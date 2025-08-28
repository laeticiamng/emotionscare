import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Gamepad2, Headphones, Clock, Heart, AlertTriangle } from 'lucide-react';

import { XRCanvas } from '@/components/vr/XRCanvas';
import { GalaxySky } from '@/components/vr/GalaxySky';
import { BreathPacerSphere } from '@/components/vr/BreathPacerSphere';
import { VRHUD } from '@/components/vr/VRHUD';
import { VRExitButton } from '@/components/vr/VRExitButton';
import { Fallback2D } from '@/components/vr/Fallback2D';

import { useXRSession } from '@/hooks/useXRSession';
import { useBreathPattern } from '@/hooks/useBreathPattern';
import { useARAnalytics } from '@/hooks/useARAnalytics';
import { type VRPattern } from '@/store/vr.store';

const DURATION_OPTIONS = [
  { value: 180, label: '3 min' },
  { value: 240, label: '4 min' },
  { value: 300, label: '5 min' },
  { value: 360, label: '6 min' },
];

const PATTERN_OPTIONS = [
  { value: '4-2-4', label: '4-2-4 (Équilibré)' },
  { value: '4-6-8', label: '4-6-8 (Relaxant)' },
  { value: '5-5', label: '5-5 (Simple)' },
] as const;

const VRGalaxyPage: React.FC = () => {
  const { xrSupported, inXR, enterXR, exitXR } = useXRSession();
  const {
    running,
    paused,
    pattern,
    duration,
    elapsedTime,
    phase,
    phaseProgress,
    reduceMotion,
    musicEnabled,
    hrvEnabled,
    hrvActive,
    hrvConnected,
    start,
    pause,
    resume,
    stop,
    reset,
    submitMetrics,
    setPattern,
    setDuration,
    setMusicEnabled,
    connectHRV,
    getMetrics,
  } = useBreathPattern();

  const { track } = useARAnalytics();

  // Track page view
  useEffect(() => {
    track('vr.galaxy.open', { xrSupported });
  }, [track, xrSupported]);

  // Handle VR session entry
  const handleEnterXR = async () => {
    const success = await enterXR();
    if (success) {
      track('vr.galaxy.enter', {});
    }
  };

  // Handle VR session exit
  const handleExitXR = async () => {
    // Stop session if running
    if (running) {
      const sessionData = stop();
      await submitMetrics(sessionData);
      track('vr.galaxy.finish', { completed: false });
    }
    
    await exitXR();
    track('vr.galaxy.exit', {});
  };

  // Handle session start
  const handleStart = () => {
    start();
    track('vr.galaxy.start', { pattern, duration, inVR: inXR });
  };

  // Handle session pause
  const handlePause = () => {
    pause();
    track('vr.galaxy.pause', {});
  };

  // Handle session resume
  const handleResume = () => {
    resume();
    track('vr.galaxy.resume', {});
  };

  // Handle session stop
  const handleStop = async () => {
    const sessionData = stop();
    await submitMetrics(sessionData);
    track('vr.galaxy.finish', { completed: elapsedTime >= duration * 0.8 });
    
    // Return to setup if not in VR
    if (!inXR) {
      reset();
    }
  };

  // Handle session completion
  useEffect(() => {
    if (running && elapsedTime >= duration) {
      handleStop();
    }
  }, [running, elapsedTime, duration]);

  // Handle pattern change
  const handlePatternChange = (value: string) => {
    setPattern(value as VRPattern);
  };

  // Handle duration change
  const handleDurationChange = (value: string) => {
    setDuration(parseInt(value));
  };

  // Handle music toggle
  const handleMusicToggle = () => {
    setMusicEnabled(!musicEnabled);
  };

  // Fallback to 2D if WebXR not supported
  if (!xrSupported) {
    track('vr.galaxy.fallback2d', {});
    
    return (
      <Fallback2D
        running={running}
        paused={paused}
        phase={phase}
        pattern={pattern}
        progress={phaseProgress}
        elapsedTime={elapsedTime}
        duration={duration}
        musicEnabled={musicEnabled}
        reduceMotion={reduceMotion}
        onStart={handleStart}
        onPause={handlePause}
        onResume={handleResume}
        onStop={handleStop}
        onToggleMusic={handleMusicToggle}
      />
    );
  }

  // VR Mode - Setup Screen (before entering VR)
  if (!inXR) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gamepad2 className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              VR Galactique
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Cohérence cardiaque en réalité virtuelle. Immergez-vous dans une galaxie apaisante pour une séance de respiration guidée.
          </p>
        </div>

        {/* WebXR Compatibility Check */}
        <Card className="mb-8 bg-emerald-900/20 border-emerald-700/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-emerald-600 text-white">
                ✓ WebXR Supporté
              </Badge>
              <CardTitle className="text-lg text-emerald-300">Casque VR détecté</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-emerald-200">
              Votre appareil supporte la réalité virtuelle. Vous pouvez profiter de l'expérience immersive complète.
            </p>
          </CardContent>
        </Card>

        {/* Session Configuration */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Configuration de la séance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Pattern Selection */}
            <div className="space-y-2">
              <label htmlFor="vr-pattern-select" className="text-sm font-medium">
                Motif respiratoire
              </label>
              <Select value={pattern} onValueChange={handlePatternChange}>
                <SelectTrigger id="vr-pattern-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PATTERN_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Duration Selection */}
            <div className="space-y-2">
              <label htmlFor="vr-duration-select" className="text-sm font-medium">
                Durée de la séance
              </label>
              <Select value={duration.toString()} onValueChange={handleDurationChange}>
                <SelectTrigger id="vr-duration-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DURATION_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Music Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Headphones className="h-4 w-4 text-muted-foreground" />
                <label htmlFor="vr-music-toggle" className="text-sm font-medium">
                  Ambiance musicale
                </label>
              </div>
              <Button
                id="vr-music-toggle"
                variant="outline"
                size="sm"
                onClick={handleMusicToggle}
                className={musicEnabled ? 'bg-primary/10' : ''}
              >
                {musicEnabled ? 'Activée' : 'Désactivée'}
              </Button>
            </div>

            {/* HRV Option */}
            {hrvEnabled && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <label className="text-sm font-medium">
                    Suivi HRV
                  </label>
                  {!hrvConnected && (
                    <Badge variant="outline" className="text-xs">
                      Optionnel
                    </Badge>
                  )}
                </div>
                {hrvConnected ? (
                  <Badge variant="secondary" className="text-xs">
                    Capteur connecté
                  </Badge>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={connectHRV}
                  >
                    Connecter
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* VR Entry */}
        <div className="text-center">
          <Button 
            size="lg"
            onClick={handleEnterXR}
            className="text-lg px-8 py-6 h-auto gap-3"
          >
            <Gamepad2 className="h-5 w-5" />
            Entrer en VR
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Mettez votre casque VR et cliquez pour démarrer l'expérience immersive
          </p>
        </div>

        {/* Tips */}
        <Card className="mt-8 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-lg">Conseils pour une meilleure expérience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Assurez-vous d'avoir suffisamment d'espace autour de vous</p>
            <p>• Ajustez votre casque pour un confort optimal</p>
            <p>• Gardez vos contrôleurs à portée de main</p>
            <p>• La session peut être mise en pause à tout moment</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // VR Mode - In VR Experience
  return (
    <XRCanvas>
      {/* Galaxy Environment */}
      <GalaxySky reducedMotion={reduceMotion} />
      
      {/* Breathing Pacer Sphere */}
      <BreathPacerSphere 
        phase={phase}
        progress={phaseProgress}
        reducedMotion={reduceMotion}
      />
      
      {/* VR User Interface */}
      <VRHUD
        running={running}
        paused={paused}
        phase={phase}
        pattern={pattern}
        elapsedTime={elapsedTime}
        duration={duration}
        musicEnabled={musicEnabled}
        onStart={handleStart}
        onPause={handlePause}
        onResume={handleResume}
        onStop={handleStop}
        onExit={handleExitXR}
        onToggleMusic={handleMusicToggle}
      />
      
      {/* Quick Exit Button */}
      <VRExitButton 
        onExit={handleExitXR}
        variant="minimal"
      />
    </XRCanvas>
  );
};

export default VRGalaxyPage;