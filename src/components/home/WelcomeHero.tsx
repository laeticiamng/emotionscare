
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStorytelling } from '@/contexts/StorytellingContext';
import { Story } from '@/types';

interface WelcomeHeroProps {
  userName?: string;
  userRole?: string;
  onboardingComplete?: boolean;
}

const WelcomeHero: React.FC<WelcomeHeroProps> = ({ 
  userName = '',
  userRole = '',
  onboardingComplete = false
}) => {
  const navigate = useNavigate();
  const { storyQueue, addStory, markStorySeen } = useStorytelling();
  const [greeting, setGreeting] = useState('');
  
  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Bonjour');
    } else if (hour < 18) {
      setGreeting('Bon après-midi');
    } else {
      setGreeting('Bonsoir');
    }
  }, []);
  
  // Add welcome story if it's the user's first visit and onboarding is complete
  useEffect(() => {
    if (onboardingComplete && userName) {
      // Check if welcome story exists and has not been seen
      const welcomeStoryExists = storyQueue.some(
        story => story.id === 'welcome' && !story.seen
      );
      
      if (!welcomeStoryExists) {
        const welcomeStory: Story = {
          id: 'welcome',
          title: 'Bienvenue sur EmotionsCare',
          content: `${userName}, bienvenue dans votre espace personnel de bien-être émotionnel. Vous pouvez maintenant accéder à tous les outils pour prendre soin de votre santé émotionnelle.`,
          type: 'onboarding',
          seen: false,
          cta: {
            label: "Explorer les fonctionnalités",
            route: "/dashboard"
          }
        };
        
        addStory(welcomeStory);
      }
    }
  }, [onboardingComplete, userName, storyQueue, addStory]);

  const handleGetStarted = () => {
    navigate('/dashboard');
    
    // Mark welcome story as seen when user clicks get started
    const welcomeStory = storyQueue.find(story => story.id === 'welcome');
    if (welcomeStory) {
      markStorySeen(welcomeStory.id);
    }
  };
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20 dark:from-background dark:to-primary/5 py-20">
      <div className="container max-w-5xl relative z-10">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-5xl font-light mb-4">
            {greeting}, <span className="font-semibold">{userName || 'Bienvenue'}</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {userName ? 
              'Prenez soin de votre équilibre émotionnel et explorez toutes nos fonctionnalités.' : 
              'EmotionsCare vous accompagne dans la gestion de votre bien-être émotionnel quotidien.'
            }
          </p>
          
          <Button 
            onClick={handleGetStarted} 
            size="lg" 
            className="group px-8"
          >
            {userName ? 'Accéder au tableau de bord' : 'Commencer maintenant'}
            <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={18} />
          </Button>
        </motion.div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
};

export default WelcomeHero;
