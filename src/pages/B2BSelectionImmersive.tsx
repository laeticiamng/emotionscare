
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Building, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserMode } from '@/contexts/UserModeContext';
import { logModeSelection } from '@/utils/modeSelectionLogger';
import { useAnalyticsConsent } from '@/hooks/useAnalyticsConsent';
import Shell from '@/Shell';

const B2BSelectionImmersive: React.FC = () => {
  const navigate = useNavigate();
  const { setUserMode } = useUserMode();
  const analyticsConsent = useAnalyticsConsent();
  
  const handleModeSelection = (mode: 'b2b-user' | 'b2b-admin') => {
    setUserMode(mode);
    
    // Log selection if analytics consent given
    if (analyticsConsent) {
      logModeSelection(mode);
    }
    
    // Navigate to the appropriate login page
    if (mode === 'b2b-admin') {
      navigate('/login-admin');
    } else {
      navigate('/login-collaborateur');
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 }
    }
  };

  return (
    <Shell>
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-blue-50/40 to-indigo-50/40 dark:from-slate-900/80 dark:to-indigo-950/50">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 1.5 }}
            className="absolute top-[-20%] right-[-10%] w-[80%] h-[60%] bg-gradient-to-br from-blue-200/30 to-transparent dark:from-blue-500/10 rounded-full filter blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="absolute bottom-[-20%] left-[-10%] w-[80%] h-[60%] bg-gradient-to-tr from-purple-200/30 to-transparent dark:from-purple-500/10 rounded-full filter blur-3xl"
          />
          
          {/* Floating particles */}
          <div className="absolute inset-0">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-2 h-2 rounded-full bg-white/20 dark:bg-white/10"
                initial={{ 
                  x: Math.random() * 100 + "%", 
                  y: Math.random() * 100 + "%",
                  opacity: Math.random() * 0.5 + 0.3
                }}
                animate={{ 
                  y: [
                    `${parseFloat(`${Math.random() * 100}`)}%`, 
                    `${parseFloat(`${Math.random() * 100}`)}%`
                  ],
                  opacity: [0.2, 0.5, 0.2]
                }}
                transition={{ 
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`
                }}
              />
            ))}
          </div>
        </div>

        <div className="container max-w-3xl z-10 relative">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-10"
          >
            {/* Header */}
            <motion.div 
              variants={itemVariants}
              className="text-center"
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Votre Espace Entreprise
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Comment souhaitez-vous utiliser EmotionsCare aujourd'hui ?
              </p>
            </motion.div>

            {/* Selection Cards */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Collaborateur Card */}
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-6 h-full flex flex-col border border-blue-200 dark:border-blue-900/40 shadow-xl">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/30">
                      <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <h2 className="text-center text-xl font-bold mb-2">Collaborateur</h2>
                  <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                    Accès aux outils de bien-être personnel
                  </p>
                  
                  <div className="mt-auto">
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 mb-8">
                      <li className="flex items-start">
                        <span className="mr-2 text-blue-500">•</span> 
                        Journal émotionnel personnel
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-blue-500">•</span> 
                        Musicothérapie personnalisée
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-blue-500">•</span> 
                        Coaching IA adapté au travail
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-blue-500">•</span> 
                        Suivi de votre bien-être
                      </li>
                    </ul>
                    
                    <Button 
                      onClick={() => handleModeSelection('b2b-user')} 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 rounded-xl shadow-md"
                    >
                      Espace Collaborateur
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Admin Card */}
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-6 h-full flex flex-col border border-indigo-200 dark:border-indigo-900/40 shadow-xl">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                      <Shield className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  </div>
                  <h2 className="text-center text-xl font-bold mb-2">Administration / RH</h2>
                  <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                    Gestion d'équipe et analyse collective
                  </p>
                  
                  <div className="mt-auto">
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 mb-8">
                      <li className="flex items-start">
                        <span className="mr-2 text-indigo-500">•</span>
                        Tableau de bord analytique
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-indigo-500">•</span>
                        Monitoring d'équipe anonymisé
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-indigo-500">•</span>
                        Organisation d'événements
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-indigo-500">•</span>
                        Rapports et tendances
                      </li>
                    </ul>
                    
                    <Button 
                      onClick={() => handleModeSelection('b2b-admin')}
                      size="lg"
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 rounded-xl shadow-md"
                    >
                      Espace Administration
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Return button */}
            <motion.div 
              variants={itemVariants}
              className="flex justify-center mt-10"
            >
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 group flex items-center gap-2"
              >
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                Retour à l'accueil
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Shell>
  );
};

export default B2BSelectionImmersive;
