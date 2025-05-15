
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
  Heart, 
  PenLine, 
  Brain, 
  VolumeX, 
  Volume2 
} from 'lucide-react';
import { WelcomeMessage } from '@/components/home/WelcomeMessage';
import { TimeOfDay, determineTimeOfDay } from '@/constants/defaults';
import { useToast } from '@/hooks/use-toast';
import { AudioController } from '@/components/home/audio/AudioController';
import { ThemeSelector } from '@/components/theme/ThemeSelector';
import { Card, CardContent } from '@/components/ui/card';
import { EmotionMoodPicker } from '@/components/emotion/EmotionMoodPicker';

const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [backgroundState, setBackgroundState] = useState<TimeOfDay>(determineTimeOfDay());
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showMoodTest, setShowMoodTest] = useState(false);
  const [dailyQuote, setDailyQuote] = useState<string>("");

  useEffect(() => {
    // Set background based on time of day
    setBackgroundState(determineTimeOfDay());

    // Generate daily quote with simulated API call
    const generateQuote = async () => {
      // In a real implementation, this would call OpenAI
      setDailyQuote("La plus grande victoire est la victoire sur soi-même.");
    };

    // Preload essential components
    const preloadComponents = async () => {
      try {
        console.log('Preloading essential components...');
        await generateQuote();
        // Here you would initialize APIs or preload components
      } catch (error) {
        console.error('Error preloading components:', error);
      }
    };
    
    preloadComponents();
  }, []);

  const handlePersonalAccess = () => {
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
      setTimeout(() => {
        // In a real implementation, this would use the Whisper API
        setIsListening(false);
        toast({
          title: "Commande reconnue",
          description: "Redirection en cours...",
        });
        // Simulate recognized command
        setTimeout(() => navigate('/b2c/login'), 1000);
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

  const handleShowMoodTest = () => {
    setShowMoodTest(true);
  };

  // Determine suggested modules based on mood
  const getSuggestedModules = () => {
    if (!selectedMood) return ["journal", "music", "coach"];
    
    switch (selectedMood) {
      case "calm":
        return ["meditation", "journal", "music"];
      case "stressed":
        return ["breathing", "coach", "meditation"];
      case "happy":
        return ["journal", "music", "social"];
      case "sad":
        return ["coach", "music", "journal"];
      default:
        return ["journal", "music", "coach"];
    }
  };

  // Get weather information (simulating API)
  const weatherInfo = {
    condition: "Brume légère",
    temperature: "12°C"
  };

  return (
    <div 
      className={`min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-1000 
        ${backgroundState === TimeOfDay.MORNING ? 'bg-gradient-to-br from-blue-100 to-blue-50' : 
        backgroundState === TimeOfDay.AFTERNOON ? 'bg-gradient-to-br from-emerald-100 to-green-50' : 
        backgroundState === TimeOfDay.EVENING ? 'bg-gradient-to-br from-indigo-100 to-purple-50' : 
        'bg-gradient-to-br from-slate-900 to-indigo-900 text-white'}`}
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
        <ThemeSelector minimal />
      </div>

      {/* Weather info */}
      <div className="absolute top-4 left-4 text-sm text-muted-foreground bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
        {weatherInfo.condition} • {weatherInfo.temperature}
      </div>

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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            EmotionsCare
          </h1>
          <WelcomeMessage className="text-xl max-w-3xl mx-auto" />
          
          {/* Daily quote */}
          <p className="mt-4 italic text-muted-foreground">"{dailyQuote}"</p>
        </motion.div>

        {!showMoodTest ? (
          <>
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
              <div className="border-primary/20 hover:border-primary hover:shadow-xl transition-all duration-500 hover:scale-[1.02] backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 rounded-xl p-8">
                <div className="flex flex-col items-center text-center space-y-6">
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
              </div>

              <div className="border-secondary/20 hover:border-secondary hover:shadow-xl transition-all duration-500 hover:scale-[1.02] backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 rounded-xl p-8">
                <div className="flex flex-col items-center text-center space-y-6">
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
              </div>
            </motion.div>

            {/* Suggested modules */}
            {selectedMood && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-10 text-center"
              >
                <h3 className="text-xl font-medium mb-4">Nous vous suggérons...</h3>
                <div className="flex flex-wrap gap-4 justify-center">
                  {getSuggestedModules().map(module => (
                    <Card key={module} className="w-full max-w-xs overflow-hidden">
                      <CardContent className="p-6 flex flex-col items-center">
                        {module === "journal" && (
                          <>
                            <PenLine size={24} className="mb-3 text-primary" />
                            <h4 className="font-medium">Journal émotionnel</h4>
                            <p className="text-sm text-muted-foreground mt-2">
                              Écrivez votre ressenti du jour
                            </p>
                          </>
                        )}
                        {module === "music" && (
                          <>
                            <Music size={24} className="mb-3 text-primary" />
                            <h4 className="font-medium">Musique adaptative</h4>
                            <p className="text-sm text-muted-foreground mt-2">
                              Ambiance sonore pour votre humeur
                            </p>
                          </>
                        )}
                        {module === "coach" && (
                          <>
                            <Brain size={24} className="mb-3 text-primary" />
                            <h4 className="font-medium">Coach émotionnel</h4>
                            <p className="text-sm text-muted-foreground mt-2">
                              Conseils personnalisés IA
                            </p>
                          </>
                        )}
                        {module === "meditation" && (
                          <>
                            <Heart size={24} className="mb-3 text-primary" />
                            <h4 className="font-medium">Méditation guidée</h4>
                            <p className="text-sm text-muted-foreground mt-2">
                              Retrouvez votre calme intérieur
                            </p>
                          </>
                        )}
                        {module === "breathing" && (
                          <>
                            <Heart size={24} className="mb-3 text-primary" />
                            <h4 className="font-medium">Exercice respiratoire</h4>
                            <p className="text-sm text-muted-foreground mt-2">
                              Relaxation par la respiration
                            </p>
                          </>
                        )}
                        {module === "social" && (
                          <>
                            <User size={24} className="mb-3 text-primary" />
                            <h4 className="font-medium">Cocon social</h4>
                            <p className="text-sm text-muted-foreground mt-2">
                              Partagez avec votre communauté
                            </p>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <Button className="mt-6" onClick={handlePersonalAccess}>
                  Commencer maintenant
                </Button>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-md mx-auto"
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-medium mb-4">Mini-test émotionnel</h3>
                {/* This would be replaced with an actual emotional test component */}
                <p className="mb-6">Questions sur votre état émotionnel pour adapter l'interface.</p>
                <Button className="w-full" onClick={() => setShowMoodTest(false)}>
                  Terminer le test
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

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
    </div>
  );
};

export default ImmersiveHome;
