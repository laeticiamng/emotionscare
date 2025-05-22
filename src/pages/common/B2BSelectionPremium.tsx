
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Building, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { useUserMode } from '@/contexts/UserModeContext';

const B2BSelectionPremium: React.FC = () => {
  const navigate = useNavigate();
  const { setUserMode } = useUserMode();
  
  const handleUserSelect = () => {
    setUserMode('b2b_user');
    navigate('/login-collaborateur');
  };
  
  const handleAdminSelect = () => {
    setUserMode('b2b_admin');
    navigate('/login-admin');
  };
  
  // Animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: custom * 0.2,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }),
    hover: {
      y: -8,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-blue-50/30 dark:to-blue-950/30 p-6 relative">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
        >
          Sélectionnez votre profil
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-muted-foreground text-lg max-w-md mx-auto"
        >
          Choisissez votre mode d'accès pour l'environnement entreprise
        </motion.p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        <motion.div
          custom={0}
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
        >
          <Card className="p-8 h-full bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30 border border-blue-200/50 dark:border-blue-800/30 relative overflow-hidden cursor-pointer" onClick={handleUserSelect}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 dark:bg-blue-400/5 rounded-full transform translate-x-16 -translate-y-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/10 dark:bg-blue-400/5 rounded-full transform -translate-x-12 translate-y-12" />
            
            <div className="relative space-y-6">
              <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4">
                <Building className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-2">Espace Collaborateur</h2>
                <p className="text-muted-foreground mb-6">
                  Accédez à vos outils de bien-être, votre journal émotionnel et vos recommandations personnalisées.
                </p>
              </div>
              
              <Button 
                className="group w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
                size="lg"
              >
                <span className="flex items-center">
                  Accéder à l'espace collaborateur
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          custom={1}
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
        >
          <Card className="p-8 h-full bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/50 dark:to-purple-900/30 border border-purple-200/50 dark:border-purple-800/30 relative overflow-hidden cursor-pointer" onClick={handleAdminSelect}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/10 dark:bg-purple-400/5 rounded-full transform translate-x-16 -translate-y-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-400/10 dark:bg-purple-400/5 rounded-full transform -translate-x-12 translate-y-12" />
            
            <div className="relative space-y-6">
              <div className="h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mb-4">
                <ShieldCheck className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-2">Espace Administrateur</h2>
                <p className="text-muted-foreground mb-6">
                  Gérez les utilisateurs, consultez les statistiques et configurez les paramètres de votre organisation.
                </p>
              </div>
              
              <Button 
                variant="outline"
                className="group w-full border-purple-600 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-900/30"
                size="lg"
              >
                <span className="flex items-center">
                  Accéder à l'espace administrateur
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-8"
      >
        <Button 
          variant="ghost" 
          className="group"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Retour à l'accueil
        </Button>
      </motion.div>
    </div>
  );
};

export default B2BSelectionPremium;
