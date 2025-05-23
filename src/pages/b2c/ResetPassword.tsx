
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const B2CResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Veuillez saisir votre adresse email');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      // Simuler l'envoi d'un email de réinitialisation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSuccess(true);
      toast.success('Email envoyé', {
        description: 'Veuillez consulter votre boîte mail pour réinitialiser votre mot de passe'
      });
      
    } catch (error) {
      console.error('Erreur de réinitialisation:', error);
      setError('Une erreur est survenue. Veuillez réessayer.');
      toast.error('Erreur', {
        description: 'Une erreur est survenue lors de l\'envoi du mail de réinitialisation'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/20 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border shadow-lg">
          <CardHeader>
            <CardTitle>Réinitialiser votre mot de passe</CardTitle>
            <CardDescription>
              {isSuccess 
                ? "Un email de réinitialisation a été envoyé" 
                : "Entrez votre adresse email pour recevoir un lien de réinitialisation"}
            </CardDescription>
          </CardHeader>
          
          {isSuccess ? (
            <CardContent className="space-y-4">
              <div className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 p-4 rounded-md flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Email envoyé avec succès !</p>
                  <p className="text-sm mt-1">
                    Nous avons envoyé un email à <strong>{email}</strong> avec les instructions pour réinitialiser votre mot de passe.
                  </p>
                </div>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="exemple@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col">
                <Button type="submit" className="w-full mb-4" disabled={isLoading}>
                  {isLoading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
                </Button>
              </CardFooter>
            </form>
          )}
          
          <div className="px-6 pb-6">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              onClick={() => navigate('/b2c/login')}
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à la connexion
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2CResetPassword;
