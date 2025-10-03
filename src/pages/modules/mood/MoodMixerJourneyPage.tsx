import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Droplet, Zap, Sun, Moon, Cloud, Wind, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import confetti from 'canvas-confetti';
import { useCollectionModule } from '@/hooks/useCollectionModule';

interface MoodColor {
  name: string;
  color: string;
  emoji: string;
  intensity: number;
}

interface MoodRecipe {
  id: string;
  name: string;
  emoji: string;
  description: string;
  colors: MoodColor[];
  energy: number;
  harmony: number;
  unlocked: boolean;
}

const baseMoods: MoodColor[] = [
  { name: 'Joie', color: '#FFD700', emoji: '😊', intensity: 0 },
  { name: 'Calme', color: '#87CEEB', emoji: '😌', intensity: 0 },
  { name: 'Énergie', color: '#FF6347', emoji: '🔥', intensity: 0 },
  { name: 'Créativité', color: '#9370DB', emoji: '🎨', intensity: 0 },
  { name: 'Gratitude', color: '#FFB6C1', emoji: '🙏', intensity: 0 },
  { name: 'Concentration', color: '#4169E1', emoji: '🎯', intensity: 0 },
];

const moodRecipes: MoodRecipe[] = [
  {
    id: '1',
    name: 'Sunrise Serenity',
    emoji: '🌅',
    description: 'Mélange parfait pour commencer la journée',
    colors: [
      { name: 'Joie', color: '#FFD700', emoji: '😊', intensity: 70 },
      { name: 'Calme', color: '#87CEEB', emoji: '😌', intensity: 50 },
    ],
    energy: 60,
    harmony: 85,
    unlocked: true,
  },
  {
    id: '2',
    name: 'Creative Storm',
    emoji: '⚡',
    description: 'Pour les moments de brainstorming intense',
    colors: [
      { name: 'Créativité', color: '#9370DB', emoji: '🎨', intensity: 90 },
      { name: 'Énergie', color: '#FF6347', emoji: '🔥', intensity: 70 },
    ],
    energy: 85,
    harmony: 70,
    unlocked: false,
  },
  {
    id: '3',
    name: 'Zen Garden',
    emoji: '🧘',
    description: 'Paix intérieure et harmonie totale',
    colors: [
      { name: 'Calme', color: '#87CEEB', emoji: '😌', intensity: 90 },
      { name: 'Gratitude', color: '#FFB6C1', emoji: '🙏', intensity: 80 },
    ],
    energy: 30,
    harmony: 95,
    unlocked: false,
  },
  {
    id: '4',
    name: 'Focus Flow',
    emoji: '🎯',
    description: 'Concentration maximale pour performer',
    colors: [
      { name: 'Concentration', color: '#4169E1', emoji: '🎯', intensity: 95 },
      { name: 'Calme', color: '#87CEEB', emoji: '😌', intensity: 60 },
    ],
    energy: 70,
    harmony: 80,
    unlocked: false,
  },
  {
    id: '5',
    name: 'Party Vibes',
    emoji: '🎉',
    description: 'Énergie débordante et joie contagieuse',
    colors: [
      { name: 'Joie', color: '#FFD700', emoji: '😊', intensity: 100 },
      { name: 'Énergie', color: '#FF6347', emoji: '🔥', intensity: 100 },
    ],
    energy: 100,
    harmony: 75,
    unlocked: false,
  },
  {
    id: '6',
    name: 'Rainbow Harmony',
    emoji: '🌈',
    description: 'L\'équilibre parfait de toutes les émotions',
    colors: baseMoods.map(m => ({ ...m, intensity: 70 })),
    energy: 80,
    harmony: 100,
    unlocked: false,
  },
];

