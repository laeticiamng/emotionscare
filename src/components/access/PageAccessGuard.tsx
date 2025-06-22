
import React, { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, Lock, Eye, Clock, AlertTriangle, 
  CheckCircle, User, Settings 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingAnimation from '@/components/ui/loading-animation';

interface PageAccessGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  showAccessInfo?: boolean;
}

const PageAccessGuard: React.FC<PageAccessGuardProps> = ({ 
  children, 
  requiredRoles = [],
  showAccessInfo = true 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { userMode } = useUserMode();
  const location = useLocation();
  const [accessGranted, setAccessGranted] = useState(false);
  const [accessChecked, setAccessChecked] = useState(false);
  const [accessDetails, setAccessDetails] = useState({
    timestamp: new Date().toISOString(),
    path: location.pathname,
    userRole: user?.role || 'non-authentifié',
    userMode: userMode || 'non-défini',
    success: false,
    reason: ''
  });

  useEffect(() => {
    const checkAccess = () => {
      if (isLoading) return;

      const currentTime = new Date().toISOString();
      const details = {
        timestamp: currentTime,
        path: location.pathname,
        userRole: user?.role || 'non-authentifié',
        userMode: userMode || 'non-défini',
        success: false,
        reason: ''
      };

      // Vérification de l'authentification
      if (!isAuthenticated) {
        details.success = false;
        details.reason = 'Utilisateur non authentifié';
        setAccessDetails(details);
        setAccessChecked(true);
        return;
      }

      // Vérification des rôles requis si spécifiés
      if (requiredRoles.length > 0 && user) {
        if (!requiredRoles.includes(user.role)) {
          details.success = false;
          details.reason = `Rôle ${user.role} non autorisé. Rôles requis: ${requiredRoles.join(', ')}`;
          setAccessDetails(details);
          setAccessChecked(true);
          return;
        }
      }

      // Logique d'accès spécifique par page
      const pageSpecificAccess = checkPageSpecificAccess(location.pathname, user?.role);
      if (!pageSpecificAccess.allowed) {
        details.success = false;
        details.reason = pageSpecificAccess.reason;
        setAccessDetails(details);
        setAccessChecked(true);
        return;
      }

      // Accès accordé
      details.success = true;
      details.reason = 'Accès autorisé';
      setAccessDetails(details);
      setAccessGranted(true);
      setAccessChecked(true);

      // Log de l'accès réussi
      console.log(`✅ Accès accordé: ${location.pathname} pour ${user?.role}`);
    };

    checkAccess();
  }, [isAuthenticated, user, isLoading, location.pathname, userMode, requiredRoles]);

  const checkPageSpecificAccess = (path: string, role?: string) => {
    // Pages admin uniquement
    const adminOnlyPages = ['/teams', '/reports', '/events', '/optimisation', '/settings'];
    if (adminOnlyPages.some(page => path.startsWith(page))) {
      if (role !== 'b2b_admin') {
        return { 
          allowed: false, 
          reason: 'Page réservée aux administrateurs B2B' 
        };
      }
    }

    // Pages B2B uniquement
    const b2bPages = ['/teams', '/reports', '/events'];
    if (b2bPages.some(page => path.startsWith(page))) {
      if (!['b2b_user', 'b2b_admin'].includes(role || '')) {
        return { 
          allowed: false, 
          reason: 'Page réservée aux utilisateurs B2B' 
        };
      }
    }

    return { allowed: true, reason: 'Accès autorisé' };
  };

  const getRedirectPath = () => {
    if (!isAuthenticated) {
      return '/login';
    }
    
    switch (user?.role) {
      case 'b2c':
        return '/b2c/dashboard';
      case 'b2b_user':
        return '/b2b/user/dashboard';
      case 'b2b_admin':
        return '/b2b/admin/dashboard';
      default:
        return '/';
    }
  };

  // Affichage du loader pendant la vérification
  if (isLoading || !accessChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <LoadingAnimation text="Vérification des autorisations..." />
      </div>
    );
  }

  // Redirection si accès refusé
  if (!accessGranted) {
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    // Affichage de la page d'accès refusé
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl"
        >
          <Card className="border-red-200">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <Lock className="h-10 w-10 text-red-600" />
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-red-800 mb-2">
                    Accès Refusé
                  </h2>
                  <p className="text-red-600 mb-4">
                    {accessDetails.reason}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-left">
                  <h3 className="font-medium text-gray-800 mb-3">Détails de l'accès :</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Page demandée :</span>
                      <p className="font-mono text-xs">{accessDetails.path}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Votre rôle :</span>
                      <p className="font-medium">{accessDetails.userRole}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Mode actuel :</span>
                      <p className="font-medium">{accessDetails.userMode}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Horodatage :</span>
                      <p className="text-xs">{new Date(accessDetails.timestamp).toLocaleString('fr-FR')}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    onClick={() => window.location.href = getRedirectPath()}
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Aller au tableau de bord
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2"
                  >
                    Retour
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Indicateur d'accès (en développement uniquement)
  const AccessIndicator = () => (
    <AnimatePresence>
      {process.env.NODE_ENV === 'development' && showAccessInfo && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed top-20 right-4 z-50 max-w-sm"
        >
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Accès Autorisé</span>
              </div>
              <div className="space-y-1 text-xs text-green-700">
                <p><strong>Page:</strong> {accessDetails.path}</p>
                <p><strong>Rôle:</strong> {accessDetails.userRole}</p>
                <p><strong>Mode:</strong> {accessDetails.userMode}</p>
              </div>
              <Badge variant="outline" className="mt-2 text-xs bg-green-100 text-green-800">
                <Eye className="h-3 w-3 mr-1" />
                Surveillé
              </Badge>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Rendu du contenu avec indicateur d'accès
  return (
    <>
      {children}
      <AccessIndicator />
    </>
  );
};

export default PageAccessGuard;
