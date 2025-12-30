/**
 * Bubble Canvas - Zone de jeu interactive avec bulles animées
 */

import { memo, useCallback, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Bubble {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  emotion: string;
  points: number;
  speed: number;
}

interface BubbleCanvasProps {
  isPlaying: boolean;
  difficulty: number;
  mood: 'calm' | 'energetic' | 'focus';
  heartRate?: number;
  onBubblePop: (points: number) => void;
}

const EMOTIONS = [
  { name: 'joy', color: '#FFD700', points: 50 },
  { name: 'calm', color: '#4FC3F7', points: 30 },
  { name: 'energy', color: '#FF6B6B', points: 40 },
  { name: 'focus', color: '#9C27B0', points: 60 },
  { name: 'love', color: '#E91E63', points: 45 }
];

const MOOD_GRADIENTS = {
  calm: 'from-blue-400/30 via-cyan-500/20 to-teal-400/30',
  energetic: 'from-orange-400/30 via-red-500/20 to-pink-400/30',
  focus: 'from-purple-400/30 via-indigo-500/20 to-blue-400/30'
};

export const BubbleCanvas = memo(function BubbleCanvas({
  isPlaying,
  difficulty,
  mood,
  heartRate = 72,
  onBubblePop
}: BubbleCanvasProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const generateBubble = useCallback((): Bubble => {
    const emotion = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
    const containerWidth = containerRef.current?.clientWidth || 400;
    const containerHeight = containerRef.current?.clientHeight || 300;
    
    return {
      id: crypto.randomUUID(),
      x: Math.random() * (containerWidth - 60) + 30,
      y: containerHeight + 50,
      size: 30 + Math.random() * 40,
      color: emotion.color,
      emotion: emotion.name,
      points: emotion.points * difficulty,
      speed: 1 + Math.random() * difficulty
    };
  }, [difficulty]);

  // Génération des bulles
  useEffect(() => {
    if (!isPlaying) {
      setBubbles([]);
      return;
    }

    const spawnInterval = setInterval(() => {
      setBubbles(prev => {
        if (prev.length >= difficulty * 5) return prev;
        return [...prev, generateBubble()];
      });
    }, 2000 / difficulty);

    return () => clearInterval(spawnInterval);
  }, [isPlaying, difficulty, generateBubble]);

  // Animation des bulles qui montent
  useEffect(() => {
    if (!isPlaying) return;

    const moveInterval = setInterval(() => {
      setBubbles(prev => 
        prev
          .map(bubble => ({
            ...bubble,
            y: bubble.y - bubble.speed * 2,
            x: bubble.x + Math.sin(Date.now() / 500 + parseInt(bubble.id.slice(0, 8), 16)) * 0.5
          }))
          .filter(bubble => bubble.y > -bubble.size)
      );
    }, 50);

    return () => clearInterval(moveInterval);
  }, [isPlaying]);

  const handleBubbleClick = useCallback((bubble: Bubble) => {
    setBubbles(prev => prev.filter(b => b.id !== bubble.id));
    onBubblePop(bubble.points);
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
  }, [onBubblePop]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full h-80 md:h-96 rounded-2xl overflow-hidden',
        'bg-gradient-to-br',
        MOOD_GRADIENTS[mood],
        'border border-border/30'
      )}
    >
      {/* Effet de pulsation au rythme cardiaque */}
      <motion.div
        className="absolute inset-0 bg-white/5"
        animate={{ opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 60 / heartRate, repeat: Infinity }}
      />

      {/* Bulles */}
      <AnimatePresence>
        {bubbles.map(bubble => (
          <motion.button
            key={bubble.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 0.9,
              y: bubble.y
            }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={() => handleBubbleClick(bubble)}
            className="absolute cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full"
            style={{
              left: bubble.x,
              width: bubble.size,
              height: bubble.size,
              background: `radial-gradient(circle at 30% 30%, ${bubble.color}ee, ${bubble.color}88)`,
              boxShadow: `0 4px 20px ${bubble.color}40, inset 0 -3px 10px rgba(0,0,0,0.2)`,
            }}
            aria-label={`Éclater bulle ${bubble.emotion} pour ${bubble.points} points`}
          >
            <span className="absolute inset-0 flex items-center justify-center text-white/90 text-xs font-bold">
              +{bubble.points}
            </span>
            {/* Reflet */}
            <span 
              className="absolute top-[15%] left-[20%] w-[30%] h-[25%] rounded-full bg-white/40"
            />
          </motion.button>
        ))}
      </AnimatePresence>

      {/* Message d'attente */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-foreground/70">
            <span className="text-5xl mb-4 block">🫧</span>
            <p className="text-lg font-medium">Prêt à jouer ?</p>
            <p className="text-sm text-muted-foreground">Éclatez les bulles au rythme</p>
          </div>
        </div>
      )}

      {/* Indicateur de rythme */}
      {isPlaying && (
        <div className="absolute bottom-4 left-4 right-4">
          <motion.div
            className="h-1 bg-white/20 rounded-full overflow-hidden"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 60 / heartRate, repeat: Infinity }}
          >
            <motion.div
              className="h-full bg-white/60 rounded-full"
              animate={{ width: ['0%', '100%', '0%'] }}
              transition={{ duration: 60 / heartRate, repeat: Infinity }}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
});

export default BubbleCanvas;
