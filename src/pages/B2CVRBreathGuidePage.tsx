/**
 * B2C VR Breath - Le fil d'Ariane respiratoire
 * Pitch : Tu suis une lueur qui te met au bon rythme sans t'épuiser.
 * Boucle cœur : Mise en place → 6–8 min de pacing → étiquette "élevée / ok / à retravailler".
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Eye, EyeOff, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

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
    <div className="min-h-screen bg-gradient-to-br from-background via-blue/5 to-background p-4">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <motion.div
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
              variant="outline"
              size="sm"
              className={isVRMode ? 'bg-primary/20 border-primary' : ''}
            >
              {isVRMode ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
              {isVRMode ? 'VR Activé' : 'Mode 2D'}
            </Button>
          </div>
        </motion.div>

        {/* Session Setup */}
        {!isActive && !sessionComplete && (
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
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-blue-500 font-medium">{session.inhaleTime}s</div>
                    <div className="text-muted-foreground">Inspire</div>
                  </div>
                  <div className="text-center">
                    <div className="text-yellow-500 font-medium">{session.holdTime}s</div>
                    <div className="text-muted-foreground">Retiens</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-500 font-medium">{session.exhaleTime}s</div>
                    <div className="text-muted-foreground">Expire</div>
                  </div>
                </div>
                
                <Button onClick={handleStart} className="w-full h-12 mt-6">
                  <Play className="w-5 h-5 mr-2" />
                  Commencer la session
                </Button>
              </div>
            </Card>
          </motion.div>
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
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={isActive ? handlePause : handleStart}
                  size="lg"
                  className="w-16 h-16 rounded-full"
                >
                  {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </Button>
                
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="lg"
                  className="w-16 h-16 rounded-full"
                >
                  <RotateCcw className="w-6 h-6" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Session Complete */}
        <AnimatePresence>
          {sessionComplete && (
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
                  <div className="flex justify-center space-x-2">
                    {(['élevée', 'ok', 'à retravailler'] as const).map((level) => (
                      <Button
                        key={level}
                        onClick={() => handleRating(level)}
                        variant={rating === level ? 'default' : 'outline'}
                        size="sm"
                        className={`capitalize ${
                          level === 'élevée' ? 'hover:bg-green-500/20' :
                          level === 'ok' ? 'hover:bg-yellow-500/20' :
                          'hover:bg-red-500/20'
                        }`}
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {rating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6"
                  >
                    <p className="text-sm text-muted-foreground mb-4">
                      {rating === 'élevée' && "Excellent ! Tu débloques de nouvelles ambiances."}
                      {rating === 'ok' && "Bien joué ! La pratique fait la différence."}
                      {rating === 'à retravailler' && "Pas de souci, chaque respiration compte."}
                    </p>
                    
                    <div className="space-y-2">
                      <Button onClick={handleReset} className="w-full">
                        Nouvelle session
                      </Button>
                      <Button variant="outline" className="w-full">
                        Flash Glow (2 min)
                      </Button>
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}