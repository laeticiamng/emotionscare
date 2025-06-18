
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { User, Building, Shield } from 'lucide-react';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenue sur EmotionsCare
          </h1>
          <p className="text-lg text-gray-600">
            Choisissez votre mode d'accès pour commencer
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <User className="mx-auto h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Particulier</CardTitle>
              <CardDescription>
                Accès personnel à votre bien-être émotionnel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => navigate('/b2c/login')}
              >
                Accéder
              </Button>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Building className="mx-auto h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Collaborateur</CardTitle>
              <CardDescription>
                Accès professionnel pour les employés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => navigate('/b2b/user/login')}
              >
                Accéder
              </Button>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Shield className="mx-auto h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Administrateur RH</CardTitle>
              <CardDescription>
                Gestion et supervision des équipes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => navigate('/b2b/admin/login')}
              >
                Accéder
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChooseModePage;
