
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-8"
          >
            <div className="text-8xl font-bold text-blue-600 mb-4">404</div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Page introuvable
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
              Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/')}
                className="px-8 py-3"
              >
                <Home className="mr-2 h-4 w-4" />
                Retour à l&apos;accueil
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => navigate(-1)}
                className="px-8 py-3"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Page précédente
              </Button>
            </div>

            <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-semibold mb-2">Suggestions :</h3>
              <ul className="text-left space-y-2 text-slate-600 dark:text-slate-400">
                <li>• Vérifiez l&apos;orthographe de l&apos;URL</li>
                <li>• Utilisez le menu de navigation</li>
                <li>• Retournez à la page d&apos;accueil</li>
                <li>• Contactez notre support si le problème persiste</li>
              </ul>
            </div>

            <Button 
              variant="ghost"
              onClick={() => navigate('/help')}
              className="mt-4"
            >
              <Search className="mr-2 h-4 w-4" />
              Rechercher dans l&apos;aide
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-12 text-sm text-slate-400"
          >
            EmotionsCare - Votre bien-être, notre priorité
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default NotFoundPage;
