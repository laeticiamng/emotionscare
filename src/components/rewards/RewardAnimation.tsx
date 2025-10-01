// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Reward } from '@/types/rewards';
import { 
  Sparkles, 
  Flower, 
  Gem, 
  Star, 
  Music, 
  Sword, 
  Card,
  Shield,
  Flame,
  Lightbulb
} from 'lucide-react';

interface RewardAnimationProps {
  reward: Reward;
  isVisible: boolean;
  onComplete: () => void;
  className?: string;
}

const getRewardIcon = (type: string) => {
  switch (type) {
    case 'gem': return Gem;
    case 'flower': return Flower;
    case 'avatar': return Star;
    case 'constellation': return Sparkles;
    case 'sample': return Music;
    case 'item': return Sword;
    case 'card': return Card;
    case 'badge': return Shield;
    case 'lantern': return Lightbulb;
    case 'flame': return Flame;
    default: return Star;
  }
};

export const RewardAnimation: React.FC<RewardAnimationProps> = ({
  reward,
  isVisible,
  onComplete,
  className = ""
}) => {
  const [phase, setPhase] = useState<'materializing' | 'revealing' | 'celebrating'>('materializing');
  const Icon = getRewardIcon(reward.type);

  useEffect(() => {
    if (!isVisible) return;

    const timer1 = setTimeout(() => setPhase('revealing'), 800);
    const timer2 = setTimeout(() => setPhase('celebrating'), 1600);
    const timer3 = setTimeout(() => onComplete(), 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  y: [0, -50, -100]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              />
            ))}
          </div>

          {/* Main reward showcase */}
          <motion.div
            className="relative"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: phase === 'materializing' ? 0.5 : 1,
              rotate: 0 
            }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 15,
              duration: 0.8 
            }}
          >
            {/* Reward glow */}
            <motion.div
              className="absolute inset-0 rounded-full blur-xl"
              style={{ backgroundColor: reward.visualData.color }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Reward container */}
            <motion.div
              className="relative w-32 h-32 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${reward.visualData.color}20, ${reward.visualData.color}40)`
              }}
            >
              <Icon 
                className="w-16 h-16 text-white drop-shadow-lg"
                style={{ color: reward.visualData.color }}
              />
            </motion.div>

            {/* Sparkles around reward */}
            {phase === 'celebrating' && (
              <div className="absolute inset-0">
                {Array.from({ length: 8 }, (_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      left: `${50 + 40 * Math.cos((i * 45) * Math.PI / 180)}%`,
                      top: `${50 + 40 * Math.sin((i * 45) * Math.PI / 180)}%`,
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: [0, 1, 0], 
                      opacity: [0, 1, 0],
                      rotate: [0, 180, 360]
                    }}
                    transition={{
                      duration: 1,
                      delay: i * 0.1,
                      repeat: 2
                    }}
                  >
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Reward info */}
          <motion.div
            className="absolute bottom-1/3 text-center text-white"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: phase === 'revealing' || phase === 'celebrating' ? 1 : 0 }}
            transition={{ delay: 1 }}
          >
            <motion.h2 
              className="text-2xl font-bold mb-2"
              animate={{ scale: phase === 'celebrating' ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.5, repeat: phase === 'celebrating' ? 3 : 0 }}
            >
              {reward.name}
            </motion.h2>
            <p className="text-lg opacity-90">{reward.description}</p>
            
            {reward.rarity !== 'common' && (
              <motion.div
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                  reward.rarity === 'legendary' ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-black' :
                  reward.rarity === 'epic' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                  'bg-gradient-to-r from-blue-500 to-cyan-500'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.5, type: "spring" }}
              >
                {reward.rarity.toUpperCase()}
              </motion.div>
            )}
          </motion.div>

          {/* Skip button */}
          <motion.button
            className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors"
            onClick={onComplete}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            Continuer →
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};