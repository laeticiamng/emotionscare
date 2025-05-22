
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface RegisterProps {
  mode?: 'b2c' | 'b2b_user';
}

const Register: React.FC<RegisterProps> = ({ mode = 'b2c' }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate registration
    console.log('Register attempt with:', { email, password, mode });
    
    // Redirect to onboarding or dashboard based on mode
    if (mode === 'b2c') {
      navigate('/b2c/onboarding');
    } else {
      navigate('/b2b/user/dashboard');
    }
  };
  
  const title = mode === 'b2b_user' 
    ? "Créer votre compte collaborateur" 
    : "Créer votre compte";
    
  const description = mode === 'b2b_user'
    ? "Inscrivez-vous pour accéder à votre espace collaborateur"
    : "Inscrivez-vous pour commencer votre parcours de bien-être";
    
  const redirectLink = mode === 'b2b_user'
    ? "/b2b/user/login"
    : "/b2c/login";
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" placeholder="John" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" placeholder="Doe" required />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="email@example.com"
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
              <Checkbox id="terms" required />
              <Label htmlFor="terms" className="text-sm">
                J'accepte les {" "}
                <Button variant="link" className="p-0 h-auto">conditions d'utilisation</Button>
                {" "} et la {" "}
                <Button variant="link" className="p-0 h-auto">politique de confidentialité</Button>
              </Label>
            </div>
            
            <Button className="w-full mt-4" type="submit">
              Créer mon compte
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm">
            Vous avez déjà un compte ?{" "}
            <Button variant="link" onClick={() => navigate(redirectLink)} className="p-0">
              Se connecter
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            Retour à l'accueil
          </Button>
          <Button variant="link" onClick={() => navigate('/pricing')}>
            Voir nos offres
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
