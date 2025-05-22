
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

interface PostLoginTransitionProps {
  show: boolean;
  onComplete: () => void;
  userName?: string;
}

const PostLoginTransition: React.FC<PostLoginTransitionProps> = ({
  show,
  onComplete,
  userName
}) => {
  const [step, setStep] = useState<'success' | 'welcome' | 'loading'>('success');
  
  useEffect(() => {
    if (!show) return;
    
    // First step: Success animation
    const successTimer = setTimeout(() => {
      setStep('welcome');
      
      // Second step: Welcome message
      const welcomeTimer = setTimeout(() => {
        setStep('loading');
        
        // Third step: Loading animation, then complete
        const loadingTimer = setTimeout(() => {
          onComplete();
        }, 1500);
        
        return () => clearTimeout(loadingTimer);
      }, 1200);
      
      return () => clearTimeout(welcomeTimer);
    }, 1000);
    
    return () => clearTimeout(successTimer);
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
        >
          <div className="max-w-md w-full px-4">
            <AnimatePresence mode="wait">
              {step === 'success' && (
                <motion.div 
                  className="flex flex-col items-center text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                    className="rounded-full bg-green-100 dark:bg-green-900/30 p-4 mb-4"
                  >
                    <Check className="h-12 w-12 text-green-600 dark:text-green-400" />
                  </motion.div>
                  
                  <motion.h3 
                    className="text-2xl font-medium mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Connexion réussie
                  </motion.h3>
                </motion.div>
              )}
              
              {step === 'welcome' && (
                <motion.div 
                  className="flex flex-col items-center text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.h3 
                    className="text-2xl font-medium mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {userName 
                      ? `Bienvenue, ${userName}!`
                      : "Bienvenue sur EmotionsCare!"}
                  </motion.h3>
                  
                  <motion.p
                    className="text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Nous préparons votre espace personnel...
                  </motion.p>
                </motion.div>
              )}
              
              {step === 'loading' && (
                <motion.div 
                  className="flex flex-col items-center text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div
                    className="relative h-16 w-16 mb-6"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  >
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                    <div className="absolute inset-0 rounded-full border-4 border-t-primary border-transparent" />
                  </motion.div>
                  
                  <motion.h3 
                    className="text-xl font-medium mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    Chargement en cours
                  </motion.h3>
                  
                  <motion.div 
                    className="w-full h-2 bg-primary/20 rounded-full overflow-hidden mt-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.div 
                      className="h-full bg-primary"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                  </motion.div>
                  
                  <motion.p
                    className="text-sm text-muted-foreground mt-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Préparation de votre tableau de bord personnalisé...
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PostLoginTransition;
