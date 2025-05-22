
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Shell from '@/Shell';
import { useAuth } from '@/contexts/AuthContext';
import AccessSection from '@/components/home/AccessSection';
import HeroSection from '@/components/home/HeroSection';
import CtaSection from '@/components/home/CtaSection';
import ActionButtons from '@/components/home/ActionButtons';
import NotificationBell from '@/components/notifications/NotificationBell';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const handleDashboardClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      toast.error("Vous devez vous connecter pour accéder au tableau de bord");
      navigate('/login');
    }
  };
  
  console.log("Rendering Home page, isAuthenticated:", isAuthenticated, "user:", user?.name);

  return (
    <Shell>
      <div className="container px-4 py-8 mx-auto">
        <div className="flex justify-end mb-4">
          <NotificationBell />
        </div>
        
        <HeroSection />
        
        {/* Quick Access Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">
            Accédez à vos fonctionnalités
          </h2>
          <ActionButtons />
        </motion.div>
        
        {/* Connection Options */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto bg-blue-50 dark:bg-blue-900/20 rounded-xl shadow-xl p-8 mb-12 border-2 border-blue-200/50 dark:border-blue-800/30"
        >
          <h2 className="text-4xl font-bold tracking-tight mb-8 text-center text-blue-600 dark:text-blue-400">
            Choisissez votre accès
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-lg transition-all duration-300 border-4 border-blue-500 hover:shadow-xl"
            >
              <h3 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">Particulier</h3>
              <p className="mb-6 text-lg text-muted-foreground">Accédez à votre espace personnel</p>
              <Button 
                onClick={() => navigate('/b2c/login')}
                size="lg" 
                className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700"
              >
                Espace Personnel
              </Button>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-lg transition-all duration-300 border-4 border-blue-300 hover:shadow-xl"
            >
              <h3 className="text-2xl font-bold mb-4 text-blue-500 dark:text-blue-300">Entreprise</h3>
              <p className="mb-6 text-lg text-muted-foreground">Solutions pour votre organisation</p>
              <Button 
                onClick={() => navigate('/b2b/selection')}
                variant="secondary"
                size="lg" 
                className="w-full text-lg py-6 bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-200"
              >
                Espace Entreprise
              </Button>
            </motion.div>
          </div>
        </motion.div>
        
        <AccessSection />
        <CtaSection />

        {/* Test accounts section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-2xl mx-auto mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-md border border-blue-100 dark:border-blue-800/30"
        >
          <h2 className="text-xl font-bold mb-4 text-center text-blue-700 dark:text-blue-300">Comptes de démonstration</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
              <h3 className="font-medium text-blue-700 dark:text-blue-400">Particulier</h3>
              <p className="text-gray-500 dark:text-gray-400">utilisateur@exemple.fr</p>
              <p className="text-gray-500 dark:text-gray-400">Mot de passe: admin</p>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
              <h3 className="font-medium text-blue-700 dark:text-blue-400">Admin</h3>
              <p className="text-gray-500 dark:text-gray-400">admin@exemple.fr</p>
              <p className="text-gray-500 dark:text-gray-400">Mot de passe: admin</p>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
              <h3 className="font-medium text-blue-700 dark:text-blue-400">Collaborateur</h3>
              <p className="text-gray-500 dark:text-gray-400">collaborateur@exemple.fr</p>
              <p className="text-gray-500 dark:text-gray-400">Mot de passe: admin</p>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ces comptes sont préchargés pour la démonstration. Utilisez-les pour explorer les différentes interfaces de l'application.
            </p>
          </div>
        </motion.div>
      </div>
    </Shell>
  );
};

export default Home;
