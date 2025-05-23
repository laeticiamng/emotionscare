
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, Building2 } from 'lucide-react';
import { useUserMode } from '@/contexts/UserModeContext';
import { Separator } from '@/components/ui/separator';
import LoadingAnimation from '@/components/ui/loading-animation';

const B2BSelection: React.FC = () => {
  const navigate = useNavigate();
  const { setUserMode, isLoading } = useUserMode();

  const handleSelectMode = (mode: 'b2b_user' | 'b2b_admin') => {
    setUserMode(mode);
    localStorage.setItem('userMode', mode);
    
    if (mode === 'b2b_user') {
      navigate('/b2b/user/login');
    } else {
      navigate('/b2b/admin/login');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingAnimation size="large" text="Chargement des options..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Espace Professionnel</CardTitle>
          <CardDescription className="text-lg mt-2">
            Choisissez le type d'accès à votre espace professionnel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Button
              onClick={() => handleSelectMode('b2b_user')}
              variant="outline"
              className="h-auto flex flex-col items-center gap-4 p-8 border-2 hover:border-primary hover:bg-primary/5 transition-all"
            >
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-medium mb-2">Collaborateur</h3>
                <p className="text-sm text-muted-foreground">
                  Accédez à votre espace collaborateur pour suivre votre bien-être et interagir avec votre équipe
                </p>
              </div>
            </Button>
            
            <Button
              onClick={() => handleSelectMode('b2b_admin')}
              variant="outline"
              className="h-auto flex flex-col items-center gap-4 p-8 border-2 hover:border-primary hover:bg-primary/5 transition-all"
            >
              <div className="bg-primary/10 p-3 rounded-full">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-medium mb-2">Administrateur</h3>
                <p className="text-sm text-muted-foreground">
                  Gérez votre organisation, suivez les indicateurs de bien-être et administrez les utilisateurs
                </p>
              </div>
            </Button>
          </div>

          <Separator className="my-4" />
          
          <div className="flex flex-col items-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Vous êtes un particulier ? Accédez à votre espace personnel
            </p>
            <Button 
              onClick={() => {
                setUserMode('b2c');
                localStorage.setItem('userMode', 'b2c');
                navigate('/b2c/login');
              }}
              variant="default"
              className="w-full max-w-xs"
            >
              <Building2 className="mr-2 h-4 w-4" />
              Espace Particulier
            </Button>
            
            <Button 
              onClick={() => navigate('/')} 
              variant="ghost" 
              className="mt-8"
            >
              Retour à l'accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BSelection;
