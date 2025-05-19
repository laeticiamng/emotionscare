
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { WelcomeMessage } from '@/components/home/WelcomeMessage';
import useVoiceCommands from '@/hooks/useVoiceCommands';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';
import '@/styles/immersive-home.css';

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="absolute top-4 right-4 flex gap-2 z-10">
      <button 
        onClick={() => setTheme('light')} 
        className={`control-button ${theme === 'light' ? 'active' : ''}`}
        aria-label="Activer le thème clair"
      >
        ☀️
      </button>
      <button 
        onClick={() => setTheme('dark')} 
        className={`control-button ${theme === 'dark' ? 'active' : ''}`}
        aria-label="Activer le thème sombre"
      >
        🌙
      </button>
      <button 
        onClick={() => setTheme('pastel')} 
        className={`control-button ${theme === 'pastel' ? 'active' : ''}`}
        aria-label="Activer le thème pastel"
      >
        🌈
      </button>
    </div>
  );
};

const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();
  const [soundEnabled, setSoundEnabled] = useState(false);
  const { isListening, toggleListening, supported } = useVoiceCommands({
    commands: {
      'particulier': () => navigate('/b2c/login'),
      'entreprise': () => navigate('/b2b/selection'),
      'administrateur': () => navigate('/b2b/admin/login'),
      'collaborateur': () => navigate('/b2b/user/login'),
      'je suis particulier': () => navigate('/b2c/login'),
      'je suis une entreprise': () => navigate('/b2b/selection'),
      'je suis un particulier': () => navigate('/b2c/login')
    },
    onTranscript: (text) => {
      toast.info(`Commande vocale reconnue: "${text}"`, {
        position: 'top-center',
        duration: 3000
      });
    }
  });

  const { theme } = useTheme();
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Animation mounting effect
    setMounted(true);
    
    // Preload login pages for faster transitions
    const preloadRoutes = ['/b2c/login', '/b2b/selection'];
    preloadRoutes.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });
    
    // Ambient sound setup (commented out as it requires audio files)
    // if (soundEnabled) {
    //   const ambientSound = new Audio('/sounds/ambient-calm.mp3');
    //   ambientSound.volume = 0.3;
    //   ambientSound.loop = true;
    //   ambientSound.play().catch(e => console.warn('Autoplay prevented:', e));
    //   
    //   return () => {
    //     ambientSound.pause();
    //     ambientSound.currentTime = 0;
    //   };
    // }
  }, [soundEnabled]);
  
  const handleB2CClick = () => {
    toast.success("Redirection vers l'espace particulier", {
      position: 'top-center',
      duration: 2000
    });
    
    setTimeout(() => {
      navigate('/b2c/login');
    }, 300);
  };
  
  const handleB2BClick = () => {
    toast.success("Redirection vers l'espace entreprise", {
      position: 'top-center',
      duration: 2000
    });
    
    setTimeout(() => {
      navigate('/b2b/selection');
    }, 300);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };
  
  return (
    <AnimatePresence>
      <div className={`immersive-container ${theme}`}>
        {/* Background animated elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 2 }}
            className="absolute w-96 h-96 ambient-circle primary top-0 left-1/4 -translate-y-1/2"
          />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="absolute w-80 h-80 ambient-circle accent bottom-0 right-1/4 translate-y-1/2"
          />
        </div>
        
        {/* Theme selector */}
        <ThemeSelector />
        
        {/* Sound & Voice controls */}
        <div className="absolute top-4 left-4 flex gap-3 z-10">
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="control-button"
            aria-label={soundEnabled ? "Désactiver le son" : "Activer le son"}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          
          {supported && (
            <button 
              onClick={toggleListening}
              className={`control-button ${isListening ? 'voice-active' : ''}`}
              aria-label={isListening ? "Arrêter la commande vocale" : "Activer la commande vocale"}
            >
              {isListening ? <Mic size={18} color="var(--primary)" /> : <MicOff size={18} />}
            </button>
          )}
        </div>
        
        {/* Main content */}
        <motion.div 
          className="relative z-10 w-full max-w-4xl mx-auto text-center px-4"
          variants={containerVariants}
          initial="hidden"
          animate={mounted ? "visible" : "hidden"}
        >
          <motion.h1 
            className="premium-title"
            variants={itemVariants}
          >
            Bienvenue sur EmotionsCare
          </motion.h1>
          
          <motion.div 
            className="premium-subtitle mb-8"
            variants={itemVariants}
          >
            <WelcomeMessage className="text-lg md:text-xl text-center mb-2" />
            <p className="mt-4 opacity-80">Choisissez votre mode d'accès</p>
          </motion.div>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
            variants={itemVariants}
          >
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1"
            >
              <button
                onClick={handleB2CClick}
                className="premium-button primary w-full p-6 rounded-2xl text-lg font-semibold"
                aria-label="Accès particulier"
              >
                Je suis un particulier
              </button>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1"
            >
              <button
                onClick={handleB2BClick}
                className="premium-button secondary w-full p-6 rounded-2xl text-lg font-semibold"
                aria-label="Accès entreprise"
              >
                Je suis une entreprise
              </button>
            </motion.div>
          </motion.div>
          
          <motion.p 
            className="text-center text-sm opacity-70 max-w-xl mx-auto"
            variants={itemVariants}
          >
            "Vous êtes au bon endroit pour prendre soin de vos émotions et développer votre intelligence émotionnelle."
          </motion.p>
          
          {isListening && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mt-6 p-3 bg-primary/10 rounded-xl inline-flex items-center"
            >
              <Mic className="mr-2" size={18} />
              <span>Dites "Je suis un particulier" ou "Je suis une entreprise"...</span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ImmersiveHome;
