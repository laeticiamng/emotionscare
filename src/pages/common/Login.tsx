
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface LoginProps {
  role?: 'b2c' | 'b2b_user' | 'b2b_admin';
}

const Login: React.FC<LoginProps> = ({ role = 'b2c' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // Determine the current mode based on URL
  const getCurrentMode = () => {
    if (location.pathname.includes('/b2b/admin')) {
      return 'b2b_admin';
    } else if (location.pathname.includes('/b2b/user')) {
      return 'b2b_user';
    }
    return 'b2c';
  };
  
  const currentMode = role || getCurrentMode();

  const getRedirectPath = (userRole: string) => {
    switch(userRole) {
      case 'b2b_admin': return '/b2b/admin';
      case 'b2b_user': return '/b2b/user';
      case 'b2c': default: return '/b2c';
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const user = await login(email, password);
      
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté."
      });
      
      // Redirect to the appropriate dashboard based on user role or current mode
      const redirectPath = getRedirectPath(user?.role || currentMode);
      navigate(redirectPath);
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Une erreur s'est produite lors de la connexion",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getPageTitle = () => {
    switch(currentMode) {
      case 'b2b_admin': return 'Espace Administration';
      case 'b2b_user': return 'Espace Collaborateur';
      case 'b2c': default: return 'Espace Personnel';
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 p-4 dark:bg-slate-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center">
            <User className="h-10 w-10 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
          <CardDescription>Connectez-vous à votre {getPageTitle()}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input 
                id="email" 
                placeholder="votre@email.fr" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">Mot de passe</label>
                <Button variant="link" className="text-xs p-0 h-auto" type="button">
                  Mot de passe oublié?
                </Button>
              </div>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>
            
            {/* Debug information for development */}
            <div className="text-xs text-muted-foreground mt-4">
              <p>Pour les tests: utilisateur@exemple.fr / admin</p>
              <p className="mt-1">Mode actuel: {currentMode}</p>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button variant="outline" className="w-full" type="button">
            Créer un compte
          </Button>
          <Button variant="ghost" className="w-full" type="button" onClick={() => navigate('/')}>
            Retour à l'accueil
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
