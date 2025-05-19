
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface PostLoginTransitionProps {
  show: boolean;
  onComplete: () => void;
  userName?: string;
  className?: string;
  duration?: number;
}

const PostLoginTransition: React.FC<PostLoginTransitionProps> = ({
  show,
  onComplete,
  userName,
  className,
  duration = 3000,
}) => {
  const [progress, setProgress] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const { user } = useAuth();
  
  const displayName = userName || user?.name || 'à EmotionsCare';
  
  useEffect(() => {
    if (!show) return;
    
    let timer: ReturnType<typeof setTimeout>;
    let interval: ReturnType<typeof setInterval>;
    
    // Start progress animation
    const startTime = Date.now();
    const endTime = startTime + duration;
    
    interval = setInterval(() => {
      const now = Date.now();
      const newProgress = Math.min(((now - startTime) / duration) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress >= 40 && !showWelcome) {
        setShowWelcome(true);
      }
      
      if (newProgress >= 100) {
        clearInterval(interval);
        // Allow user to see the completed state briefly before completing
        timer = setTimeout(() => {
          onComplete();
        }, 500);
      }
    }, 50);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [show, duration, onComplete, showWelcome]);
  
  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background",
            className
          )}
        >
          {/* Background gradients */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-primary/5 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-primary/5 to-transparent"></div>
            <motion.div
              className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/5 filter blur-3xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center px-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8"
            >
              <div className="rounded-full bg-primary/10 p-5 w-24 h-24 flex items-center justify-center">
                <Check className="h-12 w-12 text-primary" />
              </div>
            </motion.div>
            
            <AnimatePresence mode="wait">
              {!showWelcome ? (
                <motion.div
                  key="connecting"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="space-y-2"
                >
                  <h2 className="text-2xl font-bold text-foreground">Connexion réussie</h2>
                  <p className="text-muted-foreground">
                    Préparation de votre espace personnel...
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="welcome"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="space-y-3"
                >
                  <h2 className="text-3xl font-bold text-foreground">
                    Bienvenue {displayName.split(' ')[0]} !
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-md">
                    Votre espace personnel est prêt. Nous sommes heureux de vous retrouver.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Progress bar */}
            <motion.div
              className="w-64 h-1 bg-muted mt-8 rounded-full overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="h-full bg-primary"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeInOut" }}
              />
            </motion.div>
          </div>
          
          {/* Animated decoration elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div aria-hidden="true" className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-primary/10"
                  style={{
                    width: Math.random() * 100 + 50,
                    height: Math.random() * 100 + 50,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0.1, 0.3, 0.1],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 5 + Math.random() * 3,
                    delay: i * 0.3,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PostLoginTransition;
