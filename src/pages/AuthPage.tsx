
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Building2, ArrowLeft, LogIn } from 'lucide-react';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Authentification
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Choisissez votre type de connexion
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          <Card className="hover:shadow-xl transition-all duration-300">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Heart className="h-16 w-16 text-pink-500" />
              </div>
              <CardTitle className="text-2xl">Connexion Particulier</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                Accédez à votre espace personnel pour un accompagnement individualisé
              </p>
              <Button 
                onClick={() => navigate('/b2c/login')}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Se connecter
              </Button>
              <Button 
                onClick={() => navigate('/b2c/register')}
                variant="outline"
                className="w-full border-pink-500 text-pink-600 hover:bg-pink-50"
              >
                Créer un compte
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Building2 className="h-16 w-16 text-blue-500" />
              </div>
              <CardTitle className="text-2xl">Connexion Entreprise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                Accédez aux outils professionnels pour le bien-être de vos équipes
              </p>
              <Button 
                onClick={() => navigate('/b2b/selection')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Accéder à l'espace entreprise
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            onClick={() => navigate('/')} 
            variant="ghost"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
