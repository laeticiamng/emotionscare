import React, { useState, useEffect, useRef } from 'react';
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
  const { play, pause } = useMusic();
  
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
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const phaseIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Optimized animations
  const { entranceVariants, breathingVariants, cleanupAnimation } = useOptimizedAnimation({
    enableComplexAnimations: true,
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
  }, [isActive, selectedSession]);

  useEffect(() => {
    if (isActive && selectedSession && currentPhase !== 'idle') {
      runBreathingCycle();
    }
  }, [isActive, selectedSession, currentCycle]);

  const startSession = (session: CosmicBreathSession) => {
    setSelectedSession(session);
    setTimeRemaining(session.duration);
    setCurrentCycle(0);
    setCurrentPhase('inhale');
    setPhaseTimer(session.inhaleTime);
    setIsActive(true);
    
    // Start ambient music
    play();
    
    toast({
      title: "Voyage cosmique commencé",
      description: "Laisse ton souffle guider les étoiles",
    });
  };

  const stopSession = () => {
    setIsActive(false);
    setCurrentCycle(0);
    setCurrentPhase('idle');
    setPhaseTimer(0);
    
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (phaseIntervalRef.current) clearInterval(phaseIntervalRef.current);
    
    // Show constellation reward
    setShowReward(true);
  };

  const pauseSession = () => {
    setIsActive(!isActive);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (phaseIntervalRef.current) clearInterval(phaseIntervalRef.current);
  };

  const runBreathingCycle = () => {
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
  };

  const handleRewardComplete = () => {
    setShowReward(false);
    setSelectedSession(null);
    
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
    );
  }

  return (
    <UniverseEngine
      universe={universe}
      isEntering={isEntering}
      onEnterComplete={handleUniverseEnterComplete}
      enableParticles={true}
      enableAmbianceSound={false}
      className="min-h-screen"
    >
      {/* Header - Optimized */}
      <header className="relative z-50 p-6">
        <div className="flex items-center justify-between">
          <Link 
            to="/app" 
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Retour</span>
          </Link>
          
          <div className="flex items-center space-x-2 text-white">
            <Star className="h-6 w-6" />
            <h1 className="text-xl font-light tracking-wide">{universe.name}</h1>
          </div>
        </div>
      </header>

      {/* Main Content - Optimized */}
      <main className="relative z-10 container mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {!selectedSession ? (
            <motion.div
              key="selection"
              variants={entranceVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-12"
            >
              {/* Introduction */}
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
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

              {/* Sessions Grid */}
              <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
                {cosmicSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.2 }}
                    whileHover={{ scale: 1.05, y: -10 }}
                    whileTap={{ scale: 0.95 }}
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
  );
};

export default VRBreathPage;