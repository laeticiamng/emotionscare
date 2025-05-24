
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUserMode } from '@/contexts/UserModeContext';
import { motion } from 'framer-motion';
import { UserIcon, Building2, ArrowLeft } from 'lucide-react';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();
  const { setUserMode } = useUserMode();
  
  const handleModeSelect = (path: string, mode?: string) => {
    if (mode) {
      setUserMode(mode);
      localStorage.setItem('user-mode', mode);
    }
    navigate(path);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border-0"
      >
        <div className="text-center mb-12">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="absolute top-8 left-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Accueil
          </Button>
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Comment souhaitez-vous utiliser EmotionsCare ?
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Choisissez l'interface qui correspond le mieux à votre situation
            </p>
          </motion.div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => handleModeSelect('/b2c/login', 'b2c')}
            className="cursor-pointer group"
          >
            <div className="h-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-8 border-2 border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <UserIcon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-4">
                  Particulier
                </h3>
                <p className="text-blue-700 dark:text-blue-400 mb-6">
                  Accédez à votre espace personnel de bien-être émotionnel. 
                  Profitez d'un accompagnement personnalisé avec l'IA.
                </p>
                <ul className="text-left space-y-3 text-sm text-blue-600 dark:text-blue-300">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Scanner d'émotions personnel
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Coach IA personnalisé 24h/24
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Musique thérapeutique adaptée
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Journal émotionnel et analytics
                  </li>
                </ul>
                <div className="mt-6 p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <p className="text-xs text-blue-800 dark:text-blue-200 font-medium">
                    ✨ 3 jours d'essai gratuit inclus
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => handleModeSelect('/b2b/selection')}
            className="cursor-pointer group"
          >
            <div className="h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl p-8 border-2 border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 transition-all duration-300">
              <div className="text-center">
                <div className="w-20 h-20 bg-slate-700 dark:bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Building2 className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                  Entreprise
                </h3>
                <p className="text-slate-700 dark:text-slate-400 mb-6">
                  Solutions pour le bien-être en entreprise. Gérez et analysez 
                  le bien-être de vos équipes avec des outils professionnels.
                </p>
                <ul className="text-left space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-slate-600 rounded-full mr-3"></div>
                    Espace collaborateur individuel
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-slate-600 rounded-full mr-3"></div>
                    Tableau de bord RH & analytics
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-slate-600 rounded-full mr-3"></div>
                    Gestion des équipes et alertes
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-slate-600 rounded-full mr-3"></div>
                    Rapports détaillés conformes RGPD
                  </li>
                </ul>
                <div className="mt-6 p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    🏢 Pour RH et managers d'équipe
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Vous pourrez changer de mode à tout moment depuis votre profil
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ChooseModePage;
