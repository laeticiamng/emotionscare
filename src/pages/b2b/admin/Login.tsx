
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';
import Shell from '@/Shell';

export default function B2BAdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate login for test admin
      if (email === 'admin@exemple.fr' && password === 'admin') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        localStorage.setItem('auth_session', 'mock_token_admin');
        localStorage.setItem('user_role', 'b2b_admin');
        localStorage.setItem('userMode', 'b2b-admin');
        
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur votre console d'administration",
        });
        
        navigate('/b2b/admin/dashboard');
      } else {
        throw new Error("Identifiants incorrects");
      }
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Utilisez admin@exemple.fr / admin pour tester",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Shell>
      <div className="flex items-center justify-center min-h-[80vh] p-4 bg-gradient-to-br from-purple-50/80 to-white dark:from-slate-950 dark:to-purple-900/20">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <CardTitle className="text-2xl">Administration RH</CardTitle>
            <CardDescription>Accédez à votre console de gestion</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email professionnel</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@entreprise.com"
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
                <p>admin@exemple.fr / admin</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700" 
                disabled={isLoading}
              >
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
