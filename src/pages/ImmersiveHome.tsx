
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion, useAnimation } from 'framer-motion';
import { 
  User, 
  Building, 
  Mic, 
  MicOff, 
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Palette
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TimeOfDay, determineTimeOfDay, DEFAULT_WELCOME_MESSAGES } from '@/constants/defaults';
import { useUserMode } from '@/contexts/UserModeContext';
import { useTheme } from '@/components/theme/ThemeProvider';
import { EmotionMoodPicker } from '@/components/emotion/EmotionMoodPicker';
import { useMusic } from '@/contexts/MusicContext';

import '../styles/immersive-home.css';

const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUserMode } = useUserMode();
  const { theme, setTheme } = useTheme();
  const { setOpenDrawer, volume, setVolume, togglePlay, loadPlaylistForEmotion } = useMusic();
  
  const [isListening, setIsListening] = useState(false);
  const [backgroundState, setBackgroundState] = useState<TimeOfDay>(determineTimeOfDay());
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);

  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  // Set background based on time of day and generate welcome message
  useEffect(() => {
    setBackgroundState(determineTimeOfDay());
    
    const generateWelcomeMessage = async () => {
      setIsLoading(true);
      try {
        // In a production environment, this would call the OpenAI API
        const timeOfDay = determineTimeOfDay();
        const messages = DEFAULT_WELCOME_MESSAGES[timeOfDay];
        
        setWelcomeMessage(messages[Math.floor(Math.random() * messages.length)]);
      } catch (error) {
        console.error('Error generating welcome message:', error);
        setWelcomeMessage("Bienvenue dans votre espace de bien-être émotionnel");
      } finally {
        setIsLoading(false);
        setShowAnimation(true);
      }
    };
    
    generateWelcomeMessage();
    
    // Start animation sequence
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    });
    
    // Apply theme based on time of day for a seamless experience
    if (theme === 'system') {
      const hour = new Date().getHours();
      if (hour >= 20 || hour < 7) {
        setTheme('dark');
      } else {
        setTheme('pastel');
      }
    }
    
    // Event listener for mouse movement to animate orbs
    const handleMouseMove = (e: MouseEvent) => {
      if (!orb1Ref.current || !orb2Ref.current) return;
      
      const { clientX, clientY } = e;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Calculate movement based on mouse position
      const moveX1 = clientX / windowWidth - 0.5;
      const moveY1 = clientY / windowHeight - 0.5;
      const moveX2 = clientX / windowWidth - 0.5;
      const moveY2 = clientY / windowHeight - 0.5;
      
      // Apply subtle movement to orbs
      orb1Ref.current.style.transform = `translate(${moveX1 * 20}px, ${moveY1 * 20}px)`;
      orb2Ref.current.style.transform = `translate(${moveX2 * -20}px, ${moveY2 * -20}px)`;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [setTheme, theme, controls]);

  const handlePersonalAccess = () => {
    setUserMode('b2c');
    localStorage.setItem('userMode', 'b2c');
    navigate('/b2c/login');
  };

  const handleBusinessAccess = () => {
    navigate('/b2b/selection');
  };

  const toggleVoiceRecognition = () => {
    if (isListening) {
      setIsListening(false);
      toast({
        title: "Commandes vocales désactivées",
        description: "Le microphone est maintenant éteint",
      });
    } else {
      setIsListening(true);
      toast({
        title: "Commandes vocales activées",
        description: "Dites 'Je suis un particulier' ou 'Je suis une entreprise'",
      });
      
      // Simulate voice recognition after 3 seconds
      // In a production environment, this would use the Whisper API
      setTimeout(() => {
        setIsListening(false);
        toast({
          title: "Commande reconnue",
          description: "Redirection en cours...",
        });
        // Simulate recognized command
        setTimeout(() => handlePersonalAccess(), 1000);
      }, 3000);
    }
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    if (!audioEnabled) {
      // Start playing ambient music
      loadPlaylistForEmotion("calm").then(playlist => {
        if (playlist) {
          setOpenDrawer(true);
          togglePlay();
          setVolume(0.3);
          
          toast({
            title: "Musique activée",
            description: "Ambiance sonore générée par IA"
          });
        }
      });
    } else {
      setVolume(0);
      toast({
        title: "Musique désactivée",
      });
    }
  };

  const handleMoodSelected = (mood: string) => {
    setSelectedMood(mood);
    toast({
      title: `Humeur ${mood} sélectionnée`,
      description: "Interface adaptée à votre humeur"
    });
    
    // Load appropriate music based on mood
    loadPlaylistForEmotion(mood);
  };

  // Theme toggler function
  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('pastel');
    else setTheme('light');
  };

  // Get current theme icon
  const getThemeIcon = () => {
    switch (theme) {
      case 'dark': return <Moon size={18} />;
      case 'pastel': return <Palette size={18} />;
      default: return <Sun size={18} />;
    }
  };

  return (
    <div 
      className={`min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden transition-colors duration-1000 bg-${backgroundState.toLowerCase()}`}
    >
      {/* Theme and audio controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleAudio} 
          className="rounded-full bg-white/10 backdrop-blur-sm"
        >
          {audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={cycleTheme} 
          className="rounded-full bg-white/10 backdrop-blur-sm"
        >
          {getThemeIcon()}
        </Button>
      </div>

      {/* Premium 3D ambient animations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          ref={orb1Ref}
          className="absolute top-[-30%] left-[-20%] w-[80%] h-[80%] rounded-full opacity-20 bg-gradient-to-r from-blue-400 to-blue-300 blur-3xl transition-transform duration-300 ease-out"
        />
        <div
          ref={orb2Ref}
          className="absolute bottom-[-50%] right-[-20%] w-[90%] h-[90%] rounded-full opacity-20 bg-gradient-to-r from-blue-200 to-blue-400 blur-3xl transition-transform duration-300 ease-out"
        />
        
        {/* Dynamic floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-white/30"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
            />
          ))}
        </div>
      </div>

      <div className="container max-w-6xl z-10 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 premium-text-gradient">
            EmotionsCare
          </h1>
          <p className="text-xl max-w-3xl mx-auto font-light">
            {isLoading ? "Chargement..." : welcomeMessage}
          </p>
        </motion.div>

        {/* Mood picker with premium animation */}
        {showAnimation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-10"
          >
            <h2 className="text-center text-lg mb-4 font-medium">Comment vous sentez-vous aujourd'hui ?</h2>
            <EmotionMoodPicker onSelect={handleMoodSelected} selected={selectedMood} />
          </motion.div>
        )}

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {/* Particular user card */}
          <motion.div 
            className="card-3d glass border-blue-200/30 hover:border-blue-300/50 shadow-xl backdrop-blur-sm bg-white/80 dark:bg-gray-900/70 p-8 rounded-2xl flex flex-col items-center text-center space-y-6"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <User className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Particulier</h2>
              <p className="text-muted-foreground mb-6 font-light">
                Accédez à votre espace personnel de bien-être émotionnel
              </p>
            </div>
            <Button 
              onClick={handlePersonalAccess} 
              size="lg" 
              className="w-full py-6 text-lg apple-button hover-float"
            >
              <User className="mr-2 h-5 w-5" /> Espace Personnel
            </Button>
          </motion.div>

          {/* Business user card */}
          <motion.div 
            className="card-3d glass border-blue-200/30 hover:border-blue-300/50 shadow-xl backdrop-blur-sm bg-white/80 dark:bg-gray-900/70 p-8 rounded-2xl flex flex-col items-center text-center space-y-6"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <Building className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Entreprise</h2>
              <p className="text-muted-foreground mb-6 font-light">
                Solutions pour votre organisation et vos collaborateurs
              </p>
            </div>
            <Button 
              onClick={handleBusinessAccess} 
              variant="outline" 
              size="lg"
              className="w-full py-6 text-lg border-2 border-indigo-300/70 hover:border-indigo-400 hover-float"
            >
              <Building className="mr-2 h-5 w-5" /> Espace Entreprise
            </Button>
          </motion.div>
        </motion.div>

        <motion.div 
          className="flex justify-center mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Button 
            variant="ghost" 
            size="sm"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground glass px-4 py-2 rounded-full"
            onClick={toggleVoiceRecognition}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {isListening ? "Désactiver les commandes vocales" : "Activer les commandes vocales"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ImmersiveHome;
