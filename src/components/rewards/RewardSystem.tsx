import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Star, 
  Flower, 
  Flame, 
  Circle, 
  Heart,
  Droplets,
  Zap,
  Sun,
  ArrowRight
} from 'lucide-react';
import { RewardType, useRewardsStore } from '@/store/rewards.store';
import { useOptimizedAnimation } from '@/hooks/useOptimizedAnimation';

interface RewardSystemProps {
  type: RewardType;
  message: string;
  onComplete: () => void;
  className?: string;
}

const rewardIcons: Record<RewardType, React.ComponentType<any>> = {
  aura: Sun,
  constellation: Star,
  flower: Flower,
  flame: Flame,
  pearl: Circle,
  bubble: Droplets,
  crystal: Zap,
  lantern: Heart,
  sticker: Sparkles,
};

const rewardColors: Record<RewardType, string> = {
  aura: 'text-yellow-400',
  constellation: 'text-purple-400',
  flower: 'text-pink-400',
  flame: 'text-orange-400',
  pearl: 'text-blue-400',
  bubble: 'text-cyan-400',
  crystal: 'text-indigo-400',
  lantern: 'text-green-400',
  sticker: 'text-violet-400',
};

export const RewardSystem: React.FC<RewardSystemProps> = ({
  type,
  message,
  onComplete,
  className = ""
}) => {
  const [phase, setPhase] = useState<'materializing' | 'revealing' | 'complete'>('materializing');
  const { addReward } = useRewardsStore();
  
  const { entranceVariants, generateParticles } = useOptimizedAnimation({
    particleCount: 8,
    enableComplexAnimations: true,
  });

  const particles = generateParticles(8);
  const RewardIcon = rewardIcons[type];
  const iconColor = rewardColors[type];

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('revealing'), 1500);
    const timer2 = setTimeout(() => {
      setPhase('complete');
      // Add to store
      addReward({
        type,
        name: `Récompense ${type}`,
        description: message,
        moduleId: 'module'
      });
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [type, message, addReward]);

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-8 ${className}`}>
      {/* Reward manifestation */}
      <div className="relative mb-12">
        {/* Background particles */}
        <div className="absolute inset-0 w-32 h-32 -m-16">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
              animate={{
                opacity: phase === 'complete' ? [0.3, 1, 0.3] : 0.3,
                scale: phase === 'complete' ? [1, 1.5, 1] : 1,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: particle.delay,
              }}
            />
          ))}
        </div>

        {/* Main reward circle */}
        <motion.div
          className="w-32 h-32 rounded-full flex items-center justify-center relative z-10"
          style={{
            background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-foreground)))`
          }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{
            scale: phase === 'materializing' ? 0.5 : 1,
            rotate: phase === 'materializing' ? -180 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
            duration: 1.5,
          }}
        >
          <motion.div
            className={iconColor}
            initial={{ scale: 0 }}
            animate={{ scale: phase === 'revealing' || phase === 'complete' ? 1 : 0 }}
            transition={{ delay: 1.5, type: "spring" }}
          >
            <RewardIcon className="w-12 h-12" />
          </motion.div>

          {/* Glow effect */}
          {phase === 'complete' && (
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-white/30"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.8, 0, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          )}
        </motion.div>
      </div>

      {/* Reward info card */}
      <AnimatePresence>
        {(phase === 'revealing' || phase === 'complete') && (
          <motion.div
            variants={entranceVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <Card className="max-w-sm bg-card/90 backdrop-blur-md border-0 shadow-elegant">
              <CardContent className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
                </motion.div>
                
                <Badge 
                  variant="secondary"
                  className="mb-4 bg-primary/10 text-primary border-primary/20"
                >
                  Nouveau
                </Badge>
                
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Récompense débloquée
                </h3>
                
                <p className="text-sm text-muted-foreground mb-6">
                  {message}
                </p>

                {phase === 'complete' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button 
                      onClick={onComplete}
                      className="w-full"
                    >
                      Continuer l'expérience
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};