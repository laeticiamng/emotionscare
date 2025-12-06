/**
 * ScreenSilkPage - Page principale du module Screen Silk
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as Sentry from '@sentry/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Play, Pause, Square, Settings, 
  Eye, EyeOff, Timer, Sparkles,
  ArrowLeft, HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useScreenSilkMachine, type ScreenSilkConfig } from './useScreenSilkMachine';
import { SilkOverlay } from './ui/SilkOverlay';
import { BlinkGuide } from './ui/BlinkGuide';

export const ScreenSilkPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const logSessionEvent = useCallback(
    (message: string, level: 'info' | 'error' = 'info', data?: Record<string, unknown>) => {
      const client = Sentry.getCurrentHub().getClient();
      if (!client) {
        return;
      }
      Sentry.addBreadcrumb({
        category: 'session',
        level,
        message,
        data,
      });
    },
    [],
  );

  const completionOriginRef = useRef<'auto' | 'manual'>('auto');
  const interruptOriginRef = useRef<'manual' | 'machine'>('machine');
  
  const [duration, setDuration] = useState([120]); // 2 minutes par défaut
  const [enableBlur, setEnableBlur] = useState(true);
  const [blinkInterval] = useState(20); // toutes les 20 secondes

  const config: ScreenSilkConfig = {
    duration: duration[0],
    enableBlur,
    blinkInterval,
    onComplete: (label) => {
      logSessionEvent('session:complete', 'info', {
        label,
        origin: completionOriginRef.current,
      });
      completionOriginRef.current = 'auto';
      const messages = {
        gain: "Excellente pause ! Vos yeux vous remercient ✨",
        léger: "Pause bénéfique, continuez ainsi 👀",
        incertain: "Chaque effort compte, même petit 💪"
      };
      
      toast({
        title: "Pause terminée",
        description: messages[label],
      });
    },
    onInterrupt: () => {
      logSessionEvent('session:interrupt', 'info', {
        origin: interruptOriginRef.current,
      });
      interruptOriginRef.current = 'machine';
      toast({
        title: "Pause interrompue",
        description: "Pas de souci, vous pouvez reprendre quand vous voulez",
        variant: "destructive"
      });
    }
  };

  const {
    state,
    data,
    startSession,
    interrupt,
    completeWithLabel,
    isActive,
    isLoading,
    error,
  } = useScreenSilkMachine(config);

  useEffect(() => {
    if (!error) {
      return;
    }
    logSessionEvent('session:error', 'error', {
      reason: error instanceof Error ? error.message : 'unknown',
    });
  }, [error, logSessionEvent]);

  const handleStart = () => {
    completionOriginRef.current = 'auto';
    interruptOriginRef.current = 'machine';
    logSessionEvent('session:start', 'info', {
      duration: duration[0],
      enableBlur,
      blinkInterval,
    });
    startSession();
    
    // Analytics
    if (window.gtag) {
      window.gtag('event', 'silk_start', {
        event_category: 'module',
        event_label: 'screen-silk',
        value: duration[0]
      });
    }
  };

  const handleStop = () => {
    interruptOriginRef.current = 'manual';
    interrupt();
  };

  const handleManualComplete = (label: 'gain' | 'léger' | 'incertain') => {
    completionOriginRef.current = 'manual';
    completeWithLabel(label);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDurationLabel = (seconds: number): string => {
    if (seconds <= 60) return 'Express';
    if (seconds <= 120) return 'Courte';
    if (seconds <= 180) return 'Standard';
    return 'Longue';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/5 p-6" data-testid="page-root">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/app/home')}
              className="hover:bg-accent/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Screen Silk
              </h1>
              <p className="text-muted-foreground">Micro-pause écran apaisante</p>
            </div>
          </div>
          <Badge variant="outline" className="gap-2">
            <Sparkles className="h-3 w-3" />
            Module Bien-être
          </Badge>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-primary" />
                  Configuration de la Pause
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Durée */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Durée de la pause</label>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {getDurationLabel(duration[0])}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatTime(duration[0])}
                      </span>
                    </div>
                  </div>
                  <Slider
                    value={duration}
                    onValueChange={setDuration}
                    max={300}
                    min={30}
                    step={30}
                    className="w-full"
                    disabled={isActive}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>30s</span>
                    <span>Express</span>
                    <span>Courte</span>
                    <span>Standard</span>
                    <span>5min</span>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Options visuelles</h4>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Effet de flou progressif</span>
                    </div>
                    <Button
                      variant={enableBlur ? "default" : "outline"}
                      size="sm"
                      onClick={() => setEnableBlur(!enableBlur)}
                      disabled={isActive}
                    >
                      {enableBlur ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Contrôles principaux */}
                <div className="flex gap-4 justify-center pt-4">
                  <AnimatePresence mode="wait">
                    {!isActive ? (
                      <motion.div
                        key="start"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <Button
                          onClick={handleStart}
                          size="lg"
                          className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <div className="w-4 h-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                              Préparation...
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4" />
                              Commencer la Pause
                            </>
                          )}
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="controls"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex gap-3"
                      >
                        <Button
                          onClick={handleStop}
                          size="lg"
                          variant="destructive"
                          className="gap-2"
                        >
                          <Square className="h-4 w-4" />
                          Arrêter
                        </Button>
                        <Button
                          onClick={() => handleManualComplete('gain')}
                          size="lg"
                          variant="default"
                          className="gap-2"
                        >
                          <Sparkles className="h-4 w-4" />
                          Terminé
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>

            {/* Informations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-accent" />
                  Comment ça marche ?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Préparation</p>
                      <p className="text-muted-foreground">L'écran se prépare avec un overlay apaisant</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Pause active</p>
                      <p className="text-muted-foreground">Détendez vos yeux, des guides de clignement apparaîtront</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-xs font-bold text-secondary">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Sortie douce</p>
                      <p className="text-muted-foreground">Retour progressif avec feedback positif</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* État actuel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  État de la Session
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <motion.div
                    animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-4xl font-mono font-bold mb-2"
                  >
                    {formatTime(data.timeRemaining)}
                  </motion.div>
                  <Badge variant={isActive ? "default" : "secondary"}>
                    {isActive ? `Phase: ${data.phase}` : 'Inactif'}
                  </Badge>
                </div>

                {data.session && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Session ID:</span>
                      <span className="font-mono text-xs">{data.session.id.slice(-6)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Clignements:</span>
                      <span>{data.session.blinkCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Durée prévue:</span>
                      <span>{formatTime(data.session.duration)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Conseils */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">💡 Conseils</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2 text-muted-foreground">
                <p>• Regardez au loin pendant la pause</p>
                <p>• Détendez vos épaules et votre nuque</p>
                <p>• Clignez naturellement quand guidé</p>
                <p>• Utilisez Échap pour interrompre</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Overlays modaux */}
      <SilkOverlay
        isActive={isActive}
        timeRemaining={data.timeRemaining}
        totalDuration={duration[0]}
        phase={data.phase}
        enableBlur={enableBlur}
        onEscape={handleStop}
      />

      <BlinkGuide
        isActive={isActive && data.blinkGuideActive}
        onBlink={() => {
          // Le service gère déjà l'incrémentation
        }}
      />
    </div>
  );
};

export default ScreenSilkPage;