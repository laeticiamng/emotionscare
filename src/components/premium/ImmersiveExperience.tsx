// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Shield, Star, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImmersiveExperienceProps {
  variant?: 'welcome' | 'success' | 'milestone' | 'celebration';
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
  onComplete?: () => void;
}

const ImmersiveExperience: React.FC<ImmersiveExperienceProps> = ({
  variant = 'welcome',
  title,
  subtitle,
  children,
  className,
  onComplete
}) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Générer des particules pour l'effet immersif
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  const variants = {
    welcome: {
      gradient: 'from-purple-600/20 via-blue-600/20 to-indigo-600/20',
      icon: <Sparkles className="w-12 h-12 text-purple-400" />,
      color: 'text-purple-400'
    },
    success: {
      gradient: 'from-green-600/20 via-emerald-600/20 to-teal-600/20',
      icon: <Shield className="w-12 h-12 text-green-400" />,
      color: 'text-green-400'
    },
    milestone: {
      gradient: 'from-amber-600/20 via-orange-600/20 to-red-600/20',
      icon: <Star className="w-12 h-12 text-amber-400" />,
      color: 'text-amber-400'
    },
    celebration: {
      gradient: 'from-pink-600/20 via-rose-600/20 to-purple-600/20',
      icon: <Heart className="w-12 h-12 text-pink-400" />,
      color: 'text-pink-400'
    }
  };

  const currentVariant = variants[variant] || variants.welcome;

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-lg",
        className
      )}
    >
      {/* Particules flottantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Cercles décoratifs animés */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Contenu principal */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 max-w-lg mx-auto p-6"
      >
        <Card className={cn(
          "border-0 shadow-2xl backdrop-blur-xl bg-gradient-to-br",
          currentVariant.gradient
        )}>
          <CardContent className="p-8 text-center space-y-6">
            {/* Icône principale */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                delay: 0.5, 
                type: "spring", 
                stiffness: 200,
                damping: 15
              }}
              className="flex justify-center"
            >
              <div className="p-4 rounded-full bg-white/10 backdrop-blur-sm">
                {currentVariant.icon}
              </div>
            </motion.div>

            {/* Titre et sous-titre */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="space-y-2"
            >
              {title && (
                <h2 className={cn("text-2xl font-bold", currentVariant.color)}>
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {subtitle}
                </p>
              )}
            </motion.div>

            {/* Contenu personnalisé */}
            {children && (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                {children}
              </motion.div>
            )}

            {/* Bouton d'action */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <Button
                onClick={() => {
                  setIsVisible(false);
                  onComplete?.();
                }}
                className="group relative overflow-hidden bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
                size="lg"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Continuer l'expérience
                  <Zap className="w-4 h-4 group-hover:animate-pulse" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </Button>
            </motion.div>

            {/* Badge de statut */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.3, type: "spring" }}
              className="flex justify-center"
            >
              <Badge variant="outline" className="bg-white/10 border-white/20 text-white/90">
                Expérience Premium EmotionsCare
              </Badge>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ImmersiveExperience;