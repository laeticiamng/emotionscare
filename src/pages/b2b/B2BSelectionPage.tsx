
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Users, Shield, UserCheck } from 'lucide-react';
import { UNIFIED_ROUTES } from '@/utils/routeUtils';

const B2BSelectionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800" data-testid="page-root">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choisissez votre espace professionnel
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Sélectionnez le type d'accès qui correspond à votre rôle dans l'entreprise
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Utilisateur B2B */}
            <Card className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-blue-500">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Utilisateur
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Accès aux fonctionnalités de bien-être émotionnel, coaching personnel et outils de développement
                </p>
                <ul className="text-sm text-gray-500 dark:text-gray-400 mb-6 space-y-2">
                  <li className="flex items-center justify-center">
                    <UserCheck className="h-4 w-4 mr-2 text-green-500" />
                    Scan émotionnel personnel
                  </li>
                  <li className="flex items-center justify-center">
                    <UserCheck className="h-4 w-4 mr-2 text-green-500" />
                    Journal de bord
                  </li>
                  <li className="flex items-center justify-center">
                    <UserCheck className="h-4 w-4 mr-2 text-green-500" />
                    Thérapie musicale
                  </li>
                  <li className="flex items-center justify-center">
                    <UserCheck className="h-4 w-4 mr-2 text-green-500" />
                    Coaching virtuel
                  </li>
                </ul>
                <Button 
                  onClick={() => navigate(UNIFIED_ROUTES.B2B_USER_LOGIN)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Accès Utilisateur
                </Button>
              </CardContent>
            </Card>

            {/* Administrateur B2B */}
            <Card className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-purple-500">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Administrateur
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Gestion des équipes, analyses RH et supervision du bien-être organisationnel
                </p>
                <ul className="text-sm text-gray-500 dark:text-gray-400 mb-6 space-y-2">
                  <li className="flex items-center justify-center">
                    <UserCheck className="h-4 w-4 mr-2 text-green-500" />
                    Tableaux de bord RH
                  </li>
                  <li className="flex items-center justify-center">
                    <UserCheck className="h-4 w-4 mr-2 text-green-500" />
                    Rapports d'équipe
                  </li>
                  <li className="flex items-center justify-center">
                    <UserCheck className="h-4 w-4 mr-2 text-green-500" />
                    Gestion des utilisateurs
                  </li>
                  <li className="flex items-center justify-center">
                    <UserCheck className="h-4 w-4 mr-2 text-green-500" />
                    Analytics avancés
                  </li>
                </ul>
                <Button 
                  onClick={() => navigate(UNIFIED_ROUTES.B2B_ADMIN_LOGIN)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Accès Administrateur
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={() => navigate(UNIFIED_ROUTES.HOME)}
              className="text-gray-600 dark:text-gray-300"
            >
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2BSelectionPage;
