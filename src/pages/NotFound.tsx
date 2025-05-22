
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Enregistrement d'une vue de page 404 pour les analytics
    console.debug('Analytics Event:', 'pageNotFoundViewed', {
      path: window.location.pathname
    });
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">Page introuvable</h2>
            <p className="text-muted-foreground">
              La page que vous recherchez n'existe pas ou a été déplacée.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/')}
              size="lg"
              className="w-full sm:w-auto"
            >
              Retour à l'accueil
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              size="lg"
              className="w-full sm:w-auto"
            >
              Page précédente
            </Button>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-12"
        >
          <p className="text-sm text-muted-foreground">
            Si vous pensez qu'il s'agit d'une erreur, veuillez contacter notre{' '}
            <a 
              href="/support" 
              className="text-primary underline hover:text-primary/80"
            >
              équipe de support
            </a>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
