
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingIllustration } from '@/components/ui/loading-illustration';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const DashboardRedirect: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigate('/b2c/dashboard', { replace: true });
      } else {
        navigate('/b2c/login', { replace: true });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <LoadingIllustration />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center mt-4"
      >
        <p className="text-sm text-muted-foreground">
          Redirection en cours...
        </p>
      </motion.div>
    </div>
  );
};

export default DashboardRedirect;
