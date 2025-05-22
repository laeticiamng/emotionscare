
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface PostLoginTransitionProps {
  show: boolean;
  onComplete: () => void;
}

const PostLoginTransition: React.FC<PostLoginTransitionProps> = ({ 
  show, 
  onComplete,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userName = user?.name || 'chez EmotionsCare';

  useEffect(() => {
    if (!show) return;
    
    const timer = setTimeout(() => {
      navigate('/b2c/dashboard');
      onComplete();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [show, navigate, onComplete]);
  
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
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="flex flex-col items-center"
          >
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Connexion réussie</h2>
            <p className="text-muted-foreground mb-4">Bienvenue {userName}</p>
            
            <div className="mt-4 w-full">
              <motion.div
                className="w-full h-1 bg-primary/20 overflow-hidden rounded-full"
              >
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3 }}
                />
              </motion.div>
              <div className="flex items-center justify-center mt-4">
                <Loader2 className="h-5 w-5 text-primary animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">Chargement de votre espace personnel...</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PostLoginTransition;
