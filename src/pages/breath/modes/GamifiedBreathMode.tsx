// @ts-nocheck
/**
 * GamifiedBreathMode - Mode gamifié (ex Bubble Beat)
 * Éclater des bulles au rythme de la respiration
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, Star, Zap, Trophy, Sparkles, Target } from 'lucide-react';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  popped: boolean;
}

const BUBBLE_COLORS = [
  'bg-sky-400/60', 'bg-violet-400/60', 'bg-emerald-400/60',
  'bg-amber-400/60', 'bg-rose-400/60', 'bg-indigo-400/60',
];

export default function GamifiedBreathMode() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [breathPhase, setBreathPhase] = useState<'inspire' | 'expire'>('inspire');
  const [phaseTimer, setPhaseTimer] = useState(0);
  const nextId = useRef(0);

  // Generate bubbles at rhythm
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      const newBubble: Bubble = {
        id: nextId.current++,
        x: 10 + Math.random() * 80,
        y: 90 + Math.random() * 10,
        size: 30 + Math.random() * 40,
        color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
        popped: false,
      };
      setBubbles(prev => [...prev.slice(-15), newBubble]);
    }, 800);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Breath phase cycle
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setPhaseTimer(prev => {
        if (prev >= 5) {
          setBreathPhase(p => p === 'inspire' ? 'expire' : 'inspire');
          return 0;
        }
        return prev + 0.1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Pop bubbles (only during expire phase for points)
  const popBubble = useCallback((id: number) => {
    setBubbles(prev => prev.map(b => b.id === id ? { ...b, popped: true } : b));
    
    const isSync = breathPhase === 'expire';
    const points = isSync ? 10 * (1 + Math.floor(combo / 5)) : 2;
    
    setScore(prev => prev + points);
    if (isSync) {
      setCombo(prev => {
        const newCombo = prev + 1;
        setMaxCombo(m => Math.max(m, newCombo));
        return newCombo;
      });
    } else {
      setCombo(0);
    }
  }, [breathPhase, combo]);

  // Remove old bubbles
  useEffect(() => {
    const cleanup = setInterval(() => {
      setBubbles(prev => prev.filter(b => !b.popped || Date.now() - b.id < 500));
    }, 1000);
    return () => clearInterval(cleanup);
  }, []);

  return (
    <div className="space-y-6">
      {/* Score bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1 text-lg">
            <Star className="h-4 w-4 text-amber-500" /> {score}
          </Badge>
          {combo > 2 && (
            <motion.div
              key={combo}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
            >
              <Badge className="bg-gradient-to-r from-violet-500 to-pink-500 gap-1">
                <Zap className="h-3 w-3" /> x{combo} combo
              </Badge>
            </motion.div>
          )}
        </div>
        <Button
          size="sm"
          variant={isPlaying ? 'outline' : 'default'}
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
          {isPlaying ? 'Pause' : 'Jouer'}
        </Button>
      </div>

      {/* Breath indicator */}
      <div className="text-center space-y-2">
        <motion.p
          key={breathPhase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-lg font-semibold ${breathPhase === 'inspire' ? 'text-sky-400' : 'text-emerald-400'}`}
        >
          {breathPhase === 'inspire' ? '🫁 Inspirez...' : '💨 Expirez & éclatez !'}
        </motion.p>
        <Progress value={(phaseTimer / 5) * 100} className="h-2 max-w-xs mx-auto" />
        <p className="text-xs text-muted-foreground">
          {breathPhase === 'expire' ? 'Éclatez les bulles pour marquer des points !' : 'Préparez-vous...'}
        </p>
      </div>

      {/* Bubble field */}
      <div className="relative min-h-[400px] rounded-2xl bg-gradient-to-b from-primary/5 to-primary/10 border border-border/50 overflow-hidden">
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center space-y-4">
              <Sparkles className="h-16 w-16 text-primary/50 mx-auto" />
              <h3 className="text-xl font-semibold">Bubble Beat</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Inspirez pour vous préparer, expirez pour éclater les bulles au rythme !
              </p>
              <Button onClick={() => setIsPlaying(true)}>
                <Play className="h-4 w-4 mr-2" /> Commencer
              </Button>
            </div>
          </div>
        )}

        <AnimatePresence>
          {bubbles.filter(b => !b.popped).map((bubble) => (
            <motion.button
              key={bubble.id}
              initial={{ opacity: 0, scale: 0, y: 0 }}
              animate={{ opacity: 0.8, scale: 1, y: -(bubble.y * 3) }}
              exit={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 3, y: { duration: 5 } }}
              className={`absolute rounded-full ${bubble.color} backdrop-blur-sm cursor-pointer hover:scale-110 active:scale-90 transition-transform border border-white/20`}
              style={{
                left: `${bubble.x}%`,
                bottom: '10%',
                width: bubble.size,
                height: bubble.size,
              }}
              onClick={() => popBubble(bubble.id)}
              aria-label="Éclater la bulle"
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Game stats */}
      {score > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4 text-center">
              <Star className="h-5 w-5 mx-auto mb-1 text-amber-500" />
              <p className="text-xl font-bold">{score}</p>
              <p className="text-xs text-muted-foreground">Score</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <Zap className="h-5 w-5 mx-auto mb-1 text-violet-500" />
              <p className="text-xl font-bold">{maxCombo}</p>
              <p className="text-xs text-muted-foreground">Meilleur combo</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <Target className="h-5 w-5 mx-auto mb-1 text-emerald-500" />
              <p className="text-xl font-bold">{bubbles.filter(b => b.popped).length}</p>
              <p className="text-xs text-muted-foreground">Bulles éclatées</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
