
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserMode } from '@/contexts/UserModeContext';
import { Users, Building2 } from 'lucide-react';

const B2BSelection: React.FC = () => {
  const navigate = useNavigate();
  const { setUserMode } = useUserMode();

  const handleSelectUserMode = (mode: 'b2b_user' | 'b2b_admin') => {
    setUserMode(mode);
    localStorage.setItem('userMode', mode);
    
    if (mode === 'b2b_user') {
      navigate('/b2b/user/login');
    } else {
      navigate('/b2b/admin/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Espace professionnel</CardTitle>
            <CardDescription>
              Choisissez votre type d'accès
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full h-auto py-6 justify-start text-left"
              onClick={() => handleSelectUserMode('b2b_user')}
            >
              <div className="flex items-center">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Je suis collaborateur</h3>
                  <p className="text-muted-foreground text-sm">
                    Accédez aux fonctionnalités pour votre bien-être au travail
                  </p>
                </div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="w-full h-auto py-6 justify-start text-left"
              onClick={() => handleSelectUserMode('b2b_admin')}
            >
              <div className="flex items-center">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Je suis administrateur</h3>
                  <p className="text-muted-foreground text-sm">
                    Accédez au tableau de bord et à la gestion de votre organisation
                  </p>
                </div>
              </div>
            </Button>
            
            <div className="pt-4 text-center">
              <Button variant="ghost" onClick={() => navigate('/')}>
                Retour à l'accueil
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BSelection;
