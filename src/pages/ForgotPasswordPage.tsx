
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';
import Shell from '@/Shell';
import { useToast } from '@/hooks/use-toast';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simulate API call for password reset
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitted(true);
      toast({
        title: "Email envoyé",
        description: "Veuillez consulter votre boîte de réception pour réinitialiser votre mot de passe"
      });
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError('Impossible d\'envoyer l\'email de réinitialisation. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Shell>
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardHeader>
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl text-center">
                {isSubmitted ? "Email envoyé" : "Mot de passe oublié"}
              </CardTitle>
              <CardDescription className="text-center">
                {isSubmitted 
                  ? "Veuillez vérifier votre boîte de réception pour les instructions de réinitialisation"
                  : "Entrez votre email pour recevoir un lien de réinitialisation"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="vous@exemple.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-destructive p-2 bg-destructive/10 rounded-md"
                    >
                      {error}
                    </motion.div>
                  )}
                  <Button 
                    type="submit" 
                    className="w-full relative" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span>Envoi en cours...</span>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      </>
                    ) : "Envoyer le lien de réinitialisation"}
                  </Button>
                </form>
              ) : (
                <div className="text-center p-4">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-4 text-primary"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </motion.div>
                  <p className="mb-4 text-muted-foreground">
                    Un email avec les instructions pour réinitialiser votre mot de passe a été envoyé à <strong>{email}</strong>.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    N'oubliez pas de vérifier votre dossier de spam si vous ne voyez pas l'email.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col items-center gap-2">
              <div className="text-sm text-muted-foreground">
                <Link
                  to="/login"
                  className="text-primary underline-offset-4 hover:underline cursor-pointer"
                >
                  Retour à la page de connexion
                </Link>
              </div>
              <Button variant="ghost" className="mt-2 flex items-center gap-2" onClick={() => navigate('/')}>
                <ArrowLeft size={16} />
                Retour à l'accueil
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </Shell>
  );
};

export default ForgotPasswordPage;
