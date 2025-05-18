
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, User, Building, Mic, Volume2, VolumeX, Moon, Sun } from 'lucide-react';
import Shell from '@/components/Shell';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import useVoiceCommands from '@/hooks/useVoiceCommands';

const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();
  const { theme, isDarkMode, setTheme, soundEnabled = false, setSoundEnabled = () => {} } = useTheme();
  const { toast } = useToast();
  const [greeting, setGreeting] = useState<string>('Bienvenue dans votre espace de bien-être émotionnel');
  const { isListening, toggleListening, processCommand } = useVoiceCommands();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);

  // Générer un accueil selon l'heure du jour
  useEffect(() => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      setGreeting("Bienvenue dans votre espace de reconnexion émotionnelle matinale");
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Votre espace premium pour le bien-être émotionnel quotidien");
    } else if (hour >= 18 && hour < 22) {
      setGreeting("Votre refuge émotionnel pour une soirée apaisante");
    } else {
      setGreeting("Votre havre de paix émotionnel nocturne");
    }

    // Animation d'entrée
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  // Gestion de l'audio
  const initializeAudio = () => {
    if (!isAudioInitialized) {
      try {
        audioRef.current = new Audio('/sounds/ambient.mp3');
        if (audioRef.current) {
          audioRef.current.volume = 0.2;
          audioRef.current.loop = true;
          
          if (soundEnabled) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
              playPromise.catch(error => {
                console.info("Lecture audio automatique bloquée", error);
              });
            }
          }
        }
        setIsAudioInitialized(true);
      } catch (error) {
        console.error("Erreur d'initialisation audio:", error);
      }
    }
  };
  
  useEffect(() => {
    // Initialiser l'audio au chargement
    initializeAudio();
    
    // Nettoyer à la démonter du composant
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Mettre à jour l'état de l'audio quand soundEnabled change
  useEffect(() => {
    if (audioRef.current) {
      if (soundEnabled) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [soundEnabled]);

  const handlePersonalClick = () => {
    // Vibration tactile pour mobile
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    localStorage.setItem('userMode', 'b2c');
    navigate('/b2c/login');
  };

  const handleBusinessClick = () => {
    // Vibration tactile pour mobile
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    navigate('/b2b/selection');
  };

  const handleVoiceCommand = () => {
    toggleListening();
  };

  // Fonction exécutée lorsqu'une commande vocale est détectée
  useEffect(() => {
    const handleCommand = (command: string) => {
      if (!command) return;
      
      processCommand(
        command,
        {
          'particulier': handlePersonalClick,
          'personnel': handlePersonalClick,
          'individuel': handlePersonalClick,
          'entreprise': handleBusinessClick,
          'société': handleBusinessClick,
          'professionnel': handleBusinessClick,
          'business': handleBusinessClick,
          'son': () => setSoundEnabled(!soundEnabled),
          'musique': () => setSoundEnabled(!soundEnabled),
          'audio': () => setSoundEnabled(!soundEnabled),
          'sombre': () => setTheme('dark'),
          'nuit': () => setTheme('dark'),
          'clair': () => setTheme('light'),
          'jour': () => setTheme('light'),
        },
        () => {
          toast({
            title: "Commande non reconnue",
            description: "Essayez 'particulier', 'entreprise', 'musique' ou 'mode sombre'"
          });
        }
      );
    };
  }, [navigate, processCommand, setSoundEnabled, setTheme, soundEnabled, toast]);

  const toggleSound = () => {
    if (typeof setSoundEnabled === 'function') {
      setSoundEnabled(!soundEnabled);
    }
  };
  
  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  // Variantes d'animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.8
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <Shell hideNav immersive>
      {/* Fond animé */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-950 dark:to-indigo-900 transition-colors duration-700" />
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 2 }}
          className="absolute top-0 right-0 w-full h-full"
        >
          <div className="absolute top-[10%] left-[10%] w-[50vh] h-[50vh] rounded-full bg-gradient-to-tr from-blue-200/40 to-transparent blur-3xl dark:from-blue-400/10" />
          <div className="absolute bottom-[10%] right-[10%] w-[60vh] h-[60vh] rounded-full bg-gradient-to-br from-purple-200/40 to-transparent blur-3xl dark:from-purple-500/10" />
        </motion.div>
        
        {/* Particules animées */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.5, duration: 2 }}
        >
          <div className="particles-container">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white dark:bg-blue-300/20"
                style={{
                  width: Math.random() * 4 + 2 + 'px',
                  height: Math.random() * 4 + 2 + 'px',
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, Math.random() * -30 - 10],
                  opacity: [0.7, 0.1],
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 md:px-8">
        {/* Contrôles en haut à droite */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full text-primary hover:bg-primary/10 backdrop-blur-sm bg-white/10 dark:bg-slate-900/20"
            onClick={toggleTheme}
            title={isDarkMode ? "Passer en mode clair" : "Passer en mode sombre"}
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full text-primary hover:bg-primary/10 backdrop-blur-sm bg-white/10 dark:bg-slate-900/20"
            onClick={toggleSound}
            title={soundEnabled ? "Désactiver le son" : "Activer le son"}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </div>
        
        {/* Conteneur principal avec l'animation de fade-in */}
        <AnimatePresence>
          {isLoaded && (
            <motion.div 
              className="z-10 max-w-6xl mx-auto text-center relative"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="mb-12 text-center">
                <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-400 dark:to-blue-300 tracking-tight">
                  EmotionsCare
                </h1>
                <p className="text-xl md:text-2xl text-blue-700 dark:text-blue-300 max-w-3xl mx-auto font-light">
                  {greeting}
                </p>
              </motion.div>
              
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center mt-12 space-y-4 sm:space-y-0 sm:space-x-6 relative">
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 group"
                  onClick={handlePersonalClick}
                >
                  <User className="mr-2 h-5 w-5" />
                  Espace Personnel
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-blue-400 dark:border-blue-700 bg-white/80 dark:bg-blue-950/50 backdrop-blur-sm hover:bg-blue-50 dark:hover:bg-blue-900/80 text-blue-700 dark:text-blue-300 px-8 py-6 text-lg rounded-2xl shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1 group"
                  onClick={handleBusinessClick}
                >
                  <Building className="mr-2 h-5 w-5" />
                  Espace Entreprise
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </motion.div>
              
              <motion.div variants={itemVariants} className="mt-16">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`text-blue-600 dark:text-blue-400 
                    hover:bg-blue-100/50 dark:hover:bg-blue-900/50 rounded-full p-3
                    ${isListening ? 'animate-pulse ring-2 ring-blue-400 dark:ring-blue-600' : ''}`}
                  onClick={handleVoiceCommand}
                  title="Commande vocale"
                  disabled={isListening}
                >
                  <Mic className={`h-5 w-5 ${isListening ? 'text-red-500' : ''}`} />
                  <span className="sr-only">Commande vocale</span>
                </Button>
              </motion.div>
              
              <motion.div variants={itemVariants} className="mt-24 text-blue-600/60 dark:text-blue-400/60 text-sm">
                <p>Découvrez <span className="text-blue-600 dark:text-blue-400 font-medium">SocialCocon</span> - Votre communauté dédiée au bien-être</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Shell>
  );
};

export default ImmersiveHome;
