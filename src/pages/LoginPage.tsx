
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import Shell from '@/Shell';
import { useUserMode } from '@/contexts/UserModeContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUserMode } = useUserMode();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Check if this is our test user
      if (email === 'user@exemple.fr' && password === 'admin') {
        // Save test session
        localStorage.setItem('auth_session', 'mock_token_user');
        localStorage.setItem('user_role', 'b2c');
        
        // Set user mode to B2C
        setUserMode('b2c');
        localStorage.setItem('userMode', 'b2c');
        
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans votre espace personnel",
        });
        
        navigate('/dashboard');
      } else if (email === 'admin@exemple.fr' && password === 'admin') {
        // Admin test account
        localStorage.setItem('auth_session', 'mock_token_admin');
        localStorage.setItem('user_role', 'b2b-admin');
        
        setUserMode('b2b-admin');
        localStorage.setItem('userMode', 'b2b-admin');
        
        toast({
          title: "Connexion administrateur réussie",
          description: "Bienvenue dans votre espace d'administration",
        });
        
        navigate('/admin/dashboard');
      } else if (email === 'collaborateur@exemple.fr' && password === 'admin') {
        // Collaborator test account
        localStorage.setItem('auth_session', 'mock_token_collaborateur');
        localStorage.setItem('user_role', 'b2b-collaborator');
        
        setUserMode('b2b-collaborator');
        localStorage.setItem('userMode', 'b2b-collaborator');
        
        toast({
          title: "Connexion collaborateur réussie",
          description: "Bienvenue dans votre espace collaborateur",
        });
        
        navigate('/dashboard');
      } else {
        // Simulate login error
        throw new Error("Identifiants invalides");
      }
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Identifiants invalides. Essayez user@exemple.fr / admin",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Shell>
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-blue-900/20">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto bg-blue-100 dark:bg-blue-900/30 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <User className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl">Connexion Particulier</CardTitle>
            <CardDescription>
              Accédez à votre espace personnel de bien-être
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="votre@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Compte test: user@exemple.fr / admin</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </Button>
              <div className="text-sm text-center">
                <Link to="/" className="text-muted-foreground hover:underline">
                  Retour à l'accueil
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Shell>
  );
};

export default LoginPage;
