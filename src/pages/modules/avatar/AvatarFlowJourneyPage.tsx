// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Palette, Wand2, Download, RotateCcw, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import confetti from 'canvas-confetti';

interface EmotionState {
  valence: number; // -100 to 100 (negative to positive)
  arousal: number; // 0 to 100 (calm to energetic)
}

interface AvatarConfig {
  form: 'water' | 'fire' | 'air' | 'earth' | 'cosmic';
  colors: string[];
  intensity: number;
  movement: string;
}

const getAvatarConfig = (emotion: EmotionState): AvatarConfig => {
  if (emotion.arousal > 70 && emotion.valence > 50) {
    return {
      form: 'fire',
      colors: ['#FF6B6B', '#FFA500', '#FFD700'],
      intensity: 1,
      movement: 'energetic'
    };
  } else if (emotion.arousal < 30 && emotion.valence > 50) {
    return {
      form: 'water',
      colors: ['#4ECDC4', '#1A535C', '#87CEEB'],
      intensity: 0.5,
      movement: 'flowing'
    };
  } else if (emotion.arousal > 50 && emotion.valence < 0) {
    return {
      form: 'air',
      colors: ['#9B59B6', '#8E44AD', '#C39BD3'],
      intensity: 0.8,
      movement: 'swirling'
    };
  } else if (emotion.valence > 70) {
    return {
      form: 'cosmic',
      colors: ['#667EEA', '#764BA2', '#F093FB'],
      intensity: 0.9,
      movement: 'ethereal'
    };
  } else {
    return {
      form: 'earth',
      colors: ['#8B4513', '#A0522D', '#CD853F'],
      intensity: 0.6,
      movement: 'grounded'
    };
  }
};

const emotionDescriptions = {
  fire: 'Tu rayonnes d\'énergie et de passion! 🔥',
  water: 'Tu es calme et fluide comme l\'océan 🌊',
  air: 'Tu es léger et libre comme le vent 💨',
  earth: 'Tu es stable et ancré dans le moment 🌍',
  cosmic: 'Tu transcendes les émotions ordinaires ✨'
};

