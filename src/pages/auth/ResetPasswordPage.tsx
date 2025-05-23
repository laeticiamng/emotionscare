
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Extract token from URL query params
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    if (!token) {
      setError('Token de réinitialisation manquant ou invalide.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Replace with actual reset password logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      toast.success('Mot de passe réinitialisé avec succès');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('Erreur lors de la réinitialisation du mot de passe. Veuillez réessayer.');
      console.error('Password reset error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Réinitialiser votre mot de passe</CardTitle>
            <CardDescription className="text-center">
              Créez un nouveau mot de passe sécurisé
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {success ? (
              <div className="text-center space-y-4">
                <div className="rounded-full bg-green-100 p-3 inline-flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm">Mot de passe réinitialisé avec succès. Vous allez être redirigé vers la page de connexion.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {!token && (
                  <div className="p-3 text-sm text-amber-500 bg-amber-50 rounded-md">
                    Lien de réinitialisation invalide ou expiré. Veuillez demander un nouveau lien.
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="password">Nouveau mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={!token || isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={!token || isSubmitting}
                  />
                </div>
                
                {error && (
                  <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                    {error}
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={!token || isSubmitting}
                >
                  {isSubmitting ? 'Réinitialisation en cours...' : 'Réinitialiser le mot de passe'}
                </Button>
              </form>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <Button variant="link" onClick={() => navigate('/forgot-password')}>
              Demander un nouveau lien
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
