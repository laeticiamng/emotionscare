
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, User, Building } from 'lucide-react';
import { toast } from 'sonner';

interface LoginProps {
  mode?: 'b2c' | 'b2b';
}

const Login: React.FC<LoginProps> = ({ mode = 'b2c' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Si c'est le mode b2b, nous affichons une page de sélection entre admin et utilisateur
  if (mode === 'b2b') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md border shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Espace Entreprise</CardTitle>
              <CardDescription>Choisissez votre type d'accès</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  variant="outline"
                  className="w-full p-6 h-auto flex items-center justify-between"
                  onClick={() => navigate('/b2b/admin/login')}
                >
                  <div className="flex items-center">
                    <div className="mr-4 p-2 bg-primary/10 rounded-full">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium">Administration</h3>
                      <p className="text-sm text-muted-foreground">Gestion des équipes et des données</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  variant="outline"
                  className="w-full p-6 h-auto flex items-center justify-between"
                  onClick={() => navigate('/b2b/user/login')}
                >
                  <div className="flex items-center">
                    <div className="mr-4 p-2 bg-primary/10 rounded-full">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium">Collaborateur</h3>
                      <p className="text-sm text-muted-foreground">Accès à votre espace personnel</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </Button>
              </motion.div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/')}>
                Retour à l'accueil
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Pour les particuliers (B2C)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simuler une connexion réussie après 1 seconde
      setTimeout(() => {
        toast.success("Connexion réussie", {
          description: "Bienvenue sur votre espace personnel",
        });
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      toast.error("Échec de la connexion", {
        description: "Veuillez vérifier vos identifiants",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md border shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Bienvenue</CardTitle>
            <CardDescription>
              Connectez-vous pour accéder à votre espace personnel
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    placeholder="utilisateur@exemple.com"
                    type="email"
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
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sm font-normal"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/forgot-password');
                    }}
                  >
                    Mot de passe oublié ?
                  </Button>
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
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button 
                type="submit" 
                className="w-full relative" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="opacity-0">Se connecter</span>
                    <span className="absolute inset-0 flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                  </>
                ) : (
                  "Se connecter"
                )}
              </Button>
              <div className="mt-4 text-center text-sm">
                <span className="text-muted-foreground">
                  Vous n'avez pas de compte ?{' '}
                </span>
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm font-normal"
                  onClick={() => navigate('/register')}
                >
                  Créer un compte
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-4"
                onClick={() => navigate('/')}
              >
                Retour à l'accueil
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
