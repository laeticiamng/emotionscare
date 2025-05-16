
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Building, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserMode } from '@/contexts/UserModeContext';

interface PremiumContentProps {
  greeting: string;
}

const PremiumContent: React.FC<PremiumContentProps> = ({ greeting }) => {
  const navigate = useNavigate();
  const { setUserMode } = useUserMode();
  const [isVisible, setIsVisible] = useState(false);
  
  // Delay visibility for animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle navigation
  const handleB2CClick = () => {
    setUserMode('b2c');
    localStorage.setItem('userMode', 'b2c');
    navigate('/b2c/login');
  };
  
  const handleB2BClick = () => {
    navigate('/b2b/selection');
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };
  
  return (
    <motion.div 
      className="premium-content"
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <motion.div 
        className="premium-header"
        variants={itemVariants}
      >
        <h1 className="premium-title">EmotionsCare</h1>
        <p className="premium-subtitle">{greeting}</p>
      </motion.div>
      
      <motion.div 
        className="premium-options"
        variants={itemVariants}
      >
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full max-w-4xl mx-auto">
          <Button
            onClick={handleB2CClick}
            className="premium-button flex items-center gap-2 group w-full md:w-1/2 py-6 px-4 md:px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-3xl text-white shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-[1.02] text-lg md:text-xl"
          >
            <User size={24} className="flex-shrink-0" />
            <span className="flex-grow text-center">Je suis un particulier</span>
            <ArrowRight size={24} className="flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
          
          <Button
            onClick={handleB2BClick}
            variant="outline"
            className="premium-button flex items-center gap-2 group w-full md:w-1/2 py-6 px-4 md:px-6 border-2 bg-white/10 backdrop-blur-lg text-blue-600 dark:text-blue-300 border-blue-300 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-3xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-[1.02] text-lg md:text-xl"
          >
            <Building size={24} className="flex-shrink-0" />
            <span className="flex-grow text-center">Je suis une entreprise</span>
            <ArrowRight size={24} className="flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>
      </motion.div>
      
      <motion.div 
        className="premium-footer mt-16 text-sm text-center text-blue-600/70 dark:text-blue-400/70"
        variants={itemVariants}
      >
        <p>Découvrez une nouvelle approche de la gestion émotionnelle</p>
      </motion.div>
    </motion.div>
  );
};

export default PremiumContent;
