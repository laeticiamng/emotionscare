
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, SkipForward, SkipBack, Volume2, Shuffle, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Bubble {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  emotion: string;
  track?: string;
  intensity: number;
}

const BubbleBeatPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState('joie');
  const [volume, setVolume] = useState([75]);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [activeBubble, setActiveBubble] = useState<string | null>(null);

  const emotions = [
    { id: 'joie', name: 'Joie', color: 'bg-yellow-400', tracks: ['Happy Vibes', 'Sunshine Dance', 'Joy Pop'] },
    { id: 'calme', name: 'Calme', color: 'bg-blue-400', tracks: ['Ocean Waves', 'Peaceful Mind', 'Zen Flow'] },
    { id: 'energie', name: 'Énergie', color: 'bg-red-400', tracks: ['Power Boost', 'Electric Rush', 'High Energy'] },
    { id: 'amour', name: 'Amour', color: 'bg-pink-400', tracks: ['Love Song', 'Heart Beat', 'Romance'] },
    { id: 'focus', name: 'Focus', color: 'bg-purple-400', tracks: ['Deep Work', 'Concentration', 'Mind Flow'] }
  ];

  // Génération des bulles émotionnelles
  useEffect(() => {
    const generateBubbles = () => {
      const newBubbles: Bubble[] = [];
      emotions.forEach((emotion, index) => {
        for (let i = 0; i < 3; i++) {
          newBubbles.push({
            id: `${emotion.id}-${i}`,
            x: Math.random() * 80 + 10,
            y: Math.random() * 70 + 15,
            size: Math.random() * 40 + 30,
            color: emotion.color,
            emotion: emotion.name,
            track: emotion.tracks[i],
            intensity: Math.random() * 100
          });
        }
      });
      setBubbles(newBubbles);
    };

    generateBubbles();
  }, []);

  // Animation des bulles
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setBubbles(prev => prev.map(bubble => ({
        ...bubble,
        y: bubble.y <= 5 ? 95 : bubble.y - 0.5,
        intensity: Math.random() * 100
      })));
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleBubbleClick = (bubble: Bubble) => {
    setActiveBubble(bubble.id);
    setCurrentEmotion(bubble.emotion.toLowerCase());
    setIsPlaying(true);
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            🫧 Bubble Beat
          </h1>
          <p className="text-xl text-purple-200 mb-6">
            Plonge dans un océan musical interactif
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Zone des bulles interactive */}
          <div className="lg:col-span-2">
            <Card className="bg-black/30 border-purple-500/30 h-96">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  Océan Musical Interactif
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Clique sur les bulles pour découvrir des sons émotionnels
                </CardDescription>
              </CardHeader>
              <CardContent className="relative h-80 overflow-hidden">
                {/* Container des bulles */}
                <div className="absolute inset-0" data-testid="bubble-container">
                  <AnimatePresence>
                    {bubbles.map((bubble) => (
                      <motion.div
                        key={bubble.id}
                        className={`absolute rounded-full cursor-pointer ${bubble.color} opacity-70 hover:opacity-90 transition-all duration-300`}
                        style={{
                          left: `${bubble.x}%`,
                          top: `${bubble.y}%`,
                          width: `${bubble.size}px`,
                          height: `${bubble.size}px`,
                          transform: 'translate(-50%, -50%)',
                          boxShadow: activeBubble === bubble.id ? '0 0 20px rgba(255,255,255,0.8)' : 'none'
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleBubbleClick(bubble)}
                        data-testid={`bubble-${bubble.id}`}
                        animate={{
                          scale: isPlaying ? [1, 1.1, 1] : 1,
                          opacity: [0.6, 0.8, 0.6]
                        }}
                        transition={{
                          duration: 2,
                          repeat: isPlaying ? Infinity : 0,
                          ease: "easeInOut"
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white font-bold text-xs">
                            {bubble.emotion.slice(0, 3)}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Instructions */}
                {!activeBubble && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center text-white/50">
                      <div className="text-4xl mb-2">🫧</div>
                      <p>Clique sur une bulle pour commencer</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Panneau de contrôle */}
          <div className="space-y-6">
            {/* Lecteur musical */}
            <Card className="bg-black/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-400">🎵 Lecteur</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeBubble ? (
                  <>
                    <div className="text-center">
                      <h3 className="text-white font-bold">
                        {bubbles.find(b => b.id === activeBubble)?.track || 'Titre inconnu'}
                      </h3>
                      <p className="text-purple-200 text-sm">
                        Émotion: {bubbles.find(b => b.id === activeBubble)?.emotion}
                      </p>
                    </div>

                    {/* Contrôles */}
                    <div className="flex items-center justify-center gap-4">
                      <Button variant="outline" size="sm">
                        <SkipBack className="w-4 h-4" />
                      </Button>
                      <Button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="bg-purple-500 hover:bg-purple-600"
                        data-testid="play-pause-button"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </Button>
                      <Button variant="outline" size="sm">
                        <SkipForward className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Volume */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-white" />
                        <span className="text-sm text-white">{volume[0]}%</span>
                      </div>
                      <Slider
                        value={volume}
                        onValueChange={setVolume}
                        max={100}
                        step={1}
                        className="w-full"
                        data-testid="volume-slider"
                      />
                    </div>

                    {/* Barre de progression simulée */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-purple-200">
                        <span>1:23</span>
                        <span>3:45</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div 
                          className="bg-purple-500 h-2 rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: isPlaying ? "40%" : "0%" }}
                          transition={{ duration: 2 }}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune bulle sélectionnée</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Émotions disponibles */}
            <Card className="bg-black/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-400">🎭 Émotions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {emotions.map((emotion) => (
                    <Button
                      key={emotion.id}
                      variant={currentEmotion === emotion.id ? "default" : "outline"}
                      className={`h-auto p-3 ${emotion.color} ${currentEmotion === emotion.id ? 'ring-2 ring-white' : ''}`}
                      onClick={() => setCurrentEmotion(emotion.id)}
                      data-testid={`emotion-${emotion.id}`}
                    >
                      <div className="text-center">
                        <div className="font-bold text-white">{emotion.name}</div>
                        <div className="text-xs text-white/80">{emotion.tracks.length} pistes</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card className="bg-black/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-400">⚡ Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Shuffle className="w-4 h-4 mr-2" />
                  Mode Aléatoire
                </Button>
                <Button className="w-full" variant="outline">
                  💾 Sauvegarder Mix
                </Button>
                <Button className="w-full" variant="outline">
                  🔄 Régénérer Bulles
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Statistiques en temps réel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className="bg-black/30 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-purple-400">📊 Statistiques Live</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">{bubbles.length}</div>
                  <div className="text-sm text-purple-200">Bulles actives</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{emotions.length}</div>
                  <div className="text-sm text-purple-200">Émotions disponibles</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{activeBubble ? '1' : '0'}</div>
                  <div className="text-sm text-purple-200">Piste en cours</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{volume[0]}%</div>
                  <div className="text-sm text-purple-200">Volume</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default BubbleBeatPage;
