
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Building, Shield } from 'lucide-react';

const B2BSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 p-4">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Accès Professionnel
          </h1>
          <p className="text-lg text-gray-600">
            Sélectionnez votre type d'accès B2B
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Building className="mx-auto h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Collaborateur</CardTitle>
              <CardDescription>
                Accès aux outils de bien-être personnel en entreprise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => navigate('/b2b/user/login')}
              >
                Se connecter
              </Button>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Shield className="mx-auto h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Administrateur RH</CardTitle>
              <CardDescription>
                Gestion des équipes et analyses organisationnelles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => navigate('/b2b/admin/login')}
              >
                Se connecter
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mt-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/choose-mode')}
          >
            Retour
          </Button>
        </div>
      </div>
    </div>
  );
};

export default B2BSelectionPage;
