
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Loader2, ArrowLeft, Heart } from 'lucide-react';
import { toast } from 'sonner';

const B2CResetPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Veuillez saisir votre adresse email');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await resetPassword(email);
      if (error) {
        toast.error('Erreur: ' + error.message);
      } else {
        setEmailSent(true);
        toast.success('Email de réinitialisation envoyé !');
      }
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de l\'email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-red-900 dark:via-slate-800 dark:to-pink-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Card className="w-full max-w-md">
          <CardHeader className="text-center relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/b2c/login')}
              className="absolute left-4 top-4"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="mx-auto mb-4 p-3 bg-red-100 dark:bg-red-900/30 rounded-full w-fit">
              <Heart className="h-8 w-8 text-red-500" />
            </div>
            <CardTitle className="text-2xl">
              {emailSent ? 'Email envoyé' : 'Mot de passe oublié ?'}
            </CardTitle>
            <CardDescription>
              {emailSent 
                ? 'Vérifiez votre boîte email pour réinitialiser votre mot de passe'
                : 'Saisissez votre email pour recevoir un lien de réinitialisation'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!emailSent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Envoyer le lien de réinitialisation
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Un email a été envoyé à <strong>{email}</strong>
                </p>
                <Button
                  onClick={() => setEmailSent(false)}
                  variant="outline"
                  className="w-full"
                >
                  Renvoyer l'email
                </Button>
              </div>
            )}
            
            <div className="text-center mt-6">
              <Link 
                to="/b2c/login" 
                className="text-sm text-primary hover:underline"
              >
                Retour à la connexion
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2CResetPasswordPage;
