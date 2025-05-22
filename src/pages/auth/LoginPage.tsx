
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { useUserMode } from '@/contexts/UserModeContext';
import { UserMode } from '@/types/auth';
import { getModeDashboardPath, getUserModeDisplayName } from '@/utils/userModeHelpers';
import { toast } from 'sonner';

interface LoginPageProps {
  mode?: UserMode;
}

const LoginPage: React.FC<LoginPageProps> = ({ mode = 'b2c' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { changeUserMode } = useUserMode();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      changeUserMode(mode);
      toast.success("Connexion réussie");
      navigate(getModeDashboardPath(mode));
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Erreur de connexion", {
        description: "Vérifiez vos identifiants et réessayez."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getModeName = () => {
    return getUserModeDisplayName(mode);
  };

  const getRegisterPath = () => {
    if (mode === 'b2c') return '/b2c/register';
    if (mode === 'b2b_user') return '/b2b/user/register';
    if (mode === 'b2b_admin') return '/b2b/admin/register';
    return '/register';
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Connexion</CardTitle>
            <CardDescription className="text-center">
              Mode {getModeName()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="password" className="text-sm font-medium">Mot de passe</label>
                  <Link to="/reset-password" className="text-sm text-primary hover:underline">
                    Mot de passe oublié?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center flex-col space-y-4">
            <div className="text-center text-sm">
              Pas encore de compte?{" "}
              <Link to={getRegisterPath()} className="text-primary hover:underline">
                Créer un compte
              </Link>
            </div>
            <div className="text-center">
              <Button variant="ghost" onClick={() => navigate('/')}>
                Retour à l'accueil
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
