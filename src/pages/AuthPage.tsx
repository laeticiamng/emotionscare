
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Building2, ArrowLeft, Users, Shield } from 'lucide-react';

const AuthPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Authentification
            </h1>
            <p className="text-xl text-muted-foreground">
              Connectez-vous à votre espace EmotionsCare
            </p>
          </div>

          {/* Auth Options */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* B2C Login */}
            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <Heart className="h-10 w-10 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-xl">Connexion Particulier</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center text-muted-foreground text-sm mb-6">
                  Accédez à votre espace personnel de bien-être émotionnel
                </p>
                
                <div className="space-y-3">
                  <Link to="/b2c/login" className="block">
                    <Button className="w-full bg-blue-500 hover:bg-blue-600">
                      Se connecter
                    </Button>
                  </Link>
                  <Link to="/b2c/register" className="block">
                    <Button variant="outline" className="w-full">
                      Créer un compte
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* B2B Login */}
            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <Building2 className="h-10 w-10 text-purple-600" />
                  </div>
                </div>
                <CardTitle className="text-xl">Connexion Entreprise</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center text-muted-foreground text-sm mb-6">
                  Accédez aux outils de gestion d'équipe et tableaux de bord RH
                </p>
                
                <div className="space-y-3">
                  <Link to="/b2b/user/login" className="block">
                    <Button className="w-full bg-green-500 hover:bg-green-600">
                      <Users className="mr-2 h-4 w-4" />
                      Connexion Collaborateur
                    </Button>
                  </Link>
                  <Link to="/b2b/admin/login" className="block">
                    <Button className="w-full bg-purple-500 hover:bg-purple-600">
                      <Shield className="mr-2 h-4 w-4" />
                      Connexion Administrateur
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Help Section */}
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Besoin d'aide pour vous connecter ?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="ghost">
                Mot de passe oublié ?
              </Button>
              <Button variant="ghost">
                Contacter le support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
