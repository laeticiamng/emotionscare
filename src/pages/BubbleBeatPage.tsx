
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Music, Play, Pause, Volume2, Circle } from 'lucide-react';

const BubbleBeatPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bubbles, setBubbles] = useState<Array<{id: number, x: number, y: number, color: string, size: number}>>([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        const newBubble = {
          id: Date.now() + Math.random(),
          x: Math.random() * 80 + 10,
          y: Math.random() * 60 + 20,
          color: ['bg-blue-400', 'bg-purple-400', 'bg-pink-400', 'bg-green-400', 'bg-yellow-400'][Math.floor(Math.random() * 5)],
          size: Math.random() * 40 + 20
        };
        setBubbles(prev => [...prev.slice(-19), newBubble]);
      }, 800);

      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const popBubble = (id: number) => {
    setBubbles(prev => prev.filter(bubble => bubble.id !== id));
    setScore(prev => prev + 10);
  };

  const rhythmPatterns = [
    { name: 'Calme', bpm: 60, color: 'bg-blue-500' },
    { name: 'Détente', bpm: 80, color: 'bg-green-500' },
    { name: 'Énergie', bpm: 120, color: 'bg-orange-500' },
    { name: 'Dynamique', bpm: 140, color: 'bg-red-500' }
  ];

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 text-white overflow-hidden">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Music className="h-10 w-10 text-blue-400 mr-3" />
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
              Bubble Beat
            </h1>
            <Circle className="h-10 w-10 text-pink-400 ml-3" />
          </div>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto">
            Éclatez les bulles au rythme pour vous détendre et vous amuser
          </p>
        </motion.div>

        {/* Zone de jeu */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative mb-6"
        >
          <Card className="bg-black/40 border-blue-400/30 backdrop-blur-lg h-96 overflow-hidden">
            <CardContent className="p-0 h-full relative">
              {/* Bulles */}
              {bubbles.map((bubble) => (
                <motion.div
                  key={bubble.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.8 }}
                  exit={{ scale: 0, opacity: 0 }}
                  onClick={() => popBubble(bubble.id)}
                  className={`absolute cursor-pointer rounded-full ${bubble.color} animate-pulse`}
                  style={{
                    left: `${bubble.x}%`,
                    top: `${bubble.y}%`,
                    width: `${bubble.size}px`,
                    height: `${bubble.size}px`,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              ))}
              
              {/* Overlay d'information */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                <Badge className="bg-blue-600/80 text-white px-3 py-1">
                  Score: {score}
                </Badge>
                <Badge className="bg-purple-600/80 text-white px-3 py-1">
                  Niveau: {level}
                </Badge>
              </div>

              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-center">
                    <Play className="h-16 w-16 mx-auto mb-4 text-blue-400" />
                    <p className="text-xl">Cliquez sur Démarrer pour jouer</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Contrôles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-4 mb-6"
        >
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            {isPlaying ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
            {isPlaying ? 'Pause' : 'Démarrer'}
          </Button>
          <Button
            onClick={() => {
              setScore(0);
              setBubbles([]);
              setLevel(1);
            }}
            variant="outline"
            size="lg"
            className="border-blue-400 text-blue-400 hover:bg-blue-400/10"
          >
            Reset
          </Button>
        </motion.div>

        {/* Patterns rythmiques */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {rhythmPatterns.map((pattern, index) => (
            <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-center text-white flex items-center justify-center">
                  <Volume2 className="h-4 w-4 mr-1" />
                  {pattern.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className={`w-8 h-8 ${pattern.color} rounded-full mx-auto mb-2 animate-pulse`}></div>
                <p className="text-xs text-center text-gray-300">{pattern.bpm} BPM</p>
                <Button 
                  size="sm" 
                  className="w-full mt-2 bg-white/20 hover:bg-white/30 text-white text-xs"
                >
                  Sélectionner
                </Button>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default BubbleBeatPage;
