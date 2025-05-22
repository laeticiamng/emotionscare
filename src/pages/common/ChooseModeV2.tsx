
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserModeType } from '@/types/userMode';
import { useUserMode } from '@/contexts/UserModeContext';
import { logModeSelection } from '@/utils/modeSelectionLogger';
import '../../styles/glass.css';

const ChooseModeV2: React.FC = () => {
  const navigate = useNavigate();
  const { setUserMode } = useUserMode();
  const [selectedMode, setSelectedMode] = useState<UserModeType | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const handleModeHover = (mode: UserModeType) => {
    if (!isTransitioning) {
      setSelectedMode(mode);
    }
  };
  
  const handleModeSelect = (mode: UserModeType) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setSelectedMode(mode);
    setUserMode(mode);
    
    logModeSelection(mode);
    
    // Navigation after animation
    setTimeout(() => {
      switch(mode) {
        case 'b2b_admin':
          navigate('/login-admin');
          break;
        case 'b2b_user':
          navigate('/login-collaborateur');
          break;
        default:
          navigate('/b2c/login');
          break;
      }
    }, 600);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  };
  
  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-slate-900"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        className="max-w-4xl w-full text-center mb-8"
        variants={itemVariants}
      >
        <h1 className="text-4xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
          Comment souhaitez-vous utiliser EmotionsCare ?
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Choisissez l'espace qui correspond à vos besoins pour une expérience personnalisée.
        </p>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl"
        variants={itemVariants}
      >
        {/* B2C Mode */}
        <motion.div
          whileHover={{ 
            scale: 1.03, 
            transition: { duration: 0.2 } 
          }}
          whileTap={{ scale: 0.98 }}
        >
          <Card 
            className={`h-full overflow-hidden transition-all duration-300 bg-panel ${selectedMode === 'b2c' ? 'ring-2 ring-blue-400 dark:ring-blue-500' : ''}`}
            onClick={() => handleModeSelect('b2c')}
            onMouseEnter={() => handleModeHover('b2c')}
            onFocus={() => handleModeHover('b2c')}
          >
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="5"></circle>
                  <path d="M20 21a8 8 0 1 0-16 0"></path>
                </svg>
              </div>
              <CardTitle className="text-2xl font-bold">Particulier</CardTitle>
              <CardDescription className="text-base">
                Accédez à vos outils de bien-être personnel
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-2 pb-6">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                  Suivi des émotions personnalisé
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                  Playlists musicales adaptatives
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                  Coach émotionnel IA disponible 24/7
                </li>
              </ul>
              
              <div className="mt-6">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => handleModeSelect('b2c')}
                >
                  Choisir cet espace
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* B2B User Mode */}
        <motion.div
          whileHover={{ 
            scale: 1.03, 
            transition: { duration: 0.2 } 
          }}
          whileTap={{ scale: 0.98 }}
        >
          <Card 
            className={`h-full overflow-hidden transition-all duration-300 bg-panel ${selectedMode === 'b2b_user' ? 'ring-2 ring-green-400 dark:ring-green-500' : ''}`}
            onClick={() => handleModeSelect('b2b_user')}
            onMouseEnter={() => handleModeHover('b2b_user')}
            onFocus={() => handleModeHover('b2b_user')}
          >
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <CardTitle className="text-2xl font-bold">Collaborateur</CardTitle>
              <CardDescription className="text-base">
                Votre espace bien-être professionnel
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-2 pb-6">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                  Suivi du bien-être au travail
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                  Activités et défis d'équipe
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                  Ressources bien-être en entreprise
                </li>
              </ul>
              
              <div className="mt-6">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleModeSelect('b2b_user')}
                >
                  Choisir cet espace
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* B2B Admin Mode */}
        <motion.div
          whileHover={{ 
            scale: 1.03, 
            transition: { duration: 0.2 } 
          }}
          whileTap={{ scale: 0.98 }}
        >
          <Card 
            className={`h-full overflow-hidden transition-all duration-300 bg-panel ${selectedMode === 'b2b_admin' ? 'ring-2 ring-purple-400 dark:ring-purple-500' : ''}`}
            onClick={() => handleModeSelect('b2b_admin')}
            onMouseEnter={() => handleModeHover('b2b_admin')}
            onFocus={() => handleModeHover('b2b_admin')}
          >
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M19 8v6"></path>
                  <path d="M22 11h-6"></path>
                </svg>
              </div>
              <CardTitle className="text-2xl font-bold">Administration RH</CardTitle>
              <CardDescription className="text-base">
                Pilotez le bien-être de votre organisation
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-2 pb-6">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                  Tableaux de bord analytiques
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                  Gestion des programmes bien-être
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                  Rapports de santé émotionnelle
                </li>
              </ul>
              
              <div className="mt-6">
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => handleModeSelect('b2b_admin')}
                >
                  Choisir cet espace
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="mt-10"
        variants={itemVariants}
      >
        <Button 
          variant="ghost" 
          className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
          onClick={() => navigate('/')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7"></path>
            <path d="M19 12H5"></path>
          </svg>
          Retour à l'accueil
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ChooseModeV2;
