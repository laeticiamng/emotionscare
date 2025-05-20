
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, Moon, Sun, Mic, MicOff, Languages } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { logModeSelection } from '@/utils/modeSelectionLogger';
import { Button } from '@/components/ui/button';
import '../styles/immersive-home.css';

const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();
  const { setTheme, theme, isDarkMode, toggleTheme } = useTheme();
  const { setUserMode } = useUserMode();
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [micActive, setMicActive] = useState<boolean>(false);
  const [greeting, setGreeting] = useState<string>('');
  const [inspirationalQuote, setInspirationalQuote] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Get greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    let newGreeting = '';
    
    if (hour >= 5 && hour < 12) {
      newGreeting = language === 'fr' ? 'Bonjour' : 'Good morning';
    } else if (hour >= 12 && hour < 18) {
      newGreeting = language === 'fr' ? 'Bon après-midi' : 'Good afternoon';
    } else {
      newGreeting = language === 'fr' ? 'Bonsoir' : 'Good evening';
    }
    
    setGreeting(newGreeting);
  }, [language]);
  
  // Set inspirational quote
  useEffect(() => {
    const quotes = language === 'fr' 
      ? [
          "Prenez soin de vos émotions, elles sont le reflet de votre âme.",
          "Chaque émotion est une opportunité de mieux vous comprendre.",
          "La conscience de soi commence par l'écoute de ses émotions.",
          "Vos émotions ne sont pas des faiblesses, mais des guides.",
          "Accueillir ses émotions, c'est s'ouvrir à la guérison."
        ]
      : [
          "Take care of your emotions, they reflect your soul.",
          "Each emotion is an opportunity to understand yourself better.",
          "Self-awareness begins with listening to your emotions.",
          "Your emotions are not weaknesses, but guides.",
          "Welcoming your emotions is opening yourself to healing."
        ];
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setInspirationalQuote(randomQuote);
  }, [language]);
  
  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/sounds/ambient-calm.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      clearTimeout(timer);
    };
  }, []);
  
  // Handle audio toggle
  const toggleAudio = () => {
    if (audioRef.current) {
      if (audioEnabled) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.error("Audio play error:", err));
      }
      setAudioEnabled(!audioEnabled);
    }
  };
  
  // Handle microphone toggle
  const toggleMic = () => {
    setMicActive(!micActive);
    // In a full implementation, this would activate voice recognition
    // For now, we'll just toggle the state for UI feedback
  };
  
  // Handle mode selection
  const handleModeSelection = (mode: 'b2c' | 'b2b') => {
    setUserMode(mode);
    logModeSelection(mode);
    localStorage.setItem('userMode', mode);
    
    // Navigate based on selected mode
    if (mode === 'b2c') {
      navigate('/b2c/login');
    } else {
      navigate('/b2b/selection');
    }
  };
  
  // Toggle language
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'fr' ? 'en' : 'fr');
  };
  
  // Background style based on time of day
  const getTimeBasedBackground = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return 'bg-morning';
    } else if (hour >= 12 && hour < 18) {
      return 'bg-afternoon';
    } else if (hour >= 18 && hour < 22) {
      return 'bg-evening';
    } else {
      return 'bg-night';
    }
  };
  
  // Render loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div 
            className="w-20 h-20 rounded-full border-4 border-primary border-t-transparent mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
          <motion.h1 
            className="text-2xl font-semibold text-primary"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            EmotionsCare
          </motion.h1>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen ${getTimeBasedBackground()} transition-all duration-1000`}>
      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="ambient-circle primary w-[40vw] h-[40vw] top-[20%] left-[10%] opacity-20"></div>
        <div className="ambient-circle accent w-[30vw] h-[30vw] bottom-[15%] right-[5%] opacity-20"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
        {/* Logo and Controls Header */}
        <motion.div 
          className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 md:p-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Logo */}
          <div className="flex items-center">
            <motion.div 
              className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center"
              whileHover={{ rotate: 10, scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-white font-bold text-sm">EC</span>
            </motion.div>
            <span className="ml-2 text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              EmotionsCare
            </span>
          </div>
          
          {/* Controls */}
          <div className="flex items-center space-x-3">
            {/* Audio toggle */}
            <motion.button 
              className="control-button"
              onClick={toggleAudio}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={audioEnabled ? "Désactiver l'audio" : "Activer l'audio"}
            >
              {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </motion.button>
            
            {/* Theme toggle */}
            <motion.button 
              className="control-button"
              onClick={toggleTheme}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isDarkMode ? "Mode clair" : "Mode sombre"}
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </motion.button>
            
            {/* Mic toggle */}
            <motion.button 
              className={`control-button ${micActive ? 'voice-active' : ''}`}
              onClick={toggleMic}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={micActive ? "Désactiver le microphone" : "Activer le microphone"}
            >
              {micActive ? <Mic size={16} /> : <MicOff size={16} />}
            </motion.button>
            
            {/* Language toggle */}
            <motion.button 
              className="control-button"
              onClick={toggleLanguage}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Changer de langue"
            >
              <Languages size={16} />
              <span className="sr-only">{language === 'fr' ? 'Switch to English' : 'Passer en français'}</span>
            </motion.button>
          </div>
        </motion.div>
        
        {/* Main hero section */}
        <motion.div 
          className="max-w-3xl mx-auto text-center pt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.h1 
            className="premium-title mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {greeting}
          </motion.h1>
          
          <motion.p 
            className="premium-subtitle mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {inspirationalQuote}
          </motion.p>
          
          {/* Mode selection */}
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Button
              onClick={() => handleModeSelection('b2c')}
              className="premium-button primary text-lg py-6 px-8 rounded-2xl shadow-lg hover:-translate-y-1 transition-all bg-gradient-to-r from-blue-600 to-indigo-600"
              aria-label={language === 'fr' ? "Je suis un particulier" : "I am an individual"}
            >
              {language === 'fr' ? "Je suis un particulier" : "I am an individual"}
            </Button>
            
            <Button
              onClick={() => handleModeSelection('b2b')}
              className="premium-button secondary text-lg py-6 px-8 rounded-2xl bg-white/10 backdrop-blur border border-white/20 shadow-lg hover:-translate-y-1 transition-all"
              variant="outline"
              aria-label={language === 'fr' ? "Je suis une entreprise" : "I am a company"}
            >
              {language === 'fr' ? "Je suis une entreprise" : "I am a company"}
            </Button>
          </motion.div>
          
          <motion.p
            className="text-center text-sm md:text-base text-blue-600/80 dark:text-blue-400/80 max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            {language === 'fr' 
              ? "Vous êtes au bon endroit pour prendre soin de vos émotions"
              : "You're in the right place to take care of your emotions"}
          </motion.p>
        </motion.div>
        
        {/* GDPR notice */}
        <motion.div 
          className="absolute bottom-4 left-0 right-0 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          <div className="bg-white/30 dark:bg-black/20 backdrop-blur-md px-4 py-2 rounded-full text-xs text-center">
            {language === 'fr' 
              ? "Nous respectons votre vie privée."
              : "We respect your privacy."} 
            <button 
              className="ml-1 text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded"
              onClick={() => {/* Open GDPR modal in full implementation */}}
            >
              {language === 'fr' ? "En savoir plus" : "Learn more"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ImmersiveHome;
