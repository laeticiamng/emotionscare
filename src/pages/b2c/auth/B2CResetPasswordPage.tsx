
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Brain, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const B2CResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!email) {
      setError('Veuillez saisir votre adresse email');
      setIsLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Format d\'email invalide');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/b2c/reset-password?step=update`,
      });

      if (error) {
        throw error;
      }

      setIsEmailSent(true);
      toast({
        title: "Email envoyé !",
        description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe.",
        variant: "success"
      });
    } catch (error: any) {
      console.error('Reset password error:', error);
      setError(error.message || 'Erreur lors de l\'envoi de l\'email de réinitialisation');
      toast({
        title: "Erreur",
        description: error.message || 'Erreur lors de l\'envoi de l\'email',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Email envoyé !</CardTitle>
            <CardDescription>
              Un lien de réinitialisation a été envoyé à {email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Vérifiez votre boîte mail et cliquez sur le lien pour réinitialiser votre mot de passe.
                Si vous ne recevez pas l'email, vérifiez vos spams.
              </p>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Button 
                onClick={() => {
                  setIsEmailSent(false);
                  setEmail('');
                }}
                variant="outline"
                className="w-full"
              >
                Renvoyer l'email
              </Button>
              
              <Button 
                onClick={() => navigate('/b2c/login')}
                className="w-full"
              >
                Retour à la connexion
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Brain className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Mot de passe oublié</CardTitle>
          <CardDescription>
            Entrez votre email pour recevoir un lien de réinitialisation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="votre@email.com"
                required
                disabled={isLoading}
                className={error ? 'border-red-500' : ''}
              />
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Un email contenant un lien de réinitialisation sera envoyé à cette adresse.
              </p>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                'Envoyer le lien de réinitialisation'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center space-y-4">
            <Link 
              to="/b2c/login" 
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la connexion
            </Link>
            
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">
                Pas encore de compte ?
              </p>
              <Button variant="ghost" onClick={() => navigate('/b2c/register')}>
                Créer un compte
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2CResetPasswordPage;
