
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Shell from '@/Shell';
import PageTransition from '@/components/transitions/PageTransition';
import AnimatedFormField from '@/components/auth/AnimatedFormField';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateForm = () => {
    let isValid = true;
    
    if (!email) {
      setEmailError('L\'email est requis');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('L\'email n\'est pas valide');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Email envoyé",
        description: "Si un compte existe avec cette adresse, vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.",
      });
      
      setSubmitted(true);
    } catch (error) {
      toast({
        title: "Une erreur est survenue",
        description: "Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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

  return (
    <Shell>
      <PageTransition>
        <div className="flex items-center justify-center min-h-[85vh] p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-slate-900 dark:to-blue-900/30">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="w-full max-w-md"
          >
            <Card className="shadow-lg border-blue-200 dark:border-blue-800/30">
              <CardHeader className="text-center">
                <motion.div 
                  className="mx-auto mb-4 h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center"
                  variants={itemVariants}
                >
                  <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <CardTitle className="text-2xl text-blue-800 dark:text-blue-300">Mot de passe oublié</CardTitle>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <CardDescription className="text-blue-600/70 dark:text-blue-400/70">
                    Recevez un email pour réinitialiser votre mot de passe
                  </CardDescription>
                </motion.div>
              </CardHeader>
              
              {!submitted ? (
                <form onSubmit={handleSubmit}>
                  <motion.div variants={itemVariants}>
                    <CardContent className="space-y-4">
                      <AnimatedFormField
                        id="email"
                        label="Adresse email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={emailError}
                        required
                        autoComplete="email"
                        icon={<Mail className="h-4 w-4" />}
                      />
                    </CardContent>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <CardFooter className="flex flex-col gap-4">
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full"
                      >
                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" 
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center">
                              <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                              Envoi en cours...
                            </span>
                          ) : (
                            "Envoyer les instructions"
                          )}
                        </Button>
                      </motion.div>
                      <div className="text-sm text-center">
                        <Link 
                          to="/b2c/login" 
                          className="text-blue-500/70 dark:text-blue-400/70 hover:underline flex items-center justify-center"
                        >
                          <ArrowLeft className="h-4 w-4 mr-1" />
                          Retour à la connexion
                        </Link>
                      </div>
                    </CardFooter>
                  </motion.div>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <CardContent className="space-y-6 py-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                      <div className="flex justify-center mb-2">
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                      </div>
                      <p className="text-blue-700 dark:text-blue-300 font-medium">
                        Email envoyé avec succès
                      </p>
                      <p className="text-blue-600/70 dark:text-blue-400/70 text-sm mt-2">
                        Veuillez vérifier votre boîte de réception et suivre les instructions pour réinitialiser votre mot de passe.
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                      <Link to="/b2c/login">
                        <Button 
                          variant="outline" 
                          className="w-full border-blue-200 dark:border-blue-800/30 text-blue-700 dark:text-blue-300"
                        >
                          Retour à la connexion
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </Card>
          </motion.div>
        </div>
      </PageTransition>
    </Shell>
  );
};

export default ForgotPasswordPage;
