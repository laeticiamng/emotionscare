/**
 * BlinkGuide - Guide de clignements pour Screen Silk
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BlinkGuideProps {
  isActive: boolean;
  onBlink?: () => void;
  className?: string;
}

export const BlinkGuide: React.FC<BlinkGuideProps> = ({
  isActive,
  onBlink,
  className
}) => {
  const [showGuide, setShowGuide] = useState(false);
  const [blinkCount, setBlinkCount] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setShowGuide(false);
      setBlinkCount(0);
      return;
    }

    // Afficher le guide de clignement toutes les 20 secondes
    const interval = setInterval(() => {
      setShowGuide(true);
      setBlinkCount(prev => prev + 1);
      onBlink?.();
      
      // Masquer après 5 secondes
      setTimeout(() => {
        setShowGuide(false);
      }, 5000);
    }, 20000);

    return () => clearInterval(interval);
  }, [isActive, onBlink]);

  return (
    <AnimatePresence>
      {showGuide && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={cn(
            "fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
            "z-60 bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center",
            "border border-white/20 shadow-2xl",
            className
          )}
          role="alert"
          aria-live="polite"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.8, 1]
            }}
            transition={{
              duration: 1,
              repeat: 3,
              ease: "easeInOut"
            }}
            className="space-y-4"
          >
            {/* Animation des yeux */}
            <div className="flex justify-center gap-4 mb-6">
              {[...Array(2)].map((_, i) => (
                <motion.div
                  key={i}
                  className="relative"
                  animate={{
                    scaleY: [1, 0.1, 1],
                  }}
                  transition={{
                    duration: 0.3,
                    repeat: 6,
                    delay: i * 0.1,
                    ease: "easeInOut"
                  }}
                >
                  <div className="w-12 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <motion.div
                      className="w-6 h-6 bg-white/40 rounded-full"
                      animate={{
                        scale: [1, 0.9, 1],
                      }}
                      transition={{
                        duration: 0.3,
                        repeat: 6,
                        delay: i * 0.1,
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.h3
              className="text-2xl font-light text-white mb-2"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Clignez des yeux
            </motion.h3>

            <p className="text-white/80 text-sm">
              Clignez lentement plusieurs fois pour réhumidifier vos yeux
            </p>

            <motion.div
              className="text-white/60 text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Exercice {blinkCount} • Gardez vos épaules détendues
            </motion.div>
          </motion.div>

          {/* Instructions étendues */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="mt-6 space-y-2 text-white/60 text-xs"
          >
            <p>• Clignez 10-15 fois lentement</p>
            <p>• Regardez au loin entre les clignements</p>
            <p>• Respirez profondément</p>
          </motion.div>

          {/* Indicateur de progrès */}
          <motion.div
            className="absolute bottom-2 left-1/2 transform -translate-x-1/2"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 5, ease: "linear" }}
          >
            <div className="h-0.5 bg-white/40 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white/80 rounded-full"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 5, ease: "linear" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BlinkGuide;