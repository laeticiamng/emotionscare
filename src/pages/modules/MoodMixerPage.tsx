import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sliders, Palette, Sparkles } from 'lucide-react';
import { UniverseEngine } from '@/components/universe/UniverseEngine';
import { RewardSystem } from '@/components/rewards/RewardSystem';
import { useRewardsStore } from '@/store/rewards.store';
import { useOptimizedAnimation } from '@/hooks/useOptimizedAnimation';
import { UNIVERSE_CONFIGS } from '@/data/universes/config';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const MoodMixerPage: React.FC = () => {
  const [isEntering, setIsEntering] = useState(true);
  const [phase, setPhase] = useState<'setup' | 'mixing' | 'complete'>('setup');
  const [energy, setEnergy] = useState([50]); // 0-100 (doux -> enjoué)
  const [tone, setTone] = useState([50]);     // 0-100 (calme -> tonique)
  const [showReward, setShowReward] = useState(false);
  
  const { addReward } = useRewardsStore();
  const { entranceVariants, cssAnimationClasses } = useOptimizedAnimation();

  const universe = UNIVERSE_CONFIGS.moodMixer;

  const handleEnterComplete = useCallback(() => {
    setIsEntering(false);
  }, []);

  const startMixing = useCallback(() => {
    setPhase('mixing');
  }, []);

  const completeMixing = useCallback(() => {
    setPhase('complete');
    
    // Generate mood palette name
    const energyLevel = energy[0];
    const toneLevel = tone[0];
    
    let paletteName = "Ambiance ";
    if (energyLevel < 33) paletteName += "Douce";
    else if (energyLevel > 66) paletteName += "Vive";
    else paletteName += "Équilibrée";
    
    if (toneLevel < 33) paletteName += " & Calme";
    else if (toneLevel > 66) paletteName += " & Tonique";
    else paletteName += " & Sereine";

    // Create reward
    const reward = addReward({
      type: 'aura',
      name: paletteName,
      description: "Palette d'humeur personnalisée créée"
    });

    setTimeout(() => {
      setShowReward(true);
    }, 800);
  }, [energy, tone, addReward]);

  const getMoodColors = useCallback(() => {
    const energyVal = energy[0];
    const toneVal = tone[0];
    
    // Generate colors based on mood values
    const hue = (energyVal * 2.4); // 0-240 range for color spectrum
    const saturation = 40 + (toneVal * 0.4); // 40-80% saturation
    const lightness = 50 + (energyVal * 0.3); // 50-80% lightness
    
    return {
      primary: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
      secondary: `hsl(${(hue + 60) % 360}, ${saturation - 10}%, ${lightness - 10}%)`,
      accent: `hsl(${(hue + 120) % 360}, ${saturation + 10}%, ${lightness + 5}%)`
    };
  }, [energy, tone]);

  const moodColors = getMoodColors();

  if (phase === 'setup') {
    return (
      <UniverseEngine
        universe={universe}
        isEntering={isEntering}
        onEnterComplete={handleEnterComplete}
        enableParticles={true}
        className="bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900"
      >
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <motion.div
            className="text-center mb-12"
            variants={entranceVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <Sliders className="w-8 h-8 text-white/80" />
              <h1 className="text-3xl font-light text-white">Console des Humeurs</h1>
            </div>
            <p className="text-white/70 text-lg max-w-md">
              Compose l'ambiance parfaite pour ton moment présent
            </p>
          </motion.div>

          <motion.div
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={startMixing}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl py-6 text-lg font-medium"
            >
              <Palette className="w-5 h-5 mr-2" />
              Commencer à mixer
            </Button>
          </motion.div>
        </div>
      </UniverseEngine>
    );
  }

  if (phase === 'mixing') {
    return (
      <UniverseEngine
        universe={universe}
        isEntering={false}
        onEnterComplete={() => {}}
        enableParticles={true}
        className="transition-all duration-1000"
        style={{ 
          background: `linear-gradient(135deg, ${moodColors.primary}20, ${moodColors.secondary}20, ${moodColors.accent}20)` 
        }}
      >
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <motion.div
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-lg w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              borderColor: moodColors.primary + '40',
              borderWidth: '1px'
            }}
          >
            <h2 className="text-2xl font-light text-white mb-8 text-center">
              Peins ton ambiance
            </h2>

            {/* Energy Slider */}
            <div className="mb-8">
              <label className="text-white/80 text-sm mb-3 block">
                Énergie : {energy[0] < 33 ? 'Douce' : energy[0] > 66 ? 'Enjouée' : 'Équilibrée'}
              </label>
              <Slider
                value={energy}
                onValueChange={setEnergy}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-white/60 mt-2">
                <span>Doux</span>
                <span>Enjoué</span>
              </div>
            </div>

            {/* Tone Slider */}
            <div className="mb-8">
              <label className="text-white/80 text-sm mb-3 block">
                Tonalité : {tone[0] < 33 ? 'Calme' : tone[0] > 66 ? 'Tonique' : 'Sereine'}
              </label>
              <Slider
                value={tone}
                onValueChange={setTone}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-white/60 mt-2">
                <span>Calme</span>
                <span>Tonique</span>
              </div>
            </div>

            {/* Color Preview */}
            <div className="flex gap-4 mb-8 justify-center">
              <div 
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: moodColors.primary }}
              />
              <div 
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: moodColors.secondary }}
              />
              <div 
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: moodColors.accent }}
              />
            </div>

            <Button
              onClick={completeMixing}
              className="w-full bg-white/20 hover:bg-white/30 text-white rounded-2xl py-6"
              style={{ 
                backgroundColor: moodColors.primary + '40',
                borderColor: moodColors.primary + '60'
              }}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Figer cette palette
            </Button>
          </motion.div>
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
      style={{ 
        background: `linear-gradient(135deg, ${moodColors.primary}30, ${moodColors.secondary}30)` 
      }}
    >
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div 
              className={`w-12 h-12 rounded-full ${cssAnimationClasses.pulse}`}
              style={{ backgroundColor: moodColors.primary }}
            />
            <h2 className="text-2xl font-light text-white">Palette créée</h2>
          </div>
          <p className="text-white/70">
            Ton ambiance unique influence maintenant ton espace
          </p>
        </motion.div>

        {showReward && (
          <RewardSystem
            type="aura"
            message="Palette unique créée"
            onComplete={() => setShowReward(false)}
          />
        )}
      </div>
    </UniverseEngine>
  );
};

export default MoodMixerPage;