import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Play,
  Pause,
  ArrowLeft,
  Zap,
  Timer
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { UniverseEngine } from '@/components/universe/UniverseEngine';
import { RewardSystem } from '@/components/rewards/RewardSystem';
import { getOptimizedUniverse } from '@/data/universes/config';
import { useOptimizedAnimation } from '@/hooks/useOptimizedAnimation';
import { ClinicalOptIn } from '@/components/consent/ClinicalOptIn';
import { useClinicalConsent } from '@/hooks/useClinicalConsent';

interface FlashGlowSession {
  id: string;
  name: string;
  duration: number; // en secondes
  description: string;
  intensity: 'douce' | 'modérée' | 'intense';
}

const flashSessions: FlashGlowSession[] = [
  {
    id: 'quick-calm',
    name: 'Apaisement Express',
    duration: 60,
    description: 'Une minute pour calmer les étincelles intérieures',
    intensity: 'douce'
  },
  {
    id: 'deep-release',
    name: 'Libération Profonde',
    duration: 120,
    description: 'Deux minutes pour dissiper les tensions',
    intensity: 'modérée'
  },
  {
    id: 'energy-reset',
    name: 'Reset Énergétique',
    duration: 180,
    description: 'Trois minutes pour recentrer ton énergie',
    intensity: 'intense'
  }
];

