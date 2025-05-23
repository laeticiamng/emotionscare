
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { getModeDashboardPath } from '@/utils/userModeHelpers';
import { 
  Home, 
  ArrowLeft, 
  Search,
  MapPin,
  AlertTriangle
} from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { userMode } = useUserMode();

  const handleGoHome = () => {
    if (isAuthenticated && userMode) {
      navigate(getModeDashboardPath(userMode));
    } else {
      navigate('/');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const popularRoutes = [
    { path: '/', label: 'Accueil', description: 'Page d\'accueil principale' },
    { path: '/choose-mode', label: 'Choisir un mode', description: 'Sélectionnez votre type d\'accès' },
    { path: '/b2c/login', label: 'Connexion B2C', description: 'Espace particulier' },
    { path: '/b2b/selection', label: 'Espace B2B', description: 'Espace professionnel' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="text-center">
          <CardHeader className="pb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                  404
                </div>
              </div>
            </div>
            
            <CardTitle className="text-3xl font-bold mb-4">
              Oups ! Page introuvable
            </CardTitle>
            <CardDescription className="text-lg">
              La page que vous recherchez n'existe pas ou a été déplacée.
              Ne vous inquiétez pas, nous allons vous aider à retrouver votre chemin !
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleGoHome} size="lg">
                <Home className="h-5 w-5 mr-2" />
                Retour à l'accueil
              </Button>
              <Button onClick={handleGoBack} variant="outline" size="lg">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Page précédente
              </Button>
            </div>

            {/* Popular Routes */}
            <div className="text-left">
              <h3 className="text-lg font-semibold mb-4 text-center flex items-center justify-center">
                <MapPin className="h-5 w-5 mr-2" />
                Pages populaires
              </h3>
              <div className="grid gap-3">
                {popularRoutes.map((route) => (
                  <Card 
                    key={route.path}
                    className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-primary"
                    onClick={() => navigate(route.path)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{route.label}</h4>
                          <p className="text-sm text-muted-foreground">{route.description}</p>
                        </div>
                        <ArrowLeft className="h-4 w-4 rotate-180 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Search Suggestion */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  Besoin d'aide pour naviguer ?
                </h3>
                <p className="text-blue-800 text-sm mb-4">
                  Si vous cherchez quelque chose de spécifique, n'hésitez pas à nous contacter 
                  ou à explorer les différentes sections de l'application.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>
                    Mon profil
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate('/settings')}>
                    Paramètres
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* URL Display */}
            <div className="text-sm text-muted-foreground">
              <p>URL demandée : <code className="bg-muted px-2 py-1 rounded text-xs">{window.location.pathname}</code></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFoundPage;
