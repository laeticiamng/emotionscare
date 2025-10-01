import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import * as LucideIcons from 'lucide-react';
import type { WeeklyCard } from '@/types/card';

interface CardRevealProps {
  card: WeeklyCard;
  onComplete?: () => void;
}

export const CardReveal = ({ card, onComplete }: CardRevealProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Si l'icon est un emoji, on ne cherche pas de Lucide icon
  const isEmoji = card.icon && card.icon.length <= 2;
  const IconComponent = !isEmoji && (LucideIcons as any)[card.icon] 
    ? (LucideIcons as any)[card.icon]
    : null;

  useEffect(() => {
    // Son de révélation (cristal)
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSt+zPDTgjMGHm7A7+OZRA==');
    audio.volume = 0.3;
    audioRef.current = audio;

    // Jouer le son
    const timer = setTimeout(() => {
      audio.play().catch(() => {
        // Ignore si l'utilisateur n'a pas interagi avec la page
      });
    }, 800);

    // Haptics
    if ('vibrate' in navigator) {
      setTimeout(() => {
        navigator.vibrate([50, 30, 100]);
      }, 800);
    }

    // Callback de fin d'animation
    if (onComplete) {
      setTimeout(onComplete, 4000);
    }

    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [card, onComplete]);

  return (
    <div className="relative flex items-center justify-center min-h-[500px]">
      <AnimatePresence>
        {/* Halo cosmique explosif */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 3, 2.5],
            opacity: [0, 0.6, 0] 
          }}
          transition={{
            duration: 2.5,
            times: [0, 0.5, 1],
            ease: "easeOut"
          }}
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${card.color}40 0%, transparent 70%)`,
            filter: 'blur(60px)'
          }}
        />

        {/* Particules magiques */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: 0,
              y: 0,
              opacity: 0,
              scale: 0
            }}
            animate={{
              x: (Math.random() - 0.5) * 400,
              y: (Math.random() - 0.5) * 400,
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              delay: 0.8 + Math.random() * 0.5,
              ease: "easeOut"
            }}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: card.color,
            }}
          />
        ))}

        {/* La carte elle-même */}
        <motion.div
          initial={{ rotateY: 0, scale: 0.8 }}
          animate={{ 
            rotateY: [0, 180, 180],
            scale: [0.8, 1.1, 1]
          }}
          transition={{
            duration: 1.2,
            times: [0, 0.6, 1],
            ease: "easeInOut"
          }}
          style={{
            perspective: 1000,
            transformStyle: 'preserve-3d'
          }}
        >
          <motion.div
            className="w-64 h-96 rounded-3xl shadow-2xl overflow-hidden"
            style={{
              background: card.color,
            }}
            animate={{
              boxShadow: [
                `0 25px 50px -12px ${card.color}60`,
                `0 35px 70px -15px ${card.color}80`,
                `0 25px 50px -12px ${card.color}60`,
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            {/* Pattern de fond */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%">
                <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="1" fill="white" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#pattern)" />
              </svg>
            </div>

            {/* Contenu de la carte */}
            <motion.div
              className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              {/* Badge rareté */}
              <motion.div
                className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
              >
                {card.rarity.toUpperCase()}
              </motion.div>

              {/* Icône principale */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 1,
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
                className="mb-6"
              >
                {IconComponent ? (
                  <IconComponent size={80} strokeWidth={1.5} />
                ) : (
                  <span className="text-8xl">{card.icon}</span>
                )}
              </motion.div>

              {/* Badge + Mantra */}
              <motion.div
                className="text-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <h2 className="text-5xl font-bold mb-2">
                  {card.badge}
                </h2>
                <p className="text-sm opacity-80 mt-4">{card.mantra}</p>
              </motion.div>

              {/* Ligne décorative */}
              <motion.div
                className="w-32 h-0.5 bg-white/40 my-6"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.4, duration: 0.6 }}
              />

              {/* Message d'activation */}
              <motion.p
                className="text-center text-sm opacity-80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 1.6 }}
              >
                Ton énergie de la semaine
              </motion.p>
            </motion.div>

            {/* Effet de brillance qui traverse */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ 
                x: '200%',
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 1.5,
                delay: 1,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
