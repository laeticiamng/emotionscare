
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Shield, Building2 } from 'lucide-react';

const B2BSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Espace Entreprise</h1>
          <p className="text-xl text-gray-600">Choisissez votre type d'accès</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Utilisateur B2B</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Accédez à votre espace personnel de bien-être professionnel
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex gap-2">
                  <Button 
                    onClick={() => navigate('/b2b/user/login')}
                    className="w-full"
                  >
                    Se connecter
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => navigate('/b2b/user/register')}
                    variant="outline"
                    className="w-full"
                  >
                    S'inscrire
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-2xl">Administrateur RH</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Gérez le bien-être de votre organisation
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex gap-2">
                  <Button 
                    onClick={() => navigate('/b2b/admin/login')}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Accès RH
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button 
            onClick={() => navigate('/')}
            variant="ghost"
            className="text-gray-500 hover:text-gray-700"
          >
            <Building2 className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default B2BSelectionPage;
