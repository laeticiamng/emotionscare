
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, Building, ArrowRight } from 'lucide-react';
import { MusicPlayer } from '@/components/audio/MusicPlayer';

interface PremiumContentProps {
  greeting: string;
}

const PremiumContent: React.FC<PremiumContentProps> = ({ greeting }) => {
  const navigate = useNavigate();
  
  const handleB2CNavigation = () => {
    // Add haptic feedback on mobile if supported
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    navigate('/b2c/login');
  };
  
  const handleB2BNavigation = () => {
    // Add haptic feedback on mobile if supported
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    navigate('/b2b/selection');
  };
  
  return (
    <div className="premium-content">
      <motion.div 
        className="premium-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="premium-title">EmotionsCare</h1>
        <p className="premium-subtitle">{greeting}</p>
      </motion.div>
      
      <motion.div 
        className="premium-options"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="flex justify-center"
        >
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl flex items-center justify-center gap-2 min-w-[240px]"
            onClick={handleB2CNavigation}
          >
            <User className="mr-2" />
            Je suis un particulier
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="flex justify-center"
        >
          <Button 
            variant="outline" 
            size="lg" 
            className="border-primary/20 bg-background/50 backdrop-blur hover:bg-primary/10 dark:hover:bg-primary/20 px-8 py-6 text-lg rounded-2xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 min-w-[240px]"
            onClick={handleB2BNavigation}
          >
            <Building className="mr-2" />
            Je suis une entreprise
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="premium-footer mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
      >
        <MusicPlayer minimal={true} />
      </motion.div>
    </div>
  );
};

export default PremiumContent;
