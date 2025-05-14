
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, Building, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import useVoiceCommand from '@/hooks/useVoiceCommand';
import useSound from '@/hooks/useSound';
import { cn } from '@/lib/utils';

const ImmersiveHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [greeting, setGreeting] = useState('Bienvenue dans votre espace de bien-être émotionnel.');
  const [backgroundState, setBackgroundState] = useState('morning');
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Available ambient music tracks
  const ambientTracks = {
    morning: '/audio/ambient-morning.mp3',
    afternoon: '/audio/ambient-afternoon.mp3',
    evening: '/audio/ambient-evening.mp3'
  };

  // Voice command setup
  const { isListening, toggleListening, isSupported, executeCommand } = useVoiceCommand({
    commands: {
      "particulier": () => navigateToPersonal(),
      "personnel": () => navigateToPersonal(),
      "entreprise": () => navigateToCompany(),
      "rh": () => navigateToAdminLogin(),
      "manager": () => navigateToAdminLogin(),
      "collaborateur": () => navigateToUserLogin()
    }
  });

  // Handle navigation
  const navigateToPersonal = () => {
    toast({
      title: "Redirection en cours...",
      description: "Vers l'espace personnel"
    });
    navigate('/b2c/login');
  };

  const navigateToCompany = () => {
    toast({
      title: "Redirection en cours...",
      description: "Vers l'espace entreprise"
    });
    navigate('/b2b/selection');
  };
  
  const navigateToAdminLogin = () => {
    navigate('/b2b/admin/login');
  };
  
  const navigateToUserLogin = () => {
    navigate('/b2b/user/login');
  };

  // Preload the next route
  const preloadRoute = (route: string) => {
    setHoveredRoute(route);
    // In a real implementation, this could use a more advanced preloading strategy
    console.log(`Preloading route: ${route}`);
  };

  // Background based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    let timeOfDay: 'morning' | 'afternoon' | 'evening';
    let timeBasedGreeting: string;

    if (hour >= 5 && hour < 12) {
      timeOfDay = 'morning';
      timeBasedGreeting = 'Bonjour. Commencez votre journée dans la sérénité.';
    } else if (hour >= 12 && hour < 18) {
      timeOfDay = 'afternoon';
      timeBasedGreeting = 'Bon après-midi. Prenez un moment pour vous reconnecter.';
    } else {
      timeOfDay = 'evening';
      timeBasedGreeting = 'Bonsoir. Laissez les tensions de la journée s'apaiser.';
    }

    setBackgroundState(timeOfDay);
    setGreeting(timeBasedGreeting);

    // Initialize audio
    if (!audioRef.current) {
      audioRef.current = new Audio(ambientTracks[timeOfDay]);
      audioRef.current.volume = 0.3;
      audioRef.current.loop = true;
    }
    
    // Add haptic feedback for mobile
    const enableHapticFeedback = () => {
      if ('vibrate' in navigator) {
        document.querySelectorAll('button').forEach(button => {
          button.addEventListener('click', () => {
            navigator.vibrate(10); // Short, gentle vibration
          });
        });
      }
    };
    
    enableHapticFeedback();
    
    return () => {
      // Cleanup audio on unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  // Toggle audio playback
  const toggleAudio = () => {
    if (!audioRef.current) return;
    
    if (audioEnabled) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => {
        console.log('Audio autoplay prevented:', e);
        toast({
          title: "Lecture audio bloquée",
          description: "Veuillez interagir avec la page pour activer le son"
        });
      });
    }
    
    setAudioEnabled(!audioEnabled);
  };

  // Visual styles based on time of day
  const getBackgroundStyle = () => {
    switch (backgroundState) {
      case 'morning':
        return 'bg-gradient-to-br from-blue-50 via-orange-50 to-blue-100 dark:from-blue-900/20 dark:via-orange-900/10 dark:to-blue-900/30';
      case 'afternoon':
        return 'bg-gradient-to-br from-blue-50 via-emerald-50 to-blue-100 dark:from-blue-900/20 dark:via-emerald-900/10 dark:to-blue-900/30';
      case 'evening':
        return 'bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-blue-900/30 dark:from-indigo-950 dark:via-purple-950 dark:to-blue-950';
      default:
        return 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden transition-all duration-1000 ${getBackgroundStyle()}`}>
      {/* Ambient animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: [0.1, 0.2, 0.1], 
            scale: [0.8, 1.1, 0.8],
            x: ['-10%', '5%', '-10%'],
            y: ['-10%', '5%', '-10%']
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          className="absolute -top-[30%] -left-[20%] w-[80%] h-[80%] rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: [0.1, 0.15, 0.1], 
            scale: [0.8, 1.2, 0.8],
            x: ['10%', '-5%', '10%'],
            y: ['20%', '5%', '20%']
          }}
          transition={{ duration: 25, repeat: Infinity, repeatType: "reverse", delay: 1 }}
          className="absolute -bottom-[50%] -right-[20%] w-[90%] h-[90%] rounded-full bg-gradient-to-r from-secondary/10 to-primary/10 blur-3xl"
        />
      </div>

      <div className="container max-w-6xl z-10 relative">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            EmotionsCare
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            {greeting}
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            onHoverStart={() => preloadRoute('/b2c/login')}
            className="relative"
          >
            <Button 
              onClick={navigateToPersonal}
              size="lg" 
              className="w-full py-10 text-lg shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary/20 bg-gradient-to-r from-primary/90 to-primary/80"
            >
              <User className="mr-3 h-6 w-6" /> Je suis un particulier
            </Button>
            {hoveredRoute === '/b2c/login' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute -bottom-8 left-0 right-0 text-center text-sm text-muted-foreground"
              >
                Préchargement en cours...
              </motion.div>
            )}
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            onHoverStart={() => preloadRoute('/b2b/selection')}
            className="relative"
          >
            <Button 
              onClick={navigateToCompany}
              variant="outline" 
              size="lg"
              className="w-full py-10 text-lg shadow border-2 border-secondary/50 hover:border-secondary/80 hover:shadow-xl transition-all duration-300"
            >
              <Building className="mr-3 h-6 w-6" /> Je suis une entreprise
            </Button>
            {hoveredRoute === '/b2b/selection' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute -bottom-8 left-0 right-0 text-center text-sm text-muted-foreground"
              >
                Préchargement en cours...
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Emotional climate indicator */}
        <motion.div 
          className="mt-16 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <p>Aujourd'hui, 82% des utilisateurs se sentent calmes</p>
        </motion.div>

        <motion.div 
          className="flex justify-center gap-4 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Button 
            variant="ghost" 
            size="sm"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            onClick={toggleListening}
            disabled={!isSupported}
            title={isSupported ? "Activer les commandes vocales" : "Commandes vocales non supportées"}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {isListening ? "Désactiver les commandes vocales" : "Activer les commandes vocales"}
          </Button>

          <Button 
            variant="ghost" 
            size="sm"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            onClick={toggleAudio}
          >
            {audioEnabled ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            {audioEnabled ? "Désactiver la musique" : "Activer la musique"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ImmersiveHomePage;
