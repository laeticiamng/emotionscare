
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface RegisterPageProps {
  mode?: 'b2c' | 'b2b_user' | 'b2b_admin';
}

const RegisterPage: React.FC<RegisterPageProps> = ({ mode = 'b2c' }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    
    if (!acceptTerms) {
      toast.error("Vous devez accepter les conditions d'utilisation");
      return;
    }
    
    if (password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const userData = {
        name,
        role: mode,
      };
      
      await register(email, password, userData);
      
      // Show success message and redirect to dashboard
      toast.success("Inscription réussie", {
        description: "Votre compte a été créé avec succès."
      });
      
      if (mode === 'b2c') {
        navigate('/dashboard');
      } else if (mode === 'b2b_user') {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Échec de l'inscription", {
        description: "Une erreur s'est produite. Veuillez réessayer."
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

  const getTitle = () => {
    if (mode === 'b2c') return 'Créer un compte Particulier';
    if (mode === 'b2b_user') return 'Créer un compte Collaborateur';
    return 'Créer un compte Administrateur';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{getTitle()}</CardTitle>
          <CardDescription>
            Inscrivez-vous pour accéder à tous nos services
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input 
                id="name" 
                type="text" 
                placeholder="Jean Dupont" 
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
                placeholder="exemple@email.com" 
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
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="acceptTerms" 
                checked={acceptTerms} 
                onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                required
              />
              <label
                htmlFor="acceptTerms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                J'accepte les conditions d'utilisation et la politique de confidentialité
              </label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full mb-4" disabled={isSubmitting}>
              {isSubmitting ? "Inscription en cours..." : "S'inscrire"}
            </Button>
            <p className="text-sm text-center">
              Déjà un compte?{" "}
              <Link to={getLoginPath()} className="text-primary hover:underline">
                Se connecter
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default RegisterPage;
