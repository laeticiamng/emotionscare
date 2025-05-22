
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user';
import { normalizeUserMode, getModeLoginPath, getModeDashboardPath } from '@/utils/userModeHelpers';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useActivity } from '@/hooks/useActivity';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  redirectTo
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const { logActivity } = useActivity({ anonymize: true });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  // Effect for handling transitions and showing feedback
  useEffect(() => {
    if (!isLoading) {
      // If not authenticated
      if (!isAuthenticated) {
        setIsTransitioning(true);
        toast({
          title: "Accès restreint",
          description: "Veuillez vous connecter pour accéder à cette page",
          variant: "destructive"
        });
        
        // Add a small delay for transition
        setTimeout(() => setIsTransitioning(false), 300);
      } 
      // If authenticated but wrong role
      else if (requiredRole && user?.role) {
        const normalizedUserRole = normalizeUserMode(user.role);
        const normalizedRequiredRole = normalizeUserMode(requiredRole);
        
        if (normalizedUserRole !== normalizedRequiredRole) {
          setIsTransitioning(true);
          setAccessDenied(true);
          
          toast({
            title: "Accès non autorisé",
            description: `Cette section est réservée aux utilisateurs ${normalizedRequiredRole === 'b2b_admin' ? 'administrateurs' : normalizedRequiredRole === 'b2b_user' ? 'collaborateurs' : 'particuliers'}`,
            variant: "destructive"
          });
          
          // Add a small delay for transition
          setTimeout(() => setIsTransitioning(false), 300);
        }
      }
    }
  }, [isAuthenticated, user?.role, requiredRole, isLoading, toast]);

  // Show loading state if auth state is still being determined
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center min-h-[50vh] p-8"
      >
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Vérification de votre accès...</p>
      </motion.div>
    );
  }

  // If not authenticated and trying to access a protected route, redirect to login
  if (!isAuthenticated) {
    // Determine which login page to use based on the current path
    let loginPath = getModeLoginPath('b2c');
    
    if (location.pathname.includes('/b2b/admin')) {
      loginPath = getModeLoginPath('b2b_admin');
    } else if (location.pathname.includes('/b2b/user')) {
      loginPath = getModeLoginPath('b2b_user');
    }
    
    // Log blocked access attempt for monitoring purposes
    logActivity('unauthorized_access', {
      path: location.pathname,
      timestamp: new Date().toISOString(),
    });

    return (
      <AnimatePresence mode="wait">
        {isTransitioning ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[50vh] p-8"
          >
            <p className="text-lg text-muted-foreground">Redirection vers la page de connexion...</p>
          </motion.div>
        ) : (
          <Navigate to={loginPath} state={{ from: location }} />
        )}
      </AnimatePresence>
    );
  }

  // If a specific role is required and the user doesn't have it, redirect
  if (requiredRole && user?.role) {
    const normalizedUserRole = normalizeUserMode(user.role);
    const normalizedRequiredRole = normalizeUserMode(requiredRole);
    
    if (normalizedUserRole !== normalizedRequiredRole) {
      // If user is authenticated but doesn't have the right role, redirect to their default dashboard
      const userDashboardPath = getModeDashboardPath(normalizedUserRole);
      
      return (
        <AnimatePresence mode="wait">
          {isTransitioning ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center"
            >
              {accessDenied && (
                <>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-4 rounded-full bg-destructive/20 mb-4"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-destructive h-8 w-8"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </motion.div>
                  <h2 className="text-xl font-bold mb-2">Accès non autorisé</h2>
                  <p className="text-muted-foreground mb-4">Vous êtes redirigé vers votre tableau de bord</p>
                </>
              )}
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </motion.div>
          ) : (
            <Navigate to={redirectTo || userDashboardPath} />
          )}
        </AnimatePresence>
      );
    }
  }

  // User is authenticated and has required role (or no specific role required)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default ProtectedRoute;
