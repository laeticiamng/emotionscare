
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { Mail, Lock, User, UserPlus, Check, FileSymlink } from 'lucide-react';
import Shell from '@/Shell';
import { useToast } from '@/hooks/use-toast';
import PageTransition from '@/components/transitions/PageTransition';
import SocialAuthButtons from '@/components/auth/SocialAuthButtons';
import AnimatedFormField from '@/components/auth/AnimatedFormField';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);
  
  // Validation errors
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [termsError, setTermsError] = useState('');
  
  const navigate = useNavigate();
  const { register, error, clearError } = useAuth();
  const { toast } = useToast();
  
  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordChecks, setPasswordChecks] = useState({
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false
  });
  
  const validateForm = () => {
    let isValid = true;
    
    // Validation du nom
    if (!name) {
      setNameError('Le nom est requis');
      isValid = false;
    } else if (name.length < 2) {
      setNameError('Le nom doit contenir au moins 2 caractères');
      isValid = false;
    } else {
      setNameError('');
    }
    
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
    } else if (password.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    // Validation de la confirmation de mot de passe
    if (password !== confirmPassword) {
      setConfirmError('Les mots de passe ne correspondent pas');
      isValid = false;
    } else {
      setConfirmError('');
    }
    
    // Validation des conditions d'utilisation
    if (!accepted) {
      setTermsError('Vous devez accepter les conditions d\'utilisation');
      isValid = false;
    } else {
      setTermsError('');
    }
    
    return isValid;
  };
  
  const checkPasswordStrength = (value: string) => {
    const checks = {
      hasMinLength: value.length >= 8,
      hasUppercase: /[A-Z]/.test(value),
      hasLowercase: /[a-z]/.test(value),
      hasNumber: /[0-9]/.test(value),
      hasSpecial: /[^A-Za-z0-9]/.test(value)
    };
    
    setPasswordChecks(checks);
    
    const strengthScore = Object.values(checks).filter(Boolean).length;
    setPasswordStrength(strengthScore);
    
    return strengthScore;
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    checkPasswordStrength(value);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (clearError) clearError();
    setIsLoading(true);
    
    try {
      await register(name, email, password);
      
      // Stockage temporaire de l'état de connexion pour l'animation
      sessionStorage.setItem('just_logged_in', 'true');
      
      toast({
        title: "Inscription réussie",
        description: "Bienvenue sur EmotionsCare!",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Échec de l'inscription",
        description: error.message || "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
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
  
  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <Shell>
      <PageTransition>
        <div className="flex items-center justify-center min-h-[85vh] p-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="w-full max-w-lg"
          >
            <Card className="border-blue-200 dark:border-blue-900/30 shadow-xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-bl-full"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-400/10 to-blue-400/10 rounded-tr-full"></div>
              
              <CardHeader className="space-y-1 text-center relative z-10">
                <motion.div 
                  className="mx-auto mb-2 bg-blue-100 dark:bg-blue-900/30 w-14 h-14 rounded-full flex items-center justify-center"
                  variants={itemVariants}
                >
                  <UserPlus className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400">
                    Créer un compte
                  </CardTitle>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <CardDescription>
                    Rejoignez EmotionsCare pour prendre soin de votre bien-être émotionnel
                  </CardDescription>
                </motion.div>
              </CardHeader>
              
              <form onSubmit={handleRegister}>
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
                      id="name"
                      label="Nom complet"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      error={nameError}
                      required
                      autoComplete="name"
                      icon={<User className="h-4 w-4" />}
                    />
                    
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
                    
                    <div className="space-y-2">
                      <AnimatedFormField
                        id="password"
                        label="Mot de passe"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        error={passwordError}
                        required
                        autoComplete="new-password"
                        icon={<Lock className="h-4 w-4" />}
                      />
                      
                      {password && (
                        <div className="space-y-2 mt-1 mb-3">
                          <div className="flex space-x-1 h-1">
                            <div className={`flex-1 rounded-full ${passwordStrength >= 1 ? getPasswordStrengthColor() : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                            <div className={`flex-1 rounded-full ${passwordStrength >= 2 ? getPasswordStrengthColor() : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                            <div className={`flex-1 rounded-full ${passwordStrength >= 3 ? getPasswordStrengthColor() : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                            <div className={`flex-1 rounded-full ${passwordStrength >= 4 ? getPasswordStrengthColor() : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                            <div className={`flex-1 rounded-full ${passwordStrength >= 5 ? getPasswordStrengthColor() : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center">
                              <span className={`mr-1 ${passwordChecks.hasMinLength ? 'text-green-500' : 'text-gray-400'}`}>
                                {passwordChecks.hasMinLength ? <Check size={12} /> : '○'}
                              </span>
                              <span className={passwordChecks.hasMinLength ? 'text-foreground' : 'text-muted-foreground'}>
                                8 caractères min.
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className={`mr-1 ${passwordChecks.hasUppercase ? 'text-green-500' : 'text-gray-400'}`}>
                                {passwordChecks.hasUppercase ? <Check size={12} /> : '○'}
                              </span>
                              <span className={passwordChecks.hasUppercase ? 'text-foreground' : 'text-muted-foreground'}>
                                Majuscule
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className={`mr-1 ${passwordChecks.hasLowercase ? 'text-green-500' : 'text-gray-400'}`}>
                                {passwordChecks.hasLowercase ? <Check size={12} /> : '○'}
                              </span>
                              <span className={passwordChecks.hasLowercase ? 'text-foreground' : 'text-muted-foreground'}>
                                Minuscule
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className={`mr-1 ${passwordChecks.hasNumber ? 'text-green-500' : 'text-gray-400'}`}>
                                {passwordChecks.hasNumber ? <Check size={12} /> : '○'}
                              </span>
                              <span className={passwordChecks.hasNumber ? 'text-foreground' : 'text-muted-foreground'}>
                                Chiffre
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className={`mr-1 ${passwordChecks.hasSpecial ? 'text-green-500' : 'text-gray-400'}`}>
                                {passwordChecks.hasSpecial ? <Check size={12} /> : '○'}
                              </span>
                              <span className={passwordChecks.hasSpecial ? 'text-foreground' : 'text-muted-foreground'}>
                                Caractère spécial
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <AnimatedFormField
                      id="confirmPassword"
                      label="Confirmer le mot de passe"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      error={confirmError}
                      required
                      autoComplete="new-password"
                      icon={<Lock className="h-4 w-4" />}
                    />
                    
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="terms" 
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" 
                        checked={accepted}
                        onChange={(e) => setAccepted(e.target.checked)}
                      />
                      <label htmlFor="terms" className="text-sm">
                        J'accepte les <Link to="/terms" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">conditions d'utilisation</Link>
                      </label>
                    </div>
                    
                    {termsError && (
                      <p className="text-sm text-destructive">{termsError}</p>
                    )}
                    
                    <motion.div 
                      className="pt-2"
                      variants={itemVariants}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center">
                            <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                            Inscription en cours...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            Créer mon compte
                          </span>
                        )}
                      </Button>
                    </motion.div>
                    
                    <SocialAuthButtons mode="register" />
                  </CardContent>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <CardFooter className="flex flex-col space-y-4">
                    <div className="text-sm text-center">
                      Vous avez déjà un compte?{' '}
                      <Link 
                        to="/b2c/login" 
                        className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Se connecter
                      </Link>
                    </div>
                  </CardFooter>
                </motion.div>
              </form>
            </Card>
          </motion.div>
        </div>
      </PageTransition>
    </Shell>
  );
};

export default RegisterPage;