const FlashGlowPage: React.FC = () => {
  const { toast } = useToast();

  // Get optimized universe config
  const universe = getOptimizedUniverse('flashGlow');

  // Universe state
  const [isEntering, setIsEntering] = useState(true);
  const [universeEntered, setUniverseEntered] = useState(false);

  // Session state
  const [selectedSession, setSelectedSession] = useState<FlashGlowSession | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(0);
  const sudsConsent = useClinicalConsent('SUDS');
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const glowIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Optimized animations
  const { entranceVariants, cleanupAnimation } = useOptimizedAnimation({
    enableComplexAnimations: true,
    useCSSAnimations: true,
  });

  // Handle universe entrance
  const handleUniverseEnterComplete = () => {
    setUniverseEntered(true);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAnimation();
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (glowIntervalRef.current) clearInterval(glowIntervalRef.current);
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

      // Glow pulse effect
      glowIntervalRef.current = setInterval(() => {
        setGlowIntensity(prev => {
          // Gradually decrease intensity to simulate calming
          const baseIntensity = 0.8 - (selectedSession.duration - timeRemaining) / selectedSession.duration * 0.6;
          return baseIntensity + Math.random() * 0.3;
        });
      }, 100);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (glowIntervalRef.current) clearInterval(glowIntervalRef.current);
      };
    }
  }, [isActive, selectedSession, timeRemaining]);

  const startSession = (session: FlashGlowSession) => {
    setSelectedSession(session);
    setTimeRemaining(session.duration);
    setIsActive(true);
    setGlowIntensity(0.8);
    
    toast({
      title: "Session d'apaisement commencée",
      description: "Laisse les étincelles se calmer à ton rythme",
    });
  };

  const stopSession = () => {
    setIsActive(false);
    setGlowIntensity(0);
    
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (glowIntervalRef.current) clearInterval(glowIntervalRef.current);
    
    setShowReward(true);
  };

  const pauseSession = () => {
    setIsActive(!isActive);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (glowIntervalRef.current) clearInterval(glowIntervalRef.current);
  };

  const handleRewardComplete = () => {
    setShowReward(false);
    setSelectedSession(null);
    
    toast({
      title: "Énergie stabilisée ✨",
      description: "Ta flamme intérieure brille sereinement",
    });
  };

  const progress = selectedSession && timeRemaining > 0 
    ? ((selectedSession.duration - timeRemaining) / selectedSession.duration) * 100 
    : 0;

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'douce': return 'border-green-400';
      case 'modérée': return 'border-yellow-400';
      case 'intense': return 'border-orange-400';
      default: return 'border-gray-400';
    }
  };

  if (showReward && selectedSession) {
    return (
      <RewardSystem
        reward={{
          type: 'flame',
          name: 'Bougie zen',
          description: universe.artifacts.description,
          moduleId: 'flash-glow'
        }}
        badgeText="Énergie stabilisée 🕯️"
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
      {/* Electric glow effect */}
      {selectedSession && (
        <div 
          className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-100"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${universe.ambiance.colors.accent}${Math.floor(glowIntensity * 20).toString(16).padStart(2, '0')}, transparent 60%)`,
            opacity: glowIntensity
          }}
        />
      )}

      {/* Header */}
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
            <Zap className="h-6 w-6" />
            <h1 className="text-xl font-light tracking-wide">{universe.name}</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-12">
        {sudsConsent.shouldPrompt && (
          <div className="mb-10">
            <ClinicalOptIn
              title="Activer l'évaluation SUDS"
              description="Ce score de stress nous aide à ajuster l'intensité des sessions FlashGlow. Votre décision est mémorisée et peut être changée ultérieurement."
              acceptLabel="Oui, personnaliser"
              declineLabel="Pas maintenant"
              onAccept={sudsConsent.grantConsent}
              onDecline={sudsConsent.declineConsent}
              isProcessing={sudsConsent.isSaving}
              error={sudsConsent.error}
              className="bg-white/10 border-white/25 backdrop-blur-md"
            />
          </div>
        )}
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
                  style={{ background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1), transparent)' }}
                >
                  <Zap className="h-10 w-10 text-yellow-400" />
                </motion.div>
                
                <h2 className="text-4xl font-light text-white tracking-wide">
                  Sessions d'Apaisement
                </h2>
                <p className="text-xl text-white/70 max-w-2xl mx-auto font-light">
                  Laisse les étincelles se calmer et ton énergie se stabiliser. 
                  Chaque session apaise progressivement les tensions intérieures.
                </p>
              </div>

              {/* Sessions Grid */}
              <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
                {flashSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.2 }}
                    whileHover={{ scale: 1.05, y: -10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card 
                      className={`h-full bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group ${getIntensityColor(session.intensity)}`}
                      onClick={() => startSession(session)}
                    >
                      <CardContent className="p-6 space-y-4">
                        <div className="text-center">
                          <Zap className="w-10 h-10 text-yellow-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                          <h3 className="text-xl font-light text-white mb-2">
                            {session.name}
                          </h3>
                          <div className="flex items-center justify-center gap-2 mb-3">
                            <Timer className="w-4 h-4 text-white/60" />
                            <span className="text-white/60 text-sm">
                              {Math.floor(session.duration / 60)}:{(session.duration % 60).toString().padStart(2, '0')}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-white/70 text-center text-sm leading-relaxed">
                          {session.description}
                        </p>
                        
                        <Button 
                          className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm group-hover:bg-gradient-to-r group-hover:from-yellow-500/30 group-hover:to-orange-500/30 transition-all duration-300"
                          onClick={() => startSession(session)}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Commencer l'apaisement
                        </Button>
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
              className="max-w-4xl mx-auto text-center"
            >
              {/* Session Info */}
              <div className="mb-12">
                <h2 className="text-3xl font-light text-white mb-4 tracking-wide">
                  {selectedSession.name}
                </h2>
                <p className="text-white/70 text-lg mb-6">{selectedSession.description}</p>
                
                {/* Visual Timer */}
                <div className="text-6xl font-mono text-white mb-8 font-light">
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                </div>
                
                {/* Progress bar */}
                <div className="w-full max-w-md mx-auto bg-white/10 rounded-full h-3 mb-8">
                  <motion.div 
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full"
                    style={{ width: `${progress}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
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
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Reprendre
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={stopSession}
                  variant="outline"
                  size="lg"
                  className="min-w-40 bg-transparent border-white/30 text-white hover:bg-white/10"
                >
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

export default FlashGlowPage;