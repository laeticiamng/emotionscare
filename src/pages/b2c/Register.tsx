
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Lock, UserPlus, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import AnimatedFormField from '@/components/auth/AnimatedFormField';
import PostLoginTransition from '@/components/auth/PostLoginTransition';

const B2CRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameSuccess, setNameSuccess] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [agreement, setAgreement] = useState(false);
  
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();

  const validateName = (value: string) => {
    if (value.length >= 3) {
      setNameSuccess('Nom valide');
      return true;
    }
    setNameSuccess('');
    return false;
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(value)) {
      setEmailSuccess('Email valide');
      return true;
    }
    setEmailSuccess('');
    return false;
  };

  const validatePassword = (value: string) => {
    if (value.length >= 6) {
      setPasswordSuccess('Mot de passe valide');
      return true;
    }
    setPasswordSuccess('');
    return false;
  };

  const validatePasswordMatch = () => {
    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        setPasswordError('Les mots de passe ne correspondent pas');
        return false;
      } else {
        setPasswordError('');
        return true;
      }
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const doPasswordsMatch = validatePasswordMatch();
    
    if (!isNameValid || !isEmailValid || !isPasswordValid || !doPasswordsMatch || !agreement) {
      if (!agreement) {
        toast({
          title: "Veuillez accepter les conditions",
          description: "Vous devez accepter les conditions d'utilisation pour créer un compte",
          variant: "destructive"
        });
      }
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(name, email, password);
      
      toast({
        title: "Inscription réussie!",
        description: "Votre compte a été créé avec succès.",
      });
      
      setShowTransition(true);
      // La redirection se fera après l'animation de transition
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Erreur lors de l'inscription",
        description: "Veuillez vérifier vos informations et réessayer.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { ease: "easeInOut" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const handleTransitionComplete = () => {
    navigate('/b2c/dashboard');
  };
  
  return (
    <>
      <PostLoginTransition 
        show={showTransition} 
        onComplete={handleTransitionComplete} 
      />
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-blue-900/20 p-4">
        {/* Ambient background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-purple-200/20 dark:bg-blue-500/10 rounded-full filter blur-3xl"></div>
        </div>
        
        <motion.div 
          className="w-full max-w-md"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
        >
          <Card className="backdrop-blur-sm bg-white/90 dark:bg-slate-900/80 shadow-xl border-blue-100/50 dark:border-blue-900/30">
            <CardHeader className="space-y-1 text-center">
              <motion.div 
                className="flex justify-center"
                variants={itemVariants}
              >
                <div className="p-3 rounded-full bg-primary/10">
                  <UserPlus className="h-10 w-10 text-primary" />
                </div>
              </motion.div>
              <motion.div variants={itemVariants}>
                <CardTitle className="text-2xl font-bold mt-3">Créer un compte</CardTitle>
                <CardDescription>Rejoignez EmotionsCare pour prendre soin de votre bien-être émotionnel</CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div variants={itemVariants}>
                  <AnimatedFormField
                    id="name"
                    label="Nom complet"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => validateName(name)}
                    required
                    success={nameSuccess}
                    icon={<User size={18} />}
                    hint="Utilisé pour personnaliser votre expérience"
                    autoComplete="name"
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <AnimatedFormField
                    id="email"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => validateEmail(email)}
                    required
                    success={emailSuccess}
                    icon={<Mail size={18} />}
                    autoComplete="email"
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <AnimatedFormField
                    id="password"
                    label="Mot de passe"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      validatePassword(e.target.value);
                      if (confirmPassword) validatePasswordMatch();
                    }}
                    required
                    success={passwordSuccess}
                    icon={<Lock size={18} />}
                    hint="6 caractères minimum"
                    autoComplete="new-password"
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <AnimatedFormField
                    id="confirm-password"
                    label="Confirmer le mot de passe"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (password) validatePasswordMatch();
                    }}
                    required
                    error={passwordError}
                    icon={<Lock size={18} />}
                    autoComplete="new-password"
                  />
                </motion.div>
                
                <motion.div 
                  className="flex items-center space-x-2 pt-2"
                  variants={itemVariants}
                >
                  <input
                    type="checkbox"
                    id="agreement"
                    checked={agreement}
                    onChange={(e) => setAgreement(e.target.checked)}
                    className="rounded text-primary focus:ring-primary"
                    required
                  />
                  <label htmlFor="agreement" className="text-sm text-muted-foreground">
                    J'accepte les <Link to="/terms" className="text-primary hover:underline">conditions d'utilisation</Link> et la <Link to="/privacy" className="text-primary hover:underline">politique de confidentialité</Link>
                  </label>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-white transition-all" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
                        Inscription en cours...
                      </div>
                    ) : "S'inscrire"}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <motion.div className="text-sm text-center" variants={itemVariants}>
                Vous avez déjà un compte?{' '}
                <Link to="/b2c/login" className="text-primary hover:underline">
                  Se connecter
                </Link>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Button 
                  variant="ghost" 
                  className="w-full text-muted-foreground" 
                  onClick={() => navigate('/')}
                >
                  Retour à l'accueil
                </Button>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default B2CRegister;
