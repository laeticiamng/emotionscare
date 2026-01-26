// @ts-nocheck

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Star, Award, X, Share2, Sparkles, Crown, Flame, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';

interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  points: number;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  badge?: {
    name: string;
    icon: string;
    rarity: string;
  };
}

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
  show: boolean;
  autoHide?: boolean;
  autoHideDelay?: number;
  enableSound?: boolean;
  enableShare?: boolean;
}

// Queue management for multiple achievements
interface NotificationQueue {
  add: (achievement: Achievement) => void;
  current: Achievement | null;
}

const RARITY_CONFIGS = {
  common: {
    gradient: 'from-gray-400 via-gray-500 to-gray-600',
    icon: Star,
    confettiColors: ['#9ca3af', '#6b7280'],
    sound: '/sounds/achievement-common.mp3',
    animation: { scale: [1, 1.1, 1] },
  },
  rare: {
    gradient: 'from-blue-400 via-blue-500 to-blue-600',
    icon: Award,
    confettiColors: ['#3b82f6', '#60a5fa'],
    sound: '/sounds/achievement-rare.mp3',
    animation: { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] },
  },
  epic: {
    gradient: 'from-purple-400 via-purple-500 to-purple-600',
    icon: Gem,
    confettiColors: ['#a855f7', '#c084fc'],
    sound: '/sounds/achievement-epic.mp3',
    animation: { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] },
  },
  legendary: {
    gradient: 'from-yellow-400 via-amber-500 to-orange-600',
    icon: Crown,
    confettiColors: ['#f59e0b', '#fbbf24', '#f97316'],
    sound: '/sounds/achievement-legendary.mp3',
    animation: { scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] },
  },
};

const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onClose,
  show,
  autoHide = true,
  autoHideDelay = 5000,
  enableSound = true,
  enableShare = true,
}) => {
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  
  const rarity = achievement.rarity || achievement.badge?.rarity as keyof typeof RARITY_CONFIGS || 'common';
  const config = RARITY_CONFIGS[rarity] || RARITY_CONFIGS.common;
  const RarityIcon = config.icon;

  // Play sound effect
  const playSound = useCallback(() => {
    if (!enableSound) return;
    
    try {
      // Use Web Audio API for better performance
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different tones for different rarities
      const frequencies = {
        common: [440, 554, 659],
        rare: [523, 659, 784],
        epic: [587, 740, 880],
        legendary: [659, 880, 1047, 1318],
      };
      
      const freqs = frequencies[rarity];
      let delay = 0;
      
      freqs.forEach((freq, i) => {
        setTimeout(() => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          
          osc.connect(gain);
          gain.connect(audioContext.destination);
          
          osc.frequency.value = freq;
          osc.type = rarity === 'legendary' ? 'sine' : 'triangle';
          
          gain.gain.setValueAtTime(0.3, audioContext.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          
          osc.start();
          osc.stop(audioContext.currentTime + 0.3);
        }, delay);
        delay += 150;
      });
    } catch (e) {
      // Audio not supported
    }
  }, [enableSound, rarity]);

  // Trigger confetti
  const triggerConfetti = useCallback(() => {
    const count = {
      common: 50,
      rare: 100,
      epic: 150,
      legendary: 250,
    }[rarity];

    confetti({
      particleCount: count,
      spread: rarity === 'legendary' ? 100 : 70,
      origin: { y: 0.3 },
      colors: config.confettiColors,
    });

    // Extra effects for legendary
    if (rarity === 'legendary') {
      setTimeout(() => {
        confetti({
          particleCount: 100,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: config.confettiColors,
        });
        confetti({
          particleCount: 100,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: config.confettiColors,
        });
      }, 300);
    }
  }, [rarity, config]);

  // Auto-hide timer
  useEffect(() => {
    if (show && autoHide && !isHovered) {
      const timer = setTimeout(onClose, autoHideDelay);
      return () => clearTimeout(timer);
    }
  }, [show, autoHide, autoHideDelay, onClose, isHovered]);

  // Trigger effects on show
  useEffect(() => {
    if (show) {
      triggerConfetti();
      playSound();
    }
  }, [show, triggerConfetti, playSound]);

  // Share achievement
  const handleShare = async () => {
    const text = `🏆 J'ai débloqué "${achievement.title}" sur EmotionsCare !\n${achievement.description}\n+${achievement.points} points\n\n#EmotionsCare #Achievement`;
    
    if (navigator.share) {
      try {
        await navigator.share({ 
          title: 'Mon succès EmotionsCare',
          text,
        });
      } catch (e) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast({
        title: '📋 Copié !',
        description: 'Le succès a été copié dans le presse-papier.',
      });
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -100, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -100, x: '-50%' }}
          className="fixed top-4 left-1/2 z-50 w-[90vw] max-w-md"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Card className={`p-4 bg-gradient-to-r ${config.gradient} text-white shadow-2xl border-0 overflow-hidden relative`}>
            {/* Animated background sparkles for epic/legendary */}
            {(rarity === 'epic' || rarity === 'legendary') && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(rarity === 'legendary' ? 8 : 4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    animate={{
                      x: [0, Math.random() * 100 - 50],
                      y: [0, Math.random() * -100],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                    style={{ 
                      left: `${10 + i * 12}%`, 
                      top: '80%' 
                    }}
                  >
                    <Sparkles className="w-4 h-4 text-white/60" />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Legendary fire effect */}
            {rarity === 'legendary' && (
              <motion.div
                className="absolute -top-2 left-1/2 transform -translate-x-1/2"
                animate={{ y: [0, -5, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <Flame className="w-8 h-8 text-orange-300" />
              </motion.div>
            )}

            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-start gap-3 flex-1">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ 
                    scale: 1, 
                    rotate: 0,
                    ...config.animation,
                  }}
                  transition={{ 
                    delay: 0.2, 
                    type: "spring", 
                    stiffness: 200,
                    ...(rarity === 'legendary' && { 
                      scale: { 
                        repeat: Infinity, 
                        duration: 2 
                      },
                      rotate: {
                        repeat: Infinity,
                        duration: 3,
                      }
                    })
                  }}
                  className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                >
                  <RarityIcon className="h-7 w-7" />
                </motion.div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <motion.h3 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="font-bold text-lg truncate"
                    >
                      {achievement.title}
                    </motion.h3>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-xs px-2 py-0.5 bg-white/20 rounded-full capitalize"
                    >
                      {rarity}
                    </motion.span>
                  </div>
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-white/90 text-sm mb-2 line-clamp-2"
                  >
                    {achievement.description}
                  </motion.p>
                  
                  <div className="flex items-center gap-2">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="inline-flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full text-xs"
                    >
                      <Star className="h-3 w-3" />
                      +{achievement.points} points
                    </motion.div>
                    
                    {enableShare && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleShare}
                          className="h-6 px-2 text-white hover:bg-white/20"
                        >
                          <Share2 className="h-3 w-3 mr-1" />
                          Partager
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20 h-8 w-8 shrink-0"
                aria-label="Fermer la notification"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Progress bar for auto-hide */}
            {autoHide && !isHovered && (
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-white/30"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: autoHideDelay / 1000, ease: 'linear' }}
              />
            )}
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AchievementNotification;
