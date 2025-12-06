import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { EyeIcon, EyeOffIcon, Mail, Lock, ArrowRight } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { usePreferredAccess } from '@/hooks/use-preferred-access';
import LoadingAnimation from '@/components/ui/LoadingAnimation';
import { logger } from '@/lib/logger';

const EnhancedLoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { toast } = useToast();
  const { theme } = useTheme();
  
  // Use the preferred access hook for redirection
  usePreferredAccess();
  
  useEffect(() => {
    // Clean up on unmount
  }, []);
  
  // Validate email with regex
  useEffect(() => {
    if (email.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailValid(emailRegex.test(email));
    } else {
      setEmailValid(null);
    }
  }, [email]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Haptic feedback on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    try {
      await signIn(email, password);
      
      // Success toast notification
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans votre espace personnel.",
        variant: "success"
      });
      
      // Add a short delay for animation purposes
      setTimeout(() => {
        navigate('/app/consumer/home');
      }, 500);
      
    } catch (error: any) {
      logger.error('Erreur de connexion', { error }, 'AUTH');
      
      toast({
        title: "Connexion impossible",
        description: error.message || "Vérifiez vos identifiants et réessayez.",
        variant: "destructive"
      });
      
      setIsLoading(false);
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      transition: { duration: 0.3 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  return (
    <AnimatePresence mode="sync">{/* Fixed multiple children warning */}
      <motion.div
        key="login-form"
        className="flex min-h-screen items-center justify-center p-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Card className="w-full max-w-md overflow-hidden">
          <CardHeader className="space-y-1 text-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-6">
            <motion.div 
              className="flex justify-center mb-4"
              variants={itemVariants}
            >
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                <Mail className="h-6 w-6 text-white" />
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
              variants={itemVariants}
            >
              Bienvenue
            </motion.h1>
            
            <motion.p
              className="text-muted-foreground max-w-xs mx-auto"
              variants={itemVariants}
            >
              Connectez-vous pour accéder à votre espace personnel
            </motion.p>
          </CardHeader>
          
          <CardContent className="p-6 pt-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <motion.div
                className="space-y-2 relative"
                variants={itemVariants}
              >
                <div className="relative">
                  <Label
                    htmlFor="email"
                    className={`absolute transition-all duration-200 ${
                      emailFocused || email
                        ? '-top-6 left-0 text-xs text-primary'
                        : 'top-2 left-9 text-muted-foreground'
                    }`}
                  >
                    Email
                  </Label>
                  
                  <Mail className="absolute top-2.5 left-3 h-5 w-5 text-muted-foreground" />
                  
                  <Input
                    id="email"
                    type="email"
                    className={`pl-10 transition-all duration-200 ${
                      emailFocused
                        ? 'border-primary ring-1 ring-primary'
                        : emailValid === false
                        ? 'border-destructive'
                        : emailValid === true
                        ? 'border-green-500'
                        : ''
                    }`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    autoComplete="email"
                    required
                  />
                  
                  {emailValid === false && (
                    <motion.p 
                      className="text-xs text-destructive mt-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      Veuillez saisir une adresse email valide
                    </motion.p>
                  )}
                </div>
              </motion.div>
              
              <motion.div 
                className="space-y-2 relative"
                variants={itemVariants}
              >
                <div className="relative">
                  <Label
                    htmlFor="password"
                    className={`absolute transition-all duration-200 ${
                      passwordFocused || password
                        ? '-top-6 left-0 text-xs text-primary'
                        : 'top-2 left-9 text-muted-foreground'
                    }`}
                  >
                    Mot de passe
                  </Label>
                  
                  <Lock className="absolute top-2.5 left-3 h-5 w-5 text-muted-foreground" />
                  
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className={`pl-10 transition-all duration-200 ${
                      passwordFocused ? 'border-primary ring-1 ring-primary' : ''
                    }`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    autoComplete="current-password"
                    required
                  />
                  
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-2 right-3 text-muted-foreground hover:text-primary transition-colors"
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    variant="link" 
                    className="text-xs p-0 h-auto"
                    onClick={() => {
                      toast({
                        title: "Réinitialisation du mot de passe",
                        description: "Fonctionnalité bientôt disponible."
                      });
                    }}
                  >
                    Mot de passe oublié ?
                  </Button>
                </div>
              </motion.div>
              
              {/* No auth error display needed - using toast */}
              
              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 group"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <LoadingAnimation />
                  ) : (
                    <>
                      <span>Se connecter</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4 p-6 pt-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
            <motion.div 
              className="text-sm text-center w-full"
              variants={itemVariants}
            >
              <span className="text-muted-foreground">Vous n'avez pas de compte ? </span>
              <Button
                variant="link"
                className="p-0 h-auto text-primary"
                onClick={() => navigate('/signup')}
              >
                S'inscrire
              </Button>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Button
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground"
                onClick={() => navigate('/')}
              >
                Retour à l'accueil
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default EnhancedLoginForm;
