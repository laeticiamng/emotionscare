
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User, ShieldCheck, UserCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { toast } from 'sonner';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { setUserMode } = useUserMode();
  
  const handleUserModeSelection = (mode: 'b2c' | 'b2b_user' | 'b2b_admin') => {
    setUserMode(mode);
    
    if (isAuthenticated) {
      // Si l'utilisateur est déjà authentifié, rediriger directement vers le tableau de bord
      let dashboardPath = '/b2c/dashboard';
      if (mode === 'b2b_user') dashboardPath = '/b2b/user/dashboard';
      if (mode === 'b2b_admin') dashboardPath = '/b2b/admin/dashboard';
      
      navigate(dashboardPath);
      
      const modeName = 
        mode === 'b2c' ? 'personnel' : 
        mode === 'b2b_user' ? 'collaborateur' : 'administrateur';
        
      toast.success(`Mode ${modeName} activé`);
    } else {
      // Sinon, rediriger vers la page de connexion correspondante
      let loginPath = '/b2c/login';
      if (mode === 'b2b_user') loginPath = '/b2b/user/login';
      if (mode === 'b2b_admin') loginPath = '/b2b/admin/login';
      
      navigate(loginPath);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">EmotionsCare</h1>
          <p className="text-muted-foreground mt-2">
            Choisissez votre mode d'accès à la plateforme
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-50 dark:from-green-950 dark:opacity-25" />
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCircle className="h-5 w-5 mr-2" /> Espace Personnel
              </CardTitle>
              <CardDescription>
                Accédez à votre espace bien-être personnel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Analyse émotionnelle personnalisée</li>
                <li>Contenu adapté à vos besoins</li>
                <li>Journal émotionnel privé</li>
                <li>Suivi de votre progression</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => handleUserModeSelection('b2c')}
              >
                Mode personnel
              </Button>
            </CardFooter>
          </Card>
          
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
                <li>Analyse émotionnelle en contexte professionnel</li>
                <li>Accès aux sessions de bien-être</li>
                <li>Suivi de vos activités d'équipe</li>
                <li>Ressources spécifiques entreprise</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => handleUserModeSelection('b2b_user')}
              >
                Mode collaborateur
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
                Mode administrateur
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
        </div>
      </div>
    </div>
  );
};

export default ChooseModePage;
