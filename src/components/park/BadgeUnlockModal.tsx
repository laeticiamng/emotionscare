// @ts-nocheck
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Trophy, Sparkles, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BadgeUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  zoneName: string;
  zoneEmoji: string;
  totalAttractions: number;
}

export const BadgeUnlockModal: React.FC<BadgeUnlockModalProps> = ({
  isOpen,
  onClose,
  zoneName,
  zoneEmoji,
  totalAttractions
}) => {
  useEffect(() => {
    if (isOpen) {
      // Trigger confetti animation
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      // Auto close after 5 seconds
      const autoCloseTimer = setTimeout(onClose, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(autoCloseTimer);
      };
    }
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-2 border-primary/50 bg-gradient-to-br from-background via-primary/5 to-secondary/5">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateY: -180 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateY: 180 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="text-center py-8"
            >
              {/* Trophy Icon with Animation */}
              <motion.div
                animate={{
                  rotate: [0, -10, 10, -10, 10, 0],
                  scale: [1, 1.1, 1, 1.1, 1]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                className="mb-6 flex justify-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full" />
                  <Trophy className="h-24 w-24 text-primary relative z-10" />
                </div>
              </motion.div>

              {/* Sparkles Decoration */}
              <div className="absolute top-8 left-8">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity
                  }}
                >
                  <Sparkles className="h-6 w-6 text-secondary" />
                </motion.div>
              </div>

              <div className="absolute top-8 right-8">
                <motion.div
                  animate={{
                    rotate: [360, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: 0.5
                  }}
                >
                  <Star className="h-6 w-6 text-primary" />
                </motion.div>
              </div>

              {/* Content */}
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent"
              >
                🎉 Badge Débloqué !
              </motion.h2>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <div className="text-6xl mb-4">{zoneEmoji}</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {zoneName}
                </h3>
                <p className="text-muted-foreground">
                  Tu as visité les {totalAttractions} attractions de cette zone !
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col items-center gap-3"
              >
                <Badge className="text-sm px-4 py-2 bg-gradient-to-r from-primary to-secondary">
                  🏆 Zone Complétée
                </Badge>
                
                <p className="text-xs text-muted-foreground">
                  Continue à explorer pour débloquer plus de badges !
                </p>
              </motion.div>

              {/* Animated particles background */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
                {[...Array(10)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-primary/30 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`
                    }}
                    animate={{
                      y: [-20, 20, -20],
                      opacity: [0.2, 0.5, 0.2],
                      scale: [1, 1.5, 1]
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
