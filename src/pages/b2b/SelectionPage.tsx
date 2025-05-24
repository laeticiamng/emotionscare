
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const B2BSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-8">Solutions Entreprise</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Espace Collaborateur</CardTitle>
              <CardDescription>Accès pour les employés</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/b2b/user/login')}
                className="w-full"
              >
                Se connecter
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Espace Administration</CardTitle>
              <CardDescription>Tableau de bord RH</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/b2b/admin/login')}
                variant="outline"
                className="w-full"
              >
                Administration
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2BSelectionPage;
