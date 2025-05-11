
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useUserMode } from '@/contexts/UserModeContext';
import { useAuth } from '@/contexts/AuthContext';
import Shell from '@/Shell';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { ReloadIcon } from '@radix-ui/react-icons';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserMode } = useUserMode();
  const { login, error: authError, clearError, isAuthenticated } = useAuth();
  
  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from);
    }
    
    // Nettoyer les erreurs quand la page est chargée/déchargée
    return () => clearError();
  }, [isAuthenticated, navigate, location.state, clearError]);
  
  const from = location.state?.from?.pathname || '/dashboard';
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      setUserMode('b2c'); // Mode par défaut pour les nouveaux utilisateurs
      toast.success("Connexion réussie", {
        description: "Bienvenue sur EmotionsCare",
      });
      navigate(from);
    } catch (error: any) {
      toast.error("Erreur de connexion", {
        description: error.message || "Veuillez vérifier vos identifiants",
      });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Pour faciliter les démonstrations
  const handleDemoLogin = (userType: 'user' | 'admin') => {
    setEmail(userType === 'admin' ? 'admin@example.com' : 'user@example.com');
    setPassword('password123');
  };

  return (
    <Shell>
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>Connectez-vous à votre compte EmotionsCare</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {authError && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                  {authError}
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
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              <div className="text-sm text-right">
                <Link to="/forgot-password" className="text-primary hover:underline">
                  Mot de passe oublié?
                </Link>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Connexion en cours...
                  </>
                ) : "Se connecter"}
              </Button>
              
              <div className="text-sm text-center">
                Vous n'avez pas de compte?{' '}
                <Link to="/register" className="text-primary hover:underline">
                  S'inscrire
                </Link>
              </div>
              
              <div className="border-t pt-4 mt-2">
                <p className="text-sm text-center mb-2 text-muted-foreground">Accès rapide pour démonstration</p>
                <div className="flex gap-2">
                  <Button 
                    type="button"
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleDemoLogin('user')}
                  >
                    Utilisateur démo
                  </Button>
                  <Button 
                    type="button"
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleDemoLogin('admin')}
                  >
                    Admin démo
                  </Button>
                </div>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Shell>
  );
};

export default LoginPage;
