/**
 * Achievement Toast - Notification d'achievement débloqué
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

interface AchievementToastProps {
  achievement: {
    id: string;
    name: string;
    description: string;
    icon: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    xpReward: number;
  } | null;
  onClose: () => void;
  autoClose?: number;
}

const rarityStyles = {
  common: {
    bg: 'from-muted to-muted/80',
    border: 'border-muted-foreground/30',
    glow: '',
  },
  rare: {
    bg: 'from-info/20 to-info/10',
    border: 'border-info/50',
    glow: 'shadow-info/20',
  },
  epic: {
    bg: 'from-accent/20 to-accent/10',
    border: 'border-accent/50',
    glow: 'shadow-accent/30',
  },
  legendary: {
    bg: 'from-warning/30 to-warning/10',
    border: 'border-warning/60',
    glow: 'shadow-warning/40',
  },
};

const rarityLabels = {
  common: 'Commun',
  rare: 'Rare',
  epic: 'Épique',
  legendary: 'Légendaire',
};

export const AchievementToast: React.FC<AchievementToastProps> = ({
  achievement,
  onClose,
  autoClose = 5000,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setVisible(true);
      
      // Trigger confetti for epic and legendary
      if (achievement.rarity === 'epic' || achievement.rarity === 'legendary') {
        confetti({
          particleCount: achievement.rarity === 'legendary' ? 100 : 50,
          spread: 70,
          origin: { y: 0.3 },
          colors: achievement.rarity === 'legendary' 
            ? ['#FFD700', '#FFA500', '#FF6347'] 
            : ['#8B5CF6', '#A855F7', '#D946EF'],
        });
      }

      // Auto close
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300);
      }, autoClose);

      return () => clearTimeout(timer);
    }
  }, [achievement, autoClose, onClose]);

  if (!achievement) return null;

  const style = rarityStyles[achievement.rarity];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          transition={{ type: 'spring', damping: 15 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4"
        >
          <div
            className={`
              relative overflow-hidden rounded-2xl border-2 ${style.border}
              bg-gradient-to-br ${style.bg} backdrop-blur-lg
              shadow-lg ${style.glow} p-4
            `}
          >
            {/* Sparkle effect for legendary */}
            {achievement.rarity === 'legendary' && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="absolute top-2 left-4 w-4 h-4 text-warning" />
                <Sparkles className="absolute top-4 right-6 w-3 h-3 text-warning" />
                <Sparkles className="absolute bottom-3 left-8 w-3 h-3 text-warning" />
              </motion.div>
            )}

            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 rounded-full"
              onClick={() => {
                setVisible(false);
                setTimeout(onClose, 300);
              }}
            >
              <X className="h-3 w-3" />
            </Button>

            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-5 h-5 text-warning" />
              <span className="text-sm font-semibold text-foreground">
                Succès Débloqué !
              </span>
            </div>

            {/* Content */}
            <div className="flex items-center gap-4">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className={`
                  w-16 h-16 rounded-xl flex items-center justify-center text-3xl
                  bg-gradient-to-br ${style.bg} border ${style.border}
                `}
              >
                {achievement.icon}
              </motion.div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground truncate">
                  {achievement.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {achievement.description}
                </p>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-card/50`}>
                    {rarityLabels[achievement.rarity]}
                  </span>
                  <span className="text-xs text-warning font-medium flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    +{achievement.xpReward} XP
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AchievementToast;
