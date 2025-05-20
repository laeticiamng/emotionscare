
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUserMode } from '@/contexts/UserModeContext';
import { logModeSelection } from '@/utils/modeSelectionLogger';
import { trackEvent } from '@/utils/analytics';
import { UserCircle, Building2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const B2BSelectionPremium: React.FC = () => {
  const navigate = useNavigate();
  const { setUserMode } = useUserMode();
  const [timeOfDay, setTimeOfDay] = useState<string>('day');
  
  // Set time of day
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) setTimeOfDay('morning');
    else if (hours >= 12 && hours < 18) setTimeOfDay('afternoon');
    else if (hours >= 18 && hours < 22) setTimeOfDay('evening');
    else setTimeOfDay('night');
  }, []);
  
  // Track page view
  useEffect(() => {
    trackEvent('View B2B Selection Page', {
      properties: { variant: 'premium' }
    });
  }, []);
  
  const handleModeSelect = (mode: 'b2c' | 'b2b_user' | 'b2b_admin') => {
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    setUserMode(mode);
    logModeSelection(mode);
    
    // Show toast notification
    const modeLabels: Record<string, string> = {
      'b2c': 'Particulier',
      'b2b_user': 'Collaborateur',
      'b2b_admin': 'Administrateur RH'
    };
    
    toast.success(`Mode ${modeLabels[mode]} sélectionné`);
    
    // Navigate based on selected mode
    setTimeout(() => {
      switch(mode) {
        case 'b2c':
          navigate('/b2c');
          break;
        case 'b2b_user':
          navigate('/b2b/user/login');
          break;
        case 'b2b_admin':
          navigate('/b2b/admin/login');
          break;
      }
    }, 500);
  };
  
  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 bg-${timeOfDay}`}>
      {/* Background Ambient Elements */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-2/3 h-2/3 rounded-full bg-blue-500/10 blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-2/3 h-2/3 rounded-full bg-indigo-500/10 blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
      </div>
      
      <div className="container max-w-4xl mx-auto">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-12"
        >
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">EC</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              EmotionsCare
            </span>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-3 bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Espace Professionnel
          </h1>
          
          <p className="text-lg text-center text-slate-600 dark:text-slate-300 mb-10">
            Sélectionnez votre profil pour accéder à votre espace dédié
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {/* Particulier */}
          <motion.div
            whileHover={{ scale: 1.03, y: -5 }}
            transition={{ type: 'spring', stiffness: 400 }}
            className="glass-card p-6 rounded-xl flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
              <UserCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Particulier</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6 flex-grow">
              Accédez à votre espace personnel pour gérer votre bien-être émotionnel
            </p>
            <Button
              onClick={() => handleModeSelect('b2c')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white button-premium"
            >
              Espace Personnel
            </Button>
          </motion.div>
          
          {/* Collaborateur */}
          <motion.div
            whileHover={{ scale: 1.03, y: -5 }}
            transition={{ type: 'spring', stiffness: 400 }}
            className="glass-card p-6 rounded-xl flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Collaborateur</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6 flex-grow">
              Accédez à l'espace collaborateur pour suivre votre bien-être au travail
            </p>
            <Button
              onClick={() => handleModeSelect('b2b_user')}
              className="w-full bg-green-600 hover:bg-green-700 text-white button-premium"
            >
              Espace Collaborateur
            </Button>
          </motion.div>
          
          {/* Administrateur RH */}
          <motion.div
            whileHover={{ scale: 1.03, y: -5 }}
            transition={{ type: 'spring', stiffness: 400 }}
            className="glass-card p-6 rounded-xl flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Administrateur RH</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6 flex-grow">
              Accédez à l'espace administrateur pour gérer le bien-être de votre équipe
            </p>
            <Button
              onClick={() => handleModeSelect('b2b_admin')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white button-premium"
            >
              Espace Admin RH
            </Button>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-12 text-center"
        >
          <Button
            onClick={handleBackToHome}
            variant="outline"
            className="button-premium"
          >
            Retour à l'accueil
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default B2BSelectionPremium;
