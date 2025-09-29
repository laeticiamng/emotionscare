import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UniverseEngine } from '@/components/universe/UniverseEngine';
import { RewardAnimation } from '@/components/rewards/RewardAnimation';
import { useCollectionStore } from '@/store/collection.store';
import { UNIVERSE_CONFIGS } from '@/data/universes/config';
import { Button } from '@/components/ui/button';
import { Sparkles, Circle, Star } from 'lucide-react';

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'pause';
type SessionState = 'setup' | 'breathing' | 'complete';

const BREATH_PRESETS = {
  cosmic: {
    label: 'Équilibre cosmique (4-4-6-2)',
    description: 'Rythme progressif utilisé par la constellation pour guider la respiration.',
    timings: { inhale: 4, hold: 4, exhale: 6, pause: 2 },
  },
  coherence: {
    label: 'Cohérence cardiaque (5-5)',
    description: 'Respiration cadencée pour activer la cohérence cardiaque.',
    timings: { inhale: 5, hold: 0, exhale: 5, pause: 0 },
  },
  '4-7-8': {
    label: 'Relaxation 4-7-8',
    description: 'Technique apaisante pour calmer le système nerveux.',
    timings: { inhale: 4, hold: 7, exhale: 8, pause: 0 },
  },
} as const;

type BreathPresetKey = keyof typeof BREATH_PRESETS;
type BreathPreset = (typeof BREATH_PRESETS)[BreathPresetKey];

const BREATH_PRESET_ENTRIES = Object.entries(BREATH_PRESETS) as Array<[
  BreathPresetKey,
  BreathPreset
]>;

