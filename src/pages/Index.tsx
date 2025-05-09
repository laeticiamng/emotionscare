
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Cloud, Heart, Moon, Shield, Sun, User, Headset } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { isAdminRole } from '@/utils/roleUtils';
import WelcomeHero from '@/components/home/WelcomeHero';
import ModulesSection from '@/components/home/ModulesSection';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import AnimatedBackground from '@/components/home/AnimatedBackground';
import { getTimeOfDay } from '@/utils/timeUtils';
import MoodPicker from '@/components/home/MoodPicker';
import DailyQuote from '@/components/home/DailyQuote';
import EmotionalWeather from '@/components/home/EmotionalWeather';
import { cn } from '@/lib/utils';

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user ? isAdminRole(user.role) : false;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  
  // Set time of day
  useEffect(() => {
    setTimeOfDay(getTimeOfDay());
    
    const interval = setInterval(() => {
      setTimeOfDay(getTimeOfDay());
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  // Handle mood selection
  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setShowMoodPicker(false);
    
    toast({
      title: "Humeur enregistrée",
      description: `Nous avons adapté votre expérience à votre humeur: ${mood}`,
      duration: 3000,
    });
  };
  
  // Toggle ambient audio
  const toggleAudio = () => {
    setAudioEnabled(prev => !prev);
  };
  
  // Quick emotional assessment questions
  const emotionalQuestions = [
    "Je me sens plein d'énergie aujourd'hui",
    "J'ai besoin de calme et de réflexion",
    "Je cherche de l'inspiration et de la motivation"
  ];

  // Get background style based on mood and time
  const getBackgroundStyle = () => {
    if (selectedMood === "calm") {
      return "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30";
    } else if (selectedMood === "energetic") {
      return "bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/30 dark:to-orange-800/30";
    } else if (selectedMood === "creative") {
      return "bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/30 dark:to-pink-800/30";
    } else {
      // Default based on time of day
      switch(timeOfDay) {
        case 'morning':
          return "bg-gradient-to-br from-yellow-50 to-blue-100 dark:from-yellow-900/30 dark:to-blue-800/30";
        case 'afternoon':
          return "bg-gradient-to-br from-blue-50 to-purple-100 dark:from-blue-900/30 dark:to-purple-800/30";
        case 'evening':
          return "bg-gradient-to-br from-indigo-100 to-purple-200 dark:from-indigo-900/30 dark:to-purple-800/30";
        default:
          return "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-800/30";
      }
    }
  };
  
  return (
    <div className={cn("container px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden", getBackgroundStyle())}>
      {/* Animated background */}
      <AnimatedBackground mood={selectedMood} timeOfDay={timeOfDay} />
      
      {/* Audio toggle */}
      {isAuthenticated && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={toggleAudio}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md"
          aria-label={audioEnabled ? "Désactiver le son ambiant" : "Activer le son ambiant"}
        >
          {audioEnabled ? (
            <span className="flex items-center">
              <span className="w-2 h-4 bg-primary animate-pulse mr-1"></span>
              <span className="w-2 h-6 bg-primary animate-pulse mr-1"></span>
              <span className="w-2 h-3 bg-primary animate-pulse"></span>
            </span>
          ) : (
            <span className="flex items-center">
              <span className="w-2 h-2 bg-gray-400 mr-1"></span>
              <span className="w-2 h-2 bg-gray-400 mr-1"></span>
              <span className="w-2 h-2 bg-gray-400"></span>
            </span>
          )}
        </motion.button>
      )}
      
      {/* Dynamic welcome section with mood picker */}
      <motion.div 
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <WelcomeHero 
          userName={user?.name} 
          timeOfDay={timeOfDay}
          onMoodSelect={() => setShowMoodPicker(true)}
        />
        
        {/* Mood picker modal */}
        {showMoodPicker && (
          <MoodPicker onSelect={handleMoodSelect} onClose={() => setShowMoodPicker(false)} />
        )}
      </motion.div>
      
      {/* Quick emotional assessment */}
      {isAuthenticated && !selectedMood && (
        <motion.div 
          className="my-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-lg font-medium mb-4 text-center">Comment vous sentez-vous aujourd'hui ?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {emotionalQuestions.map((question, index) => (
              <motion.button
                key={index}
                className="p-4 rounded-lg border border-primary/20 hover:border-primary/50 bg-white/50 dark:bg-gray-700/50 transition-all"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleMoodSelect(['calm', 'reflective', 'energetic'][index])}
              >
                {question}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
      
      {/* Login/Dashboard buttons with enhanced visuals */}
      {!isAuthenticated ? (
        <motion.div 
          className="my-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold">Commencez votre voyage émotionnel</h2>
            <p className="text-muted-foreground mt-2">
              Connectez-vous pour accéder à une expérience personnalisée
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
            <Button asChild size="lg" className="w-full shadow-md hover:shadow-lg transition-shadow">
              <Link to="/login" className="flex items-center justify-center gap-2">
                <User className="h-5 w-5" />
                Espace Utilisateur
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="w-full shadow-sm hover:shadow-md transition-shadow">
              <Link to="/admin-login" className="flex items-center justify-center gap-2">
                <Shield className="h-5 w-5" />
                Espace Direction
              </Link>
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          className="my-8 bg-primary/10 backdrop-blur-sm rounded-xl p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold">Votre espace personnel</h2>
            <p className="text-muted-foreground mt-2">
              Accédez à votre tableau de bord pour explorer toutes les fonctionnalités
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
            <Button asChild size="lg" className="w-full shadow-md hover:shadow-lg transition-shadow">
              <Link to={isAdmin ? "/admin" : "/dashboard"} className="flex items-center justify-center gap-2">
                {isAdmin ? (
                  <>
                    <Shield className="h-5 w-5" />
                    Dashboard Administration
                  </>
                ) : (
                  <>
                    <User className="h-5 w-5" />
                    Mon tableau de bord
                  </>
                )}
              </Link>
            </Button>
          </div>
        </motion.div>
      )}
      
      {/* Enhanced Modules Section with animations */}
      <motion.div 
        className="my-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <ModulesSection showHeading={true} selectedMood={selectedMood} />
      </motion.div>
      
      {/* Daily Quote and Emotional Weather */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <DailyQuote />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <EmotionalWeather />
        </motion.div>
      </div>
      
      {/* Call to action */}
      <motion.div 
        className="my-16 bg-card rounded-3xl p-8 shadow-sm relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {/* Decorative elements */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-secondary/10 rounded-full blur-3xl"></div>
        
        <div className="text-center max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
              Prêt à commencer votre voyage vers le bien-être ?
            </h2>
          </motion.div>
          
          <motion.p 
            className="text-lg text-muted-foreground mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {isAuthenticated 
              ? "Continuez votre expérience en accédant à votre tableau de bord personnalisé."
              : "Créez un compte ou connectez-vous pour accéder à toutes nos fonctionnalités et commencer à suivre votre bien-être émotionnel."}
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            {isAuthenticated ? (
              <Button asChild size="lg" className="gap-2 shadow-md hover:shadow-lg transition-all hover:scale-[1.02]">
                <Link to={isAdmin ? "/admin" : "/dashboard"}>
                  Accéder au tableau de bord
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="gap-2 shadow-md hover:shadow-lg transition-all hover:scale-[1.02]">
                  <Link to="/register">
                    Créer un compte
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
                  <Link to="/login">
                    Se connecter
                  </Link>
                </Button>
              </>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
