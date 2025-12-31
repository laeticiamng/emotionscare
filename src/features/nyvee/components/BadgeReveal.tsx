/**
 * BadgeReveal - Révélation du badge avec animation
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import type { BadgeType } from '@/modules/nyvee/types';

interface BadgeRevealProps {
  badge: BadgeType;
  message: string;
  onComplete?: () => void;
  className?: string;
}

const BADGE_CONFIG = {
  calm: {
    icon: Heart,
    gradient: 'from-emerald-400 to-cyan-400',
    bgClass: 'bg-emerald-500/10',
    borderClass: 'border-emerald-500/30',
    label: 'Calme retrouvé',
    emoji: '🌿',
  },
  partial: {
    icon: Sparkles,
    gradient: 'from-violet-400 to-purple-400',
    bgClass: 'bg-violet-500/10',
    borderClass: 'border-violet-500/30',
    label: 'Apaisé en partie',
    emoji: '✨',
  },
  tense: {
    icon: Zap,
    gradient: 'from-orange-400 to-rose-400',
    bgClass: 'bg-orange-500/10',
    borderClass: 'border-orange-500/30',
    label: 'Encore tendu',
    emoji: '💫',
  },
};

export const BadgeReveal = memo(({ badge, message, onComplete, className }: BadgeRevealProps) => {
  const config = BADGE_CONFIG[badge];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      onAnimationComplete={onComplete}
      className={cn('relative', className)}
      role="alert"
      aria-label={`Badge obtenu: ${config.label}`}
    >
      {/* Glow effect */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className={cn(
          'absolute inset-0 -z-10 rounded-2xl blur-2xl',
          'bg-gradient-to-r',
          config.gradient,
          'opacity-30'
        )}
        aria-hidden="true"
      />

      <Card className={cn('border backdrop-blur-xl', config.bgClass, config.borderClass)}>
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4 text-center">
            {/* Icon with pulse */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className={cn('rounded-full bg-gradient-to-r p-4', config.gradient)}
              aria-hidden="true"
            >
              <Icon className="h-8 w-8 text-white" />
            </motion.div>

            {/* Badge label */}
            <div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-semibold text-foreground"
              >
                {config.label} {config.emoji}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-2 text-base text-muted-foreground"
              >
                {message}
              </motion.p>
            </div>

            {/* Decorative particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-1 w-1 rounded-full bg-foreground/40"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  y: [0, -30, -60],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
                aria-hidden="true"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

BadgeReveal.displayName = 'BadgeReveal';

export default BadgeReveal;
