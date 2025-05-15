import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { TimeBasedBackground } from '@/components/home/TimeBasedBackground';
import ModulesSection from '@/components/home/ModulesSection';
import KeyFeatures from '@/components/home/KeyFeatures';
import TherapyModules from '@/components/home/TherapyModules';
import MoodPicker from '@/components/home/MoodPicker';
import { Button } from '@/components/ui/button';
import { SmilePlus, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import '@/components/home/immersive-home.css';
import { useModulePrioritization } from '@/components/home/modules/useModulePrioritization';
import MoodBasedModules from '@/components/home/modules/MoodBasedModules';
import ModulesHeader from '@/components/home/modules/ModulesHeader';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isModulesCollapsed, setIsModulesCollapsed] = useState(false);
  
  // Get modules prioritized based on mood
  const prioritizedModules = useModulePrioritization(isAuthenticated, selectedMood);
  
  // Show welcome toast on first load
  useEffect(() => {
    const hasShownWelcome = sessionStorage.getItem('hasShownWelcome');
    
    if (!hasShownWelcome) {
      setTimeout(() => {
        toast({
          title: "Bienvenue sur EmotionsCare",
          description: "Votre espace de bien-être émotionnel personnalisé",
        });
        sessionStorage.setItem('hasShownWelcome', 'true');
      }, 1500);
    }
  }, [toast]);
  
  const handleMoodSelection = (mood: string) => {
    setSelectedMood(mood);
    setShowMoodPicker(false);
    
    toast({
      title: "Préférences mises à jour",
      description: "Votre expérience est maintenant personnalisée selon votre humeur",
    });
  };
  
  const toggleModulesCollapse = () => {
    setIsModulesCollapsed(!isModulesCollapsed);
  };

  return (
    <TimeBasedBackground>
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight heading-elegant">
            Bienvenue dans votre espace de bien-être émotionnel
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Explorez des outils et techniques conçus pour votre équilibre émotionnel
          </p>
          
          {/* Mood Selection Button */}
          <div className="flex justify-center gap-4">
            <Button 
              size="lg" 
              onClick={() => setShowMoodPicker(true)}
              className="immersive-button rounded-full group"
            >
              <SmilePlus className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              {selectedMood ? "Changer d'humeur" : "Comment vous sentez-vous aujourd'hui ?"}
            </Button>
            
            {selectedMood && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => setSelectedMood(null)}
                className="rounded-full"
              >
                <Info className="mr-2 h-5 w-5" />
                Réinitialiser
              </Button>
            )}
          </div>
        </motion.div>
        
        {/* Main Content */}
        <div className="space-y-16">
          {/* Mood-based Modules Section */}
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <ModulesHeader 
              showHeading={true}
              isCollapsed={isModulesCollapsed}
              onToggle={toggleModulesCollapse}
            />
            
            {!isModulesCollapsed && (
              <MoodBasedModules 
                modules={prioritizedModules}
                selectedMood={selectedMood}
              />
            )}
          </motion.section>
          
          {/* Other Sections */}
          <KeyFeatures />
          
          <TherapyModules />
          
          {isAuthenticated && (
            <ModulesSection 
              selectedMood={selectedMood} 
              collapsed={false}
            />
          )}
        </div>
        
        {/* Mood Picker Dialog */}
        {showMoodPicker && (
          <MoodPicker 
            onSelect={handleMoodSelection}
            onClose={() => setShowMoodPicker(false)}
          />
        )}
      </div>
    </TimeBasedBackground>
  );
};

export default Home;
