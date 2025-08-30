/**
 * B2C Breathwork - Ton souffle, pas un chrono
 * Pitch : L'app s'adapte à ton expiration réelle.
 * Boucle cœur : Choisir "Lent/Confort/Tonique" → Auto-cadence via micro → 3–6 min → "bien / ok / à travailler".
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Moon, Wind, Zap, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface BreathSession {
  mode: 'lent' | 'confort' | 'tonique';
  isActive: boolean;
  sessionTime: number;
  targetDuration: number;
  micEnabled: boolean;
  currentPhase: 'inhale' | 'exhale';
  naturalRhythm: number; // En secondes
  adaptiveRhythm: boolean;
}

const BreathModes = {
  lent: {
    name: 'Lent',
    description: 'Relaxation profonde, préparation au sommeil',
    icon: Moon,
    color: 'hsl(240, 50%, 60%)',
    baseRhythm: 8, // secondes d'expiration de base
    targetDuration: 360, // 6 minutes
    suggestion: 'Parfait pour l\'endormissement'
  },
  confort: {
    name: 'Confort',
    description: 'Équilibre naturel, détente quotidienne',
    icon: Wind,
    color: 'hsl(200, 60%, 60%)',
    baseRhythm: 6,
    targetDuration: 240, // 4 minutes
    suggestion: 'Idéal pour une pause bien-être'
  },
  tonique: {
    name: 'Tonique',
    description: 'Énergie douce, réveil progressif',
    icon: Zap,
    color: 'hsl(45, 70%, 60%)',
    baseRhythm: 4,
    targetDuration: 180, // 3 minutes
    suggestion: 'Excellente pour débuter la journée'
  }
};

export default function B2CBreathworkAdaptivePage() {
  const [session, setSession] = useState<BreathSession>({
    mode: 'confort',
    isActive: false,
    sessionTime: 0,
    targetDuration: 240,
    micEnabled: false,
    currentPhase: 'exhale',
    naturalRhythm: 6,
    adaptiveRhythm: false
  });
  
  const [sessionComplete, setSessionComplete] = useState(false);
  const [rating, setRating] = useState<'bien' | 'ok' | 'à travailler' | null>(null);
  const [atmospheres, setAtmospheres] = useState<string[]>([]);
  const [sleepMode, setSleepMode] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const analysisRef = useRef<AudioContext | null>(null);

  // Gestion du timer principal
  useEffect(() => {
    let timer: number;
    
    if (session.isActive && !sessionComplete) {
      timer = window.setInterval(() => {
        setSession(prev => {
          const newTime = prev.sessionTime + 1;
          
          if (newTime >= prev.targetDuration) {
            setSessionComplete(true);
            return { ...prev, isActive: false, sessionTime: prev.targetDuration };
          }
          
          return { ...prev, sessionTime: newTime };
        });
      }, 1000);
    }
    
    return () => clearInterval(timer);
  }, [session.isActive, sessionComplete]);

  // Analyse audio en temps réel
  useEffect(() => {
    if (session.micEnabled && session.isActive) {
      startBreathAnalysis();
    } else {
      stopBreathAnalysis();
    }
    
    return () => stopBreathAnalysis();
  }, [session.micEnabled, session.isActive]);

  const startBreathAnalysis = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const audioContext = new AudioContext();
      analysisRef.current = audioContext;
      
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      
      source.connect(analyser);
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const analyse = () => {
        if (!analysisRef.current) return;
        
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        
        // Détection simple des phases respiratoires
        if (average > 30) { // Inspiration détectée
          setSession(prev => ({ ...prev, currentPhase: 'inhale' }));
        } else if (average < 15) { // Expiration détectée
          setSession(prev => ({ ...prev, currentPhase: 'exhale' }));
        }
        
        requestAnimationFrame(analyse);
      };
      
      analyse();
      
    } catch (error) {
      console.warn('Microphone non accessible:', error);
      setSession(prev => ({ ...prev, micEnabled: false }));
    }
  };

  const stopBreathAnalysis = () => {
    if (analysisRef.current) {
      analysisRef.current.close();
      analysisRef.current = null;
    }
  };

  const handleModeSelect = (mode: 'lent' | 'confort' | 'tonique') => {
    const modeConfig = BreathModes[mode];
    setSession(prev => ({
      ...prev,
      mode,
      targetDuration: modeConfig.targetDuration,
      naturalRhythm: modeConfig.baseRhythm
    }));
  };

  const handleMicToggle = async () => {
    if (!session.micEnabled) {
      try {
        // Test d'accès au microphone
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        setSession(prev => ({ ...prev, micEnabled: true, adaptiveRhythm: true }));
      } catch (error) {
        console.warn('Microphone refusé');
      }
    } else {
      setSession(prev => ({ ...prev, micEnabled: false, adaptiveRhythm: false }));
      stopBreathAnalysis();
    }
  };

  const handleStart = () => {
    setSession(prev => ({ ...prev, isActive: true, sessionTime: 0 }));
    setSessionComplete(false);
    setRating(null);
  };

  const handlePause = () => {
    setSession(prev => ({ ...prev, isActive: false }));
  };

  const handleComplete = () => {
    setSession(prev => ({ ...prev, isActive: false }));
    setSessionComplete(true);
    stopBreathAnalysis();
  };

  const handleRating = (newRating: 'bien' | 'ok' | 'à travailler') => {
    setRating(newRating);
    
    // Débloquer des atmosphères selon le mode et la progression
    if (newRating === 'bien' && session.mode === 'lent') {
      setAtmospheres(prev => [...new Set([...prev, 'Nuit Étoilée', 'Forêt Nocturne'])]);
    }
  };

  const handleSleepMode = () => {
    setSleepMode(true);
    // Mode sommeil - plus de push notifications
  };

  const handleReset = () => {
    setSession(prev => ({
      ...prev,
      isActive: false,
      sessionTime: 0,
      currentPhase: 'exhale'
    }));
    setSessionComplete(false);
    setRating(null);
    setSleepMode(false);
    stopBreathAnalysis();
  };

  const currentMode = BreathModes[session.mode];
  const progress = (session.sessionTime / session.targetDuration) * 100;

  return (
    <div className={`min-h-screen transition-all duration-500 p-4 ${
      sleepMode 
        ? 'bg-gradient-to-br from-slate-900 to-slate-800' 
        : 'bg-gradient-to-br from-background via-muted/10 to-background'
    }`}>
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className={`text-2xl font-semibold mb-2 ${sleepMode ? 'text-white' : 'text-foreground'}`}>
            Breathwork
          </h1>
          <p className={`text-sm ${sleepMode ? 'text-slate-300' : 'text-muted-foreground'}`}>
            Ton souffle, pas un chrono
          </p>
          
          {/* Mic Status */}
          <div className="flex items-center justify-center mt-4 space-x-2">
            <Button
              onClick={handleMicToggle}
              variant="outline"
              size="sm"
              className={session.micEnabled ? 'bg-green-500/20 border-green-500' : ''}
            >
              {session.micEnabled ? <Mic className="w-4 h-4 mr-2" /> : <MicOff className="w-4 h-4 mr-2" />}
              {session.micEnabled ? 'Adaptatif' : 'Simulation'}
            </Button>
          </div>
        </motion.div>

        {/* Mode Selection */}
        {!session.isActive && !sessionComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            {Object.entries(BreathModes).map(([key, mode]) => {
              const Icon = mode.icon;
              const isSelected = session.mode === key;
              
              return (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`p-6 cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? `border-2 bg-opacity-20` 
                        : 'hover:border-primary/50'
                    }`}
                    style={isSelected ? { 
                      borderColor: mode.color,
                      backgroundColor: `${mode.color}15`
                    } : {}}
                    onClick={() => handleModeSelect(key as 'lent' | 'confort' | 'tonique')}
                  >
                    <div className="flex items-center space-x-4">
                      <Icon 
                        className="w-10 h-10 flex-shrink-0" 
                        style={{ color: mode.color }}
                      />
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold mb-1 ${sleepMode ? 'text-white' : 'text-foreground'}`}>
                          {mode.name}
                        </h3>
                        <p className={`text-sm mb-2 ${sleepMode ? 'text-slate-300' : 'text-muted-foreground'}`}>
                          {mode.description}
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <span className={sleepMode ? 'text-slate-400' : 'text-muted-foreground'}>
                            {Math.floor(mode.targetDuration / 60)} min
                          </span>
                          <span style={{ color: mode.color }}>
                            {mode.suggestion}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
            
            {/* Atmospheres */}
            {atmospheres.length > 0 && (
              <Card className="p-4">
                <h4 className={`text-sm font-medium mb-3 ${sleepMode ? 'text-white' : 'text-foreground'}`}>
                  Atmosphères débloquées
                </h4>
                <div className="flex flex-wrap gap-2">
                  {atmospheres.map((atmosphere) => (
                    <span
                      key={atmosphere}
                      className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary"
                    >
                      {atmosphere}
                    </span>
                  ))}
                </div>
              </Card>
            )}
            
            <Button
              onClick={handleStart}
              className="w-full h-12 mt-6"
              style={{ backgroundColor: currentMode.color }}
            >
              <Play className="w-5 h-5 mr-2" />
              Commencer • {currentMode.name}
            </Button>
          </motion.div>
        )}

        {/* Active Session */}
        <AnimatePresence>
          {session.isActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              {/* Breathing Visualizer */}
              <div className="relative h-80 flex items-center justify-center">
                <motion.div
                  className="w-48 h-48 rounded-full border-4 flex items-center justify-center relative"
                  style={{ 
                    borderColor: currentMode.color,
                    backgroundColor: `${currentMode.color}10`
                  }}
                  animate={{
                    scale: session.currentPhase === 'inhale' ? 1.2 : 1,
                    borderWidth: session.currentPhase === 'inhale' ? 6 : 4
                  }}
                  transition={{
                    duration: session.adaptiveRhythm ? session.naturalRhythm / 2 : 2,
                    ease: "easeInOut"
                  }}
                >
                  {/* Guidance Ring */}
                  <motion.div
                    className="absolute inset-2 rounded-full border-2 border-opacity-50"
                    style={{ borderColor: currentMode.color }}
                    animate={{
                      rotate: session.isActive ? 360 : 0
                    }}
                    transition={{
                      duration: session.naturalRhythm,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  
                  {/* Center Content */}
                  <div className="text-center z-10">
                    <div className={`text-lg font-medium mb-1 ${sleepMode ? 'text-white' : 'text-foreground'}`}>
                      {session.currentPhase === 'inhale' ? 'Inspire' : 'Expire'}
                    </div>
                    <div className={`text-sm ${sleepMode ? 'text-slate-300' : 'text-muted-foreground'}`}>
                      {session.adaptiveRhythm ? 'À ton rythme' : `${session.naturalRhythm}s`}
                    </div>
                  </div>
                  
                  {/* Mic Indicator */}
                  {session.micEnabled && (
                    <div className="absolute top-2 right-2">
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Mic className="w-4 h-4 text-green-500" />
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Progress & Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className={`flex justify-between text-sm ${sleepMode ? 'text-slate-300' : 'text-muted-foreground'}`}>
                    <span>Session</span>
                    <span>
                      {Math.floor(session.sessionTime / 60)}:{(session.sessionTime % 60).toString().padStart(2, '0')} / 
                      {Math.floor(session.targetDuration / 60)}:{(session.targetDuration % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                  <Progress 
                    value={progress} 
                    className="h-2"
                    style={{ backgroundColor: `${currentMode.color}30` }}
                  />
                </div>
                
                <div className={`text-center text-sm ${sleepMode ? 'text-slate-400' : 'text-muted-foreground'}`}>
                  Mode {currentMode.name} • {session.adaptiveRhythm ? 'Adaptatif' : 'Simulé'}
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={session.isActive ? handlePause : handleStart}
                  size="lg"
                  className="w-16 h-16 rounded-full"
                  style={{ backgroundColor: currentMode.color }}
                >
                  {session.isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </Button>
                
                <Button
                  onClick={handleComplete}
                  variant="outline"
                  size="lg"
                  className="px-6 rounded-full"
                >
                  Terminer
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completion */}
        <AnimatePresence>
          {sessionComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className={sleepMode ? 'bg-slate-800/50 border-slate-600' : ''}>
                <div className="p-6 text-center">
                  <currentMode.icon 
                    className="w-16 h-16 mx-auto mb-4" 
                    style={{ color: currentMode.color }}
                  />
                  
                  <h3 className={`text-xl font-semibold mb-4 ${sleepMode ? 'text-white' : 'text-foreground'}`}>
                    Session terminée
                  </h3>
                  
                  <p className={`text-sm mb-6 ${sleepMode ? 'text-slate-300' : 'text-muted-foreground'}`}>
                    {Math.floor(session.sessionTime / 60)} minutes de respiration {currentMode.name.toLowerCase()}
                  </p>
                  
                  <div className="space-y-3">
                    <p className={`text-sm ${sleepMode ? 'text-slate-300' : 'text-muted-foreground'}`}>Comment te sens-tu ?</p>
                    <div className="flex justify-center space-x-2">
                      {(['bien', 'ok', 'à travailler'] as const).map((level) => (
                        <Button
                          key={level}
                          onClick={() => handleRating(level)}
                          variant={rating === level ? 'default' : 'outline'}
                          size="sm"
                          className="capitalize"
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
                      className="mt-6 space-y-3"
                    >
                      {session.mode === 'lent' && (
                        <Button onClick={handleSleepMode} className="w-full" variant="outline">
                          <Moon className="w-4 h-4 mr-2" />
                          Mode Sommeil
                        </Button>
                      )}
                      
                      <Button onClick={handleReset} className="w-full">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Nouvelle session
                      </Button>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}