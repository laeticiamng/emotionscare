
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-6xl font-bold text-primary mb-6">404</h1>
        <h2 className="text-3xl font-semibold mb-4">Page non trouvée</h2>
        <p className="text-xl text-muted-foreground mb-10 max-w-md">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/')}
            className="px-8"
          >
            Retour à l'accueil
          </Button>
          <div className="pt-2">
            <Button 
              variant="link"
              onClick={() => navigate(-1)}
            >
              Retour à la page précédente
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
