// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Play, Pause, RotateCcw, Trophy, Zap, Target, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import confetti from 'canvas-confetti';

interface BubbleNote {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  sound: string;
  velocity: number;
}

interface BeatPattern {
  id: string;
  name: string;
  emoji: string;
  bpm: number;
  difficulty: number;
  description: string;
  bubbleCount: number;
  sounds: string[];
}

const beatPatterns: BeatPattern[] = [
  { id: '1', name: 'Pluie Douce', emoji: '🌧️', bpm: 60, difficulty: 1, description: 'Rythme apaisant comme la pluie', bubbleCount: 8, sounds: ['kick', 'snare'] },
  { id: '2', name: 'Cœur Zen', emoji: '💓', bpm: 72, difficulty: 1, description: 'Battement du cœur au repos', bubbleCount: 10, sounds: ['kick', 'snare', 'hihat'] },
  { id: '3', name: 'Vagues Marines', emoji: '🌊', bpm: 90, difficulty: 2, description: 'Flux et reflux des vagues', bubbleCount: 12, sounds: ['kick', 'snare', 'hihat', 'clap'] },
  { id: '4', name: 'Danse Tribale', emoji: '🔥', bpm: 110, difficulty: 2, description: 'Rythmes ancestraux', bubbleCount: 15, sounds: ['kick', 'snare', 'hihat', 'clap', 'tom'] },
  { id: '5', name: 'Électro Flow', emoji: '⚡', bpm: 128, difficulty: 3, description: 'Énergie électrique pure', bubbleCount: 18, sounds: ['kick', 'snare', 'hihat', 'clap', 'tom', 'bass'] },
  { id: '6', name: 'Chaos Créatif', emoji: '🎨', bpm: 140, difficulty: 3, description: 'Liberté totale', bubbleCount: 20, sounds: ['kick', 'snare', 'hihat', 'clap', 'tom', 'bass', 'perc'] },
  { id: '7', name: 'Cosmic Beat', emoji: '🌌', bpm: 160, difficulty: 4, description: 'Au-delà des limites', bubbleCount: 25, sounds: ['kick', 'snare', 'hihat', 'clap', 'tom', 'bass', 'perc', 'synth'] },
];

