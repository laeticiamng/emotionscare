
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Users } from 'lucide-react';
import Shell from '@/Shell';

export default function B2BUserLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate login for test user
      if (email === 'collaborateur@exemple.fr' && password === 'admin') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        localStorage.setItem('auth_session', 'mock_token_collaborateur');
        localStorage.setItem('user_role', 'b2b_user');
        localStorage.setItem('userMode', 'b2b-user');
        
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur votre espace collaborateur",
        });
        
        navigate('/b2b/user/dashboard');
      } else {
        throw new Error("Identifiants incorrects");
      }
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Utilisez collaborateur@exemple.fr / admin pour tester",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Shell>
      <div className="flex items-center justify-center min-h-[80vh] p-4 bg-gradient-to-br from-blue-50/80 to-white dark:from-slate-950 dark:to-slate-900/50">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <CardTitle className="text-2xl">Connexion Collaborateur</CardTitle>
            <CardDescription>Accédez à votre espace professionnel</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email professionnel</Label>
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
                  <Button variant="link" className="px-0 text-xs" type="button">
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
              <div className="text-sm text-muted-foreground">
                <p>Pour tester la connexion:</p>
                <p>collaborateur@exemple.fr / admin</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </Button>
              <div className="text-sm text-center">
                <Link to="/b2b/selection" className="text-muted-foreground hover:underline">
                  Retour à la sélection
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Shell>
  );
}
