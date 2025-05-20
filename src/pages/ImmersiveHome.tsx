
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUserMode } from '@/contexts/UserModeContext';
import { usePreferences } from '@/contexts/PreferencesContext';
import { logModeSelection } from '@/utils/modeSelectionLogger';
import { useAnalyticsConsent } from '@/hooks/useAnalyticsConsent';
import { useAI } from '@/hooks/useAI';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import '../styles/immersive-home.css';

const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();
  const { setUserMode } = useUserMode();
  const [greeting, setGreeting] = useState('');
  const [typedGreeting, setTypedGreeting] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasIntersected, setHasIntersected] = useState(false);
  const analyticsConsent = useAnalyticsConsent();
  const ai = useAI();

  useEffect(() => {
    ai.musicgenV1('calm background music');
  }, [ai]);

  // Animation variants
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
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  // Generate time-based greeting
  useEffect(() => {
    const generateGreeting = () => {
      const hour = new Date().getHours();
      let baseGreeting = '';
      
      if (hour >= 5 && hour < 12) {
        baseGreeting = "Bonjour et bienvenue sur EmotionsCare.";
      } else if (hour >= 12 && hour < 18) {
        baseGreeting = "Belle journée pour prendre soin de vos émotions.";
      } else {
        baseGreeting = "Bonsoir. Entrez dans votre espace d'harmonie émotionnelle.";
      }
      
      const greetings = [
        baseGreeting,
        "Découvrez votre équilibre émotionnel avec EmotionsCare.",
        "Votre bien-être émotionnel est notre priorité.",
        "Un espace pour vous reconnecter à vos émotions.",
        "Prenez un moment pour vous, ici et maintenant."
      ];
      
      return greetings[Math.floor(Math.random() * greetings.length)];
    };

    setGreeting(generateGreeting());
  }, []);

  // Typewriter effect for greeting
  useEffect(() => {
    if (!greeting) return;
    
    let index = 0;
    const timer = setInterval(() => {
      setTypedGreeting(greeting.substring(0, index));
      index++;
      
      if (index > greeting.length) {
        clearInterval(timer);
      }
    }, 50);
    
    return () => clearInterval(timer);
  }, [greeting]);

  // Handle voice command
  const toggleVoiceCommand = () => {
    if (!isListening) {
      startVoiceRecognition();
    } else {
      stopVoiceRecognition();
    }
  };

  const startVoiceRecognition = () => {
    setIsListening(true);
    
    // Check if browser supports SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error("Speech recognition not supported");
      setIsListening(false);
      return;
    }
    
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'fr-FR';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        console.log("Voice recognition started");
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log("Voice command:", transcript);
        
        // Process voice commands
        if (transcript.includes("particulier") || transcript.includes("personnel")) {
          handleModeSelection('b2c');
        } else if (transcript.includes("entreprise") || transcript.includes("business")) {
          handleModeSelection('b2b-user');
        } else if (transcript.includes("rh") || transcript.includes("administration")) {
          handleModeSelection('b2b-admin');
        }
      };
      
      recognition.onerror = (event) => {
        console.error("Voice recognition error:", event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } catch (error) {
      console.error("Error starting voice recognition:", error);
      setIsListening(false);
    }
  };

  const stopVoiceRecognition = () => {
    setIsListening(false);
  };

  // Toggle background music
  const toggleMusicMute = () => {
    setIsMuted(!isMuted);
    // Logic to play/pause background music would go here
  };

  // Handle mode selection
  const handleModeSelection = (mode: 'b2c' | 'b2b-user' | 'b2b-admin') => {
    setUserMode(mode);
    
    // Log the selection if analytics consent is given
    if (analyticsConsent) {
      logModeSelection(mode);
    }
    
    // Navigate to the dedicated login page
    switch(mode) {
      case 'b2b-admin':
        navigate('/b2b/admin/login');
        break;
      case 'b2b-user':
        navigate('/b2b/user/login');
        break;
      default:
        navigate('/b2c/login');
        break;
    }
  };

  return (
    <div className="immersive-container min-h-screen w-full bg-gradient-to-br from-blue-50/40 to-indigo-50/40 dark:from-blue-950/40 dark:to-indigo-950/40 overflow-hidden flex flex-col items-center justify-center relative z-0">
      {/* Ambient background elements */}
      <div className="absolute inset-0 overflow-hidden z-[-1]">
        <motion.div 
          className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-200/20 dark:bg-blue-400/5 blur-[80px]"
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-200/20 dark:bg-indigo-400/5 blur-[80px]"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Content container */}
      <motion.div 
        className="max-w-3xl w-full px-6 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo and title */}
        <motion.div 
          className="mb-12 text-center"
          variants={itemVariants}
        >
          <div className="mx-auto w-20 h-20 mb-6 relative">
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-80 dark:from-blue-500 dark:to-indigo-600"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl">
              EC
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            EmotionsCare
          </h1>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center mb-4"
          >
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {typedGreeting || "\u00A0"}
            </p>
          </motion.div>
        </motion.div>

        {/* Mode selection */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={itemVariants}
        >
          <motion.div
            whileHover={{ scale: 1.03, y: -5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="aspect-square md:aspect-auto"
          >
            <Button
              onClick={() => handleModeSelection('b2c')}
              className="w-full h-full min-h-[150px] bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-500 dark:hover:to-blue-600 text-white text-xl rounded-3xl shadow-lg hover:shadow-xl transition-all border border-blue-400/20 dark:border-blue-500/20 group relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ opacity: 1 }}
                animate={{ opacity: [0, 0.03, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <span className="z-10">Je suis un particulier</span>
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.03, y: -5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="aspect-square md:aspect-auto"
          >
            <Button
              onClick={() => navigate('/b2b/selection')}
              className="w-full h-full min-h-[150px] bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 dark:from-indigo-600 dark:to-indigo-700 dark:hover:from-indigo-500 dark:hover:to-indigo-600 text-white text-xl rounded-3xl shadow-lg hover:shadow-xl transition-all border border-indigo-400/20 dark:border-indigo-500/20 group relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ opacity: 1 }}
                animate={{ opacity: [0, 0.03, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <span className="z-10">Je suis une entreprise</span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Voice command suggestion */}
        <motion.div 
          className="mt-8 text-center text-gray-600 dark:text-gray-400 text-sm"
          variants={itemVariants}
        >
          <p>Vous pouvez aussi utiliser une commande vocale</p>
        </motion.div>

        {/* Control buttons */}
        <motion.div 
          className="mt-6 flex justify-center gap-4"
          variants={itemVariants}
        >
          {/* Voice command button */}
          <motion.button
            onClick={toggleVoiceCommand}
            className={`p-4 rounded-full ${isListening 
              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'} 
              hover:bg-opacity-90 transition-all relative`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isListening ? <MicOff size={24} /> : <Mic size={24} />}
            
            {isListening && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-red-400 dark:border-red-500"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </motion.button>
          
          {/* Audio control button */}
          <motion.button
            onClick={toggleMusicMute}
            className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-opacity-90 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </motion.button>
        </motion.div>

        {/* Inspirational footer message */}
        <motion.div 
          className="mt-16 text-center text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <p className="italic">Votre bien-être émotionnel commence ici</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ImmersiveHome;
