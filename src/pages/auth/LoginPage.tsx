
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface LoginPageProps {
  mode?: 'b2c' | 'b2b_user' | 'b2b_admin';
}

const LoginPage: React.FC<LoginPageProps> = ({ mode = 'b2c' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      
      // Redirect to dashboard after successful login
      toast.success("Connexion réussie", {
        description: "Bienvenue dans votre espace personnel."
      });
      
      if (mode === 'b2c') {
        navigate('/dashboard');
      } else if (mode === 'b2b_user') {
        navigate('/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Échec de la connexion", {
        description: "Identifiants incorrects. Veuillez réessayer."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getForgotPasswordPath = () => {
    if (mode === 'b2c') return '/b2c/forgot-password';
    if (mode === 'b2b_user') return '/b2b/user/forgot-password';
    return '/b2b/admin/forgot-password';
  };

  const getRegisterPath = () => {
    if (mode === 'b2c') return '/b2c/register';
    if (mode === 'b2b_user') return '/b2b/user/register';
    return '/';  // Admin users typically don't self-register
  };

  const getTitle = () => {
    if (mode === 'b2c') return 'Connexion Particulier';
    if (mode === 'b2b_user') return 'Connexion Collaborateur';
    return 'Connexion Administrateur';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{getTitle()}</CardTitle>
          <CardDescription>
            Connectez-vous pour accéder à votre espace personnel
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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <Link 
                  to={getForgotPasswordPath()}
                  className="text-sm text-primary hover:underline"
                >
                  Mot de passe oublié?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="rememberMe" 
                checked={rememberMe} 
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <label
                htmlFor="rememberMe"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Se souvenir de moi
              </label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full mb-4" disabled={isSubmitting}>
              {isSubmitting ? "Connexion en cours..." : "Se connecter"}
            </Button>
            {mode !== 'b2b_admin' && (
              <p className="text-sm text-center">
                Pas encore de compte?{" "}
                <Link to={getRegisterPath()} className="text-primary hover:underline">
                  S'inscrire
                </Link>
              </p>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
