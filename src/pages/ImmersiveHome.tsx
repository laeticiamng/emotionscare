
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  User, 
  Building, 
  Mic, 
  MicOff, 
  Music, 
  Volume2,
  VolumeX
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TimeOfDay, determineTimeOfDay } from '@/constants/defaults';
import { useUserMode } from '@/contexts/UserModeContext';
import { useTheme } from '@/hooks/use-theme';
import { EmotionMoodPicker } from '@/components/emotion/EmotionMoodPicker';
import { MusicPlayer } from '@/components/audio/MusicPlayer';
import { Card, CardContent } from '@/components/ui/card';

const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUserMode } = useUserMode();
  const { theme, setTheme } = useTheme();
  
  const [isListening, setIsListening] = useState(false);
  const [backgroundState, setBackgroundState] = useState<TimeOfDay>(determineTimeOfDay());
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Set background based on time of day and generate welcome message
  useEffect(() => {
    setBackgroundState(determineTimeOfDay());
    
    const generateWelcomeMessage = async () => {
      setIsLoading(true);
      try {
        // In a production environment, this would call the OpenAI API
        const hour = new Date().getHours();
        let timeContext = "";
        
        if (hour >= 5 && hour < 12) {
          timeContext = "ce matin";
        } else if (hour >= 12 && hour < 18) {
          timeContext = "cet après-midi";
        } else {
          timeContext = "ce soir";
        }
        
        const messages = [
          `Bienvenue dans votre espace de bien-être émotionnel ${timeContext}`,
          `Comment vous sentez-vous ${timeContext} ? EmotionsCare est à vos côtés`,
          `${timeContext}, prenez un moment pour vous reconnecter à vos émotions`,
          `EmotionsCare vous accompagne ${timeContext} pour un meilleur équilibre émotionnel`
        ];
        
        setWelcomeMessage(messages[Math.floor(Math.random() * messages.length)]);
      } catch (error) {
        console.error('Error generating welcome message:', error);
        setWelcomeMessage("Bienvenue dans votre espace de bien-être émotionnel");
      } finally {
        setIsLoading(false);
      }
    };
    
    generateWelcomeMessage();
    
    // Apply theme based on time of day
    if (theme === 'system') {
      const hour = new Date().getHours();
      if (hour >= 20 || hour < 7) {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    }
  }, [setTheme, theme]);

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
      toast({
        title: "Musique activée",
        description: "Ambiance sonore générée par IA"
      });
    } else {
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
  };

  // Get weather information (in production, this would use a weather API)
  const weatherInfo = {
    condition: "Brume légère",
    temperature: "12°C"
  };

  return (
    <div 
      className={`immersive-container ${backgroundState.toLowerCase()}`}
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
      </div>

      {/* Weather info */}
      <div className="absolute top-4 left-4 text-sm text-muted-foreground bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
        {weatherInfo.condition} • {weatherInfo.temperature}
      </div>

      {/* Ambient animations */}
      <div className="ambient-animation">
        <div className="blur-circle circle-1"></div>
        <div className="blur-circle circle-2"></div>
      </div>

      <div className="content-container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="greeting-section"
        >
          <h1 className="greeting-title">
            EmotionsCare
          </h1>
          <p className="greeting-subtitle">
            {isLoading ? "Chargement..." : welcomeMessage}
          </p>
        </motion.div>

        {/* Mood picker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-10"
        >
          <h2 className="text-center text-lg mb-4">Comment vous sentez-vous aujourd'hui ?</h2>
          <EmotionMoodPicker onSelect={handleMoodSelected} selected={selectedMood} />
        </motion.div>

        <motion.div 
          className="options-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="option-card">
            <div className="option-icon b2c-icon">
              <User />
            </div>
            <h2 className="option-title">Je suis un particulier</h2>
            <p className="option-description">
              Accédez à votre espace personnel de bien-être émotionnel
            </p>
            <button 
              onClick={handlePersonalAccess} 
              className="option-button b2c-button"
            >
              Espace Personnel
            </button>
          </div>

          <div className="option-card">
            <div className="option-icon b2b-icon">
              <Building />
            </div>
            <h2 className="option-title">Je suis une entreprise</h2>
            <p className="option-description">
              Solutions pour votre organisation et vos collaborateurs
            </p>
            <button 
              onClick={handleBusinessAccess} 
              className="option-button b2b-button"
            >
              Espace Entreprise
            </button>
          </div>
        </motion.div>

        <motion.div 
          className="flex justify-center mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <button 
            className="control-button"
            onClick={toggleVoiceRecognition}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            <span>{isListening ? "Désactiver les commandes vocales" : "Activer les commandes vocales"}</span>
          </button>
        </motion.div>

        {audioEnabled && (
          <div className="fixed bottom-4 right-4 z-30">
            <MusicPlayer autoPlay={true} volume={0.3} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImmersiveHome;
