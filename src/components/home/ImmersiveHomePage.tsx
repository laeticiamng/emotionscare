// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Music, Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '@/providers/theme';
import '@/styles/immersive-home.css';
import { VoiceCommandButton } from './voice/VoiceCommandButton';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

const ImmersiveHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, isDarkMode } = useTheme();
  const [listening, setListening] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    logger.info('ImmersiveHomePage component mounted', null, 'UI');
    
    // Audio background
    const audio = new Audio('/sounds/ambient-calm.mp3');
    audio.loop = true;
    audio.volume = 0.2;
    setAudioElement(audio);
    
    // Animation de particules
    const createParticle = () => {
      if (!document.getElementById('particles-container')) return;
      
      const particle = document.createElement('div');
      particle.className = 'absolute bg-primary/20 rounded-full';
      
      // Taille et position aléatoires
      const size = Math.random() * 8 + 4;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.opacity = '0';
      
      document.getElementById('particles-container')?.appendChild(particle);
      
      // Animation
      setTimeout(() => {
        particle.style.transition = 'all 8s ease-in-out';
        particle.style.opacity = '0.5';
        particle.style.transform = `translateY(-${100 + Math.random() * 100}px)`;
      }, 10);
      
      // Suppression après animation
      setTimeout(() => {
        particle?.remove();
      }, 8000);
    };
    
    const particleInterval = setInterval(createParticle, 500);
    
    return () => {
      clearInterval(particleInterval);
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
    };
  }, []);
  
  const toggleVoiceCommand = () => {
    setListening(!listening);
    // Simuler une notification de commande vocale
    if (!listening) {
      toast({
        title: "Commandes vocales activées",
        description: "Je vous écoute..."
      });
      
      setTimeout(() => {
        // En situation réelle, vous utiliseriez un système de reconnaissance vocale ici
        const command = "Afficher le mode B2C";
        toast({
          title: "Commande détectée",
          description: command,
        });
        
        // Simuler une redirection basée sur la commande
        if (command.toLowerCase().includes('b2c')) {
          navigate('/b2c/dashboard');
        }
        
        setListening(false);
      }, 2000);
    }
  };
  
  const toggleAudio = () => {
    if (audioElement) {
      if (audioEnabled) {
        audioElement.pause();
        toast({
          title: "Son désactivé",
          description: "Musique d'ambiance désactivée"
        });
      } else {
        audioElement.play().catch(error => {
          logger.error('Audio playback failed', error, 'UI');
          toast({
            title: "Erreur audio",
            description: "Impossible de lire la musique d'ambiance",
            variant: "destructive"
          });
        });
        toast({
          title: "Son activé",
          description: "Musique d'ambiance activée"
        });
      }
      setAudioEnabled(!audioEnabled);
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.95 }
  };

  // Commandes vocales avec redirection
  const voiceCommands = {
    "mode personnel": () => navigate('/b2c/dashboard'),
    "mode entreprise": () => navigate('/b2b/selection'),
    "je suis un particulier": () => navigate('/b2c/login'),
    "je suis une entreprise": () => navigate('/b2b/selection')
  };

  return (
    <div className={`immersive-container ${theme}`}>
      {/* Arrière-plan animé */}
      <div id="particles-container" className="particles-container">
        <div className="ambient-circle primary w-96 h-96 top-1/4 -left-48"></div>
        <div className="ambient-circle accent w-96 h-96 bottom-1/4 -right-48"></div>
      </div>
      
      {/* Conteneur principal avec animation */}
      <motion.div
        className="relative z-10 w-full max-w-4xl mx-auto px-4 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h1 className="premium-title">EmotionsCare</h1>
          <p className="premium-subtitle mb-8">
            Plateforme de bien-être émotionnel intelligente pour particuliers et entreprises
          </p>
        </motion.div>

        <motion.div 
          className="flex flex-col md:flex-row gap-4 justify-center mb-16"
          variants={itemVariants}
        >
          <motion.button
            className="premium-button primary"
            onClick={() => navigate('/b2c/dashboard')}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            aria-label="Accéder au mode personnel"
          >
            Mode Personnel
          </motion.button>
          
          <motion.button
            className="premium-button secondary"
            onClick={() => navigate('/b2b/selection')}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            aria-label="Accéder au mode entreprise"
          >
            Mode Entreprise
          </motion.button>
        </motion.div>
        
        <motion.div
          className="mt-8 space-y-2 text-sm text-center opacity-70"
          variants={itemVariants}
        >
          <p>Naviguez avec la voix ou commandes clavier</p>
          <div className="flex justify-center gap-4 mt-2">
            <button 
              onClick={toggleVoiceCommand}
              className={`control-button ${listening ? 'voice-active' : ''}`}
              aria-label="Activer les commandes vocales"
            >
              {listening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </button>
            <button 
              onClick={toggleAudio} 
              className={`control-button ${audioEnabled ? 'active' : ''}`}
              aria-label="Activer la musique d'ambiance"
            >
              {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
          </div>
        </motion.div>
        
        {/* Composant de commande vocale avancé */}
        <motion.div
          className="mt-6"
          variants={itemVariants}
        >
          <VoiceCommandButton 
            commands={voiceCommands}
            onTranscript={(text) => logger.debug('Voice transcript received', { text }, 'UI')} 
          />
        </motion.div>
        
        {/* Version responsive avec indicateur de keyboard navigation */}
        <motion.div 
          className="mt-12 text-xs text-muted-foreground"
          variants={itemVariants}
        >
          <p>
            Touche <kbd className="px-2 py-1 rounded bg-muted">Tab</kbd> pour naviguer, 
            <kbd className="px-2 py-1 rounded bg-muted ml-1">Entrée</kbd> pour sélectionner
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ImmersiveHomePage;
