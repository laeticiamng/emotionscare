
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Building, User } from 'lucide-react';
import { motion } from 'framer-motion';
import ThreeCanvas from '@/components/three/ThreeCanvas';
import '../../styles/immersive-home.css';
import { useTheme } from '@/contexts/ThemeContext';

const B2BSelection: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Navigate to B2B admin login
  const goToB2BAdminLogin = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    navigate('/b2b/admin/login');
  };

  // Navigate to B2B user login
  const goToB2BUserLogin = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    navigate('/b2b/user/login');
  };

  // Navigate back to home
  const goBack = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    navigate('/');
  };

  return (
    <div className={`immersive-container ${theme}`}>
      {/* Animated background */}
      <ThreeCanvas />
      
      {/* Ambient circles */}
      <div 
        className="ambient-circle primary" 
        style={{
          width: '40vw',
          height: '40vw',
          top: '15%',
          left: '10%',
          opacity: 0.3
        }}
      />
      <div 
        className="ambient-circle accent" 
        style={{
          width: '35vw',
          height: '35vw',
          bottom: '15%',
          right: '10%',
          opacity: 0.25
        }}
      />
      
      {/* Main content */}
      <motion.div 
        className="relative z-10 max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1 
          className="premium-title"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Espace Entreprise
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <p className="premium-subtitle mb-8">
            Sélectionnez votre profil pour accéder à l'espace adapté
          </p>
        </motion.div>
        
        <motion.div 
          className="flex flex-col sm:flex-row justify-center gap-6 mt-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Button
            onClick={goToB2BAdminLogin}
            className="premium-button primary flex items-center gap-2 group"
          >
            <Building className="mr-1" />
            <span>Je suis un responsable RH</span>
          </Button>
          
          <Button
            onClick={goToB2BUserLogin}
            className="premium-button secondary flex items-center gap-2 group"
          >
            <User className="mr-1" />
            <span>Je suis un collaborateur</span>
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-8"
        >
          <Button 
            variant="ghost" 
            onClick={goBack}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Retour à l'accueil
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default B2BSelection;
