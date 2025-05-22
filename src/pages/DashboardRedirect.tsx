
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LoadingIllustration } from '@/components/ui/loading-illustration';

/**
 * Redirection simple vers la page B2C de connexion
 * Cette page fait office de page d'accueil temporaire
 */
const DashboardRedirect: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/b2c/login', { replace: true });
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <LoadingIllustration />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-4"
      >
        <p className="text-sm text-muted-foreground">
          Redirection vers la page d'accueil...
        </p>
      </motion.div>
    </div>
  );
};

export default DashboardRedirect;
