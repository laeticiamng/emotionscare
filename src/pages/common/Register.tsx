
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface RegisterProps {
  role?: 'b2c' | 'b2b_user' | 'b2b_admin';
}

const Register: React.FC<RegisterProps> = ({ role = 'b2c' }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  const navigate = useNavigate();
  const { register, error: authError, clearError } = useAuth();
  
  const getRoleName = () => {
    switch(role) {
      case 'b2b_admin': return 'Administrateur';
      case 'b2b_user': return 'Collaborateur';
      case 'b2c': default: return 'Particulier';
    }
  };
  
  const getRedirectPath = () => {
    switch(role) {
      case 'b2b_admin': return '/b2b/admin/dashboard';
      case 'b2b_user': return '/b2b/user/dashboard';
      case 'b2c': default: return '/b2c/dashboard';
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setPasswordError('');
    if (clearError) clearError();
    
    if (password !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(email, password, name);
      
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès",
      });
      
      navigate(getRedirectPath());
    } catch (error: any) {
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur s'est produite lors de l'inscription",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getLoginPath = () => {
    switch(role) {
      case 'b2b_admin': return '/b2b/admin/login';
      case 'b2b_user': return '/b2b/user/login';
      case 'b2c': default: return '/b2c/login';
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Créer un compte {getRoleName()}</CardTitle>
          <CardDescription>Rejoignez EmotionsCare en tant que {getRoleName()}</CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            {authError && (
              <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                {authError}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input 
                id="name" 
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="email@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
              <Input 
                id="confirm-password" 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {passwordError && (
                <p className="text-sm text-destructive">{passwordError}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Inscription en cours..." : "S'inscrire"}
            </Button>
            <div className="text-sm text-center">
              Vous avez déjà un compte?{' '}
              <Link to={getLoginPath()} className="text-primary hover:underline">
                Se connecter
              </Link>
            </div>
            <div className="text-sm text-center mt-2">
              <Link to="/" className="text-muted-foreground hover:underline">
                Retour à la sélection du profil
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;
