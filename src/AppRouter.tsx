
import React, { Suspense } from 'react';
import { useRoutes, useNavigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { routes } from './router';
import { useDashboardMonitor } from './hooks/use-dashboard-monitor';
import { useAuth } from '@/contexts/AuthContext';
import usePreferredAccess from './hooks/use-preferred-access';
import { motion, AnimatePresence } from 'framer-motion';

const AppRouter: React.FC = () => {
  const content = useRoutes(routes);
  const location = useLocation();

  // Add monitoring for dashboard access issues
  useDashboardMonitor();
  // Apply unified access redirections
  usePreferredAccess();
  
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
        transition={{ duration: 0.3 }}
      >
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner />
          </div>
        }>
          {content}
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

export default AppRouter;
