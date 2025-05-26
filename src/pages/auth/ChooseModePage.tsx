
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, User, Building } from 'lucide-react';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenue sur notre plateforme
          </h1>
          <p className="text-lg text-gray-600">
            Choisissez votre mode d'accès pour commencer
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Mode B2C */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Particulier</CardTitle>
              <CardDescription>
                Accès personnel à votre espace bien-être
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={() => navigate('/b2c/login')}
                className="w-full"
              >
                Accéder en tant que particulier
              </Button>
            </CardContent>
          </Card>

          {/* Mode B2B */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Building className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Entreprise</CardTitle>
              <CardDescription>
                Espace dédié aux collaborateurs et administrateurs
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={() => navigate('/b2b/selection')}
                className="w-full"
                variant="outline"
              >
                Accéder en tant qu'entreprise
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChooseModePage;
