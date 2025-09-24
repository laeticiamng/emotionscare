import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as Sentry from '@sentry/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Pause, 
  RotateCcw, 
  ArrowLeft,
  Sparkles,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';
import { UniverseEngine } from '@/components/universe/UniverseEngine';
import { CosmicBreathingOrb } from '@/components/breath/CosmicBreathingOrb';
import { RewardSystem } from '@/components/rewards/RewardSystem';
import { getOptimizedUniverse } from '@/data/universes/config';
import { useOptimizedAnimation } from '@/hooks/useOptimizedAnimation';
import { VRSafetyCheck } from '@/components/vr/VRSafetyCheck';
import VRModeControls from '@/components/vr/VRModeControls';
import { useVRPerformanceGuard } from '@/hooks/useVRPerformanceGuard';
import { useVRSafetyStore } from '@/store/vrSafety.store';
import { createSession } from '@/services/sessions/sessionsApi';
import { ConsentGate } from '@/features/clinical-optin/ConsentGate';

interface CosmicBreathSession {
  id: string;
  name: string;
  duration: number;
  inhaleTime: number;
  holdTime: number;
  exhaleTime: number;
  cycles: number;
  description: string;
  constellation: string;
}

const cosmicSessions: CosmicBreathSession[] = [
  {
    id: 'cosmic-calm',
    name: 'Souffle Cosmique',
    duration: 180, // 3 minutes
    inhaleTime: 4,
    holdTime: 2,
    exhaleTime: 6,
    cycles: 15,
    description: 'Laisse ton souffle synchroniser l\'expansion des étoiles',
    constellation: 'Sérénité Stellaire'
  },
  {
    id: 'galactic-peace',
    name: 'Paix Galactique', 
    duration: 120, // 2 minutes
    inhaleTime: 3,
    holdTime: 1,
    exhaleTime: 4,
    cycles: 15,
    description: 'Une vague apaisante à travers les nébuleuses',
    constellation: 'Harmonie Cosmique'
  },
  {
    id: 'stellar-energy',
    name: 'Énergie Stellaire',
    duration: 240, // 4 minutes
    inhaleTime: 5,
    holdTime: 3,
    exhaleTime: 7,
    cycles: 16,
    description: 'Puise l\'énergie vitale des constellations anciennes',
    constellation: 'Force Astrale'
  }
];

const VRBreathPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { play, pause, setVolume } = useMusic();
  const particleMode = useVRSafetyStore((state) => state.particleMode);
  const fallbackEnabled = useVRSafetyStore((state) => state.fallbackEnabled);
  const prefersReducedMotion = useVRSafetyStore((state) => state.prefersReducedMotion);
  const modePreference = useVRSafetyStore((state) => state.modePreference);
  const nextAutoMode = useVRSafetyStore((state) => state.nextAutoMode);
  const lowPerformance = useVRSafetyStore((state) => state.lowPerformance);
  const lastPOMSTone = useVRSafetyStore((state) => state.lastPOMSTone);
  const allowExtensionCTA = useVRSafetyStore((state) => state.allowExtensionCTA);
  const lastSSQSummary = useVRSafetyStore((state) => state.lastSSQSummary);
  const lastPOMSSummary = useVRSafetyStore((state) => state.lastPOMSSummary);
  const ssqHintUsed = useVRSafetyStore((state) => state.ssqHintUsed);
  const pomsHintUsed = useVRSafetyStore((state) => state.pomsHintUsed);

  useVRPerformanceGuard('vr_breath');

  const [sessionStartedAt, setSessionStartedAt] = useState<number | null>(null);
  const audioFadeTimeoutRef = useRef<number | null>(null);

  const activeMode = useMemo(() => {
    if (prefersReducedMotion) return 'vr_soft' as const;
    if (modePreference === '2d') return '2d' as const;
    if (modePreference === 'soft') return 'vr_soft' as const;
    if (fallbackEnabled || lowPerformance || nextAutoMode === '2d') return '2d' as const;
    if (nextAutoMode === 'vr_soft') return 'vr_soft' as const;
    return 'vr' as const;
  }, [prefersReducedMotion, modePreference, fallbackEnabled, lowPerformance, nextAutoMode]);

  const allowMotion = activeMode === 'vr';
  const visualParticleMode = activeMode === '2d'
    ? 'minimal'
    : lastPOMSTone === 'tense'
      ? 'soft'
      : particleMode;
  const enableParticles = activeMode !== '2d' && visualParticleMode !== 'minimal';
  const adaptiveSessions = useMemo(() => (
    cosmicSessions.map((session) => {
      if (lastPOMSTone === 'tense') {
        const shortened = Math.max(90, Math.round(session.duration * 0.75));
        return { ...session, duration: shortened };
      }
      return session;
    })
  ), [lastPOMSTone]);
  const persistSession = useCallback((durationSec: number) => {
    if (!Number.isFinite(durationSec) || durationSec <= 0) {
      return;
    }
    const modeLabel = activeMode === '2d' ? '2D' : activeMode === 'vr_soft' ? 'VR_soft' : 'VR';
    const meta = {
      module: 'vr_breath',
      mode: modeLabel,
      motion_profile: activeMode === 'vr' ? 'immersif' : activeMode === 'vr_soft' ? 'doux' : '2d',
      ssq_hint_text: lastSSQSummary ?? 'non communiqué',
      mood_delta_text: lastPOMSSummary ?? 'ressenti neutre',
    } as Record<string, string>;

    void createSession({
      type: 'vr_breath',
      duration_sec: Math.max(1, Math.round(durationSec)),
      mood_delta: null,
      meta,
    }).catch((error) => {
      console.error('[VRBreath] unable to persist session', error);
    });
  }, [activeMode, lastPOMSSummary, lastSSQSummary]);

  useEffect(() => {
    Sentry.addBreadcrumb({
      category: 'vr',
      message: 'vr:enter',
      level: 'info',
      data: { module: 'vr_breath' },
    });
    return () => {
      Sentry.addBreadcrumb({
        category: 'vr',
        message: 'vr:exit',
        level: 'info',
        data: { module: 'vr_breath' },
      });
    };
  }, []);

  useEffect(() => {
    Sentry.configureScope((scope) => {
      scope.setTag('motion_safe', activeMode !== 'vr' ? 'enabled' : 'standard');
      scope.setTag('ssq_hint_used', ssqHintUsed ? 'yes' : 'no');
      scope.setTag('poms_hint_used', pomsHintUsed ? 'yes' : 'no');
    });
  }, [activeMode, ssqHintUsed, pomsHintUsed]);
  
  // Get optimized universe config
  const universe = getOptimizedUniverse('vrBreath');
  
  // Universe state
  const [isEntering, setIsEntering] = useState(true);
  const [universeEntered, setUniverseEntered] = useState(false);
  
  // Session state
  const [selectedSession, setSelectedSession] = useState<CosmicBreathSession | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'idle'>('idle');
  const [currentCycle, setCurrentCycle] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [phaseTimer, setPhaseTimer] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [showSafetyCheck, setShowSafetyCheck] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const phaseIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Optimized animations
  const particleCountForAnimation = visualParticleMode === 'standard' ? 6 : visualParticleMode === 'soft' ? 3 : 0;
  const { entranceVariants, breathingVariants, cleanupAnimation } = useOptimizedAnimation({
    enableComplexAnimations: allowMotion && visualParticleMode !== 'minimal',
    particleCount: particleCountForAnimation,
    useCSSAnimations: true,
  });

  // Handle universe entrance
  const handleUniverseEnterComplete = () => {
    setUniverseEntered(true);
  };

  // Cleanup animations on unmount
  useEffect(() => {
    return () => {
      cleanupAnimation();
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (phaseIntervalRef.current) clearInterval(phaseIntervalRef.current);
      if (audioFadeTimeoutRef.current) {
        clearTimeout(audioFadeTimeoutRef.current);
        audioFadeTimeoutRef.current = null;
      }
    };
  }, [cleanupAnimation]);

  // Session management
  useEffect(() => {
    if (isActive && selectedSession) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            stopSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [isActive, selectedSession, stopSession]);

  useEffect(() => {
    if (isActive && selectedSession && currentPhase !== 'idle') {
      runBreathingCycle();
    }
  }, [isActive, selectedSession, currentCycle, currentPhase, runBreathingCycle]);

  const startSession = (session: CosmicBreathSession) => {
    const sessionToStart = { ...session };
    setSelectedSession(sessionToStart);
    setTimeRemaining(sessionToStart.duration);
    setCurrentCycle(0);
    setCurrentPhase('inhale');
    setPhaseTimer(sessionToStart.inhaleTime);
    setIsActive(true);
    setShowSafetyCheck(false);
    setSessionStartedAt(Date.now());

    if (audioFadeTimeoutRef.current) {
      clearTimeout(audioFadeTimeoutRef.current);
      audioFadeTimeoutRef.current = null;
    }

    // Start ambient music
    void play().then(() => {
      if (typeof window === 'undefined') return;
      if (lastPOMSTone === 'tense') {
        setVolume(0.45);
        audioFadeTimeoutRef.current = window.setTimeout(() => {
          setVolume(0.65);
          audioFadeTimeoutRef.current = null;
        }, 5000);
      } else if (lastPOMSTone === 'soothed') {
        setVolume(0.75);
      } else {
        setVolume(0.7);
      }
    }).catch((error) => {
      console.warn('[VRBreath] audio start skipped', error);
    });

    toast({
      title: "Voyage cosmique commencé",
      description: activeMode === '2d'
        ? 'Version douce activée pour préserver ton confort.'
        : "Laisse ton souffle guider les étoiles",
    });
  };

  const stopSession = useCallback(() => {
    setIsActive(false);
    setCurrentCycle(0);
    setCurrentPhase('idle');
    setPhaseTimer(0);

    if (intervalRef.current) clearInterval(intervalRef.current);
    if (phaseIntervalRef.current) clearInterval(phaseIntervalRef.current);
    if (audioFadeTimeoutRef.current) {
      clearTimeout(audioFadeTimeoutRef.current);
      audioFadeTimeoutRef.current = null;
    }

    if (sessionStartedAt) {
      const elapsedMs = Date.now() - sessionStartedAt;
      persistSession(elapsedMs / 1000);
    }
    setSessionStartedAt(null);

    pause();
    setVolume(0.7);

    // Show constellation reward
    setShowReward(true);
  }, [pause, persistSession, sessionStartedAt, setVolume]);

  const pauseSession = () => {
    setIsActive(!isActive);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (phaseIntervalRef.current) clearInterval(phaseIntervalRef.current);
  };

  const runBreathingCycle = useCallback(() => {
    if (!selectedSession || currentCycle >= selectedSession.cycles) {
      stopSession();
      return;
    }

    if (phaseIntervalRef.current) {
      clearInterval(phaseIntervalRef.current);
    }

    const phases = [
      { name: 'inhale' as const, duration: selectedSession.inhaleTime },
      { name: 'hold' as const, duration: selectedSession.holdTime },
      { name: 'exhale' as const, duration: selectedSession.exhaleTime }
    ];

    let phaseIndex = 0;
    setCurrentPhase(phases[phaseIndex].name);
    setPhaseTimer(phases[phaseIndex].duration);

    phaseIntervalRef.current = setInterval(() => {
      setPhaseTimer(prev => {
        if (prev <= 1) {
          phaseIndex++;
          if (phaseIndex >= phases.length) {
            setCurrentCycle(c => c + 1);
            if (phaseIntervalRef.current) {
              clearInterval(phaseIntervalRef.current);
            }
            return 0;
          } else {
            setCurrentPhase(phases[phaseIndex].name);
            return phases[phaseIndex].duration;
          }
        }
        return prev - 1;
      });
    }, 1000);
  }, [currentCycle, selectedSession, stopSession]);

  const handleRewardComplete = () => {
    setShowReward(false);
    setSelectedSession(null);
    setShowSafetyCheck(true);

    toast({
      title: "Cosmos apaisé ✨",
      description: "Ta nouvelle constellation brille dans ta galaxie personnelle",
    });
  };

  const progress = selectedSession && timeRemaining > 0 
    ? ((selectedSession.duration - timeRemaining) / selectedSession.duration) * 100 
    : 0;

  const getCurrentPhaseDuration = () => {
    if (!selectedSession) return 4;
    switch (currentPhase) {
      case 'inhale': return selectedSession.inhaleTime;
      case 'hold': return selectedSession.holdTime;
      case 'exhale': return selectedSession.exhaleTime;
      default: return 4;
    }
  };

  if (showReward && selectedSession) {
    return (
      <ConsentGate>
        <RewardSystem
          reward={{
            type: 'constellation',
            name: selectedSession.constellation,
            description: universe.artifacts.description,
            moduleId: 'vr-breath'
          }}
          badgeText="Cosmos apaisé ✨"
          onComplete={handleRewardComplete}
        />
      </ConsentGate>
    );
  }

  return (
    <ConsentGate>
      <UniverseEngine
        universe={universe}
        isEntering={isEntering}
        onEnterComplete={handleUniverseEnterComplete}
        enableParticles={enableParticles}
        enableAmbianceSound={false}
        particleDensity={visualParticleMode}
        className="min-h-screen"
      >
      {/* Header - Optimized */}
      <header className="relative z-50 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/app"
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Retour</span>
          </Link>

          <div className="flex flex-col items-end gap-2 text-white">
            <div className="flex items-center gap-2">
              <Star className="h-6 w-6" />
              <h1 className="text-xl font-light tracking-wide">{universe.name}</h1>
              <Badge variant="secondary" className="bg-white/10 text-white/70 border-white/20">
                {activeMode === '2d' ? 'Version 2D' : activeMode === 'vr_soft' ? 'Mode doux' : 'Mode immersif'}
              </Badge>
            </div>
            <VRModeControls className="justify-end" />
          </div>
        </div>
      </header>

      {/* Main Content - Optimized */}
      <main className="relative z-10 container mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {!selectedSession ? (
            <motion.div
              key="selection"
              variants={allowMotion ? entranceVariants : undefined}
              initial={allowMotion ? 'hidden' : { opacity: 1 }}
              animate={allowMotion ? 'visible' : { opacity: 1 }}
              exit={allowMotion ? 'hidden' : { opacity: 1 }}
              className="space-y-12"
            >
              {/* Introduction */}
              <div className="text-center space-y-6">
                <motion.div
                  initial={allowMotion ? { scale: 0 } : { opacity: 1 }}
                  animate={allowMotion ? { scale: 1 } : { opacity: 1 }}
                  transition={allowMotion ? { delay: 0.5, type: "spring" } : undefined}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                  style={{ background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2), transparent)' }}
                >
                  <Sparkles className="h-10 w-10 text-white" />
                </motion.div>

                <h2 className="text-4xl font-light text-white tracking-wide">
                  Voyages Respiratoires
                </h2>
                <p className="text-xl text-white/70 max-w-2xl mx-auto font-light">
                  Ton souffle fait vibrer les étoiles. Choisis ton voyage cosmique et laisse
                  les constellations s'aligner avec ton rythme intérieur.
                </p>
              </div>

              {allowExtensionCTA && (
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                    onClick={() => startSession({
                      id: 'gentle-extension',
                      name: 'Encore une minute',
                      duration: 60,
                      inhaleTime: 4,
                      holdTime: 1,
                      exhaleTime: 4,
                      cycles: 6,
                      description: 'Une minute supplémentaire très douce pour prolonger le calme.',
                      constellation: 'Halo apaisé',
                    })}
                  >
                    Encore 1 min
                  </Button>
                </div>
              )}

              <VRSafetyCheck
                open={showSafetyCheck}
                moduleContext="vr_breath"
                onClose={() => setShowSafetyCheck(false)}
                className="max-w-xl mx-auto"
              />

              {/* Sessions Grid */}
              <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
                {adaptiveSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={allowMotion ? { opacity: 0, y: 30 } : { opacity: 1 }}
                    animate={allowMotion ? { opacity: 1, y: 0 } : { opacity: 1 }}
                    transition={allowMotion ? { delay: 0.7 + index * 0.2 } : undefined}
                    whileHover={allowMotion ? { scale: 1.05, y: -10 } : undefined}
                    whileTap={allowMotion ? { scale: 0.95 } : undefined}
                  >
                    <Card
                      className="h-full bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                      onClick={() => startSession(session)}
                    >
                      <CardContent className="p-8 space-y-6">
                        <div className="text-center">
                          <Star className="w-12 h-12 text-yellow-300 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                          <h3 className="text-2xl font-light text-white mb-2">
                            {session.name}
                          </h3>
                          <Badge 
                            variant="secondary" 
                            className="bg-white/20 text-white border-white/30 mb-4"
                          >
                            {Math.floor(session.duration / 60)}min
                          </Badge>
                        </div>
                        
                        <p className="text-white/70 text-center leading-relaxed">
                          {session.description}
                        </p>
                        
                        <div className="text-center space-y-3">
                          <div className="text-sm text-white/60">
                            Constellation: <span className="text-yellow-300 font-medium">{session.constellation}</span>
                          </div>
                          
                          <Button 
                            className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm group-hover:bg-gradient-to-r group-hover:from-indigo-500/30 group-hover:to-purple-500/30 transition-all duration-300"
                            onClick={() => startSession(session)}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Commencer le voyage
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="session"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-6xl mx-auto"
            >
              {/* Session Header */}
              <div className="text-center mb-12">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="space-y-4"
                >
                  <h2 className="text-3xl font-light text-white tracking-wide">
                    {selectedSession.name}
                  </h2>
                  <p className="text-white/70 text-lg">{selectedSession.description}</p>
                  <Badge 
                    variant="secondary" 
                    className="bg-white/20 text-white border-white/30"
                  >
                    Constellation: {selectedSession.constellation}
                  </Badge>
                </motion.div>
              </div>

              {/* Cosmic Breathing Orb */}
              <div className="flex justify-center mb-16">
                <CosmicBreathingOrb
                  phase={currentPhase}
                  phaseTimer={phaseTimer}
                  maxTime={getCurrentPhaseDuration()}
                  isActive={isActive}
                />
              </div>

              {/* Session Info */}
              <div className="text-center mb-12 space-y-6">
                <div className="text-white/60 text-sm tracking-widest">
                  CYCLE {currentCycle + 1} / {selectedSession.cycles}
                </div>
                
                <div className="w-full max-w-md mx-auto bg-white/10 rounded-full h-2 backdrop-blur-sm">
                  <motion.div 
                    className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full"
                    style={{ width: `${progress}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
                
                <div className="text-white/50 text-sm">
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')} restant
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center space-x-6">
                <Button
                  onClick={pauseSession}
                  size="lg"
                  className="min-w-40 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                >
                  {isActive ? (
                    <>
                      <Pause className="h-5 w-5 mr-2" />
                      Pause cosmique
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Reprendre le voyage
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={stopSession}
                  variant="outline"
                  size="lg"
                  className="min-w-40 bg-transparent border-white/30 text-white hover:bg-white/10"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Terminer
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </UniverseEngine>
    </ConsentGate>
  );
};

export default VRBreathPage;
