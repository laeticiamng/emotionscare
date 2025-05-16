
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Shell from '@/Shell';

const B2BSelectionPage = () => {
  const navigate = useNavigate();

  return (
    <Shell>
      <div className="min-h-[80vh] w-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900 dark:to-blue-900/30 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-blue-800 dark:text-blue-300">
            Espace Entreprise
          </h1>
          <p className="text-lg text-blue-600/80 dark:text-blue-400/80 max-w-2xl mx-auto">
            Sélectionnez votre profil pour accéder à l'interface adaptée à vos besoins
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col"
          >
            <div className="bg-white dark:bg-slate-800/80 rounded-2xl shadow-xl p-8 h-full flex flex-col border border-blue-100 dark:border-blue-900/30">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              
              <h2 className="text-2xl font-semibold text-center mb-4 text-blue-800 dark:text-blue-300">
                Espace Collaborateur
              </h2>
              
              <p className="text-blue-600/70 dark:text-blue-400/70 mb-8 text-center flex-grow">
                Accédez à votre espace personnel de bien-être professionnel, avec journal émotionnel, 
                musique adaptative, et réseau SocialCocon interne.
              </p>
              
              <Button 
                onClick={() => navigate('/b2b/user/login')}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl py-3"
              >
                Se connecter en tant que collaborateur
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col"
          >
            <div className="bg-white dark:bg-slate-800/80 rounded-2xl shadow-xl p-8 h-full flex flex-col border border-blue-100 dark:border-blue-900/30">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Building className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              
              <h2 className="text-2xl font-semibold text-center mb-4 text-blue-800 dark:text-blue-300">
                Administration RH
              </h2>
              
              <p className="text-blue-600/70 dark:text-blue-400/70 mb-8 text-center flex-grow">
                Gérez les équipes, accédez aux tableaux de bord analytiques, 
                visualisez la météo émotionnelle de l'entreprise et planifiez vos initiatives bien-être.
              </p>
              
              <Button 
                onClick={() => navigate('/b2b/admin/login')}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white rounded-xl py-3"
              >
                Se connecter en tant qu'administrateur
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12"
        >
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="px-6 py-2 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            Retour à l'accueil
          </Button>
        </motion.div>
      </div>
    </Shell>
  );
};

export default B2BSelectionPage;
