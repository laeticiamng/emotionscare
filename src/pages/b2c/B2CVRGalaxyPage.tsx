/**
 * B2C VR Galaxy - Cathédrale cosmique
 * Pitch : Tu respires sous les étoiles ; plus tu restes, plus le ciel se relie.
 * Boucle cœur : Démarrage → constellations qui se tissent si tu tiens la cadence → sortie en mots.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import * as Sentry from '@sentry/react';
import { captureException } from '@/lib/ai-monitoring';
import { logger } from '@/lib/logger';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VRSafetyCheck } from '@/components/vr/VRSafetyCheck';
import { useVRSafetyStore } from '@/store/vrSafety.store';
import VRModeControls from '@/components/vr/VRModeControls';
import { useVRPerformanceGuard } from '@/hooks/useVRPerformanceGuard';
import { createSession } from '@/services/sessions/sessionsApi';
import { ConsentGate } from '@/features/clinical-optin/ConsentGate';

interface Constellation {
  id: string;
  name: string;
  stars: Array<{ x: number; y: number; connected: boolean }>;
  unlocked: boolean;
  poeticDescription: string;
}

const ConstellationTemplates: Constellation[] = [
  {
    id: 'first-breath',
    name: 'Premier Souffle',
    stars: [
      { x: 50, y: 30, connected: false },
      { x: 60, y: 40, connected: false },
      { x: 70, y: 30, connected: false }
    ],
    unlocked: false,
    poeticDescription: "Trois étoiles qui naissent de ta première respiration consciente"
  },
  {
    id: 'inner-calm',
    name: 'Calme Intérieur',
    stars: [
      { x: 30, y: 50, connected: false },
      { x: 40, y: 45, connected: false },
      { x: 35, y: 60, connected: false },
      { x: 45, y: 65, connected: false }
    ],
    unlocked: false,
    poeticDescription: "Un carré de lumière qui grandit avec ta sérénité"
  },
  {
    id: 'cosmic-peace',
    name: 'Paix Cosmique',
    stars: [
      { x: 20, y: 20, connected: false },
      { x: 80, y: 20, connected: false },
      { x: 50, y: 80, connected: false },
      { x: 30, y: 70, connected: false },
      { x: 70, y: 70, connected: false }
    ],
    unlocked: false,
    poeticDescription: "Une danse d'étoiles qui célèbre ton voyage intérieur"
  }
];

const describeGalaxyOutcome = (durationSeconds: number, breaths: number) => {
  const breathDescriptor = breaths >= 6
    ? 'souffles profonds'
    : breaths >= 3
      ? 'souffles réguliers'
      : 'souffles légers';
  const durationDescriptor = durationSeconds >= 240
    ? 'immersion prolongée'
    : durationSeconds >= 120
      ? 'immersion apaisante'
      : 'immersion brève';

  return `${durationDescriptor}, ${breathDescriptor}.`;
};

export default function B2CVRGalaxyPage() {
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
  useVRPerformanceGuard('vr_galaxy');
  const [isActive, setIsActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [constellations, setConstellations] = useState<Constellation[]>(ConstellationTemplates);
  const [currentBreaths, setCurrentBreaths] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [mantra, setMantra] = useState('');
  const [showMantra, setShowMantra] = useState(false);
  const [showSafetyCheck, setShowSafetyCheck] = useState(false);
  const [isExtensionSession, setIsExtensionSession] = useState(false);
  const [sessionStartedAt, setSessionStartedAt] = useState<number | null>(null);

  const activeMode = useMemo(() => {
    if (prefersReducedMotion) return 'vr_soft' as const;
    if (modePreference === '2d') return '2d' as const;
    if (modePreference === 'soft') return 'vr_soft' as const;
    if (fallbackEnabled || lowPerformance || nextAutoMode === '2d') return '2d' as const;
    if (nextAutoMode === 'vr_soft') return 'vr_soft' as const;
    return 'vr' as const;
  }, [prefersReducedMotion, modePreference, fallbackEnabled, lowPerformance, nextAutoMode]);

  const allowMotion = activeMode === 'vr';
  const allowGentleMotion = activeMode !== '2d';
  const visualParticleMode = activeMode === '2d'
    ? 'minimal'
    : lastPOMSTone === 'tense'
      ? 'soft'
      : particleMode;

  const starCount = useMemo(() => {
    if (visualParticleMode === 'minimal') return 8;
    if (visualParticleMode === 'soft') return 20;
    return 36;
  }, [visualParticleMode]);
  const maxSessionDuration = lastPOMSTone === 'tense' ? 180 : 360;
  const modeBadgeLabel = activeMode === '2d' ? 'Version 2D' : activeMode === 'vr_soft' ? 'Mode doux' : 'Mode immersif';

  const persistSession = useCallback((durationSec: number, outcomeSummary: string) => {
    if (!Number.isFinite(durationSec) || durationSec <= 0) {
      return;
    }
    const modeLabel = activeMode === '2d' ? '2D' : activeMode === 'vr_soft' ? 'VR_soft' : 'VR';
    const meta = {
      module: 'vr_galaxy',
      mode: modeLabel,
      motion_profile: activeMode === 'vr' ? 'immersif' : activeMode === 'vr_soft' ? 'doux' : '2d',
      journey_summary: outcomeSummary,
      ssq_hint_text: lastSSQSummary ?? 'non communiqué',
      mood_delta_text: lastPOMSSummary ?? 'ressenti neutre',
    } as Record<string, string>;

    void createSession({
      type: 'vr_galaxy',
      duration_sec: Math.max(1, Math.round(durationSec)),
      mood_delta: null,
      meta,
    }).catch((error) => {
      logger.error('VRGalaxy: unable to persist session', error as Error, 'VR');
    });
  }, [activeMode, lastPOMSSummary, lastSSQSummary]);

  useEffect(() => {
    Sentry.addBreadcrumb({
      category: 'vr',
      message: 'vr:enter',
      level: 'info',
      data: { module: 'vr_galaxy' },
    });
    return () => {
      Sentry.addBreadcrumb({
        category: 'vr',
        message: 'vr:exit',
        level: 'info',
        data: { module: 'vr_galaxy' },
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

  const checkConstellationUnlock = (breaths: number) => {
    setConstellations(prev => prev.map((constellation, index) => {
      if (!constellation.unlocked && breaths >= (index + 1) * 3) {
        // Débloquer progressivement les constellations
        return {
          ...constellation,
          unlocked: true,
          stars: constellation.stars.map((star, starIndex) => ({
            ...star,
            connected: starIndex <= Math.floor(breaths / 2) // Connecter les étoiles progressivement
          }))
        };
      }
      return constellation;
    }));
  };

  const handleStart = useCallback((mode: 'standard' | 'extension' = 'standard') => {
    setIsActive(true);
    setSessionTime(0);
    setCurrentBreaths(0);
    setSessionComplete(false);
    setShowMantra(false);
    setShowSafetyCheck(false);
    setSessionStartedAt(Date.now());
    setIsExtensionSession(mode === 'extension');
  }, []);

  const handlePause = () => {
    setIsActive(false);
  };

  const handleComplete = useCallback(() => {
    if (sessionComplete) return;
    setIsActive(false);
    setSessionComplete(true);

    const unlockedCount = constellations.filter(c => c.unlocked).length;
    const mantras = [
      "Je respire avec l'univers",
      "Chaque souffle tisse ma lumière intérieure",
      "Je suis connecté(e) à l'infini en moi",
      "Ma paix rayonne comme les étoiles"
    ];
    const selectedMantra = mantras[Math.min(unlockedCount - 1, mantras.length - 1)] || mantras[0];
    setMantra(selectedMantra);
    setShowMantra(true);
    setShowSafetyCheck(true);

    const durationSeconds = sessionStartedAt
      ? Math.max(1, Math.round((Date.now() - sessionStartedAt) / 1000))
      : sessionTime;
    const baseSummary = describeGalaxyOutcome(durationSeconds, currentBreaths);
    const outcomeSummary = isExtensionSession
      ? `${baseSummary} Extension brève.`
      : baseSummary;
    persistSession(durationSeconds, outcomeSummary);
    setIsExtensionSession(false);
    setSessionStartedAt(null);
  }, [constellations, currentBreaths, isExtensionSession, persistSession, sessionComplete, sessionStartedAt, sessionTime]);

  const handleReset = () => {
    const elapsedSeconds = sessionStartedAt
      ? Math.max(0, Math.round((Date.now() - sessionStartedAt) / 1000))
      : sessionTime;
    const shouldLogInterruption = !sessionComplete && elapsedSeconds > 0;

    if (shouldLogInterruption) {
      const baseSummary = describeGalaxyOutcome(elapsedSeconds, currentBreaths);
      persistSession(elapsedSeconds, `${baseSummary} Sortie anticipée.`);
    }

    setIsActive(false);
    setSessionTime(0);
    setCurrentBreaths(0);
    setSessionComplete(false);
    setShowMantra(false);
    setShowSafetyCheck(false);
    setSessionStartedAt(null);
    setIsExtensionSession(false);
    setConstellations(ConstellationTemplates.map(c => ({
      ...c,
      unlocked: false,
      stars: c.stars.map(s => ({ ...s, connected: false }))
    })));
  };

  // Session timer
  useEffect(() => {
    let timer: number | null = null;

    if (isActive && !sessionComplete) {
      timer = window.setInterval(() => {
        setSessionTime(prev => {
          const newTime = prev + 1;

          if (newTime % 30 === 0) {
            setCurrentBreaths(prevBreaths => {
              const newBreaths = prevBreaths + 1;
              checkConstellationUnlock(newBreaths);
              return newBreaths;
            });
          }

          const sessionLimit = isExtensionSession ? 60 : maxSessionDuration;

          if (newTime >= sessionLimit) {
            handleComplete();
          }

          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (timer) window.clearInterval(timer);
    };
  }, [handleComplete, isActive, isExtensionSession, maxSessionDuration, sessionComplete]);

  const generateStarField = (count: number) => {
    return Array.from({ length: count }, (_, index) => ({
      id: index,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.7 + 0.3,
    }));
  };

  const [backgroundStars, setBackgroundStars] = useState(() => generateStarField(starCount));

  useEffect(() => {
    setBackgroundStars(generateStarField(starCount));
  }, [starCount]);

  return (
    <ConsentGate>
      <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-background via-info/10 to-background p-4 relative overflow-hidden">
      {/* Background Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {backgroundStars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute w-1 h-1 bg-foreground rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              opacity: star.opacity
            }}
            animate={allowMotion
              ? {
                  opacity: [star.opacity, star.opacity * 0.5, star.opacity],
                  scale: [star.size, star.size * 1.2, star.size],
                }
              : allowGentleMotion
                ? {
                    opacity: [star.opacity, star.opacity * 0.8, star.opacity],
                  }
                : { opacity: star.opacity }}
            transition={allowMotion
              ? {
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              : allowGentleMotion
                ? {
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
                : undefined}
          />
        ))}
      </div>

      <div className="max-w-md mx-auto pt-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={allowMotion ? { opacity: 0, y: -20 } : { opacity: 1 }}
          animate={allowMotion ? { opacity: 1, y: 0 } : { opacity: 1 }}
          className="mb-8 text-center"
        >
          <div className="flex flex-col items-center gap-3 text-foreground">
            <div className="flex items-center gap-2">
              <Star className="h-6 w-6" />
              <h1 className="text-2xl font-semibold">VR Galaxy</h1>
              <Badge variant="secondary" className="bg-background/10 text-foreground/80 border-border/20">
                {modeBadgeLabel}
              </Badge>
            </div>
            <p className="text-info text-sm">
              Cathédrale cosmique sous les étoiles
            </p>
            {(lastSSQSummary || lastPOMSSummary) && (
              <div className="space-y-1 text-xs text-muted-foreground">
                {lastSSQSummary && <p>{lastSSQSummary}</p>}
                {lastPOMSSummary && <p>{lastPOMSSummary}</p>}
              </div>
            )}
            <VRModeControls className="justify-center" />
          </div>
        </motion.div>

        {/* Session Setup */}
        {!isActive && !sessionComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <Card className="p-6 bg-card/50 border-border">
              <div className="text-center space-y-4">
                <Sparkles className="w-12 h-12 mx-auto text-info" />
                <h3 className="text-lg font-semibold text-foreground">
                  Voyage dans les étoiles
                </h3>
                <p className="text-muted-foreground text-sm">
                  Respire calmement et regarde les constellations naître
                </p>

                <Button onClick={() => handleStart()} className="w-full h-12 mt-6 bg-info hover:bg-info/90">
                  <Play className="w-5 h-5 mr-2" />
                  Commencer le voyage
                </Button>
              </div>
            </Card>
            {allowExtensionCTA && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  className="bg-background/10 text-foreground border-border/30 hover:bg-background/20"
                  onClick={() => handleStart('extension')}
                >
                  Encore 1 min
                </Button>
              </div>
            )}
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
              {/* Galaxy Dome */}
              <div className="relative h-80 bg-gradient-to-b from-slate-800/30 to-slate-900/50 rounded-3xl border border-slate-600/30 overflow-hidden">
                {/* Constellations */}
                {constellations.map((constellation) => (
                  <div key={constellation.id} className="absolute inset-0">
                    {constellation.stars.map((star, index) => (
                      <motion.div
                        key={index}
                        className={`absolute w-3 h-3 rounded-full ${
                          constellation.unlocked ? 'bg-info' : 'bg-muted'
                        }`}
                        style={{
                          left: `${star.x}%`,
                          top: `${star.y}%`
                        }}
                        initial={allowGentleMotion ? { scale: 0, opacity: 0 } : undefined}
                        animate={constellation.unlocked
                          ? allowMotion
                            ? {
                                scale: [0, 1.5, 1],
                                opacity: [0, 1, 0.8],
                              }
                            : allowGentleMotion
                              ? {
                                  scale: [0.8, 1, 0.95],
                                  opacity: [0.6, 0.9, 0.8],
                                }
                              : { scale: 1, opacity: 0.85 }
                          : { scale: 0, opacity: 0 }}
                        transition={allowMotion
                          ? {
                              duration: 2,
                              delay: index * 0.5,
                            }
                          : allowGentleMotion
                            ? {
                                duration: 2.5,
                                delay: index * 0.3,
                                ease: 'easeOut',
                              }
                            : undefined}
                      />
                    ))}

                    {/* Star Connections */}
                    {constellation.unlocked && constellation.stars.length > 1 && (
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {constellation.stars.slice(0, -1).map((star, index) => {
                          const nextStar = constellation.stars[index + 1];
                          if (!star.connected || !nextStar.connected) return null;

                          if (!allowGentleMotion) {
                            return (
                              <line
                                key={index}
                                x1={`${star.x}%`}
                                y1={`${star.y}%`}
                                x2={`${nextStar.x}%`}
                                y2={`${nextStar.y}%`}
                                stroke="rgb(96, 165, 250)"
                                strokeWidth="1"
                                opacity="0.5"
                              />
                            );
                          }

                          return (
                            <motion.line
                              key={index}
                              x1={`${star.x}%`}
                              y1={`${star.y}%`}
                              x2={`${nextStar.x}%`}
                              y2={`${nextStar.y}%`}
                              stroke="rgb(96, 165, 250)"
                              strokeWidth="1"
                              opacity="0.6"
                              initial={allowMotion ? { pathLength: 0 } : { pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={allowMotion
                                ? { duration: 2, delay: (index + 1) * 0.5 }
                                : { duration: 2.5, delay: (index + 1) * 0.4 }}
                            />
                          );
                        })}
                      </svg>
                    )}
                  </div>
                ))}

                {/* Central Breathing Anchor */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="w-8 h-8 bg-foreground/80 rounded-full"
                    animate={allowMotion
                      ? {
                          scale: [1, 1.3, 1],
                          opacity: [0.8, 1, 0.8],
                        }
                      : allowGentleMotion
                        ? {
                            scale: [1, 1.1, 1],
                            opacity: [0.85, 0.95, 0.85],
                          }
                        : { scale: 1, opacity: 0.8 }}
                    transition={allowMotion
                      ? {
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                      : allowGentleMotion
                        ? {
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }
                        : undefined}
                  />
                </div>
              </div>

              {/* Session Info */}
              <div className="text-center space-y-3">
                <div className="text-foreground">
                  <span className="text-2xl font-bold">{currentBreaths}</span>
                  <span className="text-muted-foreground ml-2">souffles cosmiques</span>
                </div>
                
                <div className="text-muted-foreground text-sm">
                  {Math.floor(sessionTime / 60)}:{(sessionTime % 60).toString().padStart(2, '0')}
                </div>
                
                <div className="space-y-2">
                  {constellations.map((constellation) => (
                    <motion.div
                      key={constellation.id}
                      className={`text-xs px-3 py-1 rounded-full ${
                        constellation.unlocked
                          ? 'bg-info/20 text-info border border-info/30'
                          : 'bg-muted/20 text-muted-foreground border border-muted/30'
                      }`}
                      initial={allowGentleMotion ? { opacity: 0, scale: 0.8 } : undefined}
                      animate={allowGentleMotion ? { opacity: 1, scale: 1 } : { opacity: 1 }}
                      transition={allowGentleMotion ? { delay: constellation.unlocked ? 0.5 : 0 } : undefined}
                    >
                      {constellation.unlocked ? `✨ ${constellation.name}` : `⭐ ${constellation.name}`}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={handlePause}
                  size="lg"
                  className="w-16 h-16 rounded-full bg-muted hover:bg-muted/80"
                >
                  <Pause className="w-6 h-6 text-foreground" />
                </Button>
                
                <Button
                  onClick={handleComplete}
                  size="lg"
                  className="w-16 h-16 rounded-full bg-info hover:bg-info/90"
                >
                  <Star className="w-6 h-6" />
                </Button>
                
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="lg"
                  className="w-16 h-16 rounded-full border-border text-muted-foreground"
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
              initial={allowMotion ? { opacity: 0, y: 20 } : { opacity: 1 }}
              animate={allowMotion ? { opacity: 1, y: 0 } : { opacity: 1 }}
              className="space-y-6"
            >
              <Card className="p-6 bg-card/50 border-border text-center">
                <Sparkles className="w-16 h-16 mx-auto text-info mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Voyage terminé
                </h3>
                
                <div className="text-muted-foreground space-y-2 mb-6">
                  <p>{currentBreaths} souffles • {constellations.filter(c => c.unlocked).length} constellations</p>
                  <p className="text-sm">{Math.floor(sessionTime / 60)} minutes dans les étoiles</p>
                </div>
                
                {showMantra && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-info/10 rounded-lg p-4 mb-6"
                  >
                    <p className="text-info italic">"{mantra}"</p>
                  </motion.div>
                )}
                
                <div className="space-y-3">
                  <Button onClick={handleReset} className="w-full bg-info hover:bg-info/90">
                    Nouveau voyage
                  </Button>
                  {allowExtensionCTA && (
                    <Button
                      variant="outline"
                      className="w-full border-slate-600 text-slate-300"
                      onClick={() => handleStart('extension')}
                    >
                      Encore 1 min
                    </Button>
                  )}
                </div>

                <VRSafetyCheck
                  open={showSafetyCheck}
                  moduleContext="vr_galaxy"
                  onClose={() => setShowSafetyCheck(false)}
                  className="mt-6"
                />
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </ConsentGate>
  );
}
