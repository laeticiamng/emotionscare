
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Mail, Loader2 } from 'lucide-react';

const B2CResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulation de l'envoi de l'email
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitted(true);
      toast.success("Email de réinitialisation envoyé avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'envoi de l'email de réinitialisation");
      console.error("Reset password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Réinitialisation du mot de passe</CardTitle>
          <CardDescription>
            Entrez votre adresse e-mail pour recevoir un lien de réinitialisation
          </CardDescription>
        </CardHeader>
        
        {isSubmitted ? (
          <CardContent className="space-y-4 text-center">
            <div className="bg-primary/10 p-4 rounded-full inline-flex mx-auto">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium">Vérifiez votre boîte mail</h3>
            <p className="text-muted-foreground">
              Si un compte existe avec l'adresse {email}, nous avons envoyé un lien de réinitialisation.
            </p>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
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
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-2">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !email}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  'Envoyer le lien de réinitialisation'
                )}
              </Button>
            </CardFooter>
          </form>
        )}
        
        <div className="p-4 border-t text-center">
          <Button 
            variant="ghost" 
            className="text-sm flex items-center" 
            onClick={() => navigate('/b2c/login')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la page de connexion
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default B2CResetPasswordPage;
