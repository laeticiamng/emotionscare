
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Construction, ArrowLeft, Home, List } from 'lucide-react';
import Shell from '@/Shell';
import { useAuth } from '@/contexts/AuthContext';

const NotImplementedPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  return (
    <Shell>
      <div className="container mx-auto px-4 py-16 min-h-[calc(100vh-64px)] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg text-center"
        >
          <motion.div 
            className="mx-auto w-24 h-24 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Construction className="h-12 w-12 text-orange-500" />
          </motion.div>
          
          <h1 className="text-3xl font-bold mb-4">Page en construction</h1>
          <p className="text-muted-foreground mb-8">
            Cette fonctionnalité est actuellement en cours de développement et sera disponible prochainement.
            Merci de votre compréhension.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={16} />
              Retour
            </Button>
            
            <Button
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <Home size={16} />
              Accueil
            </Button>

            {isAuthenticated && (
              <Button
                variant="secondary"
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
              >
                <List size={16} />
                Tableau de bord
              </Button>
            )}
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 text-sm text-muted-foreground"
          >
            <p className="flex items-center justify-center gap-1">
              Vous cherchez une fonctionnalité spécifique ? Consultez notre page d'accueil pour découvrir toutes les fonctionnalités disponibles.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </Shell>
  );
};

export default NotImplementedPage;
