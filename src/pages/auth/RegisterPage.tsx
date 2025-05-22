
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

interface RegisterPageProps {
  mode?: UserMode;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ mode = 'b2c' }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { changeUserMode } = useUserMode();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }

    try {
      await register({
        name,
        email,
        password,
        role: mode
      });
      changeUserMode(mode);
      toast.success("Compte créé avec succès");
      navigate(getModeDashboardPath(mode));
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("Erreur lors de l'inscription", {
        description: "Veuillez réessayer ultérieurement."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getModeName = () => {
    return getUserModeDisplayName(mode);
  };

  const getLoginPath = () => {
    if (mode === 'b2c') return '/b2c/login';
    if (mode === 'b2b_user') return '/b2b/user/login';
    if (mode === 'b2b_admin') return '/b2b/admin/login';
    return '/login';
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
            <CardTitle className="text-2xl text-center">Créer un compte</CardTitle>
            <CardDescription className="text-center">
              Mode {getModeName()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Nom</label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Votre nom"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
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
                <label htmlFor="password" className="text-sm font-medium">Mot de passe</label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">Confirmer le mot de passe</label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Inscription en cours..." : "S'inscrire"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center flex-col space-y-4">
            <div className="text-center text-sm">
              Déjà un compte?{" "}
              <Link to={getLoginPath()} className="text-primary hover:underline">
                Se connecter
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

export default RegisterPage;
