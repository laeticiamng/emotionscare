
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Lock, ArrowRight, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { useToast } from '@/hooks/use-toast';
import { getRoleHomePath } from '@/hooks/use-role-redirect';
import { UserRole } from '@/types/user';
import { UserModeType } from '@/types/userMode';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/transitions/PageTransition';

interface LoginProps {
  role?: UserRole | UserModeType;
}

const Login: React.FC<LoginProps> = ({ role = 'b2c' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  const { setUserMode } = useUserMode();
  const { toast } = useToast();
  
  // Determine the current mode based on URL
  const getCurrentMode = (): UserRole => {
    if (location.pathname.includes('/b2b/admin')) {
      return 'b2b_admin';
    } else if (location.pathname.includes('/b2b/user')) {
      return 'b2b_user';
    }
    return 'b2c';
  };
  
  const currentMode = role || getCurrentMode();
  
  // Check if user is already authenticated
  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
      // Redirect after a brief delay to show animation
      const timer = setTimeout(() => {
        const redirectPath = getRoleHomePath(user?.role || currentMode);
        navigate(redirectPath);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [user, currentMode, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');
    
    try {
      const user = await login(email, password);

      // Store the user mode in context for global access
      setUserMode(user?.role || currentMode);
      setIsAuthenticated(true);

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté."
      });
      
      // Redirect animation will be triggered by the useEffect above
    } catch (error: any) {
      console.error("Login error:", error);
      setLoginError(error.message || "Une erreur s'est produite lors de la connexion");
      
      toast({
        title: "Erreur de connexion",
        description: error.message || "Une erreur s'est produite lors de la connexion",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };
  
  const getPageTitle = () => {
    switch(currentMode) {
      case 'b2b_admin': return 'Espace Administration';
      case 'b2b_user': return 'Espace Collaborateur';
      case 'b2c': default: return 'Espace Personnel';
    }
  };
  
  // Get color theme based on mode
  const getModeThemeColors = () => {
    switch(currentMode) {
      case 'b2b_admin': 
        return {
          icon: "text-purple-600 dark:text-purple-400",
          bg: "bg-purple-100 dark:bg-purple-900/30"
        };
      case 'b2b_user': 
        return {
          icon: "text-green-600 dark:text-green-400",
          bg: "bg-green-100 dark:bg-green-900/30"
        };
      case 'b2c': 
      default: 
        return {
          icon: "text-blue-600 dark:text-blue-400",
          bg: "bg-blue-100 dark:bg-blue-900/30"
        };
    }
  };
  
  const themeColors = getModeThemeColors();
  
  return (
    <PageTransition mode="fade">
      <div className="flex min-h-screen items-center justify-center bg-blue-50 dark:bg-slate-900 p-4">
        <AnimatePresence mode="wait">
          {isAuthenticated ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto flex items-center justify-center mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
                >
                  <ArrowRight className="h-10 w-10 text-green-600 dark:text-green-400" />
                </motion.div>
              </div>
              <h2 className="text-xl font-bold mb-2">Connexion réussie</h2>
              <p className="text-muted-foreground">Redirection vers votre espace...</p>
            </motion.div>
          ) : (
            <motion.div
              key="login-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-md"
            >
              <Card>
                <CardHeader className="space-y-1 text-center">
                  <motion.div 
                    className="flex justify-center"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className={`w-16 h-16 rounded-full ${themeColors.bg} flex items-center justify-center`}>
                      <User className={`h-8 w-8 ${themeColors.icon}`} />
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
                    <CardDescription>Connectez-vous à votre {getPageTitle()}</CardDescription>
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <motion.div 
                      className="space-y-2"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        Email
                      </label>
                      <Input 
                        id="email" 
                        placeholder="votre@email.fr" 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="focus:ring-2 focus:ring-offset-1 focus:ring-primary"
                        required 
                      />
                    </motion.div>
                    <motion.div 
                      className="space-y-2"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="flex items-center justify-between">
                        <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                          Mot de passe
                        </label>
                        <Button variant="link" className="text-xs p-0 h-auto" type="button">
                          Mot de passe oublié?
                        </Button>
                      </div>
                      <Input 
                        id="password" 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="focus:ring-2 focus:ring-offset-1 focus:ring-primary"
                        required 
                      />
                    </motion.div>
                    
                    <AnimatePresence>
                      {loginError && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-3 text-sm rounded-md bg-destructive/10 text-destructive flex items-start gap-2"
                        >
                          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                          <span>{loginError}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Connexion en cours...
                          </>
                        ) : (
                          <>
                            Se connecter
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </motion.div>
                    
                    <motion.div 
                      className="text-xs text-muted-foreground mt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <p>Accès de démonstration: utilisateur@exemple.fr / mdp123</p>
                      <p className="mt-1">Mode actuel: {currentMode}</p>
                    </motion.div>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <motion.div 
                    className="w-full"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      type="button"
                      onClick={() => navigate(currentMode === 'b2c' ? '/b2c/register' : '/')}
                    >
                      Créer un compte
                    </Button>
                  </motion.div>
                  <motion.div 
                    className="w-full"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Button 
                      variant="ghost" 
                      className="w-full" 
                      type="button" 
                      onClick={() => navigate('/')}
                    >
                      Retour à l'accueil
                    </Button>
                  </motion.div>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default Login;
