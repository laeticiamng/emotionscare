
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      if (!register) throw new Error('Register function not available');
      
      await register(email, password, { name });
      toast({
        description: "Inscription réussie! Vous pouvez maintenant vous connecter.",
        variant: "success",
      });
      
      // After registration, redirect to the mode selection page
      navigate('/choose-mode');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Créer un compte</CardTitle>
          <CardDescription className="text-center">
            Inscrivez-vous pour accéder à toutes les fonctionnalités
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  placeholder="Votre nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemple@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Inscription en cours...' : 'S\'inscrire'}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-center text-sm text-muted-foreground mt-2">
            <span>Vous avez déjà un compte? </span>
            <Link 
              to="/login" 
              className="text-primary underline-offset-4 hover:underline"
            >
              Se connecter
            </Link>
          </div>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/')}
          >
            Retour à l'accueil
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;
