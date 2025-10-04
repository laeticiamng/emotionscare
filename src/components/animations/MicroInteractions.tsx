import React, { useState, useRef, useCallback } from 'react';
import { logger } from '@/lib/logger';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, Star, ThumbsUp, Zap, Sparkles, Target } from 'lucide-react';

interface MicroInteractionProps {
  children: React.ReactNode;
  type?: 'hover' | 'click' | 'focus' | 'success' | 'error' | 'loading';
  intensity?: 'subtle' | 'normal' | 'strong';
  feedback?: boolean;
  haptic?: boolean;
}

/**
 * Composant de micro-interactions avancées pour améliorer l'UX
 */
export const MicroInteraction: React.FC<MicroInteractionProps> = ({
  children,
  type = 'hover',
  intensity = 'normal',
  feedback = true,
  haptic = false
}) => {
  const [isTriggered, setIsTriggered] = useState(false);
  const controls = useAnimation();

  const getAnimation = () => {
    const intensityMap = {
      subtle: { scale: 1.02, duration: 0.15 },
      normal: { scale: 1.05, duration: 0.2 },
      strong: { scale: 1.1, duration: 0.25 }
    };

    const { scale, duration } = intensityMap[intensity];

    switch (type) {
      case 'hover':
        return {
          whileHover: { 
            scale,
            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
            transition: { duration }
          }
        };
      case 'click':
        return {
          whileTap: { 
            scale: scale * 0.95,
            transition: { duration: 0.1 }
          }
        };
      case 'success':
        return {
          animate: isTriggered ? {
            scale: [1, scale, 1],
            transition: { duration: 0.6 }
          } : {}
        };
      default:
        return {};
    }
  };

  const triggerHaptic = useCallback(() => {
    if (haptic && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, [haptic]);

  const handleInteraction = () => {
    setIsTriggered(true);
    triggerHaptic();
    
    if (feedback) {
      controls.start({
        y: [0, -5, 0],
        transition: { duration: 0.3 }
      });
    }

    setTimeout(() => setIsTriggered(false), 600);
  };

  return (
    <motion.div
      {...getAnimation()}
      animate={controls}
      onClick={handleInteraction}
      className="cursor-pointer"
    >
      {children}
    </motion.div>
  );
};

/**
 * Bouton avec animations de feedback avancées
 */
interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  className = ''
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = async () => {
    if (disabled || isLoading) return;

    setIsPressed(true);
    
    // Effet de ripple
    const button = buttonRef.current;
    if (button) {
      const rect = button.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${-size / 2}px`;
      ripple.style.top = `${-size / 2}px`;
      ripple.className = 'ripple-effect';
      
      button.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    }

    try {
      await onClick?.();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1000);
    } catch (error) {
      logger.error('Button action failed', { error }, 'ANIMATIONS');
    } finally {
      setIsPressed(false);
    }
  };

  const getVariantStyles = () => {
    const variants = {
      primary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
      secondary: 'bg-secondary hover:bg-secondary/90 text-secondary-foreground',
      success: 'bg-success hover:bg-success/90 text-success-foreground',
      danger: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
    };
    return variants[variant];
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative overflow-hidden"
    >
      <Button
        ref={buttonRef}
        onClick={handleClick}
        disabled={disabled || isLoading}
        className={`
          relative overflow-hidden transition-all duration-300
          ${getVariantStyles()}
          ${isPressed ? 'shadow-lg' : 'shadow'}
          ${showSuccess ? 'bg-success' : ''}
          ${className}
        `}
      >
        <motion.span
          className="flex items-center gap-2"
          animate={{
            opacity: isLoading ? 0.7 : 1,
            x: showSuccess ? -20 : 0
          }}
        >
          {children}
        </motion.span>

        {isLoading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}

        {showSuccess && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center text-primary-foreground"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              ✓
            </motion.div>
          </motion.div>
        )}
      </Button>

      {/* CSS for ripple effect */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
          }

          @keyframes ripple {
            to {
              transform: scale(4);
              opacity: 0;
            }
          }
        `
      }} />
    </motion.div>
  );
};

/**
 * Card interactive avec micro-interactions
 */
