
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Play, Pause, RotateCcw, Star } from 'lucide-react';

const FlashGlowPage: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [intensity, setIntensity] = useState(50);
  const [glowColor, setGlowColor] = useState('#3b82f6');

  const colors = [
    { name: 'Bleu Énergie', value: '#3b82f6' },
    { name: 'Violet Zen', value: '#8b5cf6' },
    { name: 'Rose Doux', value: '#ec4899' },
    { name: 'Vert Calme', value: '#10b981' },
    { name: 'Orange Vivant', value: '#f59e0b' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <Zap className="h-8 w-8 text-yellow-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Flash Glow
            </h1>
          </div>
          <p className="text-lg text-slate-300">
            Thérapie par la lumière instantanée pour booster votre énergie
          </p>
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
            Adaptation Immédiate
          </Badge>
        </motion.div>

        {/* Contrôles principaux */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <Card className="bg-black/30 border-purple-500/30 backdrop-blur-md">
            <CardContent className="p-8">
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background: `radial-gradient(circle, ${glowColor}20 0%, transparent 70%)`,
                      animation: `pulse ${3 - intensity / 50}s ease-in-out infinite`,
                    }}
                  />
                )}
              </AnimatePresence>
              
              <div className="relative z-10 space-y-6">
                <Button
                  onClick={() => setIsActive(!isActive)}
                  size="lg"
                  className={`w-32 h-32 rounded-full text-lg font-bold transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 shadow-2xl' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                  }`}
                >
                  {isActive ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                </Button>

                <div className="space-y-4">
                  <label className="block text-sm font-medium">Intensité: {intensity}%</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={intensity}
                    onChange={(e) => setIntensity(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${glowColor} 0%, ${glowColor} ${intensity}%, #374151 ${intensity}%, #374151 100%)`
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sélection de couleurs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-semibold text-center">Couleurs Thérapeutiques</h3>
          <div className="grid grid-cols-5 gap-4">
            {colors.map((color) => (
              <motion.button
                key={color.value}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setGlowColor(color.value)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  glowColor === color.value 
                    ? 'border-white shadow-lg' 
                    : 'border-transparent hover:border-slate-400'
                }`}
                style={{ backgroundColor: color.value + '40' }}
              >
                <div
                  className="w-8 h-8 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: color.value }}
                />
                <p className="text-xs text-center">{color.name}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Statistiques */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-4"
        >
          <Card className="bg-blue-500/10 border-blue-500/30">
            <CardContent className="p-4 text-center">
              <Star className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-400">42</p>
              <p className="text-sm text-slate-400">Sessions</p>
            </CardContent>
          </Card>
          <Card className="bg-purple-500/10 border-purple-500/30">
            <CardContent className="p-4 text-center">
              <Zap className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-400">85%</p>
              <p className="text-sm text-slate-400">Énergie</p>
            </CardContent>
          </Card>
          <Card className="bg-green-500/10 border-green-500/30">
            <CardContent className="p-4 text-center">
              <RotateCcw className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-400">3min</p>
              <p className="text-sm text-slate-400">Moyenne</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default FlashGlowPage;
