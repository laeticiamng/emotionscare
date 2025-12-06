// @ts-nocheck

import { Variants } from 'framer-motion';

/**
 * Configurations et variantes d'animation pour une expérience utilisateur premium
 */

// Variantes pour les animations d'apparition
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

// Apparaître depuis le bas
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

// Apparaître depuis le haut
export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

// Apparaître depuis la gauche
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

// Apparaître depuis la droite
export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

// Animation de zoom
export const zoomIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }
};

// Animation de card hover
export const cardHover: Variants = {
  hover: { 
    y: -5, 
    boxShadow: "0px 10px 20px rgba(0,0,0,0.1)", 
    transition: { duration: 0.3, ease: 'easeOut' } 
  }
};

// Animation staggerée pour les listes d'éléments
export const staggerItems = (staggerChildren = 0.1, delayChildren = 0) => ({
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      staggerChildren, 
      delayChildren 
    } 
  }
});

// Animation de pulse
export const pulse: Variants = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: 'loop'
    }
  }
};

// Animation de respiration
export const breathing: Variants = {
  breath: {
    scale: [1, 1.03, 1],
    opacity: [0.9, 1, 0.9],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut'
    }
  }
};

// Animation pour les boutons
export const buttonTap: Variants = {
  tap: { scale: 0.98, transition: { duration: 0.1 } }
};

// Animation d'ouverture de modal
export const modalAnimation: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { 
      type: 'spring', 
      stiffness: 300, 
      damping: 25 
    } 
  },
  exit: { 
    opacity: 0, 
    y: 30, 
    scale: 0.95, 
    transition: { duration: 0.2 } 
  }
};

// Animation d'arrière-plan pour overlay modal
export const overlayAnimation: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2, delay: 0.1 } }
};

// Animation de notification toast
export const toastAnimation: Variants = {
  hidden: { opacity: 0, y: -20, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, type: 'spring', stiffness: 350, damping: 30 } },
  exit: { opacity: 0, x: 100, transition: { duration: 0.2 } }
};

// Animation pour les transitions de page
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } }
};

// Animation pour carte badge
export const badgeAnimation: Variants = {
  hidden: { opacity: 0, scale: 0.8, rotateY: -30 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    rotateY: 0,
    transition: { 
      type: 'spring', 
      stiffness: 400, 
      damping: 20 
    }
  },
  hover: {
    y: -8,
    scale: 1.05,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 15
    }
  }
};

// Animation de compteur
export const counterAnimation = (value: number) => ({
  initial: { count: 0 },
  animate: { count: value, transition: { duration: 1.5, ease: 'easeOut' } }
});

// Animation d'éléments qui entrent dans le viewport
export const scrollAnimation: Variants = {
  offscreen: { opacity: 0, y: 50 },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      bounce: 0.4,
      duration: 0.8
    }
  }
};

// Configuration des délais en cascade
export const createStaggeredDelay = (items: any[], baseDelay: number = 0.1) => {
  return items.map((_, index) => baseDelay * index);
};

// Animation de vagues
export const waveAnimation: Variants = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};
