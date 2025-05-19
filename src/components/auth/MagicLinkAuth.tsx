
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import AnimatedFormField from './AnimatedFormField';
import { Link } from 'react-router-dom';

interface MagicLinkAuthProps {
  onCancel: () => void;
}

const MagicLinkAuth: React.FC<MagicLinkAuthProps> = ({ onCancel }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Valider l'email
    if (!validateEmail(email)) {
      setEmailError('Veuillez entrer une adresse email valide');
      return;
    }
    
    setEmailError('');
    setIsSubmitting(true);
    
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSubmitted(true);
      
      toast({
        title: "Lien envoyé",
        description: "Vérifiez votre boîte mail pour vous connecter sans mot de passe",
      });
    } catch (error) {
      toast({
        title: "Erreur lors de l'envoi",
        description: "Impossible d'envoyer le lien magique. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Connexion sans mot de passe</CardTitle>
          <CardDescription className="text-center">
            Recevez un lien magique par email pour vous connecter en un clic
          </CardDescription>
        </CardHeader>
        
        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <AnimatedFormField
                id="email"
                label="Adresse email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
                required
                autoFocus
                autoComplete="email"
                icon={<Mail className="h-4 w-4" />}
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                    Envoi en cours...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Envoyer le lien magique
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                onClick={onCancel}
                className="w-full"
              >
                Retour à la connexion classique
              </Button>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="py-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
                  <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h3 className="font-medium text-lg">Lien envoyé avec succès</h3>
              <p className="text-muted-foreground">
                Nous avons envoyé un lien de connexion à <span className="font-medium">{email}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Vérifiez votre boîte de réception et cliquez sur le lien pour vous connecter automatiquement.
              </p>
              
              <div className="pt-4">
                <Link to="/b2c/login">
                  <Button variant="outline" className="w-full">
                    Retour à la page de connexion
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
};

export default MagicLinkAuth;
