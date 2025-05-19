
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { FiUserCheck } from 'react-icons/fi';
import Shell from '@/Shell';
import { useToast } from '@/hooks/use-toast';
import PageTransition from '@/components/transitions/PageTransition';
import SocialAuthButtons from '@/components/auth/SocialAuthButtons';
import MagicLinkAuth from '@/components/auth/MagicLinkAuth';
import AnimatedFormField from '@/components/auth/AnimatedFormField';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showMagicLink, setShowMagicLink] = useState(false);
  
  const navigate = useNavigate();
  const { login, error, clearError } = useAuth();
  const { toast } = useToast();

  const validateForm = () => {
    let isValid = true;
    
    // Validation de l'email
    if (!email) {
      setEmailError('L\'email est requis');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('L\'email n\'est pas valide');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    // Validation du mot de passe
    if (!password) {
      setPasswordError('Le mot de passe est requis');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (clearError) clearError();
    setIsLoading(true);
    
    try {
      const user = await login(email, password);
      
      // Stockage temporaire de l'état de connexion pour l'animation
      sessionStorage.setItem('just_logged_in', 'true');
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur EmotionsCare!",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      
      toast({
        title: "Échec de la connexion",
        description: error.message || "Veuillez vérifier vos identifiants et réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMagicLink = () => {
    setShowMagicLink(!showMagicLink);
  };

  // Animation variants pour la page
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Shell>
      <PageTransition>
        <div className="flex items-center justify-center min-h-[85vh] p-4">
          {showMagicLink ? (
            <MagicLinkAuth onCancel={toggleMagicLink} />
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="w-full max-w-lg"
            >
              <Card className="border-blue-200 dark:border-blue-900/30 shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/10 to-purple-400/10 rounded-tr-full"></div>
                
                <CardHeader className="space-y-1 text-center relative z-10">
                  <motion.div 
                    className="mx-auto mb-2 bg-blue-100 dark:bg-blue-900/30 w-14 h-14 rounded-full flex items-center justify-center"
                    variants={itemVariants}
                  >
                    <FiUserCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                      Bienvenue
                    </CardTitle>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <CardDescription>
                      Connectez-vous pour accéder à votre espace personnel
                    </CardDescription>
                  </motion.div>
                </CardHeader>
                
                <form onSubmit={handleLogin}>
                  <motion.div variants={itemVariants}>
                    <CardContent className="space-y-4">
                      {error && (
                        <motion.div 
                          className="p-3 rounded-md bg-destructive/10 text-destructive text-sm"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {error}
                        </motion.div>
                      )}
                      
                      <AnimatedFormField
                        id="email"
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={emailError}
                        required
                        autoComplete="email"
                        icon={<Mail className="h-4 w-4" />}
                      />
                      
                      <AnimatedFormField
                        id="password"
                        label="Mot de passe"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={passwordError}
                        required
                        autoComplete="current-password"
                        icon={<Lock className="h-4 w-4" />}
                      />
                      
                      <div className="flex items-center justify-end">
                        <Link 
                          to="/b2c/forgot-password" 
                          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Mot de passe oublié?
                        </Link>
                      </div>
                      
                      <motion.div 
                        className="pt-2"
                        variants={itemVariants}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white" 
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span className="flex items-center">
                              <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                              Connexion en cours...
                            </span>
                          ) : (
                            <span className="flex items-center">
                              Se connecter
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </span>
                          )}
                        </Button>
                      </motion.div>
                      
                      <SocialAuthButtons 
                        mode="login"
                        onMagicLinkClick={toggleMagicLink}
                      />
                    </CardContent>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <CardFooter className="flex flex-col space-y-4">
                      <div className="text-sm text-center">
                        Vous n'avez pas de compte?{' '}
                        <Link 
                          to="/b2c/register" 
                          className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Créer un compte
                        </Link>
                      </div>
                      
                      <div className="text-xs text-center text-muted-foreground">
                        <p>Pour les tests: utilisateur@exemple.fr / admin</p>
                      </div>
                    </CardFooter>
                  </motion.div>
                </form>
              </Card>
            </motion.div>
          )}
        </div>
      </PageTransition>
    </Shell>
  );
};

export default LoginPage;
