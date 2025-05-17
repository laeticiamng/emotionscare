
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, User, Building, Mic, Volume2, VolumeX } from 'lucide-react';
import Shell from '@/Shell';
import ParticlesBackground from '@/components/three/ParticlesBackground';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();
  const { theme, isDarkMode, soundEnabled, setSoundEnabled } = useTheme();
  const { toast } = useToast();
  const [greeting, setGreeting] = useState<string>('Bienvenue dans votre espace de bien-être émotionnel');
  const [isListening, setIsListening] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    
    // Charger et lire la musique d'ambiance si activée
    if (soundEnabled) {
      audioRef.current = new Audio('/sounds/ambient.mp3');
      audioRef.current.volume = 0.2;
      audioRef.current.loop = true;
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Auto-play a été bloqué - normal sur de nombreux navigateurs
          console.info("Lecture audio automatique bloquée", error);
        });
      }
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
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
    // Vérifier si le navigateur supporte la reconnaissance vocale
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsListening(true);
      
      // @ts-ignore - WebkitSpeechRecognition might not be in the types
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'fr-FR';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        setIsListening(true);
        toast({
          title: "Commande vocale activée",
          description: "Dites 'particulier' ou 'entreprise' pour naviguer"
        });
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        
        if (transcript.includes('particulier') || 
            transcript.includes('personnel') || 
            transcript.includes('individuel')) {
          handlePersonalClick();
        } else if (transcript.includes('entreprise') || 
                  transcript.includes('business') || 
                  transcript.includes('professionnel') ||
                  transcript.includes('société')) {
          handleBusinessClick();
        }
        
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
        toast({
          title: "Erreur",
          description: "Impossible d'activer la reconnaissance vocale",
          variant: "destructive"
        });
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      toast({
        title: "Non supporté",
        description: "La reconnaissance vocale n'est pas supportée par votre navigateur",
        variant: "destructive"
      });
    }
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    
    if (soundEnabled) {
      // Arrêter le son
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      // Activer le son
      if (audioRef.current) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current = new Audio('/sounds/ambient.mp3');
        audioRef.current.volume = 0.2;
        audioRef.current.loop = true;
        audioRef.current.play().catch(console.error);
      }
    }
  };

  return (
    <Shell hideNav>
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Fond animé 3D */}
        <ParticlesBackground />
        
        {/* Gradient de fond adapté au thème */}
        <div 
          className={`absolute inset-0 -z-20 
            ${theme === 'light' 
              ? 'bg-gradient-to-br from-blue-50 to-white' 
              : theme === 'dark' 
                ? 'bg-gradient-to-br from-gray-900 to-blue-950' 
                : 'bg-gradient-to-br from-blue-50 to-blue-100'
            }`}
        />
        
        <div className="z-10 px-4 max-w-6xl mx-auto text-center relative">
          {/* Contrôle du volume */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 text-primary hover:bg-primary/10 rounded-full"
            onClick={toggleSound}
            title={soundEnabled ? "Désactiver le son" : "Activer le son"}
          >
            {soundEnabled ? <Volume2 /> : <VolumeX />}
          </Button>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-400 dark:to-blue-300 tracking-tight">
              EmotionsCare
            </h1>
            <p className="text-xl md:text-2xl text-blue-700 dark:text-blue-300 max-w-3xl mx-auto font-light">
              {greeting}
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center mt-12 space-y-4 sm:space-y-0 sm:space-x-6 relative"
          >
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"
              onClick={handlePersonalClick}
            >
              <User className="mr-2 h-5 w-5" />
              Espace Personnel
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-blue-400 dark:border-blue-700 bg-white/80 dark:bg-blue-950/50 backdrop-blur-sm hover:bg-blue-50 dark:hover:bg-blue-900/80 text-blue-700 dark:text-blue-300 px-8 py-6 text-lg rounded-2xl shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1"
              onClick={handleBusinessClick}
            >
              <Building className="mr-2 h-5 w-5" />
              Espace Entreprise
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16"
          >
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
              <Mic className="h-5 w-5" />
              <span className="sr-only">Commande vocale</span>
            </Button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-24 text-blue-600/60 dark:text-blue-400/60 text-sm"
          >
            <p>Découvrez <span className="text-blue-600 dark:text-blue-400 font-medium">SocialCocon</span> - Votre communauté dédiée au bien-être</p>
          </motion.div>
        </div>
      </div>
    </Shell>
  );
};

export default ImmersiveHome;