const BreathConstellationPage = () => {
  const [sessionState, setSessionState] = useState<SessionState>('setup');
  const [breathPhase, setBreathPhase] = useState<BreathPhase>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [targetCycles, setTargetCycles] = useState(5);
  const [stars, setStars] = useState<Array<{ x: number; y: number; brightness: number; id: number }>>([]);
  const [showReward, setShowReward] = useState(false);
  const [isUniverseReady, setIsUniverseReady] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<BreathPresetKey>('cosmic');

  const { addReward } = useCollectionStore();
  const universe = UNIVERSE_CONFIGS.vrBreath;

  // Breath timing configuration (in seconds)
  const breathTiming = useMemo(() => ({
    ...BREATH_PRESETS[selectedPreset].timings,
  }), [selectedPreset]);

  // Start breathing session
  const startBreathing = useCallback(() => {
    setSessionState('breathing');
    setSessionStartTime(new Date());
    setCycleCount(0);
    setStars([]);
    setBreathPhase('inhale');
  }, []);

  // Breath cycle management
  useEffect(() => {
    if (sessionState !== 'breathing') return;

    let timer: NodeJS.Timeout;
    
    const nextPhase = () => {
      setBreathPhase(current => {
        switch (current) {
          case 'inhale':
            return 'hold';
          case 'hold':
            return 'exhale';
          case 'exhale':
            return 'pause';
          case 'pause':
            // Complete cycle - add a star
            const newStar = {
              id: Date.now(),
              x: 20 + Math.random() * 60, // Keep stars in center area
              y: 20 + Math.random() * 60,
              brightness: 0.5 + Math.random() * 0.5
            };
            setStars(prev => [...prev, newStar]);
            
            const newCycleCount = cycleCount + 1;
            setCycleCount(newCycleCount);
            
            if (newCycleCount >= targetCycles) {
              // Session complete
              setTimeout(() => {
                setSessionState('complete');
                generateConstellation();
              }, 1000);
              return 'inhale';
            }
            
            return 'inhale';
          default:
            return 'inhale';
        }
      });
    };

    const currentTiming = breathTiming[breathPhase];
    timer = setTimeout(nextPhase, Math.max(currentTiming, 0) * 1000);

    return () => clearTimeout(timer);
  }, [breathPhase, sessionState, cycleCount, targetCycles, breathTiming]);

  const generateConstellation = useCallback(() => {
    if (!sessionStartTime) return;

    const sessionDuration = Date.now() - sessionStartTime.getTime();
    
    const constellationData = {
      id: `constellation-${Date.now()}`,
      starPattern: stars,
      cycleCount,
      sessionDuration,
      timestamp: new Date(),
      preset: selectedPreset,
      presetLabel: BREATH_PRESETS[selectedPreset].label,
    };

    addReward({
      type: 'constellation',
      name: `Constellation ${getCycleQuality(cycleCount)}`,
      description: `${cycleCount} cycles de respiration - ${Math.round(sessionDuration / 1000)}s`,
      moduleId: 'breath-constellation',
      rarity: cycleCount >= 10 ? 'epic' : cycleCount >= 7 ? 'rare' : 'common',
      visualData: {
        color: '#4ecdc4',
        icon: 'constellation',
        animation: 'twinkle'
      },
      metadata: constellationData
    });

    setShowReward(true);
  }, [stars, cycleCount, sessionStartTime, addReward, selectedPreset]);

  const getCycleQuality = (cycles: number): string => {
    if (cycles >= 10) return 'Majeure';
    if (cycles >= 7) return 'Céleste';
    if (cycles >= 5) return 'Étoilée';
    return 'Naissante';
  };

  const getPhaseInstructions = (): string => {
    switch (breathPhase) {
      case 'inhale': return 'Inspirez lentement...';
      case 'hold': return 'Retenez...';
      case 'exhale': return 'Expirez doucement...';
      case 'pause': return 'Pause...';
      default: return '';
    }
  };

  const getSphereScale = (): number => {
    switch (breathPhase) {
      case 'inhale': return 1.5;
      case 'hold': return 1.4;
      case 'exhale': return 0.8;
      case 'pause': return 0.9;
      default: return 1;
    }
  };

  const resetSession = () => {
    setSessionState('setup');
    setCycleCount(0);
    setStars([]);
    setShowReward(false);
    setSessionStartTime(null);
  };

  if (!universe) {
    return <div>Univers Breath Constellation non trouvé</div>;
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
          <div className="max-w-4xl mx-auto">
            
            {/* Setup phase */}
            {sessionState === 'setup' && (
              <motion.div
                className="text-center space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-white space-y-4">
                  <h2 className="text-3xl font-light">Constellation Respiratoire</h2>
                  <p className="text-lg opacity-80">
                    Chaque cycle de respiration créera une étoile dans votre constellation personnelle
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <p className="text-white font-medium">Rythme de respiration</p>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {BREATH_PRESET_ENTRIES.map(([key, preset]) => (
                        <Button
                          key={key}
                          type="button"
                          variant={selectedPreset === key ? 'default' : 'outline'}
                          onClick={() => setSelectedPreset(key)}
                          className="h-auto py-3 text-left text-white border-white/30"
                        >
                          <span className="block text-sm font-semibold">{preset.label}</span>
                          <span className="block text-xs text-white/70">{preset.timings.inhale}s / {preset.timings.hold}s / {preset.timings.exhale}s / {preset.timings.pause}s</span>
                        </Button>
                      ))}
                    </div>
                    <p className="text-sm text-white/60 max-w-2xl mx-auto">
                      {BREATH_PRESETS[selectedPreset].description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <label className="text-white font-medium">
                      Nombre de cycles: {targetCycles}
                    </label>
                    <div className="flex justify-center gap-2">
                      {[3, 5, 7, 10].map(count => (
                        <Button
                          key={count}
                          variant={targetCycles === count ? "default" : "outline"}
                          onClick={() => setTargetCycles(count)}
                          className="text-white border-white/30"
                        >
                          {count}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="text-white/60 space-y-2">
                    <p>• Inspirez : {breathTiming.inhale}s</p>
                    <p>• Retenez : {breathTiming.hold > 0 ? `${breathTiming.hold}s` : '—'}</p>
                    <p>• Expirez : {breathTiming.exhale}s</p>
                    <p>• Pause : {breathTiming.pause > 0 ? `${breathTiming.pause}s` : '—'}</p>
                  </div>

                  <Button
                    onClick={startBreathing}
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  >
                    Commencer la session
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Breathing phase */}
            {sessionState === 'breathing' && (
              <motion.div
                className="text-center space-y-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-white space-y-2">
                  <h3 className="text-xl font-light">{getPhaseInstructions()}</h3>
                  <p className="text-sm opacity-60">{BREATH_PRESETS[selectedPreset].label}</p>
                  <p className="text-sm opacity-60">Cycle {cycleCount + 1} / {targetCycles}</p>
                </div>

                {/* Breathing sphere */}
                <div className="relative flex items-center justify-center h-96">
                  <motion.div
                    className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center"
                    animate={{ 
                      scale: getSphereScale(),
                    }}
                    transition={{
                      duration: Math.max(breathTiming[breathPhase], 0.2),
                      ease: "easeInOut"
                    }}
                  >
                    <Circle className="w-24 h-24 text-white opacity-80" />
                  </motion.div>

                  {/* Existing stars from previous cycles */}
                  {stars.map((star, index) => (
                    <motion.div
                      key={star.id}
                      className="absolute"
                      style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: 1, 
                        opacity: star.brightness,
                        rotate: [0, 180, 360]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "loop"
                      }}
                    >
                      <Star className="w-6 h-6 text-yellow-300" />
                    </motion.div>
                  ))}

                  {/* Breath particles */}
                  {breathPhase === 'exhale' && (
                    <div className="absolute inset-0">
                      {Array.from({ length: 8 }, (_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-white rounded-full opacity-60"
                          style={{
                            left: '50%',
                            top: '50%',
                          }}
                          animate={{
                            x: Math.cos(i * 45 * Math.PI / 180) * 100,
                            y: Math.sin(i * 45 * Math.PI / 180) * 100,
                            opacity: [0.6, 0],
                            scale: [1, 0]
                          }}
                          transition={{
                            duration: Math.max(breathTiming.exhale, 0.2),
                            ease: "easeOut"
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Progress indicator */}
                <div className="w-64 mx-auto">
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-400 to-purple-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${(cycleCount / targetCycles) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p className="text-white/60 text-sm mt-2">
                    {cycleCount} étoiles créées
                  </p>
                </div>
              </motion.div>
            )}

            {/* Complete phase */}
            {sessionState === 'complete' && (
              <motion.div
                className="text-center space-y-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="text-white space-y-4">
                  <h3 className="text-2xl font-light">
                    Constellation {getCycleQuality(cycleCount)} créée !
                  </h3>
                  <p className="text-lg opacity-80">
                    {cycleCount} étoiles brillent dans votre ciel personnel
                  </p>
                  <p className="text-sm text-white/60">
                    Rythme : {BREATH_PRESETS[selectedPreset].label}
                  </p>
                </div>

                {/* Final constellation display */}
                <div className="relative w-80 h-80 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-full opacity-30" />
                  
                  {stars.map((star, index) => (
                    <motion.div
                      key={star.id}
                      className="absolute"
                      style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                      }}
                      animate={{
                        opacity: [star.brightness * 0.7, star.brightness, star.brightness * 0.7],
                        scale: [0.8, 1.2, 0.8]
                      }}
                      transition={{
                        duration: 2 + Math.random(),
                        repeat: Infinity,
                        delay: index * 0.2
                      }}
                    >
                      <Sparkles className="w-4 h-4 text-yellow-300" />
                    </motion.div>
                  ))}

                  {/* Constellation lines */}
                  <svg className="absolute inset-0 w-full h-full">
                    {stars.slice(0, -1).map((star, index) => {
                      const nextStar = stars[index + 1];
                      return (
                        <motion.line
                          key={`line-${index}`}
                          x1={`${star.x}%`}
                          y1={`${star.y}%`}
                          x2={`${nextStar.x}%`}
                          y2={`${nextStar.y}%`}
                          stroke="rgba(255, 255, 255, 0.3)"
                          strokeWidth="1"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: index * 0.2 }}
                        />
                      );
                    })}
                  </svg>
                </div>

                <div className="flex justify-center gap-4">
                  <Button 
                    onClick={resetSession} 
                    variant="outline" 
                    className="text-white border-white/30"
                  >
                    Nouvelle constellation
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </UniverseEngine>

      {/* Reward animation */}
      {showReward && (
        <RewardAnimation
          reward={{
            id: `constellation-${Date.now()}`,
            type: 'constellation',
            name: `Constellation ${getCycleQuality(cycleCount)}`,
            description: `${cycleCount} étoiles créées • ${BREATH_PRESETS[selectedPreset].label}`,
            moduleId: 'breath-constellation',
            rarity: cycleCount >= 10 ? 'epic' : cycleCount >= 7 ? 'rare' : 'common',
            visualData: {
              color: '#4ecdc4',
              icon: 'constellation',
              animation: 'twinkle'
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

export default BreathConstellationPage;
