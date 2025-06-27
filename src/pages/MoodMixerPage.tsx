
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Music, Heart, Zap, Headphones, Play, Shuffle } from 'lucide-react';

const MoodMixerPage: React.FC = () => {
  const [energy, setEnergy] = useState([50]);
  const [emotion, setEmotion] = useState([50]);
  const [focus, setFocus] = useState([50]);
  const [currentMix, setCurrentMix] = useState('Équilibre Parfait');

  const moods = [
    { name: 'Énergie Pure', color: 'from-red-500 to-orange-500', icon: Zap },
    { name: 'Zen Profond', color: 'from-blue-500 to-purple-500', icon: Heart },
    { name: 'Focus Laser', color: 'from-green-500 to-teal-500', icon: Headphones },
    { name: 'Créativité Flow', color: 'from-purple-500 to-pink-500', icon: Music },
  ];

  const getMixName = () => {
    const e = energy[0];
    const em = emotion[0];
    const f = focus[0];

    if (e > 80 && em > 70) return 'Explosion de Joie';
    if (e < 30 && em > 70) return 'Calme Béatitude';
    if (f > 80 && e > 60) return 'Productivité Maximale';
    if (em < 30 && e < 30) return 'Reset Complet';
    return 'Équilibre Personnel';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <Music className="h-8 w-8 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Mood Mixer
            </h1>
          </div>
          <p className="text-lg text-slate-300">
            Créez votre ambiance sonore personnalisée
          </p>
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
            Adaptation Immédiate
          </Badge>
        </motion.div>

        {/* Contrôles de Mix */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <Card className="bg-black/30 border-purple-500/30 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                Mix Actuel: <span className="text-purple-400">{getMixName()}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Slider Énergie */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Zap className="h-4 w-4 text-red-400" />
                    Énergie
                  </label>
                  <span className="text-sm text-slate-400">{energy[0]}%</span>
                </div>
                <Slider
                  value={energy}
                  onValueChange={setEnergy}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="h-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 opacity-30"></div>
              </div>

              {/* Slider Émotion */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Heart className="h-4 w-4 text-pink-400" />
                    Émotion
                  </label>
                  <span className="text-sm text-slate-400">{emotion[0]}%</span>
                </div>
                <Slider
                  value={emotion}
                  onValueChange={setEmotion}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-30"></div>
              </div>

              {/* Slider Focus */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Headphones className="h-4 w-4 text-green-400" />
                    Focus
                  </label>
                  <span className="text-sm text-slate-400">{focus[0]}%</span>
                </div>
                <Slider
                  value={focus}
                  onValueChange={setFocus}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="h-2 rounded-full bg-gradient-to-r from-green-500 to-teal-500 opacity-30"></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Presets d'Ambiance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-semibold text-center">Ambiances Prédéfinies</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {moods.map((mood, index) => {
              const IconComponent = mood.icon;
              return (
                <motion.button
                  key={mood.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-4 rounded-xl bg-gradient-to-br ${mood.color} bg-opacity-20 border border-white/20 hover:border-white/40 transition-all`}
                >
                  <IconComponent className="h-8 w-8 mx-auto mb-2 text-white" />
                  <p className="text-sm font-medium text-center">{mood.name}</p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Contrôles de Lecture */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center space-y-6"
        >
          <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 w-16 h-16 rounded-full"
                >
                  <Play className="h-6 w-6" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-purple-500/50 hover:bg-purple-500/20 w-16 h-16 rounded-full"
                >
                  <Shuffle className="h-6 w-6" />
                </Button>
              </div>
              <p className="text-slate-300 mt-4">
                Votre mix personnel est prêt à être diffusé
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Historique des Mix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-3 gap-4"
        >
          <Card className="bg-blue-500/10 border-blue-500/30">
            <CardContent className="p-4 text-center">
              <Music className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-400">24</p>
              <p className="text-sm text-slate-400">Mix Créés</p>
            </CardContent>
          </Card>
          <Card className="bg-purple-500/10 border-purple-500/30">
            <CardContent className="p-4 text-center">
              <Heart className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-400">89%</p>
              <p className="text-sm text-slate-400">Satisfaction</p>
            </CardContent>
          </Card>
          <Card className="bg-green-500/10 border-green-500/30">
            <CardContent className="p-4 text-center">
              <Headphones className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-400">2h47</p>
              <p className="text-sm text-slate-400">Temps Total</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default MoodMixerPage;