interface InteractiveCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  isSelectable?: boolean;
  isSelected?: boolean;
  hoverEffect?: boolean;
  className?: string;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  onClick,
  isSelectable = false,
  isSelected = false,
  hoverEffect = true,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!hoverEffect) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={`cursor-pointer ${className}`}
      style={{
        perspective: 1000,
        rotateX: hoverEffect ? rotateX : 0,
        rotateY: hoverEffect ? rotateY : 0,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{
        scale: hoverEffect ? 1.02 : 1,
        boxShadow: hoverEffect ? "0 20px 40px rgba(0,0,0,0.1)" : undefined,
        transition: { duration: 0.3 }
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
    >
      <Card className={`
        transition-all duration-300
        ${isSelected ? 'ring-2 ring-primary shadow-lg' : ''}
        ${isSelectable ? 'hover:shadow-md' : ''}
        ${isHovered && hoverEffect ? 'transform-gpu' : ''}
      `}>
        {children}
        
        {/* Overlay pour effet de selection */}
        {isSelected && (
          <motion.div
            className="absolute inset-0 bg-primary/5 rounded-lg pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
        
        {/* Particules d'interaction */}
        {isHovered && hoverEffect && (
          <motion.div
            className="absolute top-2 right-2 text-primary"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 180 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};

/**
 * Système de feedback visuel pour actions utilisateur
 */
interface FeedbackProps {
  type: 'like' | 'love' | 'star' | 'zap' | 'success';
  isActive: boolean;
  onClick: () => void;
  count?: number;
  showCount?: boolean;
}

export const FeedbackButton: React.FC<FeedbackProps> = ({
  type,
  isActive,
  onClick,
  count = 0,
  showCount = true
}) => {
  const [showParticles, setShowParticles] = useState(false);

  const getIcon = () => {
    const icons = {
      like: ThumbsUp,
      love: Heart,
      star: Star,
      zap: Zap,
      success: Target
    };
    return icons[type];
  };

  const getColor = () => {
    const colors = {
      like: 'text-primary',
      love: 'text-destructive',
      star: 'text-warning',
      zap: 'text-accent',
      success: 'text-success'
    };
    return colors[type];
  };

  const Icon = getIcon();

  const handleClick = () => {
    onClick();
    setShowParticles(true);
    setTimeout(() => setShowParticles(false), 1000);
  };

  return (
    <motion.div className="relative flex items-center gap-2">
      <motion.button
        className={`
          flex items-center gap-2 px-3 py-2 rounded-full
          transition-all duration-300
          ${isActive ? getColor() + ' bg-current/10' : 'text-muted-foreground hover:text-current'}
        `}
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{
            scale: isActive ? [1, 1.3, 1] : 1,
            rotate: isActive ? [0, 15, -15, 0] : 0
          }}
          transition={{ duration: 0.5 }}
        >
          <Icon 
            className={`w-5 h-5 ${isActive ? 'fill-current' : ''}`}
          />
        </motion.div>
        
        {showCount && count > 0 && (
          <motion.span
            className="text-sm font-medium"
            animate={{ scale: isActive ? [1, 1.1, 1] : 1 }}
          >
            {count}
          </motion.span>
        )}
      </motion.button>

      {/* Particules d'animation */}
      {showParticles && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-2 h-2 rounded-full ${getColor().replace('text-', 'bg-')}`}
              initial={{ 
                x: 0, 
                y: 0, 
                scale: 1,
                opacity: 1
              }}
              animate={{
                x: (Math.random() - 0.5) * 100,
                y: (Math.random() - 0.5) * 100,
                scale: 0,
                opacity: 0
              }}
              transition={{
                duration: 1,
                delay: i * 0.1
              }}
              style={{
                left: '50%',
                top: '50%'
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

/**
 * Notification toast animée personnalisée
 */
interface AnimatedToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

export const AnimatedToast: React.FC<AnimatedToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        setTimeout(onClose, 300);
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getTypeStyles = () => {
    const styles = {
      success: 'bg-success text-success-foreground',
      error: 'bg-error text-error-foreground',
      warning: 'bg-warning text-warning-foreground',
      info: 'bg-info text-info-foreground'
    };
    return styles[type];
  };

  return (
    <motion.div
      className={`
        fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50
        ${getTypeStyles()}
      `}
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        y: isVisible ? 0 : -50, 
        scale: isVisible ? 1 : 0.8 
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: isVisible ? '100%' : 0 }}
        transition={{ duration: duration / 1000 }}
        className="absolute bottom-0 left-0 h-1 bg-foreground/30 rounded-full"
      />
      
      <div className="flex items-center gap-2">
        <span>{message}</span>
        <button 
          onClick={() => setIsVisible(false)}
          className="ml-2 opacity-70 hover:opacity-100"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
};