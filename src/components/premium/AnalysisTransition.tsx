/**
 * AnalysisTransition - Animation de transition pendant l'analyse
 * Effet apaisant de respiration/onde
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AnalysisTransitionProps {
  isVisible: boolean;
  onComplete?: () => void;
  duration?: number;
}

// Voix produit officielle - calme, adulte, empathique
const SOOTHING_MESSAGES = [
  "Merci.",
  "Je prends un instant pour comprendre ce que tu ressens.",
];

const AnalysisTransition: React.FC<AnalysisTransitionProps> = ({
  isVisible,
  onComplete,
  duration = 3000,
}) => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % SOOTHING_MESSAGES.length);
    }, duration / SOOTHING_MESSAGES.length);

    const timeout = setTimeout(() => {
      onComplete?.();
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isVisible, duration, onComplete]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
    >
      {/* Background gradient animé */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Cercles concentriques de respiration */}
      <div className="relative flex items-center justify-center">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="absolute rounded-full border border-primary/20"
            style={{
              width: 120 + index * 80,
              height: 120 + index * 80,
            }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.4,
            }}
          />
        ))}

        {/* Cercle central pulsant */}
        <motion.div
          className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center"
          animate={{
            scale: [1, 1.08, 1],
            boxShadow: [
              '0 0 0 0 rgba(var(--primary), 0)',
              '0 0 40px 10px rgba(var(--primary), 0.15)',
              '0 0 0 0 rgba(var(--primary), 0)',
            ],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Onde intérieure */}
          <motion.div
            className="absolute w-16 h-16 rounded-full bg-primary/20"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          
          {/* Point central */}
          <motion.div
            className="w-8 h-8 rounded-full bg-primary/40"
            animate={{
              scale: [1, 0.9, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      </div>

      {/* Message apaisant */}
      <div className="absolute bottom-1/4 left-0 right-0 text-center px-8">
        <motion.p
          key={messageIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-base text-muted-foreground font-medium"
        >
          {SOOTHING_MESSAGES[messageIndex]}
        </motion.p>

        {/* Barre de progression subtile */}
        <div className="mt-8 mx-auto max-w-xs">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary/50 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: duration / 1000, ease: 'linear' }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalysisTransition;
