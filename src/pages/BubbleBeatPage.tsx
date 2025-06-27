
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Music, Play, Pause, Volume2, Heart, Zap, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const BubbleBeatPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState('calm');
  const [volume, setVolume] = useState([70]);
  const [heartRate, setHeartRate] = useState(72);
  const [bubbles, setBubbles] = useState<Array<{id: number, x: number, y: number, size: number, color: string}>>([]);

  const beatTypes = {
    calm: { 
      name: 'Calme Océanique', 
      bpm: 60, 
      color: 'from-blue-400 to-cyan-400',
      description: 'Battements apaisants comme les vagues'
    },
    energy: { 
      name: 'Energy Boost', 
      bpm: 120, 
      color: 'from-orange-400 to-red-400',
      description: 'Rythme énergisant et motivant'
    },
    focus: { 
      name: 'Focus Flow', 
      bpm: 90, 
      color: 'from-green-400 to-teal-400',
      description: 'Cadence parfaite pour la concentration'
    },
    meditation: { 
      name: 'Méditation Profonde', 
      bpm: 45, 
      color: 'from-purple-400 to-indigo-400',
      description: 'Battements ultra-lents pour la méditation'
    }
  };

  // Génération de bulles animées
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        const newBubble = {
          id: Date.now() + Math.random(),
          x: Math.random() * 100,
          y: 100,
          size: Math.random() * 40 + 20,
          color: ['bg-blue-400', 'bg-purple-400', 'bg-pink-400', 'bg-green-400'][Math.floor(Math.random() * 4)]
        };
        
        setBubbles(prev => [...prev.slice(-15), newBubble]);
      }, beatTypes[currentBeat as keyof typeof beatTypes].bpm > 80 ? 300 : 800);

      return () => clearInterval(interval);
    }
  }, [isPlaying, currentBeat]);

  // Simulation rythme cardiaque synchronisé
  useEffect(() => {
    if (isPlaying) {
      const targetBpm = beatTypes[currentBeat as keyof typeof beatTypes].bpm;
      const interval = setInterval(() => {
        setHeartRate(prev => {
          const diff = targetBpm - prev;
          return prev + (diff * 0.1);
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, currentBeat]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      toast.success(`${beatTypes[currentBeat as keyof typeof beatTypes].name} démarré !`);
    } else {
      toast.info('Pause - Prenez une respiration profonde');
    }
  };

  const changeBeat = (beatType: string) => {
    setCurrentBeat(beatType);
    toast.success(`Rythme changé : ${beatTypes[beatType as keyof typeof beatTypes].name}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden" data-testid="page-root">
      {/* Bulles animées en arrière-plan */}
      <div className="absolute inset-0 pointer-events-none">
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            className={`absolute rounded-full ${bubble.color} opacity-30`}
            style={{
              left: `${bubble.x}%`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
            }}
            initial={{ y: bubble.y + '%', opacity: 0.6 }}
            animate={{ 
              y: '-20%', 
              opacity: 0,
              scale: [1, 1.2, 0.8]
            }}
            transition={{ 
              duration: 4,
              ease: "easeOut"
            }}
            onAnimationComplete={() => {
              setBubbles(prev => prev.filter(b => b.id !== bubble.id));
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Bubble Beat
            </h1>
            <Sparkles className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Synchronisez votre rythme cardiaque avec des battements visuels apaisants
          </p>
          <Badge variant="secondary" className="mt-4 bg-purple-500/20 text-purple-300">
            Thérapie Rythmique Visuelle
          </Badge>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contrôles principaux */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white/10 backdrop-blur-md border-purple-500/30 mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-400" />
                  Contrôle Rythmique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-8">
                  <motion.div
                    className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-r ${beatTypes[currentBeat as keyof typeof beatTypes].color} flex items-center justify-center mb-4`}
                    animate={isPlaying ? {
                      scale: [1, 1.1, 1],
                      boxShadow: ['0 0 0 0 rgba(255,255,255,0.4)', '0 0 0 20px rgba(255,255,255,0)', '0 0 0 0 rgba(255,255,255,0)']
                    } : {}}
                    transition={{
                      duration: 60 / beatTypes[currentBeat as keyof typeof beatTypes].bpm,
                      repeat: isPlaying ? Infinity : 0,
                      ease: "easeInOut"
                    }}
                  >
                    {isPlaying ? (
                      <Pause className="w-12 h-12 text-white" />
                    ) : (
                      <Play className="w-12 h-12 text-white" />
                    )}
                  </motion.div>
                  
                  <Button
                    onClick={togglePlay}
                    size="lg"
                    className={`bg-gradient-to-r ${beatTypes[currentBeat as keyof typeof beatTypes].color} hover:opacity-90 text-white px-8 py-3`}
                  >
                    {isPlaying ? 'Pause' : 'Démarrer'} le Rythme
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-white">
                      <label className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4" />
                        Volume
                      </label>
                      <span>{volume[0]}%</span>
                    </div>
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Heart className="w-5 h-5 text-red-400" />
                      <span className="text-white font-semibold">Rythme Cardiaque</span>
                    </div>
                    <motion.div
                      className="text-3xl font-bold text-red-400"
                      animate={isPlaying ? { scale: [1, 1.05, 1] } : {}}
                      transition={{
                        duration: 60 / Math.round(heartRate),
                        repeat: isPlaying ? Infinity : 0
                      }}
                    >
                      {Math.round(heartRate)} BPM
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rythmes disponibles */}
            <Card className="bg-white/10 backdrop-blur-md border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Rythmes Thérapeutiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(beatTypes).map(([key, beat]) => (
                    <motion.div
                      key={key}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={() => changeBeat(key)}
                        variant={currentBeat === key ? 'default' : 'outline'}
                        className={`w-full h-auto p-4 ${
                          currentBeat === key
                            ? `bg-gradient-to-r ${beat.color} text-white hover:opacity-90`
                            : 'border-white/30 text-white hover:bg-white/10'
                        }`}
                      >
                        <div className="text-left w-full">
                          <div className="font-semibold mb-1">{beat.name}</div>
                          <div className="text-sm opacity-80 mb-2">{beat.description}</div>
                          <Badge variant={currentBeat === key ? 'secondary' : 'outline'} className="text-xs">
                            {beat.bpm} BPM
                          </Badge>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Visualisation des bulles */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-purple-500/30 h-fit">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  Visualisation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 relative bg-gradient-to-b from-blue-900/50 to-purple-900/50 rounded-lg overflow-hidden mb-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {isPlaying ? (
                      <motion.div
                        className="text-center text-white"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Music className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-sm">Bulles thérapeutiques actives</p>
                      </motion.div>
                    ) : (
                      <div className="text-center text-white/60">
                        <Sparkles className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-sm">Démarrez pour voir les bulles</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 text-white/80 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span>Bulles de sérénité</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                    <span>Bulles de méditation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
                    <span>Bulles d'amour-propre</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span>Bulles d'énergie</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 grid md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          <div className="text-center p-4 bg-white/5 rounded-lg backdrop-blur-sm">
            <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <h4 className="font-semibold text-white text-sm">Synchronisation</h4>
            <p className="text-xs text-gray-400 mt-1">Rythme cardiaque</p>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg backdrop-blur-sm">
            <Sparkles className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <h4 className="font-semibold text-white text-sm">Visualisation</h4>
            <p className="text-xs text-gray-400 mt-1">Bulles thérapeutiques</p>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg backdrop-blur-sm">
            <Music className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <h4 className="font-semibold text-white text-sm">Rythmes</h4>
            <p className="text-xs text-gray-400 mt-1">Multiples BPM</p>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg backdrop-blur-sm">
            <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <h4 className="font-semibold text-white text-sm">Thérapie</h4>
            <p className="text-xs text-gray-400 mt-1">Bien-être immédiat</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BubbleBeatPage;
