
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Shell from '@/Shell';
import { useToast } from '@/hooks/use-toast';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      sessionStorage.setItem('just_logged_in', 'true');
      navigate('/b2c/dashboard');
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur votre espace personnel"
      });
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Impossible de se connecter. Veuillez vérifier vos identifiants.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Shell>
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardHeader>
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl text-center">Bienvenue</CardTitle>
              <CardDescription className="text-center">
                Connectez-vous à votre compte personnel
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
                      placeholder="vous@exemple.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
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
                  className="w-full relative" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span>Connexion en cours...</span>
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
                  onClick={() => navigate('/b2c/register')}
                >
                  Créer un compte
                </a>
              </div>
              <Button variant="ghost" className="mt-2" onClick={() => navigate('/')}>
                Retour à l'accueil
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </Shell>
  );
};

export default LoginPage;
