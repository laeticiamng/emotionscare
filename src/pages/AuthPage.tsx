
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Building2, ArrowLeft } from 'lucide-react';

const AuthPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Button asChild variant="ghost" className="mb-6">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Link>
          </Button>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Authentification</CardTitle>
              <CardDescription>
                Choisissez votre type d'accès pour vous connecter
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full" size="lg">
                <Link to="/b2c/login">
                  <Heart className="h-4 w-4 mr-2" />
                  Connexion Particulier
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full" size="lg">
                <Link to="/b2b/selection">
                  <Building2 className="h-4 w-4 mr-2" />
                  Connexion Entreprise
                </Link>
              </Button>
              
              <div className="text-center pt-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Pas encore de compte ?{' '}
                  <Link to="/choose-mode" className="text-blue-600 hover:underline">
                    Découvrir EmotionsCare
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
