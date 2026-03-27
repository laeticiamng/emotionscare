// @ts-nocheck
/**
 * Composant : Révélation de la carte tirée
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WeeklyCard } from '@/types/card';
import { Sparkles, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CardRevealProps {
  card: WeeklyCard | null;
  onClose: () => void;
}

export const CardReveal: React.FC<CardRevealProps> = ({ card, onClose }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (card) {
      // Séquence d'animation
      setTimeout(() => setIsFlipped(true), 500);
      setTimeout(() => setShowContent(true), 1700);
      
      // Haptic feedback (si disponible)
      if ('vibrate' in navigator) {
        setTimeout(() => navigator.vibrate(50), 1200);
      }
    }
  }, [card]);

  if (!card) return null;

  const rarityColors = {
    common: 'from-primary/20 to-accent/20',
    rare: 'from-accent/30 to-destructive/30',
    epic: 'from-destructive/40 to-warning/40',
    legendary: 'from-warning/50 to-warning/50'
  };

  const rarityGlow = {
    common: 'shadow-lg shadow-primary/20',
    rare: 'shadow-xl shadow-accent/30',
    epic: 'shadow-2xl shadow-destructive/40',
    legendary: 'shadow-2xl shadow-warning/60 animate-pulse'
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md"
      >
        {/* Halo cosmique */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1.2 }}
          transition={{ duration: 2.5, ease: 'easeOut' }}
        >
          <div 
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br ${rarityColors[card.rarity]} blur-3xl`}
          />
        </motion.div>

        {/* Particules */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary"
            style={{
              left: '50%',
              top: '50%',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: Math.cos((i / 20) * Math.PI * 2) * 200,
              y: Math.sin((i / 20) * Math.PI * 2) * 200,
            }}
            transition={{
              duration: 2,
              delay: 1 + i * 0.05,
              ease: 'easeOut'
            }}
          />
        ))}

        {/* Carte */}
        <motion.div
          className="relative perspective-1000"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.div
            className={`w-80 h-[500px] relative ${rarityGlow[card.rarity]}`}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Face arrière */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/30 border-2 border-primary/50 backdrop-blur-md flex items-center justify-center"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <Sparkles className="w-24 h-24 text-primary/60" />
            </div>

            {/* Face avant */}
            <div 
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-card to-card/80 border-2 border-primary/50 backdrop-blur-md p-8 flex flex-col items-center justify-between"
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <AnimatePresence>
                {showContent && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-6 text-center"
                  >
                    {/* Rareté */}
                    <div className="flex items-center gap-1">
                      {[...Array(card.rarity === 'legendary' ? 4 : card.rarity === 'epic' ? 3 : card.rarity === 'rare' ? 2 : 1)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 * i }}
                        >
                          <Star className="w-5 h-5 fill-primary text-primary" />
                        </motion.div>
                      ))}
                    </div>

                    {/* Icône principale */}
                    <motion.div
                      className="text-7xl"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                    >
                      {card.icon}
                    </motion.div>

                    {/* Badge */}
                    <h2 className="text-3xl font-bold text-foreground">
                      {card.badge}
                    </h2>

                    {/* Mantra */}
                    <p className="text-lg text-muted-foreground max-w-xs">
                      {card.mantra}
                    </p>

                    {/* Unlocks */}
                    {card.unlocks && card.unlocks.length > 0 && (
                      <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <Zap className="w-4 h-4" />
                          <span>{card.unlocks.length} bonus débloqués !</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bouton fermer */}
              <AnimatePresence>
                {showContent && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      onClick={onClose}
                      variant="secondary"
                      className="mt-4"
                    >
                      Commencer ma semaine
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
