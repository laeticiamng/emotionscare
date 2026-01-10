// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Heart, Play, Pause, Square, Waves, Zap, Target, Trophy, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import PageRoot from '@/components/common/PageRoot';
import { logger } from '@/lib/logger';
import { useBubbleBeatPersistence } from '@/hooks/useBubbleBeatPersistence';

interface Bubble {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  beatSync: boolean;
  emotion: string;
}

const B2CBubbleBeatPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [heartRate, setHeartRate] = useState(72);
  const [targetHeartRate, setTargetHeartRate] = useState([75]);
  const [currentScore, setCurrentScore] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [gameMode, setGameMode] = useState<'relax' | 'energize' | 'focus'>('relax');
  const [difficulty, setDifficulty] = useState([3]);
  const [biometricData, setBiometricData] = useState({
    hrv: 45, // Heart Rate Variability
    stressLevel: 35,
    coherenceLevel: 78
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const sessionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const gameModes = {
    relax: {
      name: 'Détente Profonde',
      icon: Heart,
      color: 'from-blue-400 to-cyan-500',
      targetHR: [60, 70],
      bubbleSpeed: 0.5,
      description: 'Ralentissez votre rythme cardiaque'
    },
    energize: {
      name: 'Boost Énergétique',
      icon: Zap,
      color: 'from-orange-400 to-red-500',
      targetHR: [80, 100],
      bubbleSpeed: 1.5,
      description: 'Augmentez votre énergie vitale'
    },
    focus: {
      name: 'Concentration Laser',
      icon: Target,
      color: 'from-purple-400 to-pink-500',
      targetHR: [70, 80],
      bubbleSpeed: 1.0,
      description: 'Trouvez votre zone de flow'
    }
  };

  // Simulation de données biométriques en temps réel
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      // Simule la variation du rythme cardiaque basée sur le jeu
      const variance = (Math.random() - 0.5) * 4;
      const targetRange = gameModes[gameMode].targetHR;
      const target = (targetRange[0] + targetRange[1]) / 2;
      
      setHeartRate(prev => {
        const newHR = prev + variance;
        const clampedHR = Math.max(50, Math.min(120, newHR));
        
        // Score basé sur la proximité de la cible
        const accuracy = 1 - Math.abs(clampedHR - target) / 20;
        if (accuracy > 0.7) {
          setCurrentScore(s => s + Math.round(accuracy * 10));
        }
        
        return clampedHR;
      });

      // Mise à jour des métriques biométriques
      setBiometricData(prev => ({
        hrv: Math.max(20, Math.min(80, prev.hrv + (Math.random() - 0.5) * 3)),
        stressLevel: Math.max(0, Math.min(100, prev.stressLevel + (Math.random() - 0.5) * 2)),
        coherenceLevel: Math.max(0, Math.min(100, prev.coherenceLevel + (Math.random() - 0.5) * 4))
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, gameMode]);

  // Animation des bulles synchronisées avec le rythme cardiaque
  useEffect(() => {
    const generateBubble = () => {
      const emotions = ['joy', 'calm', 'energy', 'focus', 'love'];
      const colors = {
        joy: '#FFD700',
        calm: '#4FC3F7',
        energy: '#FF6B6B',
        focus: '#9C27B0',
        love: '#E91E63'
      };

      return {
        id: Math.random().toString(),
        x: Math.random() * 400,
        y: Math.random() * 300,
        size: 20 + Math.random() * 40,
        color: colors[emotions[Math.floor(Math.random() * emotions.length)] as keyof typeof colors],
        beatSync: Math.random() > 0.5,
        emotion: emotions[Math.floor(Math.random() * emotions.length)]
      };
    };

    if (isPlaying) {
      const interval = setInterval(() => {
        setBubbles(prev => {
          const newBubbles = [...prev];
          
          // Ajouter de nouvelles bulles
          if (newBubbles.length < difficulty[0] * 3) {
            newBubbles.push(generateBubble());
          }
          
          // Supprimer les bulles anciennes
          return newBubbles.slice(-15);
        });
      }, 2000 / difficulty[0]);

      return () => clearInterval(interval);
    }
  }, [isPlaying, difficulty]);

  // Synthèse sonore binaural
  const playBinauralBeat = (frequency: number) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
    }

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
    
    oscillator.start();
    oscillatorRef.current = oscillator;
  };

  // Hook de persistance
  const { saveSession } = useBubbleBeatPersistence();

  const startSession = async () => {
    setIsPlaying(true);
    setCurrentScore(0);
    setSessionTime(0);

    // Démarre le son binaural
    const baseFreq = gameMode === 'relax' ? 432 : gameMode === 'energize' ? 528 : 40;
    playBinauralBeat(baseFreq);

    // Timer de session
    sessionIntervalRef.current = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
  };

  const stopSession = async () => {
    setIsPlaying(false);

    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch (e) {
        logger.error('Error stopping oscillator', e as Error, 'AUDIO');
      }
      oscillatorRef.current = null;
    }

    if (sessionIntervalRef.current) {
      clearInterval(sessionIntervalRef.current);
    }

    // Sauvegarde via hook Supabase
    await saveSession({
      game_mode: gameMode,
      score: currentScore,
      duration_seconds: sessionTime,
      average_heart_rate: heartRate,
      target_heart_rate: targetHeartRate[0],
      difficulty: difficulty[0],
      biometrics: biometricData
    });

    toast({
      title: "🎉 Session terminée !",
      description: `Score: ${currentScore} points en ${Math.floor(sessionTime / 60)}m ${sessionTime % 60}s`
    });

    setBubbles([]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBubbleClick = (bubbleId: string) => {
    setBubbles(prev => prev.filter(b => b.id !== bubbleId));
    setCurrentScore(prev => prev + 50);
    
    // Feedback haptique
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  return (
    <PageRoot>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="container mx-auto px-4 py-8 space-y-6">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <motion.div
          animate={isPlaying ? { 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          } : { scale: 1, rotate: 0 }}
          transition={{ duration: heartRate ? 60/heartRate : 1, repeat: isPlaying ? Infinity : 0 }}
        >
          <Heart className="h-8 w-8 text-destructive" />
        </motion.div>
        <div>
          <h1 className="text-3xl font-bold">Bubble Beat Pro 💓</h1>
          <p className="text-muted-foreground">Synchronisez vos émotions avec votre rythme cardiaque</p>
        </div>
      </motion.div>

      {/* Métriques en temps réel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 60/heartRate, repeat: Infinity }}
              className="text-2xl font-bold text-destructive"
            >
              {Math.round(heartRate)}
            </motion.div>
            <div className="text-sm text-muted-foreground">BPM</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-info">{currentScore}</div>
            <div className="text-sm text-muted-foreground">Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent">{biometricData.coherenceLevel}%</div>
            <div className="text-sm text-muted-foreground">Cohérence</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">{formatTime(sessionTime)}</div>
            <div className="text-sm text-muted-foreground">Temps</div>
          </CardContent>
        </Card>
      </div>

      {/* Sélection du mode de jeu */}
      <Card>
        <CardHeader>
          <CardTitle>Mode d'Entraînement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(gameModes).map(([key, mode]) => {
              const Icon = mode.icon;
              return (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={gameMode === key ? "default" : "outline"}
                    className={`w-full h-auto p-6 flex flex-col gap-3 ${
                      gameMode === key ? `bg-gradient-to-br ${mode.color} text-primary-foreground` : ''
                    }`}
                    onClick={() => setGameMode(key as typeof gameMode)}
                    disabled={isPlaying}
                  >
                    <Icon className="h-8 w-8" />
                    <div>
                      <div className="font-medium">{mode.name}</div>
                      <div className="text-sm opacity-80">{mode.description}</div>
                      <Badge variant="outline" className="mt-2">
                        {mode.targetHR[0]}-{mode.targetHR[1]} BPM
                      </Badge>
                    </div>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Paramètres de difficulté */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Rythme Cardiaque Cible</label>
              <Badge variant="outline">{targetHeartRate[0]} BPM</Badge>
            </div>
            <Slider
              value={targetHeartRate}
              onValueChange={setTargetHeartRate}
              max={120}
              min={50}
              step={5}
              className="w-full"
              disabled={isPlaying}
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Difficulté</label>
              <Badge variant="outline">Niveau {difficulty[0]}</Badge>
            </div>
            <Slider
              value={difficulty}
              onValueChange={setDifficulty}
              max={5}
              min={1}
              step={1}
              className="w-full"
              disabled={isPlaying}
            />
          </div>
        </CardContent>
      </Card>

      {/* Zone de jeu */}
      <Card className="relative overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Zone de Jeu</span>
            <div className="flex gap-2">
              {!isPlaying ? (
                <Button onClick={startSession} className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Démarrer
                </Button>
              ) : (
                <Button onClick={stopSession} variant="destructive" className="flex items-center gap-2">
                  <Square className="h-4 w-4" />
                  Arrêter
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className={`relative h-96 rounded-lg overflow-hidden bg-gradient-to-br ${
              isPlaying ? gameModes[gameMode].color : 'from-gray-100 to-gray-200'
            }`}
          >
            {/* Bulles interactives */}
            <AnimatePresence>
              {bubbles.map(bubble => (
                <motion.div
                  key={bubble.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: bubble.beatSync ? [1, 1.2, 1] : 1,
                    opacity: 1,
                    x: bubble.x,
                    y: bubble.y
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ 
                    scale: {
                      duration: 60/heartRate,
                      repeat: bubble.beatSync ? Infinity : 0
                    }
                  }}
                  className="absolute cursor-pointer"
                  onClick={() => handleBubbleClick(bubble.id)}
                  style={{
                    width: bubble.size,
                    height: bubble.size,
                    backgroundColor: bubble.color,
                    borderRadius: '50%',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                  }}
                >
                  <div className="absolute inset-0 rounded-full bg-background/30" />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Indicateur de rythme cardiaque */}
            <div className="absolute bottom-4 left-4 right-4">
              <motion.div
                className="h-2 bg-background/30 rounded-full overflow-hidden"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 60/heartRate, repeat: Infinity }}
              >
                <motion.div
                  className="h-full bg-background"
                  animate={{ width: [`${heartRate}%`, `${heartRate + 10}%`, `${heartRate}%`] }}
                  transition={{ duration: 60/heartRate, repeat: Infinity }}
                />
              </motion.div>
            </div>

            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-primary-foreground">
                  <Music className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <div className="text-lg font-medium">Prêt pour votre session Bubble Beat ?</div>
                  <div className="text-sm opacity-80">Choisissez un mode et appuyez sur Démarrer</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Métriques biométriques détaillées */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Waves className="h-5 w-5 text-info" />
            Données Biométriques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm font-medium mb-2">Variabilité Cardiaque (HRV)</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    animate={{ width: `${biometricData.hrv}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="text-sm font-medium">{Math.round(biometricData.hrv)}%</span>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium mb-2">Niveau de Stress</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-success to-destructive"
                    animate={{ width: `${biometricData.stressLevel}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="text-sm font-medium">{Math.round(biometricData.stressLevel)}%</span>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium mb-2">Cohérence Émotionnelle</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-accent to-accent/50"
                    animate={{ width: `${biometricData.coherenceLevel}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="text-sm font-medium">{Math.round(biometricData.coherenceLevel)}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
        </div>
      </div>
    </PageRoot>
  );
};

export default B2CBubbleBeatPage;