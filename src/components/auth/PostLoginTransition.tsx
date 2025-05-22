
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';

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
  const [stage, setStage] = useState<'success' | 'welcome' | 'loading'>('success');
  
  useEffect(() => {
    if (!show) return;
    
    // Séquence d'animation en plusieurs étapes
    const successTimer = setTimeout(() => {
      setStage('welcome');
      
      const welcomeTimer = setTimeout(() => {
        setStage('loading');
        
        const loadingTimer = setTimeout(() => {
          onComplete();
        }, 1800);
        
        return () => clearTimeout(loadingTimer);
      }, 1500);
      
      return () => clearTimeout(welcomeTimer);
    }, 1000);
    
    return () => clearTimeout(successTimer);
  }, [show, onComplete]);
  
  if (!show) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
      >
        <div className="max-w-sm w-full flex flex-col items-center text-center p-6">
          <AnimatePresence mode="wait">
            {stage === 'success' && (
              <motion.div
                key="success"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="flex flex-col items-center"
              >
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Connexion réussie</h2>
                <p className="text-muted-foreground">Vous êtes bien connecté à votre compte</p>
              </motion.div>
            )}
            
            {stage === 'welcome' && (
              <motion.div
                key="welcome"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="flex flex-col items-center"
              >
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="rounded-full border-4 border-primary/30 border-t-primary h-12 w-12"
                  />
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  Bienvenue {userName ? userName : 'sur EmotionsCare'}
                </h2>
                <p className="text-muted-foreground">Nous préparons votre espace personnel</p>
              </motion.div>
            )}
            
            {stage === 'loading' && (
              <motion.div
                key="loading"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="flex flex-col items-center"
              >
                <div className="relative h-16 w-16 mb-4">
                  <motion.div 
                    className="absolute inset-0 rounded-full border-4 border-primary/20"
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <Loader2 className="h-16 w-16 text-primary animate-spin" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Chargement de votre espace</h2>
                <p className="text-muted-foreground">
                  Préparation de vos modules personnalisés...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PostLoginTransition;
