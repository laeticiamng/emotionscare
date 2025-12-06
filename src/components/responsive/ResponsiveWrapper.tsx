// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { cn } from '@/lib/utils';

interface ResponsiveWrapperProps {
  children: React.ReactNode;
  className?: string;
  mobileLayout?: React.ReactNode;
  tabletLayout?: React.ReactNode;
  desktopLayout?: React.ReactNode;
  enableGestures?: boolean;
  enableVibration?: boolean;
}

const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({
  children,
  className,
  mobileLayout,
  tabletLayout,
  desktopLayout,
  enableGestures = true,
  enableVibration = false
}) => {
  const device = useDeviceDetection();

  // Fonction pour déclencher la vibration sur mobile
  const triggerVibration = (pattern: number[] = [100]) => {
    if (enableVibration && device.capabilities.supportsVibration && device.type === 'mobile') {
      navigator.vibrate(pattern);
    }
  };

  // Gestionnaires de gestes pour appareils tactiles
  const gestureHandlers = enableGestures && device.isTouchDevice ? {
    onTap: () => triggerVibration([50]),
    onTapStart: () => triggerVibration([25]),
  } : {};

  // Déterminer le layout à utiliser
  const getLayoutContent = () => {
    if (device.type === 'mobile' && mobileLayout) {
      return mobileLayout;
    }
    if (device.type === 'tablet' && tabletLayout) {
      return tabletLayout;
    }
    if (device.type === 'desktop' && desktopLayout) {
      return desktopLayout;
    }
    return children;
  };

  // Classes CSS responsives
  const responsiveClasses = cn(
    // Classes de base
    'relative w-full',
    
    // Classes par type d'appareil
    device.type === 'mobile' && 'mobile-optimized',
    device.type === 'tablet' && 'tablet-optimized', 
    device.type === 'desktop' && 'desktop-optimized',
    
    // Classes tactiles
    device.isTouchDevice && 'touch-optimized select-none',
    !device.isTouchDevice && 'non-touch-optimized',
    
    // Classes d'orientation
    device.orientation === 'portrait' && 'portrait-mode',
    device.orientation === 'landscape' && 'landscape-mode',
    
    // Classes de plateforme
    device.platform === 'ios' && 'ios-platform',
    device.platform === 'android' && 'android-platform',
    
    // Padding adaptatif
    device.type === 'mobile' ? 'p-2 sm:p-4' : 
    device.type === 'tablet' ? 'p-4 md:p-6' : 
    'p-6 lg:p-8',
    
    // Espacement adaptatif
    device.type === 'mobile' ? 'space-y-3' :
    device.type === 'tablet' ? 'space-y-4' :
    'space-y-6',
    
    className
  );

  // Variants d'animation adaptatifs
  const animationVariants = {
    initial: {
      opacity: 0,
      y: device.type === 'mobile' ? 20 : 30,
      scale: device.type === 'mobile' ? 0.95 : 0.98
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1
    },
    exit: {
      opacity: 0,
      y: device.type === 'mobile' ? -20 : -30,
      scale: device.type === 'mobile' ? 0.95 : 0.98
    }
  };

  // Transition adaptative
  const transition = {
    duration: device.type === 'mobile' ? 0.3 : 0.5,
    ease: device.type === 'mobile' ? "easeOut" : [0.4, 0, 0.2, 1],
    staggerChildren: 0.1
  };

  return (
    <motion.div
      className={responsiveClasses}
      variants={animationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={transition}
      {...gestureHandlers}
      style={{
        // Variables CSS personnalisées basées sur l'appareil
        '--device-type': device.type,
        '--screen-width': `${device.screenSize.width}px`,
        '--screen-height': `${device.screenSize.height}px`,
        '--device-pixel-ratio': device.devicePixelRatio,
        '--touch-target-size': device.isTouchDevice ? '44px' : '32px',
        
        // Optimisations de performance
        WebkitFontSmoothing: device.type === 'mobile' ? 'antialiased' : 'auto',
        textRendering: 'optimizeLegibility',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)', // Force hardware acceleration
      } as React.CSSProperties}
    >
      {getLayoutContent()}
      
      {/* Indicateur de connexion pour mobile */}
      {device.type === 'mobile' && !device.isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 z-50 text-sm"
        >
          Mode hors ligne - Certaines fonctionnalités peuvent être limitées
        </motion.div>
      )}
      
      {/* Indicateur d'orientation pour tablette */}
      {device.type === 'tablet' && (
        <div className={cn(
          "fixed bottom-4 right-4 w-3 h-3 rounded-full z-40 transition-colors",
          device.orientation === 'landscape' ? 'bg-green-500' : 'bg-blue-500'
        )}/>
      )}
    </motion.div>
  );
};

export default ResponsiveWrapper;
export { ResponsiveWrapper };