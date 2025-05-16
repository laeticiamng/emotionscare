
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const B2CLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (clearError) clearError();
    
    try {
      const user = await login(email, password);
      
      if (user.role !== 'b2c') {
        toast({
          title: "Accès refusé",
          description: "Ce compte n'a pas les permissions nécessaires pour accéder à l'espace particulier.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté à votre espace personnel.",
        variant: "success",
      });
      navigate('/b2c/dashboard');
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      toast({
        title: "Échec de la connexion",
        description: error.message || "Veuillez vérifier vos identifiants et réessayer.",
        variant: "destructive",
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
          <CardTitle className="text-2xl font-bold">Bienvenue</CardTitle>
          <CardDescription>Connectez-vous à votre espace personnel</CardDescription>
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

export default B2CLogin;
