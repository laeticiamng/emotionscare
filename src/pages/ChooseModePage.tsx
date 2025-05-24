
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Building } from 'lucide-react';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Choisissez votre mode d'utilisation</h1>
          <p className="text-xl text-muted-foreground">
            Sélectionnez le mode qui correspond le mieux à vos besoins
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <User className="mx-auto h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Particulier (B2C)</CardTitle>
              <CardDescription>
                Accès personnel aux fonctionnalités de bien-être et méditation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => navigate('/b2c/login')}
              >
                Continuer en tant que particulier
              </Button>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Building className="mx-auto h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Entreprise (B2B)</CardTitle>
              <CardDescription>
                Solutions pour entreprises et professionnels de santé
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => navigate('/b2b/selection')}
              >
                Continuer en tant qu'entreprise
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChooseModePage;
