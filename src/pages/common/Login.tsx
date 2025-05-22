
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Mail, Lock, Building, User, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { toast } from 'sonner';
import { UserRole } from '@/types/user';

interface LoginProps {
  mode?: 'b2c' | 'b2b_user' | 'b2b_admin';
}

const getModeTitle = (mode: string) => {
  switch (mode) {
    case 'b2c':
      return 'Particulier';
    case 'b2b_user':
      return 'Collaborateur';
    case 'b2b_admin':
      return 'Administrateur';
    default:
      return 'Utilisateur';
  }
};

const getModeIcon = (mode: string) => {
  switch (mode) {
    case 'b2c':
      return <User className="h-6 w-6" />;
    case 'b2b_user':
      return <Building className="h-6 w-6" />;
    case 'b2b_admin':
      return <Shield className="h-6 w-6" />;
    default:
      return <User className="h-6 w-6" />;
  }
};

const getModeColor = (mode: string) => {
  switch (mode) {
    case 'b2c':
      return 'text-primary bg-primary/10';
    case 'b2b_user':
      return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
    case 'b2b_admin':
      return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30';
    default:
      return 'text-primary bg-primary/10';
  }
};

const getModeRegisterPath = (mode: string) => {
  switch (mode) {
    case 'b2c':
      return '/b2c/register';
    case 'b2b_user':
      return '/b2b/user/register';
    case 'b2b_admin':
      return '/b2b/selection'; // Pas d'inscription directe pour les admins
    default:
      return '/b2c/register';
  }
};

const getModeDashboardPath = (mode: string) => {
  switch (mode) {
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

const Login: React.FC<LoginProps> = ({ mode = 'b2c' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { setUserMode } = useUserMode();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const from = (location.state as any)?.from?.pathname || getModeDashboardPath(mode);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Call login function from AuthContext
      await login(email, password);
      
      // Set user mode after successful login
      setUserMode(mode as UserRole);
      
      // Show success message
      toast.success('Connexion réussie', {
        description: `Bienvenue dans votre espace ${getModeTitle(mode)}`
      });
      
      // Navigate to the protected page
      navigate(from);
    } catch (error) {
      console.error('Login error:', error);
      setError('Identifiants incorrects. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader>
            <div className={`mx-auto mb-4 w-12 h-12 rounded-full ${getModeColor(mode)} flex items-center justify-center`}>
              {getModeIcon(mode)}
            </div>
            <CardTitle className="text-2xl text-center">
              Connexion {getModeTitle(mode)}
            </CardTitle>
            <CardDescription className="text-center">
              Accédez à votre espace personnel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-primary hover:underline"
                  >
                    Oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive p-2 bg-destructive/10 rounded-md"
                >
                  {error}
                </motion.div>
              )}
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="mr-2">Connexion en cours...</span>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                  </>
                ) : "Se connecter"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col items-center gap-2">
            {mode !== 'b2b_admin' && (
              <div className="text-sm text-muted-foreground">
                Pas encore de compte ?{' '}
                <Link 
                  to={getModeRegisterPath(mode)} 
                  className="text-primary hover:underline"
                >
                  S'inscrire
                </Link>
              </div>
            )}
            
            <div className="flex space-x-4 mt-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                Accueil
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/choose-mode')}>
                Changer de mode
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
