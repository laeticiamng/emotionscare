
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Smile, User } from 'lucide-react';

interface PostLoginTransitionProps {
  show: boolean;
  onComplete: () => void;
  userName?: string;
}

const PostLoginTransition: React.FC<PostLoginTransitionProps> = ({
  show,
  onComplete,
  userName,
}) => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (!show) return;
    
    // First step: Show success message
    const timer1 = setTimeout(() => setStep(1), 800);
    
    // Second step: Welcome message
    const timer2 = setTimeout(() => setStep(2), 1800);
    
    // Final step: Loading dashboard
    const timer3 = setTimeout(() => {
      setStep(3);
      // Start progress bar animation
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 2;
          if (newProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => onComplete(), 200);
            return 100;
          }
          return newProgress;
        });
      }, 20);
    }, 3000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [show, onComplete]);
  
  if (!show) return null;
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-500/95 to-purple-600/95 backdrop-blur-md"
        >
          <div className="text-center text-white max-w-md w-full px-6">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="success"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.2, opacity: 0 }}
                  transition={{ duration: 0.4, type: "spring" }}
                >
                  <motion.div 
                    className="mx-auto mb-6 h-20 w-20 rounded-full bg-white/20 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  >
                    <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center">
                      <CheckCircle2 className="h-10 w-10 text-blue-600" />
                    </div>
                  </motion.div>
                  <h2 className="text-2xl font-bold mb-2">Connexion réussie!</h2>
                  <p className="text-white/80">Votre espace est en cours de préparation...</p>
                </motion.div>
              )}
              
              {step === 1 && (
                <motion.div
                  key="welcome"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.2, opacity: 0 }}
                  transition={{ duration: 0.4, type: "spring" }}
                >
                  <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-white/20 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center">
                      {userName ? (
                        <User className="h-10 w-10 text-blue-600" />
                      ) : (
                        <Smile className="h-10 w-10 text-blue-600" />
                      )}
                    </div>
                  </div>
                  <motion.h2 
                    className="text-2xl font-bold mb-2"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Bienvenue{userName ? `, ${userName}` : ' dans votre espace'}
                  </motion.h2>
                  <motion.p 
                    className="text-white/80"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Nous sommes ravis de vous revoir
                  </motion.p>
                </motion.div>
              )}
              
              {step === 2 && (
                <motion.div
                  key="preparation"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.2, opacity: 0 }}
                  transition={{ duration: 0.4, type: "spring" }}
                  className="flex flex-col items-center"
                >
                  <h2 className="text-2xl font-bold mb-6">Préparation de votre espace...</h2>
                  
                  <div className="w-full flex items-center mb-2 text-sm">
                    <span className="text-white/80 mr-2">
                      {progress < 30 && "Chargement de vos données personnelles"}
                      {progress >= 30 && progress < 60 && "Configuration de vos modules"}
                      {progress >= 60 && progress < 90 && "Préparation de vos recommandations"}
                      {progress >= 90 && "Finalisation de votre tableau de bord"}
                    </span>
                    <span className="ml-auto text-white/80">{Math.min(progress, 100)}%</span>
                  </div>
                  
                  <div className="relative w-full h-2 bg-white/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="absolute top-0 left-0 h-full bg-white rounded-full"
                    />
                  </div>
                </motion.div>
              )}
              
              {step === 3 && (
                <motion.div
                  key="ready"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.4, type: "spring" }}
                  className="flex flex-col items-center"
                >
                  <h2 className="text-2xl font-bold mb-2">Votre espace est prêt!</h2>
                  <motion.div 
                    className="mt-4"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: 1, duration: 0.6 }}
                  >
                    <div className="relative w-full h-2 bg-white/30 rounded-full overflow-hidden">
                      <div className="absolute top-0 left-0 h-full bg-white rounded-full w-full" />
                    </div>
                  </motion.div>
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
