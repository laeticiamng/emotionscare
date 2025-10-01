// @ts-nocheck
/**
 * Composant : Deck de cartes flottantes (pré-tirage)
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CardDeckProps {
  onDraw: () => void;
  isDrawing: boolean;
}

export const CardDeck: React.FC<CardDeckProps> = ({ onDraw, isDrawing }) => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[60vh] gap-8">
      {/* Deck flottant */}
      <div className="relative w-64 h-96">
        {[0, 1, 2, 3, 4].map((index) => (
          <motion.div
            key={index}
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/30 backdrop-blur-sm"
            style={{
              transformOrigin: 'center bottom',
            }}
            initial={{ 
              rotateZ: (index - 2) * 3,
              y: index * -4,
              scale: 1 - index * 0.02
            }}
            animate={{
              rotateZ: [(index - 2) * 3, (index - 2) * 3 + 2, (index - 2) * 3],
              y: [index * -4, index * -4 - 8, index * -4],
            }}
            transition={{
              duration: 3 + index * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.1
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-16 h-16 text-primary/40" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center space-y-4"
      >
        <h2 className="text-2xl font-semibold text-foreground">
          Tire ta carte de la semaine
        </h2>
        <p className="text-muted-foreground max-w-md">
          Découvre ton mantra émotionnel qui guidera toutes tes expériences
        </p>
        
        <Button
          onClick={onDraw}
          disabled={isDrawing}
          size="lg"
          className="relative overflow-hidden group"
        >
          <motion.span
            className="absolute inset-0 bg-primary/20"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
          <span className="relative flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            {isDrawing ? 'Tirage en cours...' : 'Tirer ma carte ✨'}
          </span>
        </Button>
      </motion.div>

      {/* Particules cosmiques */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/60"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
};