export default function AvatarFlowJourneyPage() {
  const [emotion, setEmotion] = useState<EmotionState>({ valence: 50, arousal: 50 });
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(getAvatarConfig({ valence: 50, arousal: 50 }));
  const [savedAvatars, setSavedAvatars] = useState<AvatarConfig[]>([]);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const config = getAvatarConfig(emotion);
    setAvatarConfig(config);
  }, [emotion]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const saveAvatar = () => {
    setSavedAvatars(prev => [...prev, avatarConfig]);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const randomizeEmotion = () => {
    setEmotion({
      valence: Math.random() * 200 - 100,
      arousal: Math.random() * 100
    });
  };

  const getAvatarStyle = () => {
    const { colors, intensity, movement } = avatarConfig;
    const gradient = `radial-gradient(circle at ${50 + Math.sin(animationPhase / 20) * 20}% ${50 + Math.cos(animationPhase / 15) * 20}%, ${colors[0]}, ${colors[1]}, ${colors[2]})`;
    
    return {
      background: gradient,
      transform: `scale(${1 + Math.sin(animationPhase / 30) * 0.1 * intensity}) rotate(${Math.sin(animationPhase / 40) * 10 * intensity}deg)`,
      filter: `blur(${2 - intensity}px) brightness(${1 + intensity * 0.2})`,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-3 flex items-center justify-center gap-3">
            <Sparkles className="w-12 h-12" />
            Avatar Flow Studio
          </h1>
          <p className="text-white/80 text-lg">Ton émotion devient une œuvre d'art vivante</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Avatar Display */}
          <Card className="lg:col-span-2 p-6 bg-black/30 backdrop-blur-lg border-white/20">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Ton Avatar Émotionnel</h2>
              <p className="text-white/70">{emotionDescriptions[avatarConfig.form]}</p>
            </div>

            {/* Avatar Canvas */}
            <div className="relative h-96 bg-black/50 rounded-xl overflow-hidden mb-6 flex items-center justify-center">
              <motion.div
                className="w-64 h-64 rounded-full"
                style={getAvatarStyle()}
                animate={{
                  boxShadow: [
                    `0 0 60px ${avatarConfig.colors[0]}`,
                    `0 0 100px ${avatarConfig.colors[1]}`,
                    `0 0 60px ${avatarConfig.colors[2]}`,
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Particle effects */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: avatarConfig.colors[i % avatarConfig.colors.length],
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -100, 0],
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-white font-medium">Émotion (Positif ↔ Négatif)</label>
                  <span className="text-white/70">{emotion.valence > 0 ? '+' : ''}{Math.round(emotion.valence)}</span>
                </div>
                <Slider
                  value={[emotion.valence + 100]}
                  onValueChange={([val]) => setEmotion(prev => ({ ...prev, valence: val - 100 }))}
                  min={0}
                  max={200}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-white font-medium">Énergie (Calme ↔ Intense)</label>
                  <span className="text-white/70">{Math.round(emotion.arousal)}%</span>
                </div>
                <Slider
                  value={[emotion.arousal]}
                  onValueChange={([val]) => setEmotion(prev => ({ ...prev, arousal: val }))}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Button
                  onClick={randomizeEmotion}
                  variant="outline"
                  className="h-12"
                >
                  <Wand2 className="w-5 h-5 mr-2" />
                  Surprise
                </Button>
                <Button
                  onClick={saveAvatar}
                  className="h-12 bg-gradient-to-r from-purple-500 to-pink-500"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Sauvegarder
                </Button>
                <Button
                  onClick={() => setEmotion({ valence: 50, arousal: 50 })}
                  variant="outline"
                  className="h-12"
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Info Card */}
            <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Élément Actuel
              </h3>
              <div className="text-center py-4">
                <div className="text-6xl mb-3">
                  {avatarConfig.form === 'fire' && '🔥'}
                  {avatarConfig.form === 'water' && '🌊'}
                  {avatarConfig.form === 'air' && '💨'}
                  {avatarConfig.form === 'earth' && '🌍'}
                  {avatarConfig.form === 'cosmic' && '✨'}
                </div>
                <div className="text-2xl font-bold text-white capitalize mb-2">
                  {avatarConfig.form}
                </div>
                <div className="text-white/70 capitalize">
                  Mouvement: {avatarConfig.movement}
                </div>
              </div>
            </Card>

            {/* Color Palette */}
            <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
              <h3 className="text-lg font-bold text-white mb-3">🎨 Palette</h3>
              <div className="flex gap-2">
                {avatarConfig.colors.map((color, i) => (
                  <div
                    key={i}
                    className="flex-1 h-12 rounded-lg"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </Card>

            {/* Gallery */}
            <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Collection ({savedAvatars.length})
              </h3>
              <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                {savedAvatars.map((avatar, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg"
                    style={{
                      background: `radial-gradient(circle, ${avatar.colors[0]}, ${avatar.colors[1]}, ${avatar.colors[2]})`
                    }}
                  />
                ))}
                {savedAvatars.length === 0 && (
                  <div className="col-span-3 text-center py-8 text-white/50">
                    Sauvegarde tes avatars ici
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Element Guide */}
        <Card className="mt-6 p-6 bg-white/5 backdrop-blur-lg border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Guide des Éléments</h3>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { name: 'Feu', emoji: '🔥', desc: 'Énergie & Passion', condition: 'Haute énergie + Positif' },
              { name: 'Eau', emoji: '🌊', desc: 'Calme & Sérénité', condition: 'Basse énergie + Positif' },
              { name: 'Air', emoji: '💨', desc: 'Tension & Changement', condition: 'Haute énergie + Négatif' },
              { name: 'Terre', emoji: '🌍', desc: 'Stabilité & Ancrage', condition: 'Basse énergie + Neutre' },
              { name: 'Cosmique', emoji: '✨', desc: 'Transcendance', condition: 'Très positif' },
            ].map((element) => (
              <div key={element.name} className="p-4 bg-white/5 rounded-lg text-center">
                <div className="text-4xl mb-2">{element.emoji}</div>
                <div className="text-white font-bold mb-1">{element.name}</div>
                <div className="text-white/60 text-sm mb-2">{element.desc}</div>
                <div className="text-white/40 text-xs">{element.condition}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
