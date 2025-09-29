
import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

// Presets d'animations fluides
export const fluidAnimations = {
  // Entrée douce
  gentleEntry: {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8
      }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  },

  // Slide fluide
  fluidSlide: {
    initial: { x: -100, opacity: 0 },
    animate: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    exit: { 
      x: 100, 
      opacity: 0,
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  },

  // Morphing fluide
  fluidMorph: {
    initial: { 
      borderRadius: "50%", 
      scale: 0,
      rotate: -180
    },
    animate: { 
      borderRadius: "8px", 
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        duration: 0.6
      }
    }
  },

  // Bounce élégant
  elegantBounce: {
    initial: { y: -50, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15,
        mass: 0.5
      }
    }
  },

  // Stagger container
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },

  // Stagger item
  staggerItem: {
    initial: { y: 20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20
      }
    }
  }
} as const;

// Composant wrapper pour animations fluides
interface FluidMotionProps {
  children: React.ReactNode;
  animation?: keyof typeof fluidAnimations;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
}

export const FluidMotion: React.FC<FluidMotionProps> = ({
  children,
  animation = 'gentleEntry',
  className,
  delay = 0,
  duration,
  once = true
}) => {
  const animationConfig = fluidAnimations[animation];
  
  // Ajouter le délai personnalisé
  const modifiedConfig = duration || delay ? {
    ...animationConfig,
    animate: {
      ...animationConfig.animate,
      transition: {
        ...animationConfig.animate.transition,
        delay,
        ...(duration && { duration })
      }
    }
  } : animationConfig;

  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={modifiedConfig}
      viewport={once ? { once: true } : undefined}
    >
      {children}
    </motion.div>
  );
};

// Composant pour listes avec stagger
interface StaggerListProps {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
}

export const StaggerList: React.FC<StaggerListProps> = ({
  children,
  className,
  staggerDelay = 0.1
}) => {
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.2
      }
    }
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {children.map((child, index) => (
        <FluidMotion key={index} animation="staggerItem">
          {child}
        </FluidMotion>
      ))}
    </motion.div>
  );
};

// Composant pour les transitions de page fluides
interface PageTransitionProps {
  children: React.ReactNode;
  exitBeforeEnter?: boolean;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  exitBeforeEnter = true
}) => {
  return (
    <AnimatePresence mode="sync">{/* Removed conditional wait mode to fix warnings */}
      <FluidMotion animation="gentleEntry">
        {children}
      </FluidMotion>
    </AnimatePresence>
  );
};

// Hook pour animations au scroll
export const useScrollAnimation = (threshold = 0.1) => {
  const [isInView, setIsInView] = React.useState(false);
  const ref = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
};

// Composant pour les micro-interactions
interface MicroInteractionProps {
  children: React.ReactNode;
  hoverScale?: number;
  tapScale?: number;
  className?: string;
}

export const MicroInteraction: React.FC<MicroInteractionProps> = ({
  children,
  hoverScale = 1.02,
  tapScale = 0.98,
  className
}) => {
  return (
    <motion.div
      className={cn("cursor-pointer", className)}
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: tapScale }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 20
      }}
    >
      {children}
    </motion.div>
  );
};

// Animation de chargement fluide
export const FluidLoader: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className={cn(
          "rounded-full border-2 border-primary/30 border-t-primary",
          sizeClasses[size]
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};

