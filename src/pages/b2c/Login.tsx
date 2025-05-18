
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const B2CLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, error: authError, clearError } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (clearError) clearError();
    
    try {
      const user = await login(email, password);
      
      if (user && user.role !== 'b2c') {
        toast({
          title: "Accès refusé",
          description: "Ce compte n'a pas les permissions nécessaires pour accéder à l'espace particulier."
        });
        setError("Ce compte n'a pas les permissions nécessaires pour accéder à l'espace particulier.");
        setIsLoading(false);
        return;
      }
      
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté à votre espace personnel."
      });
      navigate('/b2c/dashboard');
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      setError(error.message || "Identifiants invalides");
      toast({
        title: "Échec de la connexion",
        description: error.message || "Veuillez vérifier vos identifiants et réessayer."
      });
    } finally {
      setIsLoading(false);
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
          <CardDescription>Connectez-vous à votre Espace Personnel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input 
                id="email" 
                placeholder="utilisateur@exemple.fr" 
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
            
            {error && (
              <div className="p-3 text-sm rounded-md bg-destructive/10 text-destructive">
                {error}
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-xs text-muted-foreground mt-1">
            <p>Pour les tests: utilisateur@exemple.fr / admin</p>
            <p className="mt-1">Mode actuel: b2c</p>
          </div>
          <Button 
            variant="outline" 
            className="w-full" 
            type="button"
            onClick={() => navigate('/b2c/register')}
          >
            Créer un compte
          </Button>
          <Button 
            variant="ghost" 
            className="w-full" 
            type="button" 
            onClick={() => navigate('/')}
          >
            Retour à l'accueil
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default B2CLogin;
