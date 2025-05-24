
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Shield } from 'lucide-react';

const B2BSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Accès Entreprise</h1>
          <p className="text-xl text-muted-foreground">
            Choisissez votre type d'accès
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Users className="mx-auto h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Utilisateur</CardTitle>
              <CardDescription>
                Accès aux outils de bien-être en entreprise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => navigate('/b2b/user/login')}
              >
                Accès Utilisateur
              </Button>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Shield className="mx-auto h-12 w-12 text-red-600 mb-4" />
              <CardTitle>Administrateur</CardTitle>
              <CardDescription>
                Gestion et administration de la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => navigate('/b2b/admin/login')}
              >
                Accès Administrateur
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2BSelectionPage;
