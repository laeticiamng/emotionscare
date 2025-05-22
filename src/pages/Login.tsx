
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

interface LoginProps {
  mode?: 'b2c' | 'b2b';
}

const Login: React.FC<LoginProps> = ({ mode = 'b2c' }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would authenticate with a backend
    // For now, just navigate to dashboard
    navigate('/dashboard');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would register with a backend
    // For now, just navigate to dashboard
    navigate('/dashboard');
  };

  // Render B2B selection mode
  if (mode === 'b2b') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          <Card className="shadow-lg border-muted">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Sélection du mode</CardTitle>
              <CardDescription>
                Choisissez votre mode d'accès entreprise
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full py-8 text-left flex flex-col items-start"
                onClick={() => navigate('/login')}
              >
                <span className="text-lg font-semibold">Collaborateur</span>
                <span className="text-sm text-muted-foreground">
                  Accédez à votre espace personnel en tant que collaborateur
                </span>
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full py-8 text-left flex flex-col items-start"
                onClick={() => navigate('/login')}
              >
                <span className="text-lg font-semibold">Administrateur RH</span>
                <span className="text-sm text-muted-foreground">
                  Gérez les utilisateurs et accédez aux analyses de votre organisation
                </span>
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button 
                variant="link" 
                className="w-full"
                onClick={() => navigate('/')}
              >
                Retour à l'accueil
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Render B2C login/register mode
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/30">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card className="shadow-lg border-muted">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Bienvenue</CardTitle>
            <CardDescription>
              Connectez-vous ou créez un compte pour commencer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Connexion</TabsTrigger>
                <TabsTrigger value="register">Inscription</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="votre.email@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="text-sm font-medium">Mot de passe</label>
                      <Button variant="link" className="p-0 h-auto text-xs">
                        Mot de passe oublié ?
                      </Button>
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Se connecter
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label htmlFor="register-email" className="text-sm font-medium">Email</label>
                    <Input 
                      id="register-email" 
                      type="email" 
                      placeholder="votre.email@example.com" 
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="register-password" className="text-sm font-medium">Mot de passe</label>
                    <Input 
                      id="register-password" 
                      type="password" 
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="confirm-password" className="text-sm font-medium">Confirmer le mot de passe</label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Créer un compte
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Ou continuer avec</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline">Google</Button>
              <Button variant="outline">Microsoft</Button>
            </div>
            
            <Button 
              variant="link" 
              className="w-full"
              onClick={() => navigate('/')}
            >
              Retour à l'accueil
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
