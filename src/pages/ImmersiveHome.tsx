
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUserMode } from '@/contexts/UserModeContext';
import { trackEvent, trackPageView } from '@/utils/analytics';
import { logModeSelection } from '@/utils/modeSelectionLogger';
import { getModeLabel } from '@/utils/userModeHelpers';
import { ROUTES } from '@/types/navigation';
import { Mic, MicOff, Volume, VolumeX, Moon, Sun, Globe } from 'lucide-react';
import '@/styles/immersive-home.css';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

// Whisper service mock (replace with actual implementation)
const mockWhisperService = {
  startListening: () => new Promise<string>(resolve => {
    setTimeout(() => {
      resolve("particulier");
    }, 2000);
  })
};

const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();
  const { setUserMode } = useUserMode();
  const [greeting, setGreeting] = useState('Bienvenue sur EmotionsCare');
  const [subGreeting, setSubGreeting] = useState('Votre espace d\'harmonie émotionnelle');
  const [isListening, setIsListening] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [language, setLanguage] = useState<'fr'|'en'>('fr');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Get time of day for dynamic content
  const getTimeOfDay = () => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) return 'morning';
    if (hours >= 12 && hours < 18) return 'afternoon';
    if (hours >= 18 && hours < 22) return 'evening';
    return 'night';
  };
  
  const timeOfDay = getTimeOfDay();

  // Dynamic greetings based on time
  useEffect(() => {
    const messages = {
      morning: {
        fr: 'Bonjour et bienvenue sur EmotionsCare',
        en: 'Good morning and welcome to EmotionsCare'
      },
      afternoon: {
        fr: 'Bon après-midi et bienvenue sur EmotionsCare',
        en: 'Good afternoon and welcome to EmotionsCare'
      },
      evening: {
        fr: 'Bonsoir et bienvenue sur EmotionsCare',
        en: 'Good evening and welcome to EmotionsCare'
      },
      night: {
        fr: 'Bonne soirée et bienvenue sur EmotionsCare',
        en: 'Good evening and welcome to EmotionsCare'
      }
    };
    
    const subMessages = {
      morning: {
        fr: 'Démarrez votre journée en douceur',
        en: 'Start your day with calmness'
      },
      afternoon: {
        fr: 'Prenez un moment pour vous ressourcer',
        en: 'Take a moment to recharge'
      },
      evening: {
        fr: 'Retrouvez votre équilibre émotionnel',
        en: 'Find your emotional balance'
      },
      night: {
        fr: 'Un espace de tranquillité avant votre repos',
        en: 'A space of tranquility before your rest'
      }
    };
    
    setGreeting(messages[timeOfDay][language]);
    setSubGreeting(subMessages[timeOfDay][language]);
  }, [timeOfDay, language]);
  
  // Track page view
  useEffect(() => {
    trackPageView({ title: 'Immersive Home', path: '/' });
  }, []);
  
  // Initialize ambient audio
  useEffect(() => {
    audioRef.current = new Audio('/sounds/ambient-calm.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.2;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);
  
  // Toggle audio
  const toggleAudio = () => {
    if (!audioRef.current) return;
    
    if (isMuted) {
      audioRef.current.play()
        .catch(err => {
          console.error('Audio play error:', err);
          toast.error('Le navigateur a bloqué l\'audio. Cliquez à nouveau pour réessayer.');
        });
    } else {
      audioRef.current.pause();
    }
    
    setIsMuted(!isMuted);
    
    // Haptic feedback on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };
  
  // Toggle theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    
    // Haptic feedback on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };
  
  // Toggle language
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'fr' ? 'en' : 'fr');
    
    // Haptic feedback on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };
  
  // Handle user mode selection
  // Always redirect users to the appropriate login page so that
  // the dashboard cannot be reached without authentication.
  const handleModeSelect = (mode: 'b2c' | 'b2b-user' | 'b2b-admin') => {
    // Haptic feedback on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
    
    // Play sound effect
    const selectSound = new Audio('/sounds/click.mp3');
    selectSound.volume = 0.3;
    selectSound.play().catch(e => console.log('Could not play sound effect'));
    
    // Set user mode
    setUserMode(mode);
    logModeSelection(mode);
    trackEvent('Mode Selected', { properties: { mode } });
    
    // Show success toast
    toast.success(
      language === 'fr' 
        ? `Mode ${getModeLabel(mode)} sélectionné` 
        : `${getModeLabel(mode)} mode selected`
    );
    
    // Navigate based on mode
    // Always redirect to the corresponding login screen
    setTimeout(() => {
      switch (mode) {
        case 'b2b-admin':
          navigate(ROUTES.b2bAdmin.login);
          break;
        case 'b2b-user':
          navigate(ROUTES.b2bUser.login);
          break;
        case 'b2c':
          navigate(ROUTES.b2c.login);
          break;
      }
    }, 600);
  };
  
  // Handle voice command
  const handleVoiceCommand = async () => {
    setIsListening(true);
    
    try {
      const transcript = await mockWhisperService.startListening();
      
      // Process the transcript
      const lowerTranscript = transcript.toLowerCase();
      
      if (lowerTranscript.includes('particulier') || lowerTranscript.includes('personal')) {
        handleModeSelect('b2c');
      } else if (lowerTranscript.includes('entreprise') || lowerTranscript.includes('business') || lowerTranscript.includes('collaborateur')) {
        handleModeSelect('b2b-user');
      } else if (lowerTranscript.includes('admin') || lowerTranscript.includes('rh')) {
        handleModeSelect('b2b-admin');
      } else {
        toast.info('Commande non reconnue. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Voice command error:', error);
      toast.error('Impossible d\'accéder au microphone. Veuillez vérifier vos permissions.');
    } finally {
      setIsListening(false);
    }
  };

  return (
    <div className={`immersive-container ${isDarkMode ? 'dark' : ''} bg-${timeOfDay}`}>
      {/* Animated Background */}
      <div className="particles-container" aria-hidden="true">
        <div className="ambient-circle primary" style={{
          width: '40%',
          height: '40%',
          top: '10%',
          left: '10%',
          opacity: 0.3
        }}></div>
        <div className="ambient-circle accent" style={{
          width: '50%',
          height: '50%',
          bottom: '5%',
          right: '15%',
          opacity: 0.2
        }}></div>
      </div>
      
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-8 left-0 right-0 flex justify-center"
      >
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-white font-bold">EC</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            EmotionsCare
          </span>
        </div>
      </motion.div>
      
      {/* Controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute top-8 right-8 flex gap-3"
      >
        <button
          onClick={toggleTheme}
          className="control-button"
          aria-label={isDarkMode ? "Activer le mode clair" : "Activer le mode sombre"}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          onClick={toggleAudio}
          className="control-button"
          aria-label={isMuted ? "Activer la musique" : "Désactiver la musique"}
        >
          {isMuted ? <Volume size={18} /> : <VolumeX size={18} />}
        </button>
        <button
          onClick={toggleLanguage}
          className="control-button"
          aria-label="Changer de langue"
        >
          <Globe size={18} />
        </button>
      </motion.div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-screen text-center z-10">
        <motion.h1 
          className="premium-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {greeting}
        </motion.h1>
        
        <motion.p
          className="premium-subtitle mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {subGreeting}
        </motion.p>
        
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <Button 
              onClick={() => handleModeSelect('b2c')}
              className="premium-button primary w-full h-20 text-xl font-medium"
            >
              {language === 'fr' ? 'Je suis un particulier' : 'I am an individual'}
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <Button 
              onClick={() => handleModeSelect('b2b-user')}
              className="premium-button accent w-full h-20 text-xl font-medium"
            >
              {language === 'fr' ? 'Je suis une entreprise' : 'I am a business'}
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Voice Command Button */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <button
            onClick={handleVoiceCommand}
            disabled={isListening}
            className={`flex items-center gap-2 premium-button secondary px-6 py-3 ${isListening ? 'voice-active' : ''}`}
            aria-label="Commande vocale"
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            <span>{isListening 
              ? (language === 'fr' ? 'Écoute en cours...' : 'Listening...') 
              : (language === 'fr' ? 'Commande vocale' : 'Voice command')}
            </span>
          </button>
        </motion.div>
        
        {/* Inspirational Quote */}
        <motion.div
          className="absolute bottom-8 left-0 right-0 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <p className="text-sm text-text-main opacity-80">
            {language === 'fr' 
              ? 'Votre bien-être émotionnel commence ici' 
              : 'Your emotional well-being starts here'}
          </p>
        </motion.div>
      </div>
      
      {/* Music Visualizer (only when playing) */}
      {!isMuted && (
        <div className="absolute bottom-4 left-4 flex items-end gap-1 h-8 w-20">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="music-visualizer-bar w-2 rounded-t-sm bg-primary"
              style={{
                height: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImmersiveHome;
