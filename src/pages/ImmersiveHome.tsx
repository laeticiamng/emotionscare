
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
import { TimeOfDay, determineTimeOfDay, DEFAULT_WELCOME_MESSAGES } from '@/constants/defaults';
import { useUserMode } from '@/contexts/UserModeContext';
import { useTheme } from '@/hooks/use-theme';
import { EmotionMoodPicker } from '@/components/emotion/EmotionMoodPicker';
import { AudioController } from '@/components/home/audio/AudioController';

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
        const timeOfDay = determineTimeOfDay();
        const messages = DEFAULT_WELCOME_MESSAGES[timeOfDay];
        
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
      </div>

      {/* Weather info */}
      <div className="absolute top-4 left-4 text-sm text-muted-foreground bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
        {weatherInfo.condition} • {weatherInfo.temperature}
      </div>

      {/* Ambient animations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            EmotionsCare
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
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
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="border-primary/20 hover:border-primary hover:shadow-xl transition-all duration-500 hover:scale-[1.02] backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 pastel:bg-blue-50/80 p-8 rounded-xl border flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Je suis un particulier</h2>
              <p className="text-muted-foreground mb-6">
                Accédez à votre espace personnel de bien-être émotionnel
              </p>
            </div>
            <Button 
              onClick={handlePersonalAccess} 
              size="lg" 
              className="w-full py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <User className="mr-2 h-5 w-5" /> Espace Personnel
            </Button>
          </div>

          <div className="border-secondary/20 hover:border-secondary hover:shadow-xl transition-all duration-500 hover:scale-[1.02] backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 pastel:bg-blue-50/80 p-8 rounded-xl border flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center">
              <Building className="w-10 h-10 text-secondary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Je suis une entreprise</h2>
              <p className="text-muted-foreground mb-6">
                Solutions pour votre organisation et vos collaborateurs
              </p>
            </div>
            <Button 
              onClick={handleBusinessAccess} 
              variant="outline" 
              size="lg"
              className="w-full py-6 text-lg shadow border-2 border-secondary/50 hover:border-secondary/80 hover:shadow-xl transition-all duration-300"
            >
              <Building className="mr-2 h-5 w-5" /> Espace Entreprise
            </Button>
          </div>
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
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            onClick={toggleVoiceRecognition}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {isListening ? "Désactiver les commandes vocales" : "Activer les commandes vocales"}
          </Button>
        </motion.div>
      </div>

      {audioEnabled && (
        <div className="fixed bottom-4 right-4 z-30">
          <AudioController autoplay={true} initialVolume={0.3} />
        </div>
      )}
    </div>
  );
};

export default ImmersiveHome;
