
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface LoginProps {
  mode?: 'b2c' | 'b2b_user' | 'b2b_admin';
}

const Login: React.FC<LoginProps> = ({ mode = 'b2c' }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate login
    console.log('Login attempt with:', { email, password, mode });
    
    // Redirect to dashboard based on mode
    if (mode === 'b2c') {
      navigate('/b2c/dashboard');
    } else if (mode === 'b2b_user') {
      navigate('/b2b/user/dashboard');
    } else if (mode === 'b2b_admin') {
      navigate('/b2b/admin/dashboard');
    }
  };
  
  const title = mode === 'b2b_admin' 
    ? "Espace administrateur" 
    : mode === 'b2b_user' 
      ? "Espace collaborateur" 
      : "Connexion";
    
  const description = mode === 'b2b_admin'
    ? "Connectez-vous à votre espace administrateur"
    : mode === 'b2b_user'
      ? "Connectez-vous à votre espace collaborateur"
      : "Connectez-vous à votre compte personnel";
    
  const registerLink = mode === 'b2b_admin'
    ? null
    : mode === 'b2b_user'
      ? "/b2b/user/register"
      : "/b2c/register";
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <Button variant="link" className="px-0 font-normal h-auto">
                  Mot de passe oublié ?
                </Button>
              </div>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button className="w-full" type="submit">
              Se connecter
            </Button>
          </form>
          
          {registerLink && (
            <div className="mt-4 text-center text-sm">
              Vous n'avez pas de compte ?{" "}
              <Button variant="link" onClick={() => navigate(registerLink)} className="p-0">
                S'inscrire
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            Retour à l'accueil
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
