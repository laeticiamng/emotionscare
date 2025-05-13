
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface LoginProps {
  role?: 'b2c' | 'b2b_user' | 'b2b_admin';
}

const Login: React.FC<LoginProps> = ({ role = 'b2c' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, error, clearError } = useAuth();
  
  const getRoleName = () => {
    switch(role) {
      case 'b2b_admin': return 'Administrateur';
      case 'b2b_user': return 'Collaborateur';
      case 'b2c': default: return 'Particulier';
    }
  };
  
  const getRedirectPath = () => {
    switch(role) {
      case 'b2b_admin': return '/b2b/admin/dashboard';
      case 'b2b_user': return '/b2b/user/dashboard';
      case 'b2c': default: return '/b2c/dashboard';
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (clearError) clearError();
    setIsLoading(true);
    
    try {
      const user = await login(email, password);
      
      if (user) {
        // Check if the user has the correct role
        if (user.role !== role) {
          toast({
            title: "Accès refusé",
            description: "Vous n'avez pas les permissions nécessaires pour accéder à cet espace.",
            variant: "destructive"
          });
          return;
        }
        
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté.",
        });
        
        navigate(getRedirectPath());
      }
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Une erreur s'est produite",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getRegisterPath = () => {
    switch(role) {
      case 'b2b_admin': return '/b2b/admin/register';
      case 'b2b_user': return '/b2b/user/register';
      case 'b2c': default: return '/b2c/register';
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connexion {getRoleName()}</CardTitle>
          <CardDescription>Connectez-vous pour accéder à votre espace {getRoleName()}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="email@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Mot de passe oublié?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>
            <div className="text-sm text-center">
              Pas encore de compte?{' '}
              <Link to={getRegisterPath()} className="text-primary hover:underline">
                S'inscrire
              </Link>
            </div>
            <div className="text-sm text-center mt-2">
              <Link to="/" className="text-muted-foreground hover:underline">
                Retour à la sélection du profil
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
