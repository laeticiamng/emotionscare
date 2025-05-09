
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { HeartHandshake, Smile } from 'lucide-react';
import { getGreeting, formatDateFr } from '@/utils/timeUtils';

interface WelcomeHeroProps {
  userName?: string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening';
  onMoodSelect?: () => void;
}

const WelcomeHero: React.FC<WelcomeHeroProps> = ({ 
  userName, 
  timeOfDay = 'morning',
  onMoodSelect
}) => {
  const today = new Date();
  const formattedDate = formatDateFr(today);
  const greeting = getGreeting();
  
  // Animations for staggered children
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="text-center my-8 md:my-12"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div
        variants={item}
        className="inline-block"
      >
        <div className="inline-flex items-center justify-center p-2 mb-4 rounded-full bg-primary/10 text-primary backdrop-blur-sm">
          <HeartHandshake className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">{formattedDate}</span>
        </div>
      </motion.div>
      
      <motion.h1 
        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight"
        variants={item}
      >
        {greeting}, <span className="text-primary">{userName || 'bienvenue'}</span>
      </motion.h1>
      
      <motion.p 
        className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8"
        variants={item}
      >
        {userName 
          ? "Que souhaitez-vous explorer aujourd'hui ?" 
          : "Explorez votre bien-être émotionnel avec EmotionsCare"}
      </motion.p>
      
      {/* Mood selection button - only shows for authenticated users */}
      {userName && onMoodSelect && (
        <motion.div variants={item}>
          <Button 
            onClick={onMoodSelect}
            size="lg" 
            variant="outline"
            className="group hover:bg-primary/10 transition-all duration-300"
          >
            <Smile className="w-5 h-5 mr-2 group-hover:text-primary transition-colors" />
            Comment vous sentez-vous aujourd'hui ?
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WelcomeHero;
