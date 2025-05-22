
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserMode } from '@/contexts/UserModeContext';

const ModeSwitcher: React.FC = () => {
  const navigate = useNavigate();
  const { setUserMode } = useUserMode();
  
  const handleSelectMode = (mode: 'b2c' | 'b2b_user' | 'b2b_admin') => {
    setUserMode(mode);
    
    if (mode === 'b2c') {
      navigate('/b2c/login');
    } else if (mode === 'b2b_user') {
      navigate('/b2b/user/login');
    } else if (mode === 'b2b_admin') {
      navigate('/b2b/admin/login');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">Choisissez votre espace</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Particulier</CardTitle>
              <CardDescription>Accès à votre espace personnel</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Gérez votre bien-être émotionnel et accédez à nos outils personnels.
              </p>
              <Button 
                className="w-full" 
                onClick={() => handleSelectMode('b2c')}
              >
                Accéder
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Collaborateur</CardTitle>
              <CardDescription>Accès à votre espace entreprise</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Accédez aux fonctionnalités de bien-être pour les employés.
              </p>
              <Button 
                className="w-full" 
                onClick={() => handleSelectMode('b2b_user')}
              >
                Accéder
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Administration</CardTitle>
              <CardDescription>Espace RH et management</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Gérez les utilisateurs et analysez les données de votre organisation.
              </p>
              <Button 
                className="w-full" 
                onClick={() => handleSelectMode('b2b_admin')}
              >
                Accéder
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 text-center">
          <Button variant="ghost" onClick={() => navigate('/')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModeSwitcher;
