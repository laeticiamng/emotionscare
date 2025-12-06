// @ts-nocheck
import { motion } from 'framer-motion';
import { Sparkles, Heart, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface BadgeRevealProps {
  badge: 'calm' | 'partial' | 'tense';
  message: string;
  onComplete?: () => void;
  className?: string;
}

const BADGE_CONFIG = {
  calm: {
    icon: Heart,
    color: 'from-emerald-400 to-cyan-400',
    bgColor: 'bg-emerald-950/60',
    borderColor: 'border-emerald-400/30',
    label: 'Calme retrouvé',
    emoji: '🌿',
  },
  partial: {
    icon: Sparkles,
    color: 'from-violet-400 to-purple-400',
    bgColor: 'bg-violet-950/60',
    borderColor: 'border-violet-400/30',
    label: 'Apaisé en partie',
    emoji: '✨',
  },
  tense: {
    icon: Zap,
    color: 'from-orange-400 to-rose-400',
    bgColor: 'bg-orange-950/60',
    borderColor: 'border-orange-400/30',
    label: 'Encore tendu',
    emoji: '💫',
  },
};

export const BadgeReveal = ({ badge, message, onComplete, className }: BadgeRevealProps) => {
  const config = BADGE_CONFIG[badge];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      onAnimationComplete={onComplete}
      className={cn('relative', className)}
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
          config.color,
          'opacity-30'
        )}
      />

      <Card className={cn('border backdrop-blur-xl', config.bgColor, config.borderColor)}>
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4 text-center">
            {/* Icon with pulse */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className={cn('rounded-full bg-gradient-to-r p-4', config.color)}
            >
              <Icon className="h-8 w-8 text-white" />
            </motion.div>

            {/* Badge label */}
            <div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-semibold text-white"
              >
                {config.label} {config.emoji}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-2 text-base text-white/80"
              >
                {message}
              </motion.p>
            </div>

            {/* Decorative particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-1 w-1 rounded-full bg-white/60"
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
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BadgeReveal;
