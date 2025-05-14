
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Shell from '@/Shell';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulation de connexion réussie
      await new Promise(resolve => setTimeout(resolve, 1000));
      await login({ email, password, role: 'b2b_user' });
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur votre espace collaborateur",
      });
      navigate('/b2b/user/dashboard');
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Vérifiez vos identifiants et réessayez",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Shell>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50/80 to-white dark:from-slate-950 dark:to-slate-900/50">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Espace Collaborateur</CardTitle>
            <CardDescription className="text-center">
              Connectez-vous à votre espace bien-être professionnel
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email professionnelle</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="prenom.nom@entreprise.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Button variant="link" className="px-0 text-xs text-muted-foreground" type="button">
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
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </Button>
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Nouvel utilisateur? </span>
                <Button 
                  variant="link" 
                  className="p-0 text-sm text-blue-600 dark:text-blue-400" 
                  onClick={() => navigate('/b2b/user/register')}
                  type="button"
                >
                  Créer un compte
                </Button>
              </div>
              <Button 
                variant="ghost" 
                type="button"
                className="mt-2" 
                onClick={() => navigate('/b2b/selection')}
              >
                Retour à la sélection
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Shell>
  );
};

export default Login;
