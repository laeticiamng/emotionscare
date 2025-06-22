
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, CheckCircle, Eye, Lock, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageAccessGuardProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  requiredRoles?: string[];
  fallbackComponent?: React.ReactNode;
}

interface AccessInfo {
  hasAccess: boolean;
  userRole: string;
  pagePath: string;
  accessLevel: 'full' | 'limited' | 'denied';
  restrictions?: string[];
  recommendations?: string[];
}

const PageAccessGuard: React.FC<PageAccessGuardProps> = ({
  children,
  adminOnly = false,
  requiredRoles = [],
  fallbackComponent
}) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [accessInfo, setAccessInfo] = useState<AccessInfo | null>(null);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  useEffect(() => {
    // Simulate access verification logic
    const verifyAccess = () => {
      if (!isAuthenticated || !user) {
        setAccessInfo({
          hasAccess: false,
          userRole: 'anonymous',
          pagePath: location.pathname,
          accessLevel: 'denied',
          restrictions: ['Authentification requise'],
          recommendations: ['Veuillez vous connecter pour accéder à cette page']
        });
        return;
      }

      const userRole = user.role || 'user';
      let hasAccess = true;
      let accessLevel: 'full' | 'limited' | 'denied' = 'full';
      const restrictions: string[] = [];
      const recommendations: string[] = [];

      // Check admin-only access
      if (adminOnly && !['b2b_admin', 'admin'].includes(userRole)) {
        hasAccess = false;
        accessLevel = 'denied';
        restrictions.push('Accès administrateur requis');
        recommendations.push('Contactez votre administrateur pour obtenir les permissions nécessaires');
      }

      // Check required roles
      if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
        hasAccess = false;
        accessLevel = 'denied';
        restrictions.push(`Rôles autorisés: ${requiredRoles.join(', ')}`);
      }

      // Role-specific access logic
      switch (location.pathname) {
        case '/teams':
        case '/reports':
        case '/events':
        case '/optimisation':
          if (!['b2b_admin'].includes(userRole)) {
            hasAccess = false;
            accessLevel = 'denied';
            restrictions.push('Accès réservé aux administrateurs RH');
          }
          break;
        
        case '/settings':
          if (userRole === 'b2c') {
            accessLevel = 'limited';
            restrictions.push('Certaines options avancées non disponibles');
            recommendations.push('Mode personnel : fonctionnalités limitées');
          }
          break;

        case '/security':
          if (userRole === 'b2c') {
            recommendations.push('Sécurité personnelle - fonctionnalités adaptées');
          }
          break;
      }

      setAccessInfo({
        hasAccess,
        userRole,
        pagePath: location.pathname,
        accessLevel,
        restrictions,
        recommendations
      });
    };

    verifyAccess();
  }, [isAuthenticated, user, location.pathname, adminOnly, requiredRoles]);

  // Log access attempt for audit purposes
  useEffect(() => {
    if (accessInfo) {
      console.log('Page Access Audit:', {
        user: user?.email || 'anonymous',
        role: accessInfo.userRole,
        page: accessInfo.pagePath,
        access: accessInfo.hasAccess,
        level: accessInfo.accessLevel,
        timestamp: new Date().toISOString()
      });
      
      // Dispatch custom event for security monitoring
      window.dispatchEvent(new CustomEvent('page-access', {
        detail: {
          success: accessInfo.hasAccess,
          page: accessInfo.pagePath,
          role: accessInfo.userRole,
          level: accessInfo.accessLevel
        }
      }));
    }
  }, [accessInfo, user]);

  if (!accessInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!accessInfo.hasAccess) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }

    return (
      <div className="container mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Lock className="h-5 w-5" />
                Accès Refusé
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  Rôle: {accessInfo.userRole}
                </Badge>
                <Badge variant="destructive">
                  Accès: {accessInfo.accessLevel}
                </Badge>
              </div>

              {accessInfo.restrictions && accessInfo.restrictions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    Restrictions
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {accessInfo.restrictions.map((restriction, index) => (
                      <li key={index}>{restriction}</li>
                    ))}
                  </ul>
                </div>
              )}

              {accessInfo.recommendations && accessInfo.recommendations.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Recommandations</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {accessInfo.recommendations.map((recommendation, index) => (
                      <li key={index}>{recommendation}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => window.history.back()}>
                  Retour
                </Button>
                <Button onClick={() => window.location.href = '/'}>
                  Accueil
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Access Level Indicator */}
      <AnimatePresence>
        {accessInfo.accessLevel !== 'full' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4"
          >
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Accès limité - {accessInfo.accessLevel}
                </p>
                {accessInfo.recommendations && accessInfo.recommendations.length > 0 && (
                  <p className="text-xs text-yellow-700 mt-1">
                    {accessInfo.recommendations[0]}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Debug Info Toggle */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDebugInfo(!showDebugInfo)}
          >
            <Eye className="h-4 w-4" />
            Debug Access
          </Button>
        </div>
      )}

      {/* Debug Panel */}
      <AnimatePresence>
        {showDebugInfo && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-4 right-4 w-80 z-50"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Debug - Accès Page</CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2">
                <div className="flex justify-between">
                  <span>Utilisateur:</span>
                  <span>{user?.email || 'anonymous'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rôle:</span>
                  <Badge variant="outline" className="text-xs">
                    {accessInfo.userRole}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Page:</span>
                  <span>{accessInfo.pagePath}</span>
                </div>
                <div className="flex justify-between">
                  <span>Accès:</span>
                  <Badge variant={accessInfo.hasAccess ? 'default' : 'destructive'} className="text-xs">
                    {accessInfo.accessLevel}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  {accessInfo.hasAccess ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Lock className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </div>
  );
};

export default PageAccessGuard;
