
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { resetPassword } from '@/lib/passwordResetService';

interface ResetPasswordPageProps {
  mode?: 'b2c' | 'b2b_user' | 'b2b_admin';
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ mode = 'b2c' }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token from URL on component mount
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get('token');
    
    if (tokenParam) {
      setToken(tokenParam);
      // In a real implementation, we would verify the token validity here
      setIsTokenValid(true);
    } else {
      setIsTokenValid(false);
      toast.error("Lien de réinitialisation invalide", {
        description: "Le lien que vous avez utilisé est invalide ou a expiré.",
      });
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    
    if (password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (token) {
        const result = await resetPassword(token, password);
        
        if (result.success) {
          toast.success("Mot de passe réinitialisé avec succès", {
            description: "Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.",
          });
          
          // Redirect to login page after success
          setTimeout(() => {
            const loginPath = mode === 'b2c' ? '/b2c/login' : 
                             mode === 'b2b_user' ? '/b2b/user/login' :
                             '/b2b/admin/login';
            navigate(loginPath);
          }, 2000);
        } else {
          toast.error("Erreur lors de la réinitialisation", {
            description: result.message || "Une erreur s'est produite. Veuillez réessayer.",
          });
        }
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("Erreur lors de la réinitialisation", {
        description: "Une erreur s'est produite. Veuillez réessayer plus tard.",
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

  if (isTokenValid === false) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/30 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Lien invalide</CardTitle>
            <CardDescription>
              Le lien de réinitialisation que vous avez utilisé est invalide ou a expiré.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" onClick={() => navigate(getLoginPath())}>
              Retour à la connexion
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Réinitialiser votre mot de passe</CardTitle>
          <CardDescription>
            Veuillez saisir votre nouveau mot de passe
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nouveau mot de passe</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full mb-4" disabled={isSubmitting || !isTokenValid}>
              {isSubmitting ? "Réinitialisation en cours..." : "Réinitialiser le mot de passe"}
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

export default ResetPasswordPage;
