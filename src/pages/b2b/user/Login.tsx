
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Users } from 'lucide-react';
import Shell from '@/Shell';
import { motion } from 'framer-motion';

export default function B2BUserLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate login for test user
      if (email === 'collaborateur@exemple.fr' && password === 'admin') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        localStorage.setItem('auth_session', 'mock_token_collaborateur');
        localStorage.setItem('user_role', 'b2b_user');
        localStorage.setItem('userMode', 'b2b-user');
        
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur votre espace collaborateur",
        });
        
        navigate('/b2b/user/dashboard');
      } else {
        throw new Error("Identifiants incorrects");
      }
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Utilisez collaborateur@exemple.fr / admin pour tester",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Shell>
      <div className="flex items-center justify-center min-h-[80vh] p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900 dark:to-blue-900/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-lg border-blue-100 dark:border-blue-800/30">
            <CardHeader className="text-center">
              <motion.div 
                className="flex justify-center mb-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </motion.div>
              <CardTitle className="text-2xl text-blue-800 dark:text-blue-300">Connexion Collaborateur</CardTitle>
              <CardDescription>Accédez à votre espace professionnel</CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Label htmlFor="email">Email professionnel</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="prenom.nom@entreprise.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-blue-100 dark:border-blue-900/30 focus:border-blue-300"
                    required
                  />
                </motion.div>
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Button variant="link" className="px-0 text-xs text-blue-600 dark:text-blue-400" type="button">
                      Mot de passe oublié?
                    </Button>
                  </div>
                  <Input 
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-blue-100 dark:border-blue-900/30 focus:border-blue-300"
                    required
                  />
                </motion.div>
                <motion.div 
                  className="text-sm text-blue-600/70 dark:text-blue-400/70 bg-blue-50/50 dark:bg-blue-900/20 p-3 rounded-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <p>Pour tester la connexion:</p>
                  <p>collaborateur@exemple.fr / admin</p>
                </motion.div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <motion.div
                  className="w-full"
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Connexion en cours..." : "Se connecter"}
                  </Button>
                </motion.div>
                <motion.div 
                  className="text-sm text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <Link to="/b2b/selection" className="text-blue-500/70 dark:text-blue-400/70 hover:underline">
                    Retour à la sélection
                  </Link>
                </motion.div>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </Shell>
  );
}
