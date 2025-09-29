
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { EyeIcon, EyeOffIcon, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import LoadingAnimation from '@/components/ui/LoadingAnimation';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez saisir une adresse email valide.",
  }),
  password: z.string().min(8, {
    message: "Le mot de passe doit contenir au moins 8 caractères.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"],
});

const EnhancedRegisterForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();
  const { register, error: authError, clearError } = useAuth();
  const { toast } = useToast();
  const { theme } = useTheme();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  useEffect(() => {
    // Clean up error on unmount
    return () => {
      if (clearError) clearError();
    };
  }, [clearError]);
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    // Haptic feedback on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    if (clearError) clearError();
    
    try {
      const user = await register(values.name, values.email, values.password);
      
      // Success toast notification
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès.",
        variant: "success"
      });
      
      // Add a short delay for animation purposes
      setTimeout(() => {
        navigate('/b2c/dashboard');
      }, 500);
      
    } catch (error: any) {
      console.error("Erreur d'inscription:", error);
      
      toast({
        title: "Inscription impossible",
        description: error.message || "Une erreur s'est produite lors de l'inscription.",
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
        key="register-form"
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
                <User className="h-6 w-6 text-white" />
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
              variants={itemVariants}
            >
              Créer un compte
            </motion.h1>
            
            <motion.p
              className="text-muted-foreground max-w-xs mx-auto"
              variants={itemVariants}
            >
              Rejoignez EmotionsCare pour prendre soin de votre bien-être émotionnel
            </motion.p>
          </CardHeader>
          
          <CardContent className="p-6 pt-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormLabel className="absolute text-muted-foreground left-9 top-2 transition-all duration-200 peer-focus:-top-6 peer-focus:left-0 peer-focus:text-primary peer-focus:text-xs peer-valid:-top-6 peer-valid:left-0 peer-valid:text-xs">
                          Nom complet
                        </FormLabel>
                        <User className="absolute top-2.5 left-3 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input
                            className="pl-10 transition-all peer"
                            {...field}
                            autoComplete="name"
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-destructive mt-1" />
                      </FormItem>
                    )}
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormLabel className="absolute text-muted-foreground left-9 top-2 transition-all duration-200 peer-focus:-top-6 peer-focus:left-0 peer-focus:text-primary peer-focus:text-xs peer-valid:-top-6 peer-valid:left-0 peer-valid:text-xs">
                          Email
                        </FormLabel>
                        <Mail className="absolute top-2.5 left-3 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input
                            className="pl-10 transition-all peer"
                            type="email"
                            {...field}
                            autoComplete="email"
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-destructive mt-1" />
                      </FormItem>
                    )}
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormLabel className="absolute text-muted-foreground left-9 top-2 transition-all duration-200 peer-focus:-top-6 peer-focus:left-0 peer-focus:text-primary peer-focus:text-xs peer-valid:-top-6 peer-valid:left-0 peer-valid:text-xs">
                          Mot de passe
                        </FormLabel>
                        <Lock className="absolute top-2.5 left-3 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <div className="relative">
                            <Input
                              className="pl-10 pr-10 transition-all peer"
                              type={showPassword ? "text" : "password"}
                              {...field}
                              autoComplete="new-password"
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
                        </FormControl>
                        <FormMessage className="text-xs text-destructive mt-1" />
                      </FormItem>
                    )}
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormLabel className="absolute text-muted-foreground left-9 top-2 transition-all duration-200 peer-focus:-top-6 peer-focus:left-0 peer-focus:text-primary peer-focus:text-xs peer-valid:-top-6 peer-valid:left-0 peer-valid:text-xs">
                          Confirmer le mot de passe
                        </FormLabel>
                        <Lock className="absolute top-2.5 left-3 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <div className="relative">
                            <Input
                              className="pl-10 pr-10 transition-all peer"
                              type={showConfirmPassword ? "text" : "password"}
                              {...field}
                              autoComplete="new-password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute top-2 right-3 text-muted-foreground hover:text-primary transition-colors"
                              aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                            >
                              {showConfirmPassword ? (
                                <EyeOffIcon className="h-5 w-5" />
                              ) : (
                                <EyeIcon className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs text-destructive mt-1" />
                      </FormItem>
                    )}
                  />
                </motion.div>
                
                {authError && (
                  <motion.div 
                    className="p-3 rounded-md bg-destructive/10 text-destructive text-sm border border-destructive/20"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {authError}
                  </motion.div>
                )}
                
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
                        <span>S'inscrire</span>
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4 p-6 pt-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
            <motion.div 
              className="text-sm text-center w-full"
              variants={itemVariants}
            >
              <span className="text-muted-foreground">Vous avez déjà un compte ? </span>
              <Button
                variant="link"
                className="p-0 h-auto text-primary"
                onClick={() => navigate('/b2c/login')}
              >
                Se connecter
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

export default EnhancedRegisterForm;