export default function MoodMixerJourneyPage() {
  const {
    collection,
    unlockItem,
    isUnlocked,
    sessionData,
    achievements,
  } = useCollectionModule('mood-mixer', moodRecipes.length);

  const [currentMoods, setCurrentMoods] = useState<MoodColor[]>(baseMoods);
  const [mixedColor, setMixedColor] = useState('#808080');
  const [recipes, setRecipes] = useState<MoodRecipe[]>(moodRecipes);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Calculate mixed color based on mood intensities
  useEffect(() => {
    const totalIntensity = currentMoods.reduce((sum, m) => sum + m.intensity, 0);
    if (totalIntensity === 0) {
      setMixedColor('#808080');
      return;
    }

    let r = 0, g = 0, b = 0;
    currentMoods.forEach(mood => {
      const weight = mood.intensity / totalIntensity;
      const color = mood.color;
      const rgb = hexToRgb(color);
      r += rgb.r * weight;
      g += rgb.g * weight;
      b += rgb.b * weight;
    });

    setMixedColor(rgbToHex(Math.round(r), Math.round(g), Math.round(b)));
  }, [currentMoods]);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 128, g: 128, b: 128 };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const updateMoodIntensity = (moodName: string, intensity: number) => {
    setCurrentMoods(prev =>
      prev.map(mood =>
        mood.name === moodName ? { ...mood, intensity } : mood
      )
    );
  };

  const tryRecipe = (recipe: MoodRecipe) => {
    const newMoods = baseMoods.map(baseMood => {
      const recipeMood = recipe.colors.find(c => c.name === baseMood.name);
      return recipeMood ? { ...baseMood, intensity: recipeMood.intensity } : baseMood;
    });
    setCurrentMoods(newMoods);
  };

  const saveMix = async () => {
    // Check if it matches any locked recipe
    const matchedRecipe = recipes.find(recipe => {
      if (isUnlocked(recipe.id)) return false;
      
      const tolerance = 15;
      return recipe.colors.every(recipeColor => {
        const currentMood = currentMoods.find(m => m.name === recipeColor.name);
        return currentMood && Math.abs(currentMood.intensity - recipeColor.intensity) <= tolerance;
      });
    });

    if (matchedRecipe) {
      await unlockItem(matchedRecipe.id, {
        recipe: matchedRecipe.name,
        harmony: Math.round(calculateHarmony()),
        energy: Math.round(calculateEnergy())
      });

      setRecipes(prev =>
        prev.map(r => r.id === matchedRecipe.id ? { ...r, unlocked: true } : r)
      );
      
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: [matchedRecipe.colors[0].color],
      });
    }
  };

  const resetMixer = () => {
    setCurrentMoods(baseMoods);
  };

  const randomize = () => {
    setCurrentMoods(prev =>
      prev.map(mood => ({ ...mood, intensity: Math.floor(Math.random() * 100) }))
    );
  };

  const calculateHarmony = () => {
    const avg = currentMoods.reduce((sum, m) => sum + m.intensity, 0) / currentMoods.length;
    const variance = currentMoods.reduce((sum, m) => sum + Math.pow(m.intensity - avg, 2), 0) / currentMoods.length;
    return Math.max(0, 100 - Math.sqrt(variance));
  };

  const calculateEnergy = () => {
    return currentMoods.reduce((sum, m) => sum + m.intensity, 0) / currentMoods.length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-fuchsia-950 to-pink-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-3 flex items-center justify-center gap-3">
            <Palette className="w-12 h-12" />
            Mood Mixer Laboratory
          </h1>
          <p className="text-white/80 text-lg">Crée ton cocktail émotionnel parfait</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Mixer */}
          <Card className="lg:col-span-2 p-6 bg-white/10 backdrop-blur-lg border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">🧪 Ton Mélange Actuel</h2>

            {/* Color Preview */}
            <div className="relative h-64 rounded-xl overflow-hidden mb-6 flex items-center justify-center">
              <motion.div
                className="w-full h-full"
                style={{
                  background: `radial-gradient(circle at ${50 + Math.sin(animationPhase / 20) * 30}% ${50 + Math.cos(animationPhase / 15) * 30}%, ${mixedColor}, ${mixedColor}88)`,
                }}
                animate={{
                  boxShadow: [
                    `0 0 60px ${mixedColor}`,
                    `0 0 100px ${mixedColor}`,
                    `0 0 60px ${mixedColor}`,
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Floating mood particles */}
              {currentMoods.filter(m => m.intensity > 0).map((mood, i) => (
                <motion.div
                  key={i}
                  className="absolute text-4xl"
                  animate={{
                    x: [0, Math.random() * 100 - 50],
                    y: [0, Math.random() * 100 - 50],
                    scale: [1, 1.2, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                  style={{
                    left: `${Math.random() * 80 + 10}%`,
                    top: `${Math.random() * 80 + 10}%`,
                  }}
                >
                  {mood.emoji}
                </motion.div>
              ))}
            </div>

            {/* Mood Sliders */}
            <div className="space-y-4 mb-6">
              {currentMoods.map((mood) => (
                <div key={mood.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{mood.emoji}</span>
                      <span className="text-white font-medium">{mood.name}</span>
                    </div>
                    <span className="text-white/70">{mood.intensity}%</span>
                  </div>
                  <Slider
                    value={[mood.intensity]}
                    onValueChange={([val]) => updateMoodIntensity(mood.name, val)}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="grid grid-cols-3 gap-3">
              <Button onClick={saveMix} className="h-12 bg-gradient-to-r from-purple-500 to-pink-500">
                <Droplet className="w-5 h-5 mr-2" />
                Sauvegarder
              </Button>
              <Button onClick={randomize} variant="outline" className="h-12">
                <Zap className="w-5 h-5 mr-2" />
                Aléatoire
              </Button>
              <Button onClick={resetMixer} variant="outline" className="h-12">
                Reset
              </Button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Card className="p-4 bg-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="text-white/80">Énergie</span>
                </div>
                <div className="text-2xl font-bold text-white">{Math.round(calculateEnergy())}%</div>
              </Card>
              <Card className="p-4 bg-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Sun className="w-5 h-5 text-orange-400" />
                  <span className="text-white/80">Harmonie</span>
                </div>
                <div className="text-2xl font-bold text-white">{Math.round(calculateHarmony())}%</div>
              </Card>
            </div>
          </Card>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Stats */}
            <Card className="p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-lg border-yellow-500/30">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-8 h-8 text-yellow-400" />
                <span className="text-white/80">Score</span>
              </div>
              <div className="text-4xl font-bold text-white">{perfectMixes * 100}</div>
            </Card>

            {/* Progress */}
            <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Progression
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Recettes débloquées</span>
                  <span className="text-white font-bold">
                    {collection.filter(c => c.unlocked).length}/{recipes.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Points</span>
                  <span className="text-white font-bold">{sessionData.totalPoints || 0}</span>
                </div>
              </div>
            </Card>

            {/* Recipes */}
            <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">📖 Recettes</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {recipes.map((recipe) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      isUnlocked(recipe.id)
                        ? 'bg-green-500/20 border-2 border-green-400'
                        : 'bg-white/5 border-2 border-white/20'
                    }`}
                    onClick={() => isUnlocked(recipe.id) && tryRecipe(recipe)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{recipe.emoji}</span>
                        <div>
                          <div className="text-white font-medium">{recipe.name}</div>
                          {isUnlocked(recipe.id) ? (
                            <div className="text-white/60 text-xs">{recipe.description}</div>
                          ) : (
                            <div className="text-white/40 text-xs">🔒 À découvrir</div>
                          )}
                        </div>
                      </div>
                    </div>
                    {isUnlocked(recipe.id) && (
                      <div className="flex gap-1 mt-2">
                        {recipe.colors.slice(0, 3).map((color, i) => (
                          <div
                            key={i}
                            className="flex-1 h-2 rounded-full"
                            style={{ backgroundColor: color.color }}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </Card>

            {achievements.length > 0 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <Card className="p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 text-center">
                  <Award className="w-16 h-16 text-yellow-400 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Alchimiste des Émotions!</h3>
                  <p className="text-white/70 text-sm">Tu maîtrises l'art du mélange 🎨</p>
                </Card>
              </motion.div>
            )}
          </div>
        </div>

        {/* Color Theory Guide */}
        <Card className="mt-6 p-6 bg-white/5 backdrop-blur-lg border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">🌈 Guide des Émotions</h3>
          <div className="grid md:grid-cols-6 gap-4">
            {baseMoods.map((mood) => (
              <div
                key={mood.name}
                className="p-4 bg-white/5 rounded-lg text-center"
                style={{ borderTop: `4px solid ${mood.color}` }}
              >
                <div className="text-4xl mb-2">{mood.emoji}</div>
                <div className="text-white font-bold mb-1">{mood.name}</div>
                <div
                  className="w-full h-3 rounded-full mt-2"
                  style={{ backgroundColor: mood.color }}
                />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
