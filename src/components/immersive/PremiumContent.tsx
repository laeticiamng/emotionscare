// @ts-nocheck

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Building, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserMode } from '@/contexts/UserModeContext';
import { ROUTES } from '@/types/navigation';
import { toast } from '@/hooks/use-toast';

interface PremiumContentProps {
  greeting?: string;
  onHover?: () => void;
  onClick?: (route: string) => void;
}

const PremiumContent: React.FC<PremiumContentProps> = ({ 
  greeting = "Bienvenue sur la plateforme de bien-être émotionnel",
  onHover,
  onClick
}) => {
  const navigate = useNavigate();
  const { setUserMode } = useUserMode();
  const [isVisible, setIsVisible] = useState(false);
  const [language, setLanguage] = useState('fr');
  
  // Delay visibility for animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    // Detect browser language
    const browserLang = navigator.language.substring(0, 2).toLowerCase();
    if (['fr', 'en', 'es'].includes(browserLang)) {
      setLanguage(browserLang);
    }
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle navigation
  const handleB2CClick = () => {
    toast({
      title: "Mode personnel activé",
      description: "Vous accédez à l'espace personnel EmotionsCare"
    });
    
    setUserMode('b2c');
    localStorage.setItem('userMode', 'b2c');
    navigate(ROUTES.LOGIN);
  };
  
  const handleB2BClick = () => {
    toast({
      title: "Mode entreprise",
      description: "Vous accédez à l'espace entreprise EmotionsCare"
    });
    
    navigate(ROUTES.B2B_HOME);
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

  // Text content based on language
  const content = {
    fr: {
      title: 'EmotionsCare',
      particular: 'Je suis un particulier',
      business: 'Je suis une entreprise',
      footer: 'Découvrez une nouvelle approche de la gestion émotionnelle'
    },
    en: {
      title: 'EmotionsCare',
      particular: 'Personal Access',
      business: 'Business Access',
      footer: 'Discover a new approach to emotional management'
    },
    es: {
      title: 'EmotionsCare',
      particular: 'Acceso personal',
      business: 'Acceso empresarial',
      footer: 'Descubra un nuevo enfoque de gestión emocional'
    }
  };
  
  const currentContent = content[language as keyof typeof content];
  
  return (
    <motion.div 
      className="premium-content w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16"
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={containerVariants}
      aria-live="polite"
    >
      <motion.div 
        className="premium-header text-center mb-16"
        variants={itemVariants}
      >
        <h1 className="premium-title text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-500" tabIndex={0}>
          {currentContent.title}
        </h1>
        <p className="premium-subtitle text-xl md:text-2xl text-blue-700 dark:text-blue-300 max-w-3xl mx-auto" tabIndex={0}>
          {greeting}
        </p>
      </motion.div>
      
      <motion.div 
        className="premium-options"
        variants={itemVariants}
      >
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full max-w-4xl mx-auto">
          <motion.div
            whileHover={{ 
              scale: 1.03,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            onHoverStart={() => onHover && onHover()}
            className="w-full md:w-1/2"
          >
            <Button
              onClick={handleB2CClick}
              className="premium-button flex items-center gap-2 group w-full h-full py-8 px-6 md:px-8 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-3xl text-white shadow-lg hover:shadow-xl transform transition-all duration-200 text-lg md:text-xl"
              aria-label={currentContent.particular}
            >
              <User size={24} className="flex-shrink-0" />
              <span className="flex-grow text-center">{currentContent.particular}</span>
              <ArrowRight 
                size={24} 
                className="flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1" 
              />
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ 
              scale: 1.03,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            onHoverStart={() => onHover && onHover()}
            className="w-full md:w-1/2"
          >
            <Button
              onClick={handleB2BClick}
              variant="outline"
              className="premium-button flex items-center gap-2 group w-full h-full py-8 px-6 md:px-8 border-2 bg-white/10 backdrop-blur-lg text-blue-600 dark:text-blue-300 border-blue-300 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-3xl shadow-lg hover:shadow-xl transform transition-all duration-200 text-lg md:text-xl"
              aria-label={currentContent.business}
            >
              <Building size={24} className="flex-shrink-0" />
              <span className="flex-grow text-center">{currentContent.business}</span>
              <ArrowRight 
                size={24} 
                className="flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1" 
              />
            </Button>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div 
        className="premium-footer mt-16 text-sm text-center text-blue-600/70 dark:text-blue-400/70"
        variants={itemVariants}
      >
        <p tabIndex={0}>{currentContent.footer}</p>
      </motion.div>
      
      {/* Ambient background circles for visual appeal */}
      <div className="absolute top-[20%] left-[10%] w-64 h-64 rounded-full bg-blue-500/10 blur-3xl -z-10 animate-blob"></div>
      <div className="absolute bottom-[10%] right-[5%] w-72 h-72 rounded-full bg-violet-500/10 blur-3xl -z-10 animate-blob animation-delay-2000"></div>
      <div className="absolute top-[40%] right-[20%] w-56 h-56 rounded-full bg-pink-500/5 blur-3xl -z-10 animate-blob animation-delay-4000"></div>
    </motion.div>
  );
};

export default PremiumContent;