export default function BubbleBeatJourneyPage() {
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bubbles, setBubbles] = useState<BubbleNote[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [totalBeats, setTotalBeats] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentPattern = beatPatterns[currentStage];
  const progress = (currentStage / (beatPatterns.length - 1)) * 100;

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const createBubble = () => {
    const colors = ['#FF6B9D', '#C44569', '#FFC048', '#4ECDC4', '#A78BFA', '#818CF8'];
    const newBubble: BubbleNote = {
      id: Math.random().toString(36),
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      size: Math.random() * 40 + 40,
      color: colors[Math.floor(Math.random() * colors.length)],
      sound: currentPattern.sounds[Math.floor(Math.random() * currentPattern.sounds.length)],
      velocity: Math.random() * 2 + 1,
    };
    setBubbles(prev => [...prev, newBubble]);
    setTotalBeats(prev => prev + 1);
    setCombo(prev => prev + 1);
    setScore(prev => prev + (10 * (1 + combo * 0.1)));

    // Remove bubble after animation
    setTimeout(() => {
      setBubbles(prev => prev.filter(b => b.id !== newBubble.id));
    }, 3000);
  };

  const handleBeat = () => {
    if (!isPlaying) return;
    createBubble();
    
    // Vibration feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const reset = () => {
    setBubbles([]);
    setCombo(0);
  };

  const nextStage = () => {
    if (currentStage < beatPatterns.length - 1) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setCurrentStage(prev => prev + 1);
      reset();
      setIsPlaying(false);
    } else {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 }
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-3 flex items-center justify-center gap-3">
            <Music className="w-12 h-12" />
            Bubble Beat Laboratory
          </h1>
          <p className="text-white/80 text-lg">Crée tes rythmes en éclatant des bulles sonores</p>
        </motion.div>

        {/* Progress */}
        <Card className="p-6 mb-6 bg-white/10 backdrop-blur-lg border-white/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-medium">Niveau {currentStage + 1}/7</span>
            <span className="text-white/70">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Canvas */}
          <Card className="lg:col-span-2 p-6 bg-white/5 backdrop-blur-lg border-white/20">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{currentPattern.emoji}</span>
                <div>
                  <h2 className="text-2xl font-bold text-white">{currentPattern.name}</h2>
                  <p className="text-white/70">{currentPattern.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{currentPattern.bpm}</div>
                <div className="text-white/70 text-sm">BPM</div>
              </div>
            </div>

            {/* Interactive Canvas */}
            <div
              ref={canvasRef}
              className="relative h-96 bg-black/30 rounded-xl overflow-hidden cursor-pointer"
              onClick={handleBeat}
            >
              <AnimatePresence>
                {bubbles.map((bubble) => (
                  <motion.div
                    key={bubble.id}
                    initial={{ scale: 0, opacity: 1, x: `${bubble.x}%`, y: `${bubble.y}%` }}
                    animate={{ 
                      scale: [1, 1.2, 0],
                      opacity: [1, 0.8, 0],
                      y: [`${bubble.y}%`, `${bubble.y - 30}%`]
                    }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 3, ease: "easeOut" }}
                    className="absolute rounded-full blur-sm"
                    style={{
                      width: bubble.size,
                      height: bubble.size,
                      backgroundColor: bubble.color,
                      boxShadow: `0 0 30px ${bubble.color}`,
                    }}
                  />
                ))}
              </AnimatePresence>

              {!isPlaying && bubbles.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white/50">
                    <Music className="w-16 h-16 mx-auto mb-3 opacity-30" />
                    <p className="text-lg">Clique pour créer des bulles sonores</p>
                    <p className="text-sm mt-2">Démarre la session pour commencer</p>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex gap-3 mt-4">
              <Button
                onClick={togglePlay}
                className="flex-1 h-14 text-lg"
                variant={isPlaying ? "destructive" : "default"}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Démarrer
                  </>
                )}
              </Button>
              <Button onClick={reset} variant="outline" className="h-14">
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>
          </Card>

          {/* Stats Sidebar */}
          <div className="space-y-4">
            {/* Score */}
            <Card className="p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-lg border-yellow-500/30">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-8 h-8 text-yellow-400" />
                <span className="text-white/80">Score</span>
              </div>
              <div className="text-4xl font-bold text-white">{Math.round(score)}</div>
            </Card>

            {/* Combo */}
            <Card className="p-6 bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-lg border-pink-500/30">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-8 h-8 text-pink-400" />
                <span className="text-white/80">Combo</span>
              </div>
              <div className="text-4xl font-bold text-white">x{combo}</div>
            </Card>

            {/* Stats */}
            <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/80">
                    <Target className="w-5 h-5" />
                    <span>Beats</span>
                  </div>
                  <span className="text-white font-bold">{totalBeats}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/80">
                    <Music className="w-5 h-5" />
                    <span>Temps</span>
                  </div>
                  <span className="text-white font-bold">{formatTime(sessionTime)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/80">
                    <Award className="w-5 h-5" />
                    <span>Difficulté</span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-4 rounded-full ${
                          i < currentPattern.difficulty ? 'bg-pink-400' : 'bg-white/20'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Next Stage */}
            {score > 500 && currentStage < beatPatterns.length - 1 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <Button onClick={nextStage} className="w-full h-14 text-lg bg-gradient-to-r from-pink-500 to-purple-500">
                  <Award className="w-5 h-5 mr-2" />
                  Niveau Suivant
                </Button>
              </motion.div>
            )}

            {currentStage === beatPatterns.length - 1 && score > 500 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <Card className="p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-lg border-yellow-500/30">
                  <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-white mb-2">Parcours Terminé!</h3>
                  <p className="text-white/70">Tu es un maître du rythme!</p>
                </Card>
              </motion.div>
            )}
          </div>
        </div>

        {/* Stage Preview */}
        <Card className="mt-6 p-6 bg-white/5 backdrop-blur-lg border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Parcours Bubble Beat</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {beatPatterns.map((pattern, index) => (
              <div
                key={pattern.id}
                className={`p-3 rounded-lg text-center transition-all ${
                  index === currentStage
                    ? 'bg-pink-500/30 border-2 border-pink-400 scale-105'
                    : index < currentStage
                    ? 'bg-green-500/20 border-2 border-green-400'
                    : 'bg-white/10 border-2 border-white/20'
                }`}
              >
                <div className="text-3xl mb-2">{pattern.emoji}</div>
                <div className="text-white text-sm font-medium">{pattern.name}</div>
                {index < currentStage && (
                  <div className="text-green-400 text-xs mt-1">✓ Complété</div>
                )}
                {index === currentStage && (
                  <div className="text-pink-400 text-xs mt-1">● En cours</div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
