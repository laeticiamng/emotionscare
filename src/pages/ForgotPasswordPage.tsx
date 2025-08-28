
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle, 
  Key,
  Shield,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [step, setStep] = useState<'request' | 'sent' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePasswordResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;

      setStep('sent');
      toast({
        title: "Email envoyé",
        description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe."
      });
    } catch (error: any) {
      setError(error.message || 'Une erreur est survenue');
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'email de réinitialisation.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne concordent pas');
      return;
    }

    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Mot de passe modifié",
        description: "Votre mot de passe a été mis à jour avec succès."
      });

      navigate('/choose-mode');
    } catch (error: any) {
      setError(error.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-blue-500" />
            <span className="font-bold text-xl">EmotionsCare</span>
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              {step === 'request' && <Key className="h-8 w-8 text-blue-500" />}
              {step === 'sent' && <Mail className="h-8 w-8 text-green-500" />}
              {step === 'reset' && <Shield className="h-8 w-8 text-purple-500" />}
            </div>
            <CardTitle className="text-2xl">
              {step === 'request' && 'Mot de passe oublié'}
              {step === 'sent' && 'Email envoyé'}
              {step === 'reset' && 'Nouveau mot de passe'}
            </CardTitle>
            <p className="text-muted-foreground">
              {step === 'request' && 'Saisissez votre email pour recevoir les instructions'}
              {step === 'sent' && 'Vérifiez votre boîte mail'}
              {step === 'reset' && 'Créez votre nouveau mot de passe'}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {step === 'request' && (
              <form onSubmit={handlePasswordResetRequest} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Adresse email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    required
                    disabled={isLoading}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Envoyer les instructions
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <Button variant="ghost" onClick={goBack} className="text-muted-foreground">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour à la connexion
                  </Button>
                </div>
              </form>
            )}

            {step === 'sent' && (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-green-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Email envoyé avec succès</h3>
                    <p className="text-muted-foreground">
                      Nous avons envoyé un lien de réinitialisation à <strong>{email}</strong>.
                      Cliquez sur le lien dans l'email pour créer un nouveau mot de passe.
                    </p>
                  </div>
                </div>

                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    Le lien expire dans 1 heure. Si vous ne recevez pas l'email, vérifiez vos spams.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setStep('request')}
                  >
                    Renvoyer l'email
                  </Button>
                  
                  <div className="text-center">
                    <Button variant="ghost" onClick={goBack} className="text-muted-foreground">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Retour à la connexion
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {step === 'reset' && (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Au moins 6 caractères"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmez votre mot de passe"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Votre mot de passe doit contenir :</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Au moins 6 caractères</li>
                    <li>Au moins une lettre majuscule (recommandé)</li>
                    <li>Au moins un chiffre (recommandé)</li>
                    <li>Au moins un caractère spécial (recommandé)</li>
                  </ul>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Mise à jour...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Mettre à jour le mot de passe
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>
            Besoin d'aide ? {' '}
            <Link to={Routes.help()} className="text-blue-500 hover:underline">
              Contactez le support
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
