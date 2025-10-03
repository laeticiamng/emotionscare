import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Waves, Heart, Music, Sparkles } from 'lucide-react';
import { UniverseEngine } from '@/components/universe/UniverseEngine';
import { RewardSystem } from '@/components/rewards/RewardSystem';
import { useRewardsStore } from '@/store/rewards.store';
import { useOptimizedAnimation } from '@/hooks/useOptimizedAnimation';
import { UNIVERSE_CONFIGS } from '@/data/universes/config';
import { Button } from '@/components/ui/button';

interface Bubble {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  speed: number;
}

const BubbleBeatPage: React.FC = () => {
  const [isEntering, setIsEntering] = useState(true);
  const [phase, setPhase] = useState<'setup' | 'beating' | 'complete'>('setup');
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [poppedBubbles, setPoppedBubbles] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  
  const { addReward } = useRewardsStore();
  const { entranceVariants, cssAnimationClasses } = useOptimizedAnimation();

  const universe = UNIVERSE_CONFIGS.bubbleBeat;

  const handleEnterComplete = useCallback(() => {
    setIsEntering(false);
  }, []);

  const generateBubble = useCallback((): Bubble => {
    const colors = ['#4fc3f7', '#81d4fa', '#b3e5fc', '#e1f5fe', '#29b6f6'];
    return {
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * 80 + 10,
      y: 100 + Math.random() * 20,
      size: 20 + Math.random() * 40,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 0.6 + Math.random() * 0.4,
      speed: 1 + Math.random() * 2
    };
  }, []);

  const startSession = useCallback(() => {
    setPhase('beating');
    setPoppedBubbles(0);
    setSessionDuration(0);
    
    // Generate initial bubbles
    const initialBubbles = Array.from({ length: 8 }, generateBubble);
    setBubbles(initialBubbles);
  }, [generateBubble]);

  const popBubble = useCallback((bubbleId: string) => {
    setBubbles(prev => prev.filter(b => b.id !== bubbleId));
    setPoppedBubbles(prev => prev + 1);
    
    // Add a new bubble
    setTimeout(() => {
      setBubbles(prev => [...prev, generateBubble()]);
    }, 500);
  }, [generateBubble]);

  const completeSession = useCallback(() => {
    setPhase('complete');
    
    const reward = addReward({
      type: 'sticker',
      name: 'Bulle Précieuse',
      description: `${poppedBubbles} bulles éclatées en ${Math.floor(sessionDuration / 60)}min`
    });

    setTimeout(() => {
      setShowReward(true);
    }, 800);
  }, [poppedBubbles, sessionDuration, addReward]);

  // Animation loop for bubbles
  useEffect(() => {
    if (phase !== 'beating') return;

    const interval = setInterval(() => {
      setSessionDuration(prev => prev + 1);
      
      setBubbles(prev => 
        prev.map(bubble => ({
          ...bubble,
          y: bubble.y - bubble.speed
        })).filter(bubble => bubble.y > -10)
      );

      // Add new bubbles occasionally
      if (Math.random() < 0.3) {
        setBubbles(prev => [...prev, generateBubble()]);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [phase, generateBubble]);

  // Auto-complete after 2 minutes
  useEffect(() => {
    if (sessionDuration >= 120) {
      completeSession();
    }
  }, [sessionDuration, completeSession]);

  if (phase === 'setup') {
    return (
      <UniverseEngine
        universe={universe}
        isEntering={isEntering}
        onEnterComplete={handleEnterComplete}
        enableParticles={true}
        className="bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900"
      >
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <motion.div
            className="text-center mb-12"
            variants={entranceVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <Waves className="w-8 h-8 text-blue-400" />
              <h1 className="text-3xl font-light text-white">L'Océan des Bulles</h1>
            </div>
            <p className="text-white/70 text-lg max-w-md">
              Libère tes tensions dans la danse des bulles
            </p>
          </motion.div>

          <motion.div
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <p className="text-white/80 text-sm">
                Chaque bulle éclatée libère une tension. 
                Prends ton temps, respire, et laisse-toi porter.
              </p>
            </div>

            <Button
              onClick={startSession}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl py-6 text-lg font-medium"
            >
              <Waves className="w-5 h-5 mr-2" />
              Entrer dans l'océan
            </Button>
          </motion.div>
        </div>
      </UniverseEngine>
    );
  }

  if (phase === 'beating') {
    return (
      <UniverseEngine
        universe={universe}
        isEntering={false}
        onEnterComplete={() => {}}
        enableParticles={false}
        className="bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900 overflow-hidden"
      >
        <div className="min-h-screen relative p-6">
          {/* Header */}
          <div className="text-center mb-8 relative z-10">
            <p className="text-white/80 text-lg">
              {poppedBubbles} bulles éclatées
            </p>
            <p className="text-white/60 text-sm">
              {Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')}
            </p>
          </div>

          {/* Bubbles */}
          <div className="absolute inset-0">
            <AnimatePresence>
              {bubbles.map((bubble) => (
                <motion.div
                  key={bubble.id}
                  className="absolute cursor-pointer"
                  style={{
                    left: `${bubble.x}%`,
                    top: `${bubble.y}%`,
                    width: `${bubble.size}px`,
                    height: `${bubble.size}px`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: bubble.opacity, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.5 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => popBubble(bubble.id)}
                >
                  <div
                    className="w-full h-full rounded-full relative"
                    style={{
                      background: `radial-gradient(circle at 30% 20%, ${bubble.color}80, ${bubble.color}40)`,
                      border: `1px solid ${bubble.color}60`,
                      boxShadow: `0 0 20px ${bubble.color}40`
                    }}
                  >
                    {/* Bubble highlight */}
                    <div
                      className="absolute top-2 left-2 w-2 h-2 bg-white/60 rounded-full"
                      style={{ width: `${bubble.size * 0.15}px`, height: `${bubble.size * 0.15}px` }}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Complete Button */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
            <Button
              onClick={completeSession}
              className="bg-white/20 hover:bg-white/30 text-white rounded-full px-8 py-3"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Terminer
            </Button>
          </div>
        </div>
      </UniverseEngine>
    );
  }

  return (
    <UniverseEngine
      universe={universe}
      isEntering={false}
      onEnterComplete={() => {}}
      enableParticles={true}
      className="bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900"
    >
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 bg-cyan-400 rounded-full flex items-center justify-center ${cssAnimationClasses.pulse}`}>
              <Waves className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-light text-white">Session terminée</h2>
          </div>
          <p className="text-white/70">
            {poppedBubbles} tensions libérées en {Math.floor(sessionDuration / 60)} minutes
          </p>
        </motion.div>

        {/* Aquarium Collection */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 max-w-md w-full mb-8">
          <h3 className="text-white/80 text-center mb-4">Ton aquarium</h3>
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: Math.min(poppedBubbles, 12) }).map((_, i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 opacity-60"
              />
            ))}
          </div>
        </div>

        {showReward && (
          <RewardSystem
            type="sticker"
            message="Stress allégé dans l'océan des bulles"
            onComplete={() => setShowReward(false)}
          />
        )}
      </div>
    </UniverseEngine>
  );
};

export default BubbleBeatPage;