import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, ButtonProps } from '@/components/ui/button';
import { Loader2, Sparkles, Star, Zap, Heart, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends ButtonProps {
  variant?: 'default' | 'premium' | 'magical' | 'success' | 'glow' | 'pulse';
  animation?: 'none' | 'hover' | 'pulse' | 'glow' | 'shimmer' | 'bounce';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loadingText?: string;
  successText?: string;
  successIcon?: React.ReactNode;
  onSuccess?: () => void;
  particles?: boolean;
  glowIntensity?: 'low' | 'medium' | 'high';
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  variant = 'default',
  animation = 'hover',
  isLoading = false,
  leftIcon,
  rightIcon,
  loadingText = "Chargement...",
  successText,
  successIcon,
  onSuccess,
  particles = false,
  glowIntensity = 'medium',
  className,
  onClick,
  ...props
}) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (particles) {
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 1000);
    }

    if (onClick) {
      const result = await onClick(e);
      if (successText && !isLoading) {
        setIsSuccess(true);
        onSuccess?.();
        setTimeout(() => setIsSuccess(false), 2000);
      }
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'premium':
        return cn(
          "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
          "text-white border-0 shadow-lg hover:shadow-purple-500/25",
          glowIntensity === 'high' && "shadow-purple-500/50",
          "relative overflow-hidden"
        );
      case 'magical':
        return cn(
          "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500",
          "hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600",
          "text-white border-0 shadow-lg hover:shadow-pink-500/25",
          "relative overflow-hidden"
        );
      case 'success':
        return cn(
          "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600",
          "text-white border-0 shadow-lg hover:shadow-emerald-500/25",
          "relative overflow-hidden"
        );
      case 'glow':
        return cn(
          "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600",
          "text-white border-0 shadow-lg hover:shadow-blue-500/50",
          "relative overflow-hidden",
          glowIntensity === 'low' && "shadow-blue-500/20",
          glowIntensity === 'medium' && "shadow-blue-500/40", 
          glowIntensity === 'high' && "shadow-blue-500/60"
        );
      case 'pulse':
        return cn(
          "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600",
          "text-white border-0 shadow-lg hover:shadow-red-500/25",
          "relative overflow-hidden"
        );
      default:
        return "";
    }
  };

  const getAnimationVariants = () => {
    switch (animation) {
      case 'pulse':
        return {
          initial: { scale: 1 },
          animate: { scale: [1, 1.05, 1] },
          transition: { duration: 1, repeat: Infinity }
        };
      case 'bounce':
        return {
          whileHover: { y: -2 },
          whileTap: { y: 0, scale: 0.98 }
        };
      case 'glow':
        return {
          whileHover: { 
            boxShadow: "0 0 20px rgba(var(--primary), 0.5)" 
          }
        };
      case 'hover':
        return {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 }
        };
      default:
        return {};
    }
  };

  const ParticleEffect = () => (
    <AnimatePresence>
      {showParticles && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: '50%',
                top: '50%',
              }}
              initial={{
                x: 0,
                y: 0,
                opacity: 1,
                scale: 1
              }}
              animate={{
                x: (Math.random() - 0.5) * 100,
                y: (Math.random() - 0.5) * 100,
                opacity: 0,
                scale: 0
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.8,
                delay: i * 0.05,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );

  const ShimmerEffect = () => (
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
      initial={{ x: '-100%' }}
      animate={{ x: '200%' }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        repeatDelay: 3,
        ease: "easeInOut"
      }}
    />
  );

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <span className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          {loadingText}
        </span>
      );
    }

    if (isSuccess && successText) {
      return (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2"
        >
          {successIcon || <Star className="w-4 h-4" />}
          {successText}
        </motion.span>
      );
    }

    return (
      <span className="flex items-center gap-2">
        {leftIcon}
        {children}
        {rightIcon}
      </span>
    );
  };

  const getVariantIcon = () => {
    switch (variant) {
      case 'premium': return <Crown className="w-4 h-4" />;
      case 'magical': return <Sparkles className="w-4 h-4" />;
      case 'success': return <Star className="w-4 h-4" />;
      case 'glow': return <Zap className="w-4 h-4" />;
      case 'pulse': return <Heart className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <motion.div
      className="relative inline-block"
      {...getAnimationVariants()}
    >
      <Button
        {...props}
        onClick={handleClick}
        disabled={isLoading || props.disabled}
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          getVariantClasses(),
          (animation === 'pulse' && !isLoading) && "animate-pulse",
          className
        )}
      >
        {/* Effet de brillance */}
        {(animation === 'shimmer' || variant === 'premium' || variant === 'magical') && (
          <ShimmerEffect />
        )}

        {/* Contenu du bouton */}
        <span className="relative z-10 flex items-center gap-2">
          {!leftIcon && variant !== 'default' && !isLoading && !isSuccess && getVariantIcon()}
          {getButtonContent()}
        </span>

        {/* Particules */}
        {particles && <ParticleEffect />}

        {/* Overlay de succès */}
        <AnimatePresence>
          {isSuccess && (
            <motion.div
              className="absolute inset-0 bg-green-500/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>
      </Button>

      {/* Glow effect externe */}
      {(variant === 'glow' || glowIntensity === 'high') && (
        <motion.div
          className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-lg -z-10"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  );
};

export default AnimatedButton;