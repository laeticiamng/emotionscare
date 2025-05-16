
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { MailIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import Shell from '@/Shell';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Email envoyé",
        description: "Si un compte existe avec cette adresse, vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.",
        variant: "success",
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

  return (
    <Shell>
      <div className="flex items-center justify-center min-h-[80vh] p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900 dark:to-blue-900/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-lg border-blue-200 dark:border-blue-800/30">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <MailIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl text-blue-800 dark:text-blue-300">Mot de passe oublié</CardTitle>
              <CardDescription className="text-blue-600/70 dark:text-blue-400/70">
                Recevez un email pour réinitialiser votre mot de passe
              </CardDescription>
            </CardHeader>
            
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-blue-700 dark:text-blue-300">Adresse email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-blue-200 dark:border-blue-900/30 focus:border-blue-300"
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Envoi en cours..." : "Envoyer les instructions"}
                  </Button>
                  <div className="text-sm text-center">
                    <Link to="/login" className="text-blue-500/70 dark:text-blue-400/70 hover:underline">
                      Retour à la connexion
                    </Link>
                  </div>
                </CardFooter>
              </form>
            ) : (
              <CardContent className="space-y-6 py-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                  <p className="text-blue-700 dark:text-blue-300 mb-2">
                    ✅ Email envoyé avec succès
                  </p>
                  <p className="text-blue-600/70 dark:text-blue-400/70 text-sm">
                    Veuillez vérifier votre boîte de réception et suivre les instructions.
                  </p>
                </div>
                
                <div className="flex flex-col gap-4">
                  <Link to="/login">
                    <Button 
                      variant="outline" 
                      className="w-full border-blue-200 dark:border-blue-800/30 text-blue-700 dark:text-blue-300"
                    >
                      Retour à la connexion
                    </Button>
                  </Link>
                </div>
              </CardContent>
            )}
          </Card>
        </motion.div>
      </div>
    </Shell>
  );
};

export default ForgotPasswordPage;
