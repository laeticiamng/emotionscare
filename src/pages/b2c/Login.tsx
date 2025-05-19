
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import AnimatedFormField from '@/components/auth/AnimatedFormField';
import PostLoginTransition from '@/components/auth/PostLoginTransition';

const B2CLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [magicLinkEmail, setMagicLinkEmail] = useState('');
  const [showMagicLink, setShowMagicLink] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      setShowTransition(true);
      // Note: La redirection se fera après l'animation de transition
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Problème de connexion",
        description: "Veuillez vérifier vos identifiants et réessayer.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  const handleMagicLinkRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!magicLinkEmail) {
      toast({
        title: "Email requis",
        description: "Veuillez entrer votre adresse email pour recevoir un lien de connexion.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Lien magique envoyé!",
      description: "Veuillez vérifier votre boîte mail pour vous connecter sans mot de passe.",
      variant: "default",
    });
    
    setShowMagicLink(false);
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
        {/* Ambient background elements */}
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
          {!showMagicLink ? (
            <Card className="backdrop-blur-sm bg-white/90 dark:bg-slate-900/80 shadow-xl border-blue-100/50 dark:border-blue-900/30">
              <CardHeader className="space-y-1 text-center">
                <motion.div 
                  className="flex justify-center"
                  variants={itemVariants}
                >
                  <div className="p-3 rounded-full bg-primary/10">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <CardTitle className="text-2xl font-bold mt-3">Bienvenue</CardTitle>
                  <CardDescription>Connectez-vous à votre espace personnel EmotionsCare</CardDescription>
                </motion.div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <motion.div variants={itemVariants}>
                    <AnimatedFormField
                      id="email"
                      label="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
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
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      icon={<Lock size={18} />}
                      autoComplete="current-password"
                    />
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center justify-between text-sm pt-2"
                    variants={itemVariants}
                  >
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="remember" 
                        className="rounded text-primary focus:ring-primary"
                      />
                      <label htmlFor="remember" className="text-muted-foreground">Se souvenir de moi</label>
                    </div>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-primary" 
                      type="button"
                      onClick={() => setShowMagicLink(true)}
                    >
                      Mot de passe oublié?
                    </Button>
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
                          Connexion...
                        </div>
                      ) : "Se connecter"}
                    </Button>
                  </motion.div>
                </form>
                
                <motion.div 
                  className="relative flex items-center justify-center mt-6"
                  variants={itemVariants}
                >
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-muted"></div>
                  </div>
                  <div className="relative px-4 text-xs uppercase bg-white dark:bg-slate-900/80 text-muted-foreground">
                    ou
                  </div>
                </motion.div>
                
                <motion.div 
                  className="mt-6"
                  variants={itemVariants}
                >
                  <Button 
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    type="button"
                    onClick={() => setShowMagicLink(true)}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Connexion sans mot de passe
                  </Button>
                </motion.div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <motion.div className="w-full" variants={itemVariants}>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => navigate('/b2c/register')}
                  >
                    Créer un compte
                  </Button>
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
          ) : (
            <Card className="backdrop-blur-sm bg-white/90 dark:bg-slate-900/80 shadow-xl border-blue-100/50 dark:border-blue-900/30">
              <CardHeader className="space-y-1 text-center">
                <motion.div 
                  className="flex justify-center"
                  variants={itemVariants}
                >
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <Mail className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                  </div>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <CardTitle className="text-2xl font-bold mt-3">Connexion Magique</CardTitle>
                  <CardDescription>Recevez un lien de connexion par email</CardDescription>
                </motion.div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleMagicLinkRequest} className="space-y-4">
                  <motion.div variants={itemVariants}>
                    <AnimatedFormField
                      id="magic-email"
                      label="Email"
                      type="email"
                      value={magicLinkEmail}
                      onChange={(e) => setMagicLinkEmail(e.target.value)}
                      required
                      icon={<Mail size={18} />}
                      autoComplete="email"
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                    >
                      Recevoir un lien magique
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
              <CardFooter>
                <motion.div className="w-full" variants={itemVariants}>
                  <Button 
                    variant="ghost" 
                    className="w-full" 
                    onClick={() => setShowMagicLink(false)}
                  >
                    Retour à la connexion standard
                  </Button>
                </motion.div>
              </CardFooter>
            </Card>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default B2CLogin;
