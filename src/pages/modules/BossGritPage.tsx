import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hammer, Flame, Shield, Sword, Crown } from 'lucide-react';
import { UniverseEngine } from '@/components/universe/UniverseEngine';
import { RewardSystem } from '@/components/rewards/RewardSystem';
import { useRewardsStore } from '@/store/rewards.store';
import { useOptimizedAnimation } from '@/hooks/useOptimizedAnimation';
import { UNIVERSE_CONFIGS } from '@/data/universes/config';
import { Button } from '@/components/ui/button';

interface ForgedItem {
  id: string;
  name: string;
  icon: React.ElementType;
  progress: number;
  description: string;
}

const BossGritPage: React.FC = () => {
  const [isEntering, setIsEntering] = useState(true);
  const [phase, setPhase] = useState<'setup' | 'forging' | 'complete'>('setup');
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [hammerStrike, setHammerStrike] = useState(0);
  const [showReward, setShowReward] = useState(false);
  
  const { addReward } = useRewardsStore();
  const { entranceVariants, cssAnimationClasses } = useOptimizedAnimation();

  const universe = UNIVERSE_CONFIGS.bossGrit;

  const challenges = [
    { id: 'daily-breath', name: 'Respirer 3 fois par jour', icon: Flame, days: 7 },
    { id: 'journal-week', name: 'Écrire 1 ligne par jour', icon: Shield, days: 5 },
    { id: 'mindful-moments', name: 'Pause mindful quotidienne', icon: Sword, days: 3 }
  ];

  const forgedItems: ForgedItem[] = [
    {
      id: 'flame-sword',
      name: 'Épée de Persévérance',
      icon: Sword,
      progress: 75,
      description: 'Forgée dans la détermination quotidienne'
    },
    {
      id: 'wisdom-shield', 
      name: 'Bouclier de Sagesse',
      icon: Shield,
      progress: 45,
      description: 'Protection contre les doutes'
    }
  ];

  const handleEnterComplete = useCallback(() => {
    setIsEntering(false);
  }, []);

  const selectChallenge = useCallback((challengeId: string) => {
    setSelectedChallenge(challengeId);
    setPhase('forging');
  }, []);

  const strike = useCallback(() => {
    setHammerStrike(prev => {
      const newStrike = prev + 1;
      if (newStrike >= 5) {
        setTimeout(() => completeForging(), 800);
      }
      return newStrike;
    });
  }, []);

  const completeForging = useCallback(() => {
    setPhase('complete');
    
    const challenge = challenges.find(c => c.id === selectedChallenge);
    const itemNames = ['Amulette de Force', 'Clé de Détermination', 'Pièce de Courage'];
    const itemName = itemNames[Math.floor(Math.random() * itemNames.length)];
    
    const reward = addReward({
      type: 'sticker',
      name: itemName,
      description: `Forgé avec ${challenge?.name}`
    });

    setTimeout(() => {
      setShowReward(true);
    }, 1000);
  }, [selectedChallenge, challenges, addReward]);

  if (phase === 'setup') {
    return (
      <UniverseEngine
        universe={universe}
        isEntering={isEntering}
        onEnterComplete={handleEnterComplete}
        enableParticles={true}
        className="bg-gradient-to-br from-slate-900 via-orange-900 to-red-900"
      >
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <motion.div
            className="text-center mb-12"
            variants={entranceVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <Hammer className="w-8 h-8 text-orange-400" />
              <h1 className="text-3xl font-light text-white">La Forge Intérieure</h1>
            </div>
            <p className="text-white/70 text-lg max-w-md">
              Forge ta détermination dans les flammes de la persévérance
            </p>
          </motion.div>

          <div className="grid gap-4 max-w-md w-full">
            <h3 className="text-white/80 text-center mb-4">Choisis ton défi à forger</h3>
            {challenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Button
                  onClick={() => selectChallenge(challenge.id)}
                  className="w-full bg-gradient-to-r from-orange-500/20 to-red-500/20 hover:from-orange-500/30 hover:to-red-500/30 text-white rounded-2xl p-6 border border-orange-400/30"
                >
                  <challenge.icon className="w-6 h-6 mr-3 text-orange-400" />
                  <div className="text-left">
                    <p className="font-medium">{challenge.name}</p>
                    <p className="text-sm text-white/60">{challenge.days} jours</p>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </UniverseEngine>
    );
  }

  if (phase === 'forging') {
    const challenge = challenges.find(c => c.id === selectedChallenge);
    
    return (
      <UniverseEngine
        universe={universe}
        isEntering={false}
        onEnterComplete={() => {}}
        enableParticles={true}
        className="bg-gradient-to-br from-slate-900 via-orange-900 to-red-900"
      >
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-light text-white mb-2">
              Forge: {challenge?.name}
            </h2>
            <p className="text-white/60">
              Frappe {5 - hammerStrike} fois pour terminer
            </p>
          </motion.div>

          {/* Anvil and Hammer */}
          <motion.div
            className="relative mb-12"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {/* Sparks effect */}
            <AnimatePresence>
              {Array.from({ length: hammerStrike }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-orange-400 rounded-full"
                  initial={{ 
                    opacity: 1, 
                    scale: 1,
                    x: Math.random() * 100 - 50,
                    y: Math.random() * 100 - 50
                  }}
                  animate={{ 
                    opacity: 0, 
                    scale: 0,
                    x: Math.random() * 200 - 100,
                    y: Math.random() * 200 - 100
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                />
              ))}
            </AnimatePresence>

            {/* Anvil representation */}
            <div className="w-32 h-32 bg-gradient-to-b from-gray-300 to-gray-600 rounded-lg relative">
              <div className="absolute inset-2 bg-gradient-to-b from-gray-400 to-gray-500 rounded" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Crown className="w-8 h-8 text-orange-400" />
              </div>
            </div>
          </motion.div>

          {/* Strike Button */}
          <Button
            onClick={strike}
            className="w-32 h-32 rounded-full bg-gradient-to-b from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-2xl"
            disabled={hammerStrike >= 5}
          >
            <Hammer className="w-12 h-12" />
          </Button>

          {/* Progress */}
          <div className="mt-8 flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i < hammerStrike ? 'bg-orange-400' : 'bg-white/20'
                }`}
              />
            ))}
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
      className="bg-gradient-to-br from-slate-900 via-orange-900 to-red-900"
    >
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center ${cssAnimationClasses.pulse}`}>
              <Crown className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-light text-white">Artefact forgé</h2>
          </div>
          <p className="text-white/70">
            Ton objet de détermination est prêt
          </p>
        </motion.div>

        <div className="max-w-md w-full mb-8">
          <h3 className="text-white/80 text-center mb-4">Ta collection</h3>
          <div className="space-y-3">
            {forgedItems.map((item) => (
              <div
                key={item.id}
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-orange-400/20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <item.icon className="w-5 h-5 text-orange-400" />
                  <span className="text-white font-medium">{item.name}</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-orange-400 to-red-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <p className="text-white/60 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {showReward && (
          <RewardSystem
            type="sticker"
            message="Objet forgé avec persévérance"
            onComplete={() => setShowReward(false)}
          />
        )}
      </div>
    </UniverseEngine>
  );
};

export default BossGritPage;