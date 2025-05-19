
import React, { Suspense, useEffect } from 'react';
import { useRoutes, useLocation } from 'react-router-dom';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { routes } from './router';
import { useDashboardMonitor } from './hooks/use-dashboard-monitor';
import { usePreferredAccess } from './hooks/use-preferred-access';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserMode } from '@/contexts/UserModeContext';
import { useToast } from '@/hooks/use-toast';

const AppRouter: React.FC = () => {
  const content = useRoutes(routes);
  const location = useLocation();
  const { userMode } = useUserMode();
  const { toast } = useToast();

  // Add monitoring for dashboard access issues
  useDashboardMonitor();
  
  // Apply unified access redirections
  usePreferredAccess();
  
  // Show a toast when navigating to key pages for better feedback
  useEffect(() => {
    const keyPageMessages: Record<string, { title: string, description: string }> = {
      '/b2c/dashboard': {
        title: 'Espace Personnel',
        description: 'Bienvenue dans votre espace personnel EmotionsCare'
      },
      '/b2b/user/dashboard': {
        title: 'Espace Collaborateur',
        description: 'Bienvenue dans votre espace professionnel'
      },
      '/b2b/admin/dashboard': {
        title: 'Espace Administrateur',
        description: 'Bienvenue dans votre console d\'administration'
      }
    };
    
    if (keyPageMessages[location.pathname]) {
      const { title, description } = keyPageMessages[location.pathname];
      toast({
        title,
        description,
        variant: "default",
      });
    }
  }, [location.pathname, toast]);
  
  if (!content) {
    console.error("[AppRouter] No route matches the current path:", location.pathname);
  }
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ 
          duration: 0.3,
          type: 'spring',
          stiffness: 260,
          damping: 20
        }}
        className="min-h-screen flex flex-col"
      >
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <LoadingSpinner />
            </motion.div>
          </div>
        }>
          {content}
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

export default AppRouter;
