
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, ArrowLeft, Check } from 'lucide-react';
import AnimatedFormField from '@/components/auth/AnimatedFormField';
import B2CAuthLayout from '@/components/auth/B2CAuthLayout';

const B2CForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Veuillez saisir votre adresse email');
      return;
    }
    
    if (!validateEmail(email)) {
      setError("Format d'email invalide");
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitted(true);
      
      toast({
        title: "Email envoyé",
        description: "Si un compte existe avec cette adresse, vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.",
      });
    } catch (error) {
      setError("Une erreur s'est produite lors de l'envoi. Veuillez réessayer.");
      
      toast({
        title: "Une erreur est survenue",
        description: "Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <B2CAuthLayout
      title="Réinitialisation du mot de passe"
      subtitle="Recevez un email pour réinitialiser votre mot de passe"
      backgroundImage="/lovable-uploads/033892e2-fdd7-440d-8a6f-7adfc4957c78.png"
    >
      <Card className="border-none shadow-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6 pt-6">
                <div className="text-center mb-4">
                  <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
                    <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-xl font-semibold">Mot de passe oublié</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Entrez votre email pour recevoir un lien de réinitialisation
                  </p>
                </div>
                
                <AnimatedFormField
                  id="email"
                  label="Adresse email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  icon={<Mail className="h-4 w-4" />}
                  error={error}
                />
              </CardContent>
              
              <CardFooter className="flex flex-col gap-4">
                <Button 
                  type="submit" 
                  className="w-full relative overflow-hidden" 
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <span className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-primary/10">
                      <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi en cours...
                    </span>
                  )}
                  <span className={isSubmitting ? "opacity-0" : "opacity-100"}>
                    Envoyer les instructions
                  </span>
                </Button>
                
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full" 
                  onClick={() => {}}
                  asChild
                >
                  <Link to="/b2c/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour à la connexion
                  </Link>
                </Button>
              </CardFooter>
            </form>
          ) : (
            <CardContent className="space-y-6 py-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <div className="mx-auto h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                
                <h2 className="text-xl font-semibold mb-2">Email envoyé!</h2>
                
                <p className="text-muted-foreground mb-6">
                  Si un compte existe avec l'adresse <strong>{email}</strong>, vous recevrez un email contenant les instructions pour réinitialiser votre mot de passe.
                </p>
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  asChild
                >
                  <Link to="/b2c/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour à la connexion
                  </Link>
                </Button>
              </motion.div>
            </CardContent>
          )}
        </motion.div>
      </Card>
    </B2CAuthLayout>
  );
};

export default B2CForgotPasswordPage;
