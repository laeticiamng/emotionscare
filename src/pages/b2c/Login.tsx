
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import AnimatedFormField from '@/components/auth/AnimatedFormField';
import AnimatedButton from '@/components/auth/AnimatedButton';
import EmotionLoadingSpinner from '@/components/auth/EmotionLoadingSpinner';
import AuthFormTransition from '@/components/auth/AuthFormTransition';
import PageTransition from '@/components/transitions/PageTransition';
import AnimatedBackground from '@/components/immersive/AnimatedBackground';
import ThemeSwitcher from '@/components/theme/ThemeSwitcher';

const B2CLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showMagicLinkForm, setShowMagicLinkForm] = useState(false);
  const [magicLinkEmail, setMagicLinkEmail] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  
  const navigate = useNavigate();
  const { login, error: authError, clearError } = useAuth();
  const { setUserMode } = useUserMode();
  const { toast } = useToast();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    if (clearError) clearError();
    
    // Validate inputs
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const user = await login(email, password);
      
      setUserMode(user?.role || 'b2c');
      
      // Success toast with animation
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur EmotionsCare. Redirection vers votre espace...",
      });
      
      // Redirect after a slight delay for the animation to be visible
      setTimeout(() => navigate('/b2c/dashboard'), 800);
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      
      toast({
        title: "Échec de la connexion",
        description: "Identifiants incorrects ou problème de connexion",
        variant: "destructive",
      });
      
      setPasswordError("Veuillez vérifier vos identifiants");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(magicLinkEmail)) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate sending magic link
    setTimeout(() => {
      setIsLoading(false);
      setMagicLinkSent(true);
      
      toast({
        title: "Email envoyé",
        description: "Consultez votre boîte mail pour vous connecter sans mot de passe",
      });
    }, 1500);
  };

  // Animation variants for card
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
        <title>Connexion | EmotionsCare</title>
        <meta name="description" content="Connectez-vous à votre espace personnel EmotionsCare" />
      </Helmet>
      
      {/* Dynamic animated background */}
      <AnimatedBackground type="gradient" intensity="low" />
      
      {/* Theme toggle button */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeSwitcher variant="outline" />
      </div>
      
      <div className="min-h-screen flex items-center justify-center p-4">
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
              
              <CardTitle className="text-2xl font-semibold">Bienvenue</CardTitle>
              <CardDescription className="text-base">
                Connectez-vous à votre espace personnel
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {isLoading ? (
                <div className="py-8 flex justify-center">
                  <EmotionLoadingSpinner 
                    emotion="calm" 
                    text="Vérification de vos identifiants..." 
                  />
                </div>
              ) : (
                <>
                  {/* Show either login form or magic link form */}
                  <AuthFormTransition show={!showMagicLinkForm && !magicLinkSent}>
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                        autoFocus
                      />
                      
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
                        autoComplete="current-password"
                      />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="remember-me"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <label htmlFor="remember-me" className="text-sm text-muted-foreground cursor-pointer">
                            Se souvenir de moi
                          </label>
                        </div>
                        
                        <button 
                          type="button"
                          className="text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded-sm"
                          onClick={() => setShowMagicLinkForm(true)}
                        >
                          Mot de passe oublié?
                        </button>
                      </div>
                      
                      <AnimatedButton 
                        type="submit" 
                        className="w-full"
                        isLoading={isLoading}
                        loadingText="Connexion en cours..."
                      >
                        Se connecter <ArrowRight size={16} className="ml-2" />
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
                  
                  {/* Magic Link Form */}
                  <AuthFormTransition show={showMagicLinkForm && !magicLinkSent}>
                    <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-medium">Connexion sans mot de passe</h3>
                        <p className="text-sm text-muted-foreground">
                          Nous vous enverrons un lien magique pour vous connecter
                        </p>
                      </div>
                      
                      <AnimatedFormField
                        id="magic-link-email"
                        label="Email"
                        type="email"
                        value={magicLinkEmail}
                        onChange={(e) => setMagicLinkEmail(e.target.value)}
                        onBlur={() => validateEmail(magicLinkEmail)}
                        error={emailError}
                        required
                        icon={<Mail size={18} />}
                        autoComplete="email"
                        autoFocus
                      />
                      
                      <AnimatedButton 
                        type="submit" 
                        className="w-full"
                        isLoading={isLoading}
                        loadingText="Envoi en cours..."
                      >
                        Recevoir un lien de connexion <ArrowRight size={16} className="ml-2" />
                      </AnimatedButton>
                      
                      <button 
                        type="button"
                        className="text-sm text-center w-full text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded-sm"
                        onClick={() => setShowMagicLinkForm(false)}
                      >
                        Retour à la connexion classique
                      </button>
                    </form>
                  </AuthFormTransition>
                  
                  {/* Magic Link Sent Confirmation */}
                  <AuthFormTransition show={magicLinkSent}>
                    <div className="py-6">
                      <div className="text-center space-y-4">
                        <div className="rounded-full bg-primary/10 p-4 w-20 h-20 flex items-center justify-center mx-auto">
                          <Mail className="h-10 w-10 text-primary" />
                        </div>
                        
                        <h3 className="text-xl font-medium">Email envoyé!</h3>
                        <p className="text-muted-foreground">
                          Un lien de connexion a été envoyé à <span className="font-medium">{magicLinkEmail}</span>.
                          Vérifiez votre boîte de réception.
                        </p>
                        
                        <AnimatedButton
                          variant="outline"
                          className="mt-4"
                          onClick={() => {
                            setMagicLinkSent(false);
                            setShowMagicLinkForm(false);
                          }}
                        >
                          Retour à la connexion
                        </AnimatedButton>
                      </div>
                    </div>
                  </AuthFormTransition>
                </>
              )}
            </CardContent>
            
            {!isLoading && !magicLinkSent && (
              <CardFooter className="flex flex-col gap-4">
                <div className="relative w-full">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                    ou
                  </span>
                </div>
                
                <Link to="/b2c/register" className="w-full">
                  <AnimatedButton 
                    variant="outline" 
                    type="button"
                    className="w-full"
                  >
                    Créer un compte
                  </AnimatedButton>
                </Link>
                
                <div className="text-center text-xs text-muted-foreground mt-2">
                  En vous connectant, vous acceptez nos{' '}
                  <a href="#" className="text-primary hover:underline">
                    Conditions Générales d'Utilisation
                  </a>{' '}
                  et notre{' '}
                  <a href="#" className="text-primary hover:underline">
                    Politique de Confidentialité
                  </a>
                </div>
              </CardFooter>
            )}
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default B2CLogin;
