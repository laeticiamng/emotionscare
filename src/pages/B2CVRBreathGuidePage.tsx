/**
 * B2C VR BREATH GUIDE PAGE - EMOTIONSCARE
 * Page VR respiration accessible WCAG 2.1 AA
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ConsentGate } from '@/features/clinical-optin/ConsentGate';

interface BreathSession {
  duration: number; // en secondes
  inhaleTime: number;
  holdTime: number;
  exhaleTime: number;
  currentPhase: 'inhale' | 'hold' | 'exhale';
  cycleCount: number;
}

export default function B2CVRBreathGuidePage() {
  const [isVRMode, setIsVRMode] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [session, setSession] = useState<BreathSession>({
    duration: 360, // 6 minutes
    inhaleTime: 4,
    holdTime: 2,
    exhaleTime: 6,
    currentPhase: 'inhale',
    cycleCount: 0
  });
  const [phaseTime, setPhaseTime] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [rating, setRating] = useState<'élevée' | 'ok' | 'à retravailler' | null>(null);

  // Focus management pour l'accessibilité
  useEffect(() => {
    document.title = "VR Breath - Respiration guidée | EmotionsCare";
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  // Gestion des phases de respiration
  useEffect(() => {
    let timer: number;
    
    if (isActive && !sessionComplete) {
      timer = window.setInterval(() => {
        setSessionTime(prev => {
          const newTime = prev + 1;
          if (newTime >= session.duration) {
            setSessionComplete(true);
            setIsActive(false);
            return session.duration;
          }
          return newTime;
        });
        
        setPhaseTime(prev => {
          const newPhaseTime = prev + 1;
          const currentPhaseDuration = getCurrentPhaseDuration();
          
          if (newPhaseTime >= currentPhaseDuration) {
            moveToNextPhase();
            return 0;
          }
          return newPhaseTime;
        });
      }, 1000);
    }
    
    return () => clearInterval(timer);
  }, [isActive, session, sessionComplete]);

  const getCurrentPhaseDuration = () => {
    switch (session.currentPhase) {
      case 'inhale': return session.inhaleTime;
      case 'hold': return session.holdTime;
      case 'exhale': return session.exhaleTime;
      default: return session.inhaleTime;
    }
  };

  const moveToNextPhase = () => {
    setSession(prev => {
      let nextPhase: 'inhale' | 'hold' | 'exhale';
      let newCycleCount = prev.cycleCount;
      
      switch (prev.currentPhase) {
        case 'inhale':
          nextPhase = 'hold';
          break;
        case 'hold':
          nextPhase = 'exhale';
          break;
        case 'exhale':
          nextPhase = 'inhale';
          newCycleCount += 1;
          break;
        default:
          nextPhase = 'inhale';
      }
      
      return {
        ...prev,
        currentPhase: nextPhase,
        cycleCount: newCycleCount
      };
    });
  };

  const handleStart = () => {
    setIsActive(true);
    setSessionTime(0);
    setPhaseTime(0);
    setSessionComplete(false);
    setRating(null);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setSessionTime(0);
    setPhaseTime(0);
    setSessionComplete(false);
    setRating(null);
    setSession(prev => ({
      ...prev,
      currentPhase: 'inhale',
      cycleCount: 0
    }));
  };

  const handleRating = (newRating: 'élevée' | 'ok' | 'à retravailler') => {
    setRating(newRating);
  };

  const getPhaseColor = () => {
    switch (session.currentPhase) {
      case 'inhale': return 'hsl(200, 70%, 60%)'; // Bleu
      case 'hold': return 'hsl(50, 80%, 60%)';   // Jaune
      case 'exhale': return 'hsl(120, 60%, 60%)'; // Vert
      default: return 'hsl(200, 70%, 60%)';
    }
  };

  const getPhaseText = () => {
    switch (session.currentPhase) {
      case 'inhale': return 'Inspire';
      case 'hold': return 'Retiens';
      case 'exhale': return 'Expire';
      default: return 'Inspire';
    }
  };

  const progress = (sessionTime / session.duration) * 100;
  const phaseProgress = (phaseTime / getCurrentPhaseDuration()) * 100;

  return (
    <ConsentGate>
      <>
      {/* Skip Links pour l'accessibilité */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
        tabIndex={0}
      >
        Aller au contenu principal
      </a>

      <div className="min-h-screen bg-gradient-to-br from-background via-blue/5 to-background p-4" data-testid="page-root">
        <main id="main-content" role="main" className="max-w-md mx-auto pt-8">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              VR Breath
            </h1>
            <p className="text-muted-foreground text-sm">
              Le fil d'Ariane respiratoire
            </p>
            
            {/* VR Toggle */}
            <div className="flex items-center justify-center mt-4 space-x-2">
              <Button
                onClick={() => setIsVRMode(!isVRMode)}
                onKeyDown={(e) => handleKeyDown(e, () => setIsVRMode(!isVRMode))}
                variant="outline"
                size="sm"
                className={`focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isVRMode ? 'bg-primary/20 border-primary' : ''}`}
                aria-pressed={isVRMode}
                aria-label={isVRMode ? 'Désactiver le mode VR' : 'Activer le mode VR'}
                tabIndex={0}
              >
                {isVRMode ? <Eye className="w-4 h-4 mr-2" aria-hidden="true" /> : <EyeOff className="w-4 h-4 mr-2" aria-hidden="true" />}
                {isVRMode ? 'VR Activé' : 'Mode 2D'}
              </Button>
            </div>
          </motion.header>

          {/* Session Setup */}
          {!isActive && !sessionComplete && (
            <section aria-labelledby="session-setup-title">
              <h2 id="session-setup-title" className="sr-only">Configuration de la session de respiration</h2>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <Card className="p-6">
                  <div className="text-center space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      Session {Math.floor(session.duration / 60)} minutes
                    </h3>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm" role="group" aria-label="Rythme de respiration">
                      <div className="text-center">
                        <div className="text-info font-medium" aria-label={`${session.inhaleTime} secondes`}>
                          {session.inhaleTime}s
                        </div>
                        <div className="text-muted-foreground">Inspire</div>
                      </div>
                      <div className="text-center">
                        <div className="text-warning font-medium" aria-label={`${session.holdTime} secondes`}>
                          {session.holdTime}s
                        </div>
                        <div className="text-muted-foreground">Retiens</div>
                      </div>
                      <div className="text-center">
                        <div className="text-success font-medium" aria-label={`${session.exhaleTime} secondes`}>
                          {session.exhaleTime}s
                        </div>
                        <div className="text-muted-foreground">Expire</div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleStart} 
                      onKeyDown={(e) => handleKeyDown(e, handleStart)}
                      className="w-full h-12 mt-6 focus:ring-2 focus:ring-primary focus:ring-offset-2" 
                      aria-label="Commencer la session de respiration guidée"
                      tabIndex={0}
                    >
                      <Play className="w-5 h-5 mr-2" aria-hidden="true" />
                      Commencer la session
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </section>
          )}

        {/* Active Session */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              {/* Breathing Visualizer */}
              <div className="relative h-64 flex items-center justify-center">
                <motion.div
                  className="w-40 h-40 rounded-full border-4 flex items-center justify-center"
                  style={{ 
                    borderColor: getPhaseColor(),
                    backgroundColor: `${getPhaseColor()}20`
                  }}
                  animate={{
                    scale: session.currentPhase === 'inhale' ? [1, 1.2] : 
                           session.currentPhase === 'exhale' ? [1.2, 1] : 1.1,
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: getCurrentPhaseDuration(),
                    repeat: 0,
                    ease: "easeInOut"
                  }}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground mb-1">
                      {getPhaseText()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getCurrentPhaseDuration() - phaseTime}s
                    </div>
                  </div>
                </motion.div>
                
                {/* Ambient Particles (VR simulation) */}
                {isVRMode && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-primary/30 rounded-full"
                        style={{
                          left: `${20 + (i * 10)}%`,
                          top: `${30 + (i * 8)}%`
                        }}
                        animate={{
                          scale: [0.5, 1, 0.5],
                          opacity: [0.3, 0.8, 0.3],
                          y: [-10, 10, -10]
                        }}
                        transition={{
                          duration: 3 + (i * 0.5),
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Progress */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Session</span>
                    <span>{Math.floor(sessionTime / 60)}:{(sessionTime % 60).toString().padStart(2, '0')} / {Math.floor(session.duration / 60)}:00</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Phase {getPhaseText()}</span>
                    <span>Cycle {session.cycleCount + 1}</span>
                  </div>
                  <Progress 
                    value={phaseProgress} 
                    className="h-1"
                    style={{ backgroundColor: `${getPhaseColor()}30` }}
                  />
                </div>
              </div>

              {/* Controls */}
              <nav aria-label="Contrôles de la session" className="flex justify-center space-x-4">
                <Button
                  onClick={isActive ? handlePause : handleStart}
                  onKeyDown={(e) => handleKeyDown(e, isActive ? handlePause : handleStart)}
                  size="lg"
                  className="w-16 h-16 rounded-full focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label={isActive ? 'Mettre en pause la session' : 'Reprendre la session'}
                  tabIndex={0}
                >
                  {isActive ? <Pause className="w-6 h-6" aria-hidden="true" /> : <Play className="w-6 h-6" aria-hidden="true" />}
                </Button>
                
                <Button
                  onClick={handleReset}
                  onKeyDown={(e) => handleKeyDown(e, handleReset)}
                  variant="outline"
                  size="lg"
                  className="w-16 h-16 rounded-full focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="Réinitialiser la session"
                  tabIndex={0}
                >
                  <RotateCcw className="w-6 h-6" aria-hidden="true" />
                </Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Session Complete */}
        <AnimatePresence>
          {sessionComplete && (
            <section aria-labelledby="session-complete-title">
              <h2 id="session-complete-title" className="sr-only">Session terminée - Évaluation</h2>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Session terminée !
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {session.cycleCount} cycles • {Math.floor(sessionTime / 60)} minutes
                  </p>
                  
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">Comment te sens-tu ?</p>
                    <fieldset>
                      <legend className="sr-only">Évaluation de la session</legend>
                      <div className="flex justify-center space-x-2" role="radiogroup" aria-label="Évaluation de votre ressenti">
                        {(['élevée', 'ok', 'à retravailler'] as const).map((level) => (
                          <Button
                            key={level}
                            onClick={() => handleRating(level)}
                            onKeyDown={(e) => handleKeyDown(e, () => handleRating(level))}
                            variant={rating === level ? 'default' : 'outline'}
                            size="sm"
                            className={`capitalize focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                              level === 'élevée' ? 'hover:bg-success/20' :
                              level === 'ok' ? 'hover:bg-warning/20' :
                              'hover:bg-destructive/20'
                            }`}
                            role="radio"
                            aria-checked={rating === level}
                            tabIndex={rating === level ? 0 : -1}
                            aria-label={`Évaluer la session comme ${level}`}
                          >
                            {level}
                          </Button>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                  
                  {rating && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-6"
                      role="status"
                      aria-live="polite"
                    >
                      <p className="text-sm text-muted-foreground mb-4">
                        {rating === 'élevée' && "Excellent ! Tu débloques de nouvelles ambiances."}
                        {rating === 'ok' && "Bien joué ! La pratique fait la différence."}
                        {rating === 'à retravailler' && "Pas de souci, chaque respiration compte."}
                      </p>
                      
                      <nav aria-label="Actions après la session" className="space-y-2">
                        <Button 
                          onClick={handleReset} 
                          onKeyDown={(e) => handleKeyDown(e, handleReset)}
                          className="w-full focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          aria-label="Commencer une nouvelle session de respiration"
                          tabIndex={0}
                        >
                          Nouvelle session
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          aria-label="Accéder à Flash Glow - session courte de 2 minutes"
                          tabIndex={0}
                        >
                          Flash Glow (2 min)
                        </Button>
                      </nav>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            </section>
          )}
        </AnimatePresence>
      </main>
      </div>
      </>
    </ConsentGate>
  );
}
