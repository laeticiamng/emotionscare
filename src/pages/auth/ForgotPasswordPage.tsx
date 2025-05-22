
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface ForgotPasswordPageProps {
  mode?: 'b2c' | 'b2b_user' | 'b2b_admin';
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ mode = 'b2c' }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Veuillez saisir votre adresse email");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await resetPassword(email);
      toast.success("Instructions de réinitialisation envoyées", {
        description: "Veuillez consulter votre boîte mail pour la suite des instructions."
      });
      
      // After success, navigate to the login page
      setTimeout(() => {
        const loginPath = mode === 'b2c' ? '/b2c/login' : 
                         mode === 'b2b_user' ? '/b2b/user/login' :
                         '/b2b/admin/login';
        navigate(loginPath);
      }, 2000);
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("Erreur lors de l'envoi", {
        description: "Une erreur s'est produite. Veuillez réessayer plus tard."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLoginPath = () => {
    if (mode === 'b2c') return '/b2c/login';
    if (mode === 'b2b_user') return '/b2b/user/login';
    return '/b2b/admin/login';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Mot de passe oublié</CardTitle>
          <CardDescription>
            Entrez votre adresse email pour recevoir un lien de réinitialisation
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="exemple@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full mb-4" disabled={isSubmitting}>
              {isSubmitting ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => navigate(getLoginPath())}>
              Retour à la connexion
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
