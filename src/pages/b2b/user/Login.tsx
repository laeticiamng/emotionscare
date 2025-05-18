
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const B2BUserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, error, clearError } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Haptic feedback for mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    if (clearError) clearError();
    
    try {
      const user = await login(email, password);
      
      if (user && user.role !== 'b2b_user') {
        toast({
          title: "Accès refusé",
          description: "Ce compte n'a pas les permissions nécessaires pour accéder à l'espace collaborateur.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans votre espace collaborateur EmotionsCare."
      });

      // Small delay to show the success message before redirecting
      setTimeout(() => navigate('/b2b/user/dashboard'), 800);
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      toast({
        title: "Échec de la connexion",
        description: error.message || "Veuillez vérifier vos identifiants et réessayer.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 dark:from-slate-900 dark:to-blue-900/20">
      {/* Ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-blue-200/40 to-transparent rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-blue-200/40 to-transparent rounded-full filter blur-3xl"></div>
      </div>
      
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-slate-900/80 border-blue-200/50 dark:border-blue-900/30 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <motion.div 
              className="flex justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Building className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
            </motion.div>
            <CardTitle className="text-2xl font-bold mt-3">Espace Collaborateur</CardTitle>
            <CardDescription>
              Connectez-vous pour accéder à votre espace personnel
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email professionnel</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="prenom.nom@entreprise.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/50 dark:bg-slate-800/50 border-blue-100 dark:border-blue-900/50 focus:border-blue-300 transition-all"
                  autoComplete="email"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">Mot de passe</Label>
                  <Button 
                    variant="link" 
                    className="text-xs p-0 h-auto text-blue-600 dark:text-blue-400" 
                    type="button"
                    onClick={() => toast({
                      title: "Réinitialisation de mot de passe",
                      description: "La fonctionnalité sera bientôt disponible."
                    })}
                  >
                    Mot de passe oublié?
                  </Button>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/50 dark:bg-slate-800/50 border-blue-100 dark:border-blue-900/50 focus:border-blue-300 transition-all"
                  autoComplete="current-password"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all" 
                disabled={isLoading}
              >
                {isLoading ? 
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    Connexion...
                  </div> : 
                  "Se connecter"
                }
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            <Button 
              variant="outline" 
              className="w-full border-blue-200 dark:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20" 
              onClick={() => navigate('/b2b/user/register')}
            >
              Demander un accès
            </Button>
            
            <Button 
              variant="ghost" 
              className="text-muted-foreground hover:text-blue-600 flex items-center gap-1" 
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à l'accueil
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2BUserLogin;
