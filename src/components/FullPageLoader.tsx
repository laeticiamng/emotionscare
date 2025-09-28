
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FullPageLoaderProps {
  show: boolean;
  message?: string;
  onComplete?: () => void;
  minDisplayTime?: number;
}

const FullPageLoader: React.FC<FullPageLoaderProps> = ({
  show,
  message = "Chargement...",
  onComplete,
  minDisplayTime = 800
}) => {
  const [shouldRender, setShouldRender] = useState(show);
  const [startTime, setStartTime] = useState<number | null>(null);
  
  // Préférence utilisateur pour les animations réduites
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  useEffect(() => {
    if (show && !startTime) {
      // Définir l'heure de début lors de l'affichage
      setStartTime(Date.now());
      setShouldRender(true);
    } else if (!show && startTime) {
      // Calculer combien de temps le loader a été affiché
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
      
      // Maintenir le loader visible pendant au moins minDisplayTime
      if (remainingTime > 0) {
        const timer = setTimeout(() => {
          setShouldRender(false);
          setStartTime(null);
          if (onComplete) onComplete();
        }, remainingTime);
        
        return () => clearTimeout(timer);
      } else {
        setShouldRender(false);
        setStartTime(null);
        if (onComplete) onComplete();
      }
    }
  }, [show, startTime, minDisplayTime, onComplete]);
  
  return (
    <AnimatePresence>
      {shouldRender && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        >
          <div className="text-center">
            {prefersReducedMotion ? (
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-primary/30 border-t-primary" />
            ) : (
              <motion.div
                className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-primary/30 border-t-primary"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            )}
            
            <p className="text-lg font-medium text-foreground/80">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FullPageLoader;
