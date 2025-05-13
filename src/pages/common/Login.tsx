
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  role: 'b2c' | 'b2b_user' | 'b2b_admin';
}

const Login: React.FC<LoginProps> = ({ role }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error: authError, clearError, isAuthenticated } = useAuth();
  
  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || getDashboardPath(role);
      navigate(from);
    }
    
    // Nettoyer les erreurs quand la page est chargée/déchargée
    return () => clearError();
  }, [isAuthenticated, navigate, location.state, clearError, role]);
  
  const getDashboardPath = (role: string) => {
    switch (role) {
      case 'b2c':
        return '/b2c/dashboard';
      case 'b2b_user':
        return '/b2b/user/dashboard';
      case 'b2b_admin':
        return '/b2b/admin/dashboard';
      default:
        return '/dashboard';
    }
  };
  
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'b2c':
        return 'Particulier';
      case 'b2b_user':
        return 'Collaborateur';
      case 'b2b_admin':
        return 'RH/Administration';
      default:
        return '';
    }
  };
  
  const from = location.state?.from?.pathname || getDashboardPath(role);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez saisir votre adresse e-mail",
        variant: "destructive"
      });
      return;
    }
    
    if (!password) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez saisir votre mot de passe",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur EmotionsCare",
      });
      navigate(from);
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Veuillez vérifier vos identifiants",
        variant: "destructive"
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connexion {getRoleLabel(role)}</CardTitle>
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
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <Button 
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
                  </span>
                </Button>
              </div>
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
              <Link to={`/${role}/register`} className="text-primary hover:underline">
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
  );
};

export default Login;
