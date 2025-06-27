
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Star, Zap, Heart, Sun, Moon } from 'lucide-react';

const InstantGlowPage: React.FC = () => {
  const [currentGlow, setCurrentGlow] = useState(0);
  const [isGlowing, setIsGlowing] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(50);

  const glowModes = [
    {
      name: 'Golden Hour',
      description: 'Lueur dorée apaisante',
      color: 'from-yellow-400 to-orange-500',
      icon: Sun,
      effects: ['Confiance', 'Chaleur', 'Optimisme']
    },
    {
      name: 'Aurora Borealis',
      description: 'Danse de lumières mystiques',
      color: 'from-green-400 via-blue-500 to-purple-600',
      icon: Sparkles,
      effects: ['Émerveillement', 'Sérénité', 'Connexion']
    },
    {
      name: 'Crystal Energy',
      description: 'Éclat cristallin purificateur',
      color: 'from-cyan-400 to-blue-500',
      icon: Star,
      effects: ['Clarté', 'Purification', 'Focus']
    },
    {
      name: 'Rose Quartz',
      description: 'Douceur rose bienveillante',
      color: 'from-pink-400 to-rose-500',
      icon: Heart,
      effects: ['Amour-propre', 'Douceur', 'Guérison']
    },
    {
      name: 'Midnight Glow',
      description: 'Lueur nocturne apaisante',
      color: 'from-indigo-500 to-purple-600',
      icon: Moon,
      effects: ['Calme', 'Méditation', 'Repos']
    }
  ];

  const activateGlow = () => {
    setIsGlowing(true);
    setTimeout(() => setIsGlowing(false), 3000);
  };

  const currentMode = glowModes[currentGlow];
  const IconComponent = currentMode.icon;

  return (
    <div className={`min-h-screen transition-all duration-1000 ${
      isGlowing 
        ? `bg-gradient-to-br from-slate-800 via-${currentMode.color.split(' ')[1].split('-')[0]}-800 to-slate-900` 
        : 'bg-gradient-to-br from-slate-900 via-gray-900 to-black'
    } text-white p-6`}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="h-8 w-8 text-yellow-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Instant Glow
            </h1>
          </div>
          <p className="text-lg text-slate-300">
            Illuminez votre être en un instant
          </p>
          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
            Transformation Instantanée
          </Badge>
        </motion.div>

        {/* Zone de Glow Principale */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <Card className={`relative overflow-hidden bg-black/30 border-2 backdrop-blur-md transition-all duration-1000 ${
            isGlowing ? `border-${currentMode.color.split(' ')[1].split('-')[0]}-400 shadow-2xl` : 'border-gray-500/30'
          }`}>
            <CardContent className="p-8">
              {/* Effet de Glow Animé */}
              <AnimatePresence>
                {isGlowing && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: [0, 1, 1, 0], 
                      scale: [0, 1.5, 2, 3],
                      rotate: [0, 180, 360]
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 3, ease: "easeOut" }}
                    className={`absolute inset-0 bg-gradient-to-br ${currentMode.color} opacity-20 rounded-lg`}
                  />
                )}
              </AnimatePresence>

              <div className="relative z-10 space-y-6">
                {/* Icône Centrale */}
                <motion.div
                  animate={isGlowing ? {
                    scale: [1, 1.3, 1],
                    rotate: [0, 360],
                    opacity: [0.7, 1, 0.7]
                  } : {}}
                  transition={{ duration: 3, ease: "easeInOut" }}
                  className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${currentMode.color} flex items-center justify-center shadow-2xl`}
                >
                  <IconComponent className="h-16 w-16 text-white" />
                </motion.div>

                {/* Mode Actuel */}
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">{currentMode.name}</h3>
                  <p className="text-slate-300">{currentMode.description}</p>
                </div>

                {/* Effets */}
                <div className="flex flex-wrap justify-center gap-2">
                  {currentMode.effects.map((effect, index) => (
                    <motion.div
                      key={effect}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Badge 
                        variant="secondary" 
                        className={`bg-gradient-to-r ${currentMode.color} text-white`}
                      >
                        {effect}
                      </Badge>
                    </motion.div>
                  ))}
                </div>

                {/* Contrôle d'Intensité */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium">
                    Intensité du Glow: {glowIntensity}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={glowIntensity}
                    onChange={(e) => setGlowIntensity(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Bouton d'Activation */}
                <Button
                  onClick={activateGlow}
                  size="lg"
                  disabled={isGlowing}
                  className={`bg-gradient-to-r ${currentMode.color} hover:opacity-90 text-white font-bold px-8 py-3 text-lg shadow-lg transition-all duration-300 ${
                    isGlowing ? 'animate-pulse' : 'hover:scale-105'
                  }`}
                >
                  {isGlowing ? (
                    <>
                      <Sparkles className="h-5 w-5 mr-2 animate-spin" />
                      Glow Activé...
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5 mr-2" />
                      Activer le Glow
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sélection de Modes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-semibold text-center">Modes de Glow</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {glowModes.map((mode, index) => {
              const ModeIcon = mode.icon;
              return (
                <motion.button
                  key={mode.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentGlow(index)}
                  className={`p-4 rounded-xl bg-gradient-to-br ${mode.color} bg-opacity-20 border-2 transition-all ${
                    currentGlow === index 
                      ? 'border-white shadow-lg' 
                      : 'border-transparent hover:border-white/30'
                  }`}
                >
                  <ModeIcon className="h-8 w-8 mx-auto mb-2 text-white" />
                  <p className="text-sm font-medium text-center">{mode.name}</p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Statistiques de Bien-être */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-4"
        >
          <Card className="bg-yellow-500/10 border-yellow-500/30">
            <CardContent className="p-4 text-center">
              <Sparkles className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-400">89</p>
              <p className="text-sm text-slate-400">Glows Totaux</p>
            </CardContent>
          </Card>
          <Card className="bg-pink-500/10 border-pink-500/30">
            <CardContent className="p-4 text-center">
              <Heart className="h-6 w-6 text-pink-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-pink-400">94%</p>
              <p className="text-sm text-slate-400">Bien-être</p>
            </CardContent>
          </Card>
          <Card className="bg-purple-500/10 border-purple-500/30">
            <CardContent className="p-4 text-center">
              <Star className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-400">7</p>
              <p className="text-sm text-slate-400">Jours Consécutifs</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default InstantGlowPage;
