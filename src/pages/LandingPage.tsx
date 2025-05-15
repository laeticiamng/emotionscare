
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

const LandingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [backgroundState, setBackgroundState] = useState('morning');

  // Set background based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setBackgroundState('morning');
    } else if (hour >= 12 && hour < 18) {
      setBackgroundState('afternoon');
    } else {
      setBackgroundState('evening');
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
        className={`min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-1000 
          ${backgroundState === 'morning' ? 'bg-gradient-to-br from-blue-50 via-orange-50 to-blue-100 dark:from-blue-900/20 dark:via-orange-900/10 dark:to-blue-900/30' : 
          backgroundState === 'afternoon' ? 'bg-gradient-to-br from-blue-50 via-emerald-50 to-blue-100 dark:from-blue-900/20 dark:via-emerald-900/10 dark:to-blue-900/30' : 
          'bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-blue-900/30 dark:from-indigo-950 dark:via-purple-950 dark:to-blue-950'}`}
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
            <WelcomeMessage className="text-xl max-w-3xl mx-auto" />
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Card className="border-primary/20 hover:border-primary hover:shadow-xl transition-all duration-500 hover:scale-[1.02] backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
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
              </CardContent>
            </Card>

            <Card className="border-secondary/20 hover:border-secondary hover:shadow-xl transition-all duration-500 hover:scale-[1.02] backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
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
