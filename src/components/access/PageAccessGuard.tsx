
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { useSecurityContext } from '@/components/security/SecurityProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft, Home, Shield } from 'lucide-react';
import { UNIFIED_ROUTES } from '@/utils/routeUtils';
import { motion } from 'framer-motion';

interface PageAccessGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requiredMode?: string;
  adminOnly?: boolean;
  b2bOnly?: boolean;
}

const PageAccessGuard: React.FC<PageAccessGuardProps> = ({
  children,
  requiredRoles = [],
  requiredMode,
  adminOnly = false,
  b2bOnly = false
}) => {
  const { user, isAuthenticated } = useAuth();
  const { userMode } = useUserMode();
  const { logAccess } = useSecurityContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [accessError, setAccessError] = useState<string | null>(null);

  useEffect(() => {
    checkAccess();
  }, [user, userMode, location.pathname]);

  const checkAccess = () => {
    // Vérifier l'authentification
    if (!isAuthenticated) {
      const reason = 'Vous devez être connecté pour accéder à cette page.';
      setAccessError(reason);
      logAccess(location.pathname, false, reason);
      
      // Dispatch custom event for unauthorized access
      window.dispatchEvent(new CustomEvent('unauthorized-access', {
        detail: { page: location.pathname, reason }
      }));
      return;
    }

    // Vérifier le mode utilisateur
    if (requiredMode && userMode !== requiredMode) {
      const reason = `Cette page nécessite le mode ${requiredMode}.`;
      setAccessError(reason);
      logAccess(location.pathname, false, reason);
      return;
    }

    // Vérifier les rôles requis
    if (requiredRoles.length > 0 && user?.role && !requiredRoles.includes(user.role)) {
      const reason = 'Vous n\'avez pas les permissions nécessaires pour accéder à cette page.';
      setAccessError(reason);
      logAccess(location.pathname, false, reason);
      return;
    }

    // Vérifier l'accès admin uniquement
    if (adminOnly && user?.role !== 'b2b_admin' && user?.role !== 'admin') {
      const reason = 'Cette page est réservée aux administrateurs.';
      setAccessError(reason);
      logAccess(location.pathname, false, reason);
      return;
    }

    // Vérifier l'accès B2B uniquement
    if (b2bOnly && !userMode?.startsWith('b2b_')) {
      const reason = 'Cette page est réservée aux utilisateurs B2B.';
      setAccessError(reason);
      logAccess(location.pathname, false, reason);
      return;
    }

    // Accès autorisé
    setAccessError(null);
    logAccess(location.pathname, true);
  };

  const getRedirectPath = () => {
    if (!userMode) return UNIFIED_ROUTES.CHOOSE_MODE;
    
    switch (userMode) {
      case 'b2c':
        return UNIFIED_ROUTES.B2C_DASHBOARD;
      case 'b2b_user':
        return UNIFIED_ROUTES.B2B_USER_DASHBOARD;
      case 'b2b_admin':
        return UNIFIED_ROUTES.B2B_ADMIN_DASHBOARD;
      default:
        return UNIFIED_ROUTES.HOME;
    }
  };

  if (accessError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="max-w-md w-full border-red-200 shadow-xl">
            <CardContent className="p-6 text-center space-y-6">
              <motion.div 
                className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mx-auto"
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Shield className="h-10 w-10 text-red-600" />
              </motion.div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Accès refusé
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {accessError}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Retour
                </Button>
                <Button 
                  onClick={() => navigate(getRedirectPath())}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                >
                  <Home className="h-4 w-4" />
                  Tableau de bord
                </Button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 space-y-2">
                <div className="font-medium text-gray-900 mb-2">Informations de diagnostic :</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="font-medium">Mode actuel:</span>
                    <br />
                    {userMode || 'Non défini'}
                  </div>
                  <div>
                    <span className="font-medium">Rôle:</span>
                    <br />
                    {user?.role || 'Non défini'}
                  </div>
                </div>
                <div className="text-xs pt-2 border-t">
                  <span className="font-medium">Page demandée:</span> {location.pathname}
                </div>
              </div>

              <Button 
                variant="link" 
                onClick={() => navigate('/access-diagnostic')}
                className="text-xs text-muted-foreground"
              >
                Diagnostic complet des accès
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PageAccessGuard;
