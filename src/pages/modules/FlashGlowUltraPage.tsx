import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UniverseEngine } from '@/components/universe/UniverseEngine';
import { RewardAnimation } from '@/components/rewards/RewardAnimation';
import { useCollectionStore } from '@/store/collection.store';
import { UNIVERSE_CONFIGS } from '@/data/universes/config';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Zap, Circle, Sparkles } from 'lucide-react';

type FlashPhase = 'intro' | 'pulse' | 'expansion' | 'climax' | 'condensation' | 'complete';
type GlowType = 'energy' | 'calm' | 'focus' | 'joy';

const FlashGlowUltraPage = () => {
  const [phase, setPhase] = useState<FlashPhase>('intro');
  const [glowType, setGlowType] = useState<GlowType>('energy');
  const [progress, setProgress] = useState(0);
  const [intensity, setIntensity] = useState(50);
  const [showReward, setShowReward] = useState(false);
  const [generatedGem, setGeneratedGem] = useState<any>(null);
  const [isUniverseReady, setIsUniverseReady] = useState(false);

  const { addReward } = useCollectionStore();
  const universe = UNIVERSE_CONFIGS.flashGlow;

  // Glow type colors and properties
  const glowConfigs = {
    energy: { 
      color: '#ff6b35', 
      sound: 'zap', 
      pulseRate: 1.2,
      description: 'Gemme d\'Énergie Vitale'
    },
    calm: { 
      color: '#4ecdc4', 
      sound: 'wave', 
      pulseRate: 0.8,
      description: 'Gemme de Sérénité'
    },
    focus: { 
      color: '#45b7d1', 
      sound: 'crystal', 
      pulseRate: 1.0,
      description: 'Gemme de Concentration'
    },
    joy: { 
      color: '#f9ca24', 
      sound: 'chime', 
      pulseRate: 1.4,
      description: 'Gemme de Joie'
    }
  };

  const currentGlow = glowConfigs[glowType];

  // Auto-progress through phases
  useEffect(() => {
    if (!isUniverseReady || phase === 'complete') return;

    let timer: NodeJS.Timeout;
    
    switch (phase) {
      case 'intro':
        timer = setTimeout(() => {
          setPhase('pulse');
          setProgress(20);
        }, 2000);
        break;
      case 'pulse':
        timer = setTimeout(() => {
          setPhase('expansion');
          setProgress(40);
        }, 3000);
        break;
      case 'expansion':
        timer = setTimeout(() => {
          setPhase('climax');
          setProgress(70);
        }, 4000);
        break;
      case 'climax':
        timer = setTimeout(() => {
          setPhase('condensation');
          setProgress(90);
          generateGem();
        }, 2000);
        break;
      case 'condensation':
        timer = setTimeout(() => {
          setPhase('complete');
          setProgress(100);
        }, 2000);
        break;
    }

    return () => clearTimeout(timer);
  }, [phase, isUniverseReady]);

  const generateGem = useCallback(() => {
    const gem = {
      id: `gem-${Date.now()}`,
      color: currentGlow.color,
      intensity,
      duration: 8000, // Total session duration
      timestamp: new Date(),
      glowType
    };

    setGeneratedGem(gem);

    // Add to collection
    const rewardId = addReward({
      type: 'gem',
      name: currentGlow.description,
      description: `Intensité ${intensity}% - Créée avec amour`,
      moduleId: 'flash-glow-ultra',
      rarity: intensity > 80 ? 'epic' : intensity > 60 ? 'rare' : 'common',
      visualData: {
        color: currentGlow.color,
        icon: 'gem',
        animation: 'pulse'
      },
      metadata: gem
    });

    setTimeout(() => setShowReward(true), 1000);
  }, [glowType, intensity, currentGlow, addReward]);

  const resetSession = () => {
    setPhase('intro');
    setProgress(0);
    setShowReward(false);
    setGeneratedGem(null);
  };

  const getPhaseContent = () => {
    switch (phase) {
      case 'intro':
        return (
          <motion.div 
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-light text-white mb-4">
              Choisissez votre énergie
            </h2>
            
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {Object.entries(glowConfigs).map(([type, config]) => (
                <Button
                  key={type}
                  variant={glowType === type ? "default" : "outline"}
                  onClick={() => setGlowType(type as GlowType)}
                  className="h-16 text-white border-white/30"
                  style={{ 
                    backgroundColor: glowType === type ? config.color : 'transparent',
                    borderColor: config.color
                  }}
                >
                  <div className="text-center">
                    <div className="font-medium">{type.charAt(0).toUpperCase() + type.slice(1)}</div>
                  </div>
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-white/80 text-sm">Intensité: {intensity}%</label>
              <input
                type="range"
                min="20"
                max="100"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: currentGlow.color }}
              />
            </div>
          </motion.div>
        );

      case 'pulse':
        return (
          <motion.div 
            className="flex flex-col items-center justify-center space-y-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <motion.div
              className="w-32 h-32 rounded-full flex items-center justify-center"
              style={{ backgroundColor: currentGlow.color }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 1 / currentGlow.pulseRate,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Zap className="w-16 h-16 text-white" />
            </motion.div>
            
            <p className="text-white/80 text-lg">
              Vibration énergétique activée...
            </p>
          </motion.div>
        );

      case 'expansion':
        return (
          <motion.div 
            className="flex flex-col items-center justify-center space-y-8"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <motion.div
              className="relative"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <motion.div
                className="w-48 h-48 rounded-full border-4 border-white/30 flex items-center justify-center"
                animate={{
                  scale: [1, 1.5, 1.2],
                  borderColor: [`${currentGlow.color}30`, `${currentGlow.color}80`, `${currentGlow.color}30`]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Circle 
                  className="w-24 h-24"
                  style={{ color: currentGlow.color }}
                />
              </motion.div>
              
              {/* Breathing guide */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="text-white text-center">
                  <div className="text-sm opacity-60">Respirez</div>
                </div>
              </motion.div>
            </motion.div>
            
            <p className="text-white/80 text-lg">
              Expansion progressive de l'aura...
            </p>
          </motion.div>
        );

      case 'climax':
        return (
          <motion.div 
            className="flex flex-col items-center justify-center space-y-8"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
          >
            <motion.div
              className="w-64 h-64 rounded-full flex items-center justify-center relative overflow-hidden"
              style={{ 
                background: `radial-gradient(circle, ${currentGlow.color}, ${currentGlow.color}50)`,
                boxShadow: `0 0 100px ${currentGlow.color}80`
              }}
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{ duration: 0.5, repeat: 4 }}
            >
              <Sparkles className="w-32 h-32 text-white" />
              
              {/* Flash effect */}
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.1, repeat: 8, repeatDelay: 0.2 }}
              />
            </motion.div>
            
            <p className="text-white text-xl font-medium">
              ✨ Flash cristallin activé ✨
            </p>
          </motion.div>
        );

      case 'condensation':
        return (
          <motion.div 
            className="flex flex-col items-center justify-center space-y-8"
          >
            <motion.div
              className="w-48 h-48 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${currentGlow.color}40` }}
              animate={{
                scale: [1.5, 0.8],
                rotate: [0, 720]
              }}
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              <motion.div
                className="w-24 h-24 rounded-full"
                style={{ backgroundColor: currentGlow.color }}
                animate={{
                  boxShadow: [
                    `0 0 20px ${currentGlow.color}`,
                    `0 0 60px ${currentGlow.color}80`,
                    `0 0 20px ${currentGlow.color}`
                  ]
                }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.div>
            
            <p className="text-white/80 text-lg">
              Condensation en gemme précieuse...
            </p>
          </motion.div>
        );

      case 'complete':
        return (
          <motion.div 
            className="text-center space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-white space-y-4">
              <h3 className="text-2xl font-light">Session terminée</h3>
              <p className="text-lg opacity-80">
                Votre gemme a été ajoutée à votre collection ✨
              </p>
              
              <div className="flex justify-center gap-4 mt-8">
                <Button onClick={resetSession} variant="outline" className="text-white border-white/30">
                  Nouvelle session
                </Button>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (!universe) {
    return <div>Univers Flash Glow non trouvé</div>;
  }

  return (
    <>
      <UniverseEngine
        universe={universe}
        isEntering={true}
        onEnterComplete={() => setIsUniverseReady(true)}
        className="min-h-screen"
      >
        <div className="container mx-auto px-4 py-8">
          {/* Progress bar */}
          <div className="mb-8">
            <Progress 
              value={progress} 
              className="w-full h-2"
              style={{ 
                background: `linear-gradient(to right, ${currentGlow.color}20, ${currentGlow.color}60)`
              }}
            />
          </div>

          {/* Main content area */}
          <div className="flex items-center justify-center min-h-[60vh]">
            <AnimatePresence mode="wait">
              <motion.div
                key={phase}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl"
              >
                {getPhaseContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </UniverseEngine>

      {/* Reward animation */}
      {showReward && generatedGem && (
        <RewardAnimation
          reward={{
            id: generatedGem.id,
            type: 'gem',
            name: currentGlow.description,
            description: `Intensité ${intensity}% - Session Flash Glow`,
            moduleId: 'flash-glow-ultra',
            rarity: intensity > 80 ? 'epic' : intensity > 60 ? 'rare' : 'common',
            visualData: {
              color: currentGlow.color,
              icon: 'gem',
              animation: 'pulse'
            },
            earnedAt: new Date()
          }}
          isVisible={showReward}
          onComplete={() => setShowReward(false)}
        />
      )}
    </>
  );
};

export default FlashGlowUltraPage;