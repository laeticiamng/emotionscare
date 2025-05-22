
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { isLoginLocked } from '@/utils/security';
import { AuthErrorCode } from '@/utils/authErrors';
import { Mail, Lock } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Vérification simple du verrouillage par tentatives excessives
    if (isLoginLocked(email)) {
      setError('Trop de tentatives de connexion. Veuillez réessayer plus tard.');
      setIsLoading(false);
      return;
    }

    try {
      await login(email, password);
      
      // Set flag for post-login transition
      sessionStorage.setItem('just_logged_in', 'true');
      
      // Navigate is handled by AuthContext or redirect components
    } catch (err: any) {
      console.error('Login error:', err);
      
      if (err?.code === AuthErrorCode.INVALID_CREDENTIALS) {
        setError('Identifiants incorrects. Vérifiez votre email et mot de passe.');
      } else if (err?.code === AuthErrorCode.TOO_MANY_ATTEMPTS) {
        setError('Trop de tentatives. Veuillez réessayer plus tard.');
      } else {
        setError('Impossible de vous connecter. Vérifiez vos identifiants.');
      }
      
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
            <CardTitle className="text-2xl">Connexion</CardTitle>
            <CardDescription>
              Entrez vos identifiants pour accéder à votre espace personnel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nom@exemple.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  startIcon={<Mail className="h-4 w-4 text-muted-foreground" />}
                  required
                  className="auth-input-focus-effect"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  startIcon={<Lock className="h-4 w-4 text-muted-foreground" />}
                  required
                  className="auth-input-focus-effect"
                />
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
                className="w-full relative" 
                disabled={isLoading}
                variant="default"
              >
                {isLoading ? (
                  <>
                    <span className="auth-button-loading">Connexion en cours...</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </>
                ) : "Se connecter"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-2">
            <div className="text-sm text-muted-foreground">
              Vous n'avez pas de compte ?{' '}
              <a
                className="text-primary underline-offset-4 hover:underline cursor-pointer"
                onClick={() => navigate('/auth/register')}
              >
                Créer un compte
              </a>
            </div>
            <div className="text-sm">
              <a
                className="text-sm text-muted-foreground hover:underline cursor-pointer"
                onClick={() => navigate('/auth/forgot-password')}
              >
                Mot de passe oublié ?
              </a>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
