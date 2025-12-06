import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '@/providers/theme';
import '@/styles/immersive-home.css';
import { VoiceCommandButton } from './voice/VoiceCommandButton';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

const MAX_PARTICLES = 20;

const ImmersiveHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [listening, setListening] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const particleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const particlesRef = useRef<Set<HTMLDivElement>>(new Set());
  const { toast } = useToast();

  // Cleanup function for particles
  const cleanupParticles = useCallback(() => {
    particlesRef.current.forEach(particle => {
      particle.remove();
    });
    particlesRef.current.clear();
  }, []);

  // Create particle with proper cleanup
  const createParticle = useCallback(() => {
    const container = document.getElementById('particles-container');
    if (!container) return;

    // Limit number of particles to prevent memory leak
    if (particlesRef.current.size >= MAX_PARTICLES) {
      // Remove oldest particle
      const firstParticle = particlesRef.current.values().next().value;
      if (firstParticle) {
        firstParticle.remove();
        particlesRef.current.delete(firstParticle);
      }
    }

    const particle = document.createElement('div');
    particle.className = 'absolute bg-primary/20 rounded-full pointer-events-none';

    // Random size and position
    const size = Math.random() * 8 + 4;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.opacity = '0';

    container.appendChild(particle);
    particlesRef.current.add(particle);

    // Animation
    requestAnimationFrame(() => {
      particle.style.transition = 'all 8s ease-in-out';
      particle.style.opacity = '0.5';
      particle.style.transform = `translateY(-${100 + Math.random() * 100}px)`;
    });

    // Auto cleanup after animation
    setTimeout(() => {
      particle.remove();
      particlesRef.current.delete(particle);
    }, 8000);
  }, []);

  // Initialize audio and particles
  useEffect(() => {
    logger.info('ImmersiveHomePage component mounted', null, 'UI');

    // Initialize audio
    const audio = new Audio('/sounds/ambient-calm.mp3');
    audio.loop = true;
    audio.volume = 0.2;
    audio.preload = 'metadata';
    audioRef.current = audio;

    // Start particle animation
    particleIntervalRef.current = setInterval(createParticle, 500);

    // Cleanup function
    return () => {
      // Clear particle interval
      if (particleIntervalRef.current) {
        clearInterval(particleIntervalRef.current);
        particleIntervalRef.current = null;
      }

      // Cleanup all particles
      cleanupParticles();

      // Cleanup audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }

      logger.info('ImmersiveHomePage component unmounted', null, 'UI');
    };
  }, [createParticle, cleanupParticles]);

  const toggleVoiceCommand = useCallback(() => {
    setListening(prev => !prev);

    if (!listening) {
      toast({
        title: "Commandes vocales activées",
        description: "Je vous écoute..."
      });

      // Simulate voice command detection
      setTimeout(() => {
        const command = "Afficher le mode B2C";
        toast({
          title: "Commande détectée",
          description: command,
        });

        // Simulate redirection based on command
        if (command.toLowerCase().includes('b2c')) {
          navigate('/app/consumer/home');
        }

        setListening(false);
      }, 2000);
    }
  }, [listening, navigate, toast]);

  const toggleAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audioEnabled) {
      audio.pause();
      toast({
        title: "Son désactivé",
        description: "Musique d'ambiance désactivée"
      });
    } else {
      audio.play().catch(error => {
        logger.error('Audio playback failed', error as Error, 'UI');
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

    setAudioEnabled(prev => !prev);
  }, [audioEnabled, toast]);

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

  // Voice commands with navigation
  const voiceCommands: Record<string, () => void> = {
    "mode personnel": () => navigate('/app/consumer/home'),
    "mode entreprise": () => navigate('/entreprise'),
    "je suis un particulier": () => navigate('/login?segment=b2c'),
    "je suis une entreprise": () => navigate('/entreprise')
  };

  return (
    <div className={`immersive-container ${theme}`}>
      {/* Animated background */}
      <div id="particles-container" className="particles-container">
        <div className="ambient-circle primary w-96 h-96 top-1/4 -left-48"></div>
        <div className="ambient-circle accent w-96 h-96 bottom-1/4 -right-48"></div>
      </div>

      {/* Main container with animation */}
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
            onClick={() => navigate('/app/consumer/home')}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            aria-label="Accéder au mode personnel"
          >
            Mode Personnel
          </motion.button>

          <motion.button
            className="premium-button secondary"
            onClick={() => navigate('/entreprise')}
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
              type="button"
            >
              {listening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </button>
            <button
              onClick={toggleAudio}
              className={`control-button ${audioEnabled ? 'active' : ''}`}
              aria-label="Activer la musique d'ambiance"
              type="button"
            >
              {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
          </div>
        </motion.div>

        {/* Advanced voice command component */}
        <motion.div
          className="mt-6"
          variants={itemVariants}
        >
          <VoiceCommandButton
            commands={voiceCommands}
            onTranscript={(text) => logger.debug('Voice transcript received', { text }, 'UI')}
          />
        </motion.div>

        {/* Keyboard navigation indicator */}
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
