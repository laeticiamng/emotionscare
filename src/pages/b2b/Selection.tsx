
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { toast } from 'sonner';

const B2BSelection: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { setUserMode } = useUserMode();
  
  const handleUserModeSelection = (mode: 'b2b_user' | 'b2b_admin') => {
    setUserMode(mode);
    
    if (isAuthenticated) {
      // Si l'utilisateur est déjà authentifié, rediriger directement vers le tableau de bord
      const dashboardPath = mode === 'b2b_user' ? '/b2b/user/dashboard' : '/b2b/admin/dashboard';
      navigate(dashboardPath);
      toast.success(`Mode ${mode === 'b2b_user' ? 'collaborateur' : 'administrateur'} activé`);
    } else {
      // Sinon, rediriger vers la page de connexion correspondante
      const loginPath = mode === 'b2b_user' ? '/b2b/user/login' : '/b2b/admin/login';
      navigate(loginPath);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">EmotionsCare | Entreprise</h1>
          <p className="text-muted-foreground mt-2">
            Sélectionnez le mode d'accès à la plateforme
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-50 dark:from-blue-950 dark:opacity-25" />
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" /> Espace Collaborateur
              </CardTitle>
              <CardDescription>
                Accédez à votre espace bien-être en entreprise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Analyse émotionnelle personnalisée</li>
                <li>Accès aux sessions de bien-être</li>
                <li>Suivi de vos activités</li>
                <li>Espace d'équipe</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => handleUserModeSelection('b2b_user')}
              >
                Accéder à l'espace collaborateur
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-50 dark:from-purple-950 dark:opacity-25" />
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShieldCheck className="h-5 w-5 mr-2" /> Espace Administrateur
              </CardTitle>
              <CardDescription>
                Gérez votre organisation et vos collaborateurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Gestion des utilisateurs</li>
                <li>Analyse des données émotionnelles</li>
                <li>Organisation des sessions</li>
                <li>Configuration et paramètres</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => handleUserModeSelection('b2b_admin')}
              >
                Accéder à l'espace administrateur
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="text-center mt-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
          >
            Retour à l'accueil
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Vous êtes un particulier ?{' '}
            <Button 
              variant="link" 
              className="p-0 h-auto" 
              onClick={() => navigate('/b2c/login')}
            >
              Accéder à l'espace personnel
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default B2BSelection;
