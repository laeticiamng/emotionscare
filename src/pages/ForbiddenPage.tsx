/**
 * ForbiddenPage - Page 403 Accès interdit
 * TICKET: FE/BE-Router-Cleanup-01
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Routes, getDashboardRoute } from '@/routerV2/helpers';
import { useAuth } from '@/contexts/AuthContext';
import { Lock, ArrowLeft, Home } from 'lucide-react';

const ForbiddenPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">403</h1>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Accès interdit
            </h2>
            <p className="text-gray-600">
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>
          </div>

          <div className="space-y-3">
            {isAuthenticated && user ? (
              <Link to={getDashboardRoute(user.role)}>
                <Button className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Mon dashboard
                </Button>
              </Link>
            ) : (
              <Link to={Routes.login()}>
                <Button className="w-full">
                  Se connecter
                </Button>
              </Link>
            )}
            
            <Link to={Routes.home()}>
              <Button variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Button>
            </Link>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Besoin d'aide ?</strong><br />
              <Link to={Routes.contact()} className="underline hover:text-yellow-600">
                Contactez notre équipe support
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForbiddenPage;