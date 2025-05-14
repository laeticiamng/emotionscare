
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, Building } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SelectionEntreprise() {
  const navigate = useNavigate();
  
  const navigateToUserLogin = () => {
    navigate('/b2b/user/login');
  };
  
  const navigateToAdminLogin = () => {
    navigate('/b2b/admin/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 dark:from-blue-900/20 dark:via-indigo-900/10 dark:to-blue-900/30">
      <div className="container max-w-6xl z-10 relative">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-500">
            Bienvenue dans EmotionsCare Entreprise
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choisissez votre profil pour accéder à l'espace adapté
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.div whileHover={{ scale: 1.03 }}>
            <Button 
              onClick={navigateToUserLogin}
              size="lg" 
              className="w-full py-10 text-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-500/90 to-blue-600/80"
            >
              <User className="mr-3 h-6 w-6" /> Je suis un collaborateur
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }}>
            <Button 
              onClick={navigateToAdminLogin}
              variant="outline" 
              size="lg"
              className="w-full py-10 text-lg shadow border-2 border-blue-300/50 hover:border-blue-400/80 hover:shadow-xl transition-all duration-300"
            >
              <Building className="mr-3 h-6 w-6" /> Je suis RH ou manager
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Ambient background blur */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
