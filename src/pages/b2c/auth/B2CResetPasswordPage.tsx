
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const B2CResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Vérifier si le token est présent dans l'URL
  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace('#', ''));
    const type = params.get('type');
    
    if (type !== 'recovery') {
      setErrorMessage('Lien de réinitialisation invalide ou expiré');
    }
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (password !== confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (password.length < 6) {
      setErrorMessage('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await updatePassword(password);
      
      if (result.success) {
        setIsSuccess(true);
        toast.success('Mot de passe réinitialisé avec succès');
        setTimeout(() => {
          navigate('/b2c/login');
        }, 3000);
      } else {
        setErrorMessage(result.error || 'Échec de la réinitialisation du mot de passe');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                <ShieldCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Mot de passe réinitialisé</CardTitle>
            <CardDescription className="text-center">
              Votre mot de passe a été mis à jour avec succès. Vous allez être redirigé vers la page de connexion.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-4 pt-4">
            <Button 
              onClick={() => navigate('/b2c/login')}
              className="w-full"
            >
              Se connecter maintenant
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Nouveau mot de passe</CardTitle>
          <CardDescription>
            Veuillez définir votre nouveau mot de passe
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {errorMessage && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-start">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">Nouveau mot de passe</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
              <div className="relative">
                <Input 
                  id="confirmPassword" 
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Le mot de passe doit contenir au moins 6 caractères
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Réinitialisation...
                </>
              ) : (
                'Réinitialiser le mot de passe'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default B2CResetPasswordPage;
