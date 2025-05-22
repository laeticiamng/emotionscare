
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserMode } from '@/contexts/UserModeContext';

const B2BSelection: React.FC = () => {
  const navigate = useNavigate();
  const { setUserMode } = useUserMode();
  
  const handleSelectRole = (role: 'b2b_user' | 'b2b_admin') => {
    setUserMode(role);
    
    if (role === 'b2b_user') {
      navigate('/b2b/user/login');
    } else {
      navigate('/b2b/admin/login');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center mb-2">Solutions entreprise</h1>
        <p className="text-center text-muted-foreground mb-8 max-w-lg mx-auto">
          Sélectionnez votre rôle pour accéder à la plateforme EmotionsCare en entreprise
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Collaborateur</CardTitle>
              <CardDescription>Espace dédié aux employés</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Accédez à vos outils de bien-être émotionnel et de développement personnel en entreprise.
              </p>
              <Button 
                className="w-full" 
                onClick={() => handleSelectRole('b2b_user')}
              >
                Continuer
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Administration</CardTitle>
              <CardDescription>Espace de gestion RH</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Gérez les utilisateurs, accédez aux statistiques et pilotez le bien-être de votre organisation.
              </p>
              <Button 
                className="w-full" 
                onClick={() => handleSelectRole('b2b_admin')}
              >
                Continuer
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 text-center">
          <Button variant="ghost" onClick={() => navigate('/')}>
            Retour à l'accueil
          </Button>
          <Button variant="link" onClick={() => navigate('/pricing')}>
            Voir nos offres
          </Button>
        </div>
      </div>
    </div>
  );
};

export default B2BSelection;
