
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Lock, Mail, Eye, EyeOff, HelpCircle, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useUserMode } from '@/contexts/UserModeContext';
import { isLoginLocked } from '@/utils/security';

const B2BUserPremiumLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const { setUserMode } = useUserMode();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempt, setLoginAttempt] = useState(0);
  const [showHelpPanel, setShowHelpPanel] = useState(false);
  
  // Field validation
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // Check if login is locked
  const loginLocked = isLoginLocked(email);
  
  useEffect(() => {
    // Set user mode to B2B user
    setUserMode('b2b_user');
    
    // Reset field errors when input changes
    if (email) setEmailError('');
    if (password) setPasswordError('');
  }, [setUserMode, email, password]);
  
  const validateForm = (): boolean => {
    let valid = true;
    
    if (!email) {
      setEmailError('Veuillez saisir votre email professionnel');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Format d\'email invalide');
      valid = false;
    }
    
    if (!password) {
      setPasswordError('Veuillez saisir votre mot de passe');
      valid = false;
    }
    
    return valid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginLocked) {
      toast({
        title: "Connexion temporairement bloquée",
        description: "Trop de tentatives échouées. Veuillez réessayer plus tard ou réinitialiser votre mot de passe.",
        variant: "destructive",
      });
      return;
    }
    
    if (!validateForm()) return;
    
    try {
      const user = await login(email, password, rememberMe);
      
      if (user) {
        // Add haptic feedback if available
        if (window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate([50, 30, 50]); // Success pattern
        }
        
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans votre espace collaborateur",
          variant: "success",
        });
        
        navigate('/b2b/user/dashboard');
      } else {
        // Increment login attempt counter
        setLoginAttempt(prev => prev + 1);
        
        if (loginAttempt >= 2) {
          toast({
            title: "Plusieurs échecs de connexion",
            description: "Vérifiez vos identifiants ou cliquez sur 'Mot de passe oublié'",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Erreur de connexion",
        description: "Identifiants incorrects ou service indisponible",
        variant: "destructive",
      });
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };
  
  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted px-4 py-12"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      <motion.div className="w-full max-w-md" variants={itemVariants}>
        <motion.div 
          className="flex flex-col items-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mb-4">
            <Users className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold">Espace Collaborateur</h1>
          <p className="text-muted-foreground mt-2 text-center">
            Accédez à votre espace bien-être en entreprise
          </p>
        </motion.div>
        
        <motion.div 
          className="glass-card p-8 rounded-2xl relative overflow-hidden"
          variants={itemVariants}
        >
          {/* Background subtle pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/20 to-teal-50/10 dark:from-green-900/20 dark:to-teal-900/10 rounded-2xl -z-10"></div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className={`text-sm font-medium transition-colors duration-200 ${emailFocused ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}
              >
                Email professionnel
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-200 ${emailFocused ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`} />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 py-6 bg-background/80 ${emailError ? 'border-red-400 focus:ring-red-400' : 'focus:ring-green-400'}`}
                  placeholder="nom@entreprise.fr"
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  disabled={isLoading || loginLocked}
                />
              </div>
              {emailError && (
                <motion.p 
                  className="text-sm text-red-500 flex items-center gap-1 mt-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <AlertCircle className="h-3 w-3" /> {emailError}
                </motion.p>
              )}
            </div>
            
            <div className="space-y-2">
              <label 
                htmlFor="password"
                className={`text-sm font-medium transition-colors duration-200 ${passwordFocused ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}
              >
                Mot de passe
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-200 ${passwordFocused ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`} />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 pr-10 py-6 bg-background/80 ${passwordError ? 'border-red-400 focus:ring-red-400' : 'focus:ring-green-400'}`}
                  placeholder="••••••••••"
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  disabled={isLoading || loginLocked}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {passwordError && (
                <motion.p 
                  className="text-sm text-red-500 flex items-center gap-1 mt-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <AlertCircle className="h-3 w-3" /> {passwordError}
                </motion.p>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  disabled={isLoading || loginLocked}
                />
                <label 
                  htmlFor="remember" 
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Se souvenir de moi
                </label>
              </div>
              
              <Link
                to="/b2b/user/forgot-password"
                className="text-sm text-green-600 dark:text-green-400 hover:underline"
              >
                Mot de passe oublié ?
              </Link>
            </div>
            
            {loginLocked && (
              <motion.div 
                className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-800 dark:text-red-300 flex items-start gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Compte temporairement bloqué</p>
                  <p>Trop de tentatives échouées. Veuillez réessayer plus tard ou utiliser la récupération de mot de passe.</p>
                </div>
              </motion.div>
            )}
            
            <Button
              type="submit"
              className="w-full py-6 bg-green-600 hover:bg-green-700 text-white button-premium"
              disabled={isLoading || loginLocked}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion en cours...
                </span>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Vous n'avez pas de compte ?{' '}
              <Link to="/b2b/user/register" className="text-green-600 dark:text-green-400 hover:underline font-medium">
                Demander un accès
              </Link>
            </p>
          </div>
          
          <div className="mt-4 text-center">
            <button 
              type="button" 
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mx-auto"
              onClick={() => setShowHelpPanel(!showHelpPanel)}
            >
              <HelpCircle className="h-3 w-3" />
              Besoin d'aide ?
            </button>
          </div>
        </motion.div>
        
        <div className="mt-8 text-center">
          <Button 
            variant="ghost" 
            className="text-muted-foreground hover:text-foreground flex items-center gap-1"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Button>
        </div>
      </motion.div>
      
      {/* Help panel */}
      <AnimatePresence>
        {showHelpPanel && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHelpPanel(false)}
          >
            <motion.div 
              className="glass-card max-w-md w-full p-6 rounded-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Assistance connexion</h3>
              
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium">Comment obtenir un compte ?</h4>
                  <p className="text-muted-foreground">Contactez votre service RH qui vous enverra une invitation par email.</p>
                </div>
                
                <div>
                  <h4 className="font-medium">J'ai oublié mon mot de passe</h4>
                  <p className="text-muted-foreground">Cliquez sur "Mot de passe oublié" pour recevoir un lien de réinitialisation par email.</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Mon compte est bloqué</h4>
                  <p className="text-muted-foreground">Après plusieurs tentatives échouées, votre compte est temporairement bloqué. Attendez quelques minutes ou réinitialisez votre mot de passe.</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Besoin d'assistance ?</h4>
                  <p className="text-muted-foreground">Contactez le support technique à <a href="mailto:support@emotionscare.com" className="text-green-600 dark:text-green-400 hover:underline">support@emotionscare.com</a></p>
                </div>
              </div>
              
              <div className="mt-6">
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowHelpPanel(false)}
                >
                  Fermer
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default B2BUserPremiumLogin;
