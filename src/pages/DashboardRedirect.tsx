
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getModeDashboardPath, getModeLoginPath, normalizeUserMode } from '@/utils/userModeHelpers';
import { logDashboardAccessDenied } from '@/utils/securityLogs';
import PageLoader from '@/components/PageLoader';
import { motion } from 'framer-motion';

/**
 * Redirects the user to the correct dashboard based on their role.
 * Unauthenticated users are redirected to the appropriate login page.
 */
const DashboardRedirect: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [redirectMessage, setRedirectMessage] = useState('Préparation de votre espace...');

  useEffect(() => {
    if (!isAuthenticated) {
      setRedirectMessage('Redirection vers la page de connexion...');
      
      const timer = setTimeout(() => {
        logDashboardAccessDenied(null, location.pathname);
        navigate(getModeLoginPath('b2c'), { replace: true });
      }, 1500); // Short delay for a smoother experience
      
      return () => clearTimeout(timer);
    }

    if (user) {
      setRedirectMessage(`Chargement de votre espace personnel...`);
      
      const timer = setTimeout(() => {
        const role = normalizeUserMode(user.role);
        navigate(getModeDashboardPath(role), { replace: true });
      }, 1800); // Short delay for a smoother experience
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, navigate, location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <PageLoader 
        isLoading={true}
        variant="premium"
        duration={3000}
        message={redirectMessage}
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-4"
      >
        <p className="text-sm text-muted-foreground">
          Veuillez patienter un instant...
        </p>
      </motion.div>
    </div>
  );
};

export default DashboardRedirect;
