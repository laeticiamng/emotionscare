/**
 * B2C Flash Glow - Éclair doux
 * Pitch : 90–120s qui calment sans te sur-stimuler.
 * Boucle cœur : Tap → halo velours → "ça suffit / encore 60s".
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Play, Pause, RotateCcw, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface GlowSession {
  duration: number;
  isActive: boolean;
  timeRemaining: number;
  intensity: 'doux' | 'standard' | 'tonique';
}

const GlowIntensities = {
  doux: {
    duration: 90,
    colors: ['hsl(210, 60%, 70%)', 'hsl(200, 50%, 80%)', 'hsl(190, 40%, 85%)'],
    pulseSpeed: 4
  },
  standard: {
    duration: 120,
    colors: ['hsl(45, 70%, 70%)', 'hsl(35, 60%, 75%)', 'hsl(25, 50%, 80%)'],
    pulseSpeed: 3
  },
  tonique: {
    duration: 90,
    colors: ['hsl(160, 60%, 70%)', 'hsl(150, 50%, 75%)', 'hsl(140, 40%, 80%)'],
    pulseSpeed: 2.5
  }
};

export default function B2CFlashGlowPage() {
  const [session, setSession] = useState<GlowSession>({
    duration: 120,
    isActive: false,
    timeRemaining: 120,
    intensity: 'standard'
  });
  const [showComplete, setShowComplete] = useState(false);
  const [perfectEndings, setPerfectEndings] = useState(0);
  const [afterglow, setAfterglow] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Détection des préférences d'accessibilité
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Timer principal
  useEffect(() => {
    let timer: number;
    
    if (session.isActive && session.timeRemaining > 0) {
      timer = window.setInterval(() => {
        setSession(prev => {
          const newTimeRemaining = prev.timeRemaining - 1;
          
          if (newTimeRemaining <= 0) {
            setShowComplete(true);
            setAfterglow(true);
            return { ...prev, isActive: false, timeRemaining: 0 };
          }
          
          return { ...prev, timeRemaining: newTimeRemaining };
        });
      }, 1000);
    }
    
    return () => clearInterval(timer);
  }, [session.isActive, session.timeRemaining]);

  // Afterglow automatique
  useEffect(() => {
    if (afterglow) {
      const timer = setTimeout(() => {
        setAfterglow(false);
      }, 8000); // 8 secondes d'afterglow
      
      return () => clearTimeout(timer);
    }
  }, [afterglow]);

  const handleStart = (intensity: 'doux' | 'standard' | 'tonique') => {
    const glowConfig = GlowIntensities[intensity];
    setSession({
      duration: glowConfig.duration,
      isActive: true,
      timeRemaining: glowConfig.duration,
      intensity
    });
    setShowComplete(false);
  };

  const handlePause = () => {
    setSession(prev => ({ ...prev, isActive: false }));
  };

  const handleResume = () => {
    setSession(prev => ({ ...prev, isActive: true }));
  };

  const handleStop = () => {
    setSession(prev => ({ ...prev, isActive: false }));
    setShowComplete(true);
    setAfterglow(true);
    
    // Récompense pour avoir terminé
    if (session.timeRemaining <= 10) {
      setPerfectEndings(prev => prev + 1);
    }
  };

  const handleExtend = () => {
    setSession(prev => ({
      ...prev,
      timeRemaining: prev.timeRemaining + 60,
      duration: prev.duration + 60,
      isActive: true
    }));
    setShowComplete(false);
  };

  const handleReset = () => {
    setSession({
      duration: 120,
      isActive: false,
      timeRemaining: 120,
      intensity: 'standard'
    });
    setShowComplete(false);
    setAfterglow(false);
  };

  const currentGlow = GlowIntensities[session.intensity];
  const progress = ((session.duration - session.timeRemaining) / session.duration) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 relative overflow-hidden">
      {/* Afterglow Effect */}
      <AnimatePresence>
        {afterglow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${currentGlow.colors[0]}40, transparent 70%)`
            }}
          />
        )}
      </AnimatePresence>

      <div className="max-w-md mx-auto pt-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Flash Glow
          </h1>
          <p className="text-muted-foreground text-sm">
            Éclair doux en velours, sans strobe
          </p>
          
          {prefersReducedMotion && (
            <div className="text-xs text-muted-foreground mt-2 bg-muted/50 rounded px-2 py-1">
              Mode mouvement réduit activé
            </div>
          )}
        </motion.div>

        {/* Intensity Selection */}
        {!session.isActive && !showComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            {Object.entries(GlowIntensities).map(([key, config]) => (
              <motion.div
                key={key}
                whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
                whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
              >
                <Card
                  className="p-6 cursor-pointer transition-all duration-300 hover:border-primary/50"
                  style={{
                    background: prefersReducedMotion 
                      ? `${config.colors[0]}20` 
                      : `linear-gradient(135deg, ${config.colors[0]}20, ${config.colors[1]}15)`
                  }}
                  onClick={() => handleStart(key as 'doux' | 'standard' | 'tonique')}
                >
                  <div className="text-center">
                    <Zap 
                      className="w-8 h-8 mx-auto mb-3" 
                      style={{ color: config.colors[0] }}
                    />
                    <h3 className="text-lg font-semibold text-foreground capitalize mb-2">
                      {key}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {config.duration}s • Velours {key === 'doux' ? 'léger' : key === 'standard' ? 'équilibré' : 'dynamique'}
                    </p>
                    <div className="flex justify-center space-x-1">
                      {config.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
            
            {/* Perfect Endings Counter */}
            {perfectEndings > 0 && (
              <Card className="p-4 bg-primary/10 border-primary/30">
                <div className="text-center">
                  <Check className="w-6 h-6 mx-auto text-primary mb-2" />
                  <p className="text-sm text-foreground">
                    {perfectEndings} fin{perfectEndings > 1 ? 's' : ''} parfaite{perfectEndings > 1 ? 's' : ''}
                  </p>
                </div>
              </Card>
            )}
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
              {/* Main Glow */}
              <div className="relative h-80 flex items-center justify-center">
                {prefersReducedMotion ? (
                  // Mode accessibilité - simple fondu
                  <motion.div
                    className="w-64 h-64 rounded-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${currentGlow.colors[0]}, ${currentGlow.colors[1]})`
                    }}
                    animate={{
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{
                      duration: currentGlow.pulseSpeed,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="text-center text-white">
                      <Zap className="w-12 h-12 mx-auto mb-2" />
                      <div className="text-2xl font-bold">
                        {Math.floor(session.timeRemaining / 60)}:{(session.timeRemaining % 60).toString().padStart(2, '0')}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  // Mode normal - velours animé
                  <div className="relative">
                    {/* Couches de velours */}
                    {currentGlow.colors.map((color, index) => (
                      <motion.div
                        key={index}
                        className="absolute inset-0 rounded-full"
                        style={{
                          width: `${280 - (index * 40)}px`,
                          height: `${280 - (index * 40)}px`,
                          background: `radial-gradient(circle, ${color}60, ${color}20, transparent)`,
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)'
                        }}
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.4, 0.8, 0.4]
                        }}
                        transition={{
                          duration: currentGlow.pulseSpeed,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.2
                        }}
                      />
                    ))}
                    
                    {/* Centre avec timer */}
                    <div className="relative z-10 w-32 h-32 bg-background/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground mb-1">
                          {Math.floor(session.timeRemaining / 60)}:{(session.timeRemaining % 60).toString().padStart(2, '0')}
                        </div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {session.intensity}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: currentGlow.colors[0] }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  {session.duration - session.timeRemaining}s sur {session.duration}s
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={session.isActive ? handlePause : handleResume}
                  size="lg"
                  className="w-16 h-16 rounded-full"
                >
                  {session.isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </Button>
                
                <Button
                  onClick={handleStop}
                  variant="outline"
                  size="lg"
                  className="px-6 rounded-full"
                >
                  Ça suffit
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completion */}
        <AnimatePresence>
          {showComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="p-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <Check className="w-16 h-16 mx-auto text-green-500 mb-4" />
                </motion.div>
                
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Flash terminé !
                </h3>
                
                <div className="space-y-4">
                  <Button
                    onClick={handleExtend}
                    className="w-full"
                    style={{ backgroundColor: currentGlow.colors[0] }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Encore 60s
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={handleReset}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Nouveau Flash
                    </Button>
                    
                    <Button variant="outline">
                      Silk ou Journal
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}