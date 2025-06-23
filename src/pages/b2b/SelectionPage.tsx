
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Shield } from 'lucide-react';

const B2BSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main data-testid="page-root" className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Sélection B2B</h1>
          <p className="text-xl text-muted-foreground">
            Choisissez votre profil pour accéder à EmotionsCare
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <Users className="h-16 w-16 mx-auto mb-4 text-blue-500" />
              <CardTitle className="text-2xl">Utilisateur</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Accès aux fonctionnalités de bien-être et d'analyse émotionnelle
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={() => navigate('/b2b/user/login')}
                  className="w-full"
                >
                  Se connecter
                </Button>
                <Button 
                  onClick={() => navigate('/b2b/user/register')}
                  variant="outline"
                  className="w-full"
                >
                  Créer un compte
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <Shield className="h-16 w-16 mx-auto mb-4 text-green-500" />
              <CardTitle className="text-2xl">Administrateur</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Gestion d'équipe, rapports et administration de la plateforme
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={() => navigate('/b2b/admin/login')}
                  className="w-full"
                >
                  Connexion Admin
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Button 
            onClick={() => navigate('/')}
            variant="ghost"
          >
            ← Retour à l'accueil
          </Button>
        </div>
      </div>
    </main>
  );
};

export default B2BSelectionPage;
