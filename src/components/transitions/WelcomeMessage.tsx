
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useUserModeHelpers } from '@/hooks/useUserModeHelpers';

interface WelcomeMessageProps {
  onComplete?: () => void;
  className?: string;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ 
  onComplete,
  className = ''
}) => {
  const [visible, setVisible] = useState(true);
  const { user } = useAuth();
  const { getModeName } = useUserModeHelpers();
  const [greetingMessage, setGreetingMessage] = useState('');
  
  useEffect(() => {
    const hour = new Date().getHours();
    let greeting = '';
    
    if (hour < 12) {
      greeting = 'Bonjour';
    } else if (hour < 18) {
      greeting = 'Bon après-midi';
    } else {
      greeting = 'Bonsoir';
    }
    
    const name = user?.name || '';
    setGreetingMessage(`${greeting}${name ? ` ${name}` : ''}`);
    
    // Hide after 3 seconds
    const timer = setTimeout(() => {
      setVisible(false);
      // Call onComplete after animation (0.5s)
      setTimeout(() => {
        onComplete && onComplete();
      }, 500);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [user, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-md z-50 ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <motion.h2 
              className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {greetingMessage}
            </motion.h2>
            
            <motion.p
              className="text-xl text-foreground/80"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              Bienvenue dans votre espace {getModeName()}
            </motion.p>
            
            <motion.div
              className="mt-8 flex justify-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1, type: 'spring', stiffness: 200 }}
            >
              <div className="h-2 w-2 bg-blue-600 rounded-full mx-1 animate-pulse" style={{ animationDelay: '0s' }} />
              <div className="h-2 w-2 bg-blue-500 rounded-full mx-1 animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="h-2 w-2 bg-blue-400 rounded-full mx-1 animate-pulse" style={{ animationDelay: '0.4s' }} />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeMessage;
