import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UniverseEngine } from '@/components/universe/UniverseEngine';
import { RewardAnimation } from '@/components/rewards/RewardAnimation';
import { useCollectionStore } from '@/store/collection.store';
import { UNIVERSE_CONFIGS } from '@/data/universes/config';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Droplets, Flame, Wind, Mountain } from 'lucide-react';

type EmotionAvatar = {
  type: 'water' | 'fire' | 'air' | 'earth';
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
  traits: string[];
};

const EmotionScanPage = () => {
  const [valence, setValence] = useState([50]); // Pleasant vs Unpleasant
  const [arousal, setArousal] = useState([50]); // Calm vs Excited
  const [isScanning, setIsScanning] = useState(false);
  const [detectedAvatar, setDetectedAvatar] = useState<EmotionAvatar | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [isUniverseReady, setIsUniverseReady] = useState(false);

  const { addReward } = useCollectionStore();
  const universe = UNIVERSE_CONFIGS.scan;

  // Emotion avatar types based on valence/arousal model
  const avatars: EmotionAvatar[] = [
    {
      type: 'water',
      name: 'Esprit Aquatique',
      icon: Droplets,
      color: '#4ecdc4',
      description: 'Fluide et adaptable, apporte la sérénité',
      traits: ['Calme', 'Réfléchi', 'Empathique']
    },
    {
      type: 'fire',
      name: 'Flamme Vitale',
      icon: Flame,
      color: '#ff6b35',
      description: 'Passionné et énergique, illumine le chemin',
      traits: ['Dynamique', 'Créatif', 'Motivant']
    },
    {
      type: 'air',
      name: 'Souffle Léger',
      icon: Wind,
      color: '#45b7d1',
      description: 'Libre et optimiste, élève l\'esprit',
      traits: ['Joyeux', 'Spontané', 'Inspirant']
    },
    {
      type: 'earth',
      name: 'Roc Paisible',
      icon: Mountain,
      color: '#8b4513',
      description: 'Stable et sage, ancre dans la réalité',
      traits: ['Grounded', 'Patient', 'Fiable']
    }
  ];

  const getAvatarFromEmotion = useCallback((valenceValue: number, arousalValue: number): EmotionAvatar => {
    // Simple emotion mapping to avatar types
    if (valenceValue >= 50 && arousalValue >= 50) {
      return avatars[1]; // Fire - High valence, High arousal (Joy/Excitement)
    } else if (valenceValue >= 50 && arousalValue < 50) {
      return avatars[0]; // Water - High valence, Low arousal (Contentment/Peace)
    } else if (valenceValue < 50 && arousalValue >= 50) {
      return avatars[3]; // Earth - Low valence, High arousal (Stress/Anger)
    } else {
      return avatars[2]; // Air - Low valence, Low arousal (Melancholy/Reflection)
    }
  }, []);

  const startScan = useCallback(async () => {
    setIsScanning(true);
    
    // Simulate scanning process with visual feedback
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const avatar = getAvatarFromEmotion(valence[0], arousal[0]);
    setDetectedAvatar(avatar);
    
    // Add to collection
    const avatarData = {
      id: `avatar-${Date.now()}`,
      type: avatar.type,
      valence: valence[0],
      arousal: arousal[0],
      visualForm: avatar.name,
      timestamp: new Date()
    };

    addReward({
      type: 'avatar',
      name: avatar.name,
      description: avatar.description,
      moduleId: 'emotion-scan',
      rarity: 'common',
      visualData: {
        color: avatar.color,
        icon: 'avatar',
        animation: 'float'
      },
      metadata: avatarData
    });

    setIsScanning(false);
    setShowReward(true);
  }, [valence, arousal, getAvatarFromEmotion, addReward]);

  const resetScan = () => {
    setDetectedAvatar(null);
    setShowReward(false);
    setValence([50]);
    setArousal([50]);
  };

  // Get current preview avatar based on slider values
  const previewAvatar = getAvatarFromEmotion(valence[0], arousal[0]);

  if (!universe) {
    return <div>Univers Emotion Scan non trouvé</div>;
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
            
            {!isScanning && !detectedAvatar && (
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-center text-white space-y-4">
                  <h2 className="text-3xl font-light">Scan Émotionnel</h2>
                  <p className="text-lg opacity-80">
                    Ajustez les curseurs selon votre ressenti actuel
                  </p>
                </div>

                {/* Emotion sliders */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-white font-medium">
                      Ressenti: {valence[0] > 50 ? 'Agréable' : 'Difficile'} ({valence[0]}%)
                    </label>
                    <Slider
                      value={valence}
                      onValueChange={setValence}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-white/60">
                      <span>Difficile</span>
                      <span>Agréable</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-white font-medium">
                      Énergie: {arousal[0] > 50 ? 'Activée' : 'Calme'} ({arousal[0]}%)
                    </label>
                    <Slider
                      value={arousal}
                      onValueChange={setArousal}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-white/60">
                      <span>Calme</span>
                      <span>Activée</span>
                    </div>
                  </div>
                </div>

                {/* Live preview avatar */}
                <motion.div 
                  className="text-center space-y-6"
                  key={`${valence[0]}-${arousal[0]}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  <div className="relative inline-block">
                    <motion.div
                      className="w-32 h-32 rounded-full flex items-center justify-center relative"
                      style={{ 
                        backgroundColor: `${previewAvatar.color}20`,
                        border: `3px solid ${previewAvatar.color}60`
                      }}
                      animate={{
                        boxShadow: [
                          `0 0 20px ${previewAvatar.color}40`,
                          `0 0 40px ${previewAvatar.color}60`,
                          `0 0 20px ${previewAvatar.color}40`
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <previewAvatar.icon 
                        className="w-16 h-16"
                        style={{ color: previewAvatar.color }}
                      />
                      
                      {/* Floating particles */}
                      <div className="absolute inset-0">
                        {Array.from({ length: 6 }, (_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full"
                            style={{ backgroundColor: previewAvatar.color }}
                            animate={{
                              x: [0, Math.cos(i * 60 * Math.PI / 180) * 40],
                              y: [0, Math.sin(i * 60 * Math.PI / 180) * 40],
                              opacity: [0, 1, 0]
                            }}
                            transition={{
                              duration: 2,
                              delay: i * 0.2,
                              repeat: Infinity,
                              repeatType: "loop"
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-medium text-white">
                      {previewAvatar.name}
                    </h3>
                    <p className="text-white/80">
                      {previewAvatar.description}
                    </p>
                    <div className="flex justify-center gap-2 flex-wrap">
                      {previewAvatar.traits.map((trait, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full text-sm text-white"
                          style={{ backgroundColor: `${previewAvatar.color}40` }}
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={startScan}
                    size="lg"
                    className="mt-6 text-white"
                    style={{ backgroundColor: previewAvatar.color }}
                  >
                    Scanner cette émotion
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {/* Scanning animation */}
            {isScanning && (
              <motion.div
                className="text-center space-y-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h3 className="text-2xl font-light text-white">
                  Analyse en cours...
                </h3>
                
                <div className="relative inline-block">
                  <motion.div
                    className="w-48 h-48 border-4 border-white/30 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                  
                  <motion.div
                    className="absolute inset-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${previewAvatar.color}20` }}
                    animate={{
                      scale: [0.8, 1.2, 0.8],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <previewAvatar.icon 
                      className="w-16 h-16"
                      style={{ color: previewAvatar.color }}
                    />
                  </motion.div>
                </div>

                <div className="space-y-2">
                  <div className="h-2 w-64 mx-auto bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: previewAvatar.color }}
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 3 }}
                    />
                  </div>
                  <p className="text-white/60">Détection des patterns émotionnels...</p>
                </div>
              </motion.div>
            )}

            {/* Results */}
            {detectedAvatar && !showReward && (
              <motion.div
                className="text-center space-y-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <h3 className="text-2xl font-light text-white">
                  Avatar découvert !
                </h3>
                
                <div className="space-y-6">
                  <motion.div
                    className="w-40 h-40 mx-auto rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${detectedAvatar.color}20` }}
                    animate={{
                      boxShadow: [
                        `0 0 30px ${detectedAvatar.color}60`,
                        `0 0 60px ${detectedAvatar.color}80`,
                        `0 0 30px ${detectedAvatar.color}60`
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <detectedAvatar.icon 
                      className="w-20 h-20"
                      style={{ color: detectedAvatar.color }}
                    />
                  </motion.div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-medium text-white">
                      {detectedAvatar.name}
                    </h4>
                    <p className="text-white/80 max-w-md mx-auto">
                      {detectedAvatar.description}
                    </p>
                  </div>

                  <div className="flex justify-center gap-4">
                    <Button onClick={resetScan} variant="outline" className="text-white border-white/30">
                      Nouveau scan
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </UniverseEngine>

      {/* Reward animation */}
      {showReward && detectedAvatar && (
        <RewardAnimation
          reward={{
            id: `avatar-${Date.now()}`,
            type: 'avatar',
            name: detectedAvatar.name,
            description: detectedAvatar.description,
            moduleId: 'emotion-scan',
            rarity: 'common',
            visualData: {
              color: detectedAvatar.color,
              icon: 'avatar',
              animation: 'float'
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

export default EmotionScanPage;