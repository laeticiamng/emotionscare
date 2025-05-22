
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, ShieldCheck, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { getUserModeLabel } from '@/utils/userModeHelpers';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface LoginPageProps {
  mode?: 'b2c' | 'b2b_user' | 'b2b_admin';
}

const LoginPage: React.FC<LoginPageProps> = ({ mode = 'b2c' }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Champs obligatoires", {
        description: "Veuillez remplir tous les champs"
      });
      return;
    }
    
    // Exemple de login de démonstration. Dans une vraie application, il faudrait
    // s'authentifier auprès d'un backend
    login({
      id: '1',
      email,
      name: email.split('@')[0],
      role: mode
    });
    
    toast.success("Connexion réussie", {
      description: "Redirection vers votre tableau de bord"
    });
    
    setTimeout(() => {
      if (mode === 'b2c') {
        navigate('/b2c/dashboard');
      } else if (mode === 'b2b_user') {
        navigate('/b2b/user/dashboard');
      } else if (mode === 'b2b_admin') {
        navigate('/b2b/admin/dashboard');
      }
    }, 1000);
  };
  
  const getModeIcon = () => {
    if (mode === 'b2c') return <User className="h-6 w-6" />;
    if (mode === 'b2b_user') return <Building2 className="h-6 w-6" />;
    return <ShieldCheck className="h-6 w-6" />;
  };
  
  const getModeColor = () => {
    if (mode === 'b2c') return "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
    if (mode === 'b2b_user') return "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300";
    return "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className={getModeColor()}>
            <div className="flex items-center gap-3">
              {getModeIcon()}
              <div>
                <CardTitle className="text-xl">Connexion</CardTitle>
                <CardDescription className="text-foreground/70">
                  Mode {getUserModeLabel(mode)}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="votre@email.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                      Mot de passe oublié ?
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
                <Button type="submit" className="w-full">
                  Se connecter
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-4">
            <div className="text-sm text-center text-muted-foreground">
              Pas encore de compte ?{' '}
              <Link
                to={
                  mode === 'b2c'
                    ? '/b2c/register'
                    : mode === 'b2b_user'
                    ? '/b2b/user/register'
                    : '/b2b/admin/register'
                }
                className="text-primary hover:underline"
              >
                Créer un compte
              </Link>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
              >
                Retour à l'accueil
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/mode-switcher')}
              >
                Changer de mode
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
