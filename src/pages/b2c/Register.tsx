
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, AlertCircle, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedFormField from '@/components/auth/AnimatedFormField';
import AnimatedButton from '@/components/auth/AnimatedButton';
import EmotionLoadingSpinner from '@/components/auth/EmotionLoadingSpinner';
import AuthFormTransition from '@/components/auth/AuthFormTransition';
import PageTransition from '@/components/transitions/PageTransition';
import AnimatedBackground from '@/components/immersive/AnimatedBackground';
import ThemeSwitcher from '@/components/theme/ThemeSwitcher';

const B2CRegister: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeTermsError, setAgreeTermsError] = useState('');
  const [registrationComplete, setRegistrationComplete] = useState(false);
  
  const navigate = useNavigate();
  const { register, error: authError, clearError } = useAuth();
  const { toast } = useToast();
  
  const validateName = (name: string): boolean => {
    if (!name.trim()) {
      setNameError('Le nom est requis');
      return false;
    }
    if (name.trim().length < 2) {
      setNameError('Le nom doit contenir au moins 2 caractères');
      return false;
    }
    setNameError('');
    return true;
  };
  
  const validateEmail = (email: string): boolean => {
    if (!email) {
      setEmailError('L\'email est requis');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Format d\'email invalide');
      return false;
    }
    setEmailError('');
    return true;
  };
  
  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError('Le mot de passe est requis');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    setPasswordError('');
    return true;
  };
  
  const validateConfirmPassword = (confirmPwd: string): boolean => {
    if (!confirmPwd) {
      setConfirmPasswordError('Veuillez confirmer votre mot de passe');
      return false;
    }
    if (confirmPwd !== password) {
      setConfirmPasswordError('Les mots de passe ne correspondent pas');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };
  
  const validateTerms = (): boolean => {
    if (!agreeTerms) {
      setAgreeTermsError('Vous devez accepter les conditions générales');
      return false;
    }
    setAgreeTermsError('');
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    if (clearError) clearError();
    
    // Validate all inputs
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    const areTermsAccepted = validateTerms();
    
    if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid || !areTermsAccepted) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(name, email, password);
      
      // Simulate success and show animation before redirecting
      setRegistrationComplete(true);
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès",
        variant: "success",
      });
      
      // Redirect after success animation
      setTimeout(() => navigate('/b2c/dashboard'), 1500);
    } catch (error: any) {
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur s'est produite lors de l'inscription",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return { text: '', color: '' };
    
    if (password.length < 6) {
      return { text: 'Faible', color: 'text-red-500' };
    } else if (password.length < 10) {
      return { text: 'Moyen', color: 'text-amber-500' };
    } else {
      return { text: 'Fort', color: 'text-green-500' };
    }
  };
  
  const passwordStrength = getPasswordStrength();
  
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <PageTransition>
      <Helmet>
        <title>Inscription | EmotionsCare</title>
        <meta name="description" content="Créez un compte et rejoignez la communauté EmotionsCare" />
      </Helmet>
      
      {/* Dynamic animated background */}
      <AnimatedBackground type="gradient" intensity="low" />
      
      {/* Theme toggle button */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeSwitcher variant="outline" />
      </div>
      
      <div className="min-h-screen flex items-center justify-center p-4 py-10">
        <motion.div
          className="w-full max-w-md"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="backdrop-blur-sm bg-background/95 border-primary/10 shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <motion.div 
                className="mx-auto mb-2"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div className="rounded-full bg-primary/10 p-3 w-16 h-16 flex items-center justify-center mx-auto">
                  <User className="h-8 w-8 text-primary" />
                </div>
              </motion.div>
              
              <CardTitle className="text-2xl font-semibold">Créer un compte</CardTitle>
              <CardDescription className="text-base">
                Rejoignez la communauté EmotionsCare
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {isLoading ? (
                <div className="py-8 flex justify-center">
                  <EmotionLoadingSpinner 
                    emotion="happy" 
                    text="Création de votre compte..." 
                  />
                </div>
              ) : registrationComplete ? (
                <AuthFormTransition>
                  <div className="py-8 flex flex-col items-center space-y-4">
                    <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                      <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-medium">Inscription réussie!</h3>
                    <p className="text-muted-foreground text-center">
                      Votre compte a été créé avec succès. Bienvenue dans la communauté EmotionsCare!
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Redirection vers votre espace personnel...
                    </p>
                  </div>
                </AuthFormTransition>
              ) : (
                <AuthFormTransition>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <AnimatedFormField
                      id="name"
                      label="Nom complet"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={() => validateName(name)}
                      error={nameError}
                      required
                      icon={<User size={18} />}
                      autoComplete="name"
                      autoFocus
                    />
                    
                    <AnimatedFormField
                      id="email"
                      label="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => validateEmail(email)}
                      error={emailError}
                      required
                      icon={<Mail size={18} />}
                      autoComplete="email"
                    />
                    
                    <div className="space-y-1">
                      <AnimatedFormField
                        id="password"
                        label="Mot de passe"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => validatePassword(password)}
                        error={passwordError}
                        required
                        icon={<Lock size={18} />}
                        hint={password ? `Force: ${passwordStrength.text}` : ''}
                        className={password ? `border-b-2 border-b-${passwordStrength.color.replace('text-', '')}` : ''}
                      />
                      
                      {password && (
                        <div className="w-full h-1 flex mt-1 gap-1">
                          <motion.div 
                            className={`h-full rounded-full ${password.length >= 1 ? 'bg-red-500' : 'bg-gray-200'}`}
                            initial={{ width: 0 }}
                            animate={{ width: '33%' }}
                            transition={{ duration: 0.3 }}
                          />
                          <motion.div 
                            className={`h-full rounded-full ${password.length >= 6 ? 'bg-amber-500' : 'bg-gray-200'}`}
                            initial={{ width: 0 }}
                            animate={{ width: '33%' }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                          />
                          <motion.div 
                            className={`h-full rounded-full ${password.length >= 10 ? 'bg-green-500' : 'bg-gray-200'}`}
                            initial={{ width: 0 }}
                            animate={{ width: '33%' }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                          />
                        </div>
                      )}
                    </div>
                    
                    <AnimatedFormField
                      id="confirm-password"
                      label="Confirmer le mot de passe"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() => validateConfirmPassword(confirmPassword)}
                      error={confirmPasswordError}
                      required
                      icon={<Lock size={18} />}
                    />
                    
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox 
                        id="terms" 
                        checked={agreeTerms}
                        onCheckedChange={(checked) => {
                          setAgreeTerms(checked === true);
                          if (checked) setAgreeTermsError('');
                        }}
                        aria-invalid={!!agreeTermsError}
                        aria-describedby={agreeTermsError ? "terms-error" : undefined}
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm leading-none text-muted-foreground cursor-pointer"
                      >
                        J'accepte les{' '}
                        <a href="#" className="text-primary hover:underline">
                          conditions générales
                        </a>{' '}
                        et la{' '}
                        <a href="#" className="text-primary hover:underline">
                          politique de confidentialité
                        </a>
                      </label>
                    </div>
                    
                    {agreeTermsError && (
                      <p id="terms-error" className="text-sm text-destructive mt-1" role="alert">
                        {agreeTermsError}
                      </p>
                    )}
                    
                    <AnimatedButton 
                      type="submit" 
                      className="w-full mt-6"
                      isLoading={isLoading}
                      loadingText="Inscription en cours..."
                    >
                      Créer mon compte <ArrowRight size={16} className="ml-2" />
                    </AnimatedButton>
                    
                    {authError && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-3 rounded-md bg-destructive/10 text-destructive flex items-center gap-2"
                      >
                        <AlertCircle size={16} />
                        <span className="text-sm">{authError}</span>
                      </motion.div>
                    )}
                  </form>
                </AuthFormTransition>
              )}
            </CardContent>
            
            {!isLoading && !registrationComplete && (
              <CardFooter className="flex flex-col gap-4">
                <div className="relative w-full">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                    ou
                  </span>
                </div>
                
                <Link to="/b2c/login" className="w-full">
                  <AnimatedButton 
                    variant="outline" 
                    type="button"
                    className="w-full"
                  >
                    J'ai déjà un compte
                  </AnimatedButton>
                </Link>
              </CardFooter>
            )}
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default B2CRegister;
