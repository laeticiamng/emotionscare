
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User, Building, Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { ThemeSelector } from '@/components/theme/ThemeSelector';
import { AudioController } from '@/components/home/audio/AudioController';
import { WelcomeMessage } from '@/components/home/WelcomeMessage';
import Shell from '@/Shell';
import { TimeOfDay } from '@/constants/defaults';

const LandingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [backgroundState, setBackgroundState] = useState<TimeOfDay>(TimeOfDay.MORNING);

  // Set background based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setBackgroundState(TimeOfDay.MORNING);
    } else if (hour >= 12 && hour < 18) {
      setBackgroundState(TimeOfDay.AFTERNOON);
    } else if (hour >= 18 && hour < 22) {
      setBackgroundState(TimeOfDay.EVENING);
    } else {
      setBackgroundState(TimeOfDay.NIGHT);
    }

    // Preload essential components
    const preloadComponents = async () => {
      try {
        // Simulate preloading with minimal operations
        console.log('Preloading essential components...');
        // Here you would initialize any APIs or preload components
      } catch (error) {
        console.error('Error preloading components:', error);
      }
    };
    
    preloadComponents();
    
    // Simulate music starting
    const timer = setTimeout(() => {
      console.log('Background music would start playing here');
      // This is where you would integrate with Music Generator API
    }, 1000);
    
    return () => clearTimeout(timer);
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

  return (
    <Shell>
      <div 
        className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-1000 
          bg-blue-50 dark:bg-slate-900"
      >
        {/* Theme selector position in top-right */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-4">
          <AudioController minimal className="mr-2" />
          <ThemeSelector minimal />
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
            className="absolute -top-[30%] -left-[20%] w-[80%] h-[80%] rounded-full bg-gradient-to-r from-blue-300/20 to-blue-200/10 blur-3xl"
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
            className="absolute -bottom-[50%] -right-[20%] w-[90%] h-[90%] rounded-full bg-gradient-to-r from-blue-200/10 to-blue-300/20 blur-3xl"
          />
        </div>

        <div className="container max-w-6xl z-10 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              EmotionsCare
            </h1>
            <WelcomeMessage className="text-xl max-w-3xl mx-auto" />
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Card className="border-blue-200/20 hover:border-blue-300 hover:shadow-xl transition-all duration-500 hover:scale-[1.02] backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-blue-100/50 flex items-center justify-center">
                  <User className="w-10 h-10 text-blue-600" />
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
                  className="w-full py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-blue-600 hover:bg-blue-700"
                >
                  <User className="mr-2 h-5 w-5" /> Espace Personnel
                </Button>
              </CardContent>
            </Card>

            <Card className="border-blue-400/20 hover:border-blue-300 hover:shadow-xl transition-all duration-500 hover:scale-[1.02] backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-blue-100/50 flex items-center justify-center">
                  <Building className="w-10 h-10 text-blue-600" />
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
                  className="w-full py-6 text-lg shadow border-2 border-blue-500/50 hover:border-blue-500/80 hover:shadow-xl transition-all duration-300"
                >
                  <Building className="mr-2 h-5 w-5" /> Espace Entreprise
                </Button>
              </CardContent>
            </Card>
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
      </div>
    </Shell>
  );
};

export default LandingPage;
