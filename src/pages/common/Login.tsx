
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface LoginProps {
  mode?: 'b2c' | 'b2b_user' | 'b2b_admin' | 'b2b';
}

const Login: React.FC<LoginProps> = ({ mode = 'b2c' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate login
    console.log('Login attempt with:', { email, password, mode });
    
    // Redirect based on mode
    if (mode === 'b2c') {
      navigate('/b2c/dashboard');
    } else if (mode === 'b2b_user') {
      navigate('/b2b/user/dashboard');
    } else if (mode === 'b2b_admin') {
      navigate('/b2b/admin/dashboard');
    } else if (mode === 'b2b') {
      navigate('/b2b/selection');
    }
  };
  
  const renderContent = () => {
    if (mode === 'b2b') {
      return (
        <div className="flex flex-col gap-4 text-center">
          <h2 className="text-xl font-semibold">Solutions entreprise</h2>
          <p className="text-muted-foreground">Choisissez votre profil pour accéder à l'espace dédié:</p>
          
          <div className="grid grid-cols-1 gap-4 mt-4">
            <Button 
              variant="outline" 
              className="justify-start px-4 py-6 h-auto"
              onClick={() => navigate('/b2b/user/login')}
            >
              <div className="flex flex-col items-start">
                <span className="font-medium">Espace Collaborateur</span>
                <span className="text-sm text-muted-foreground">Accédez à vos outils de bien-être</span>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start px-4 py-6 h-auto"
              onClick={() => navigate('/b2b/admin/login')}
            >
              <div className="flex flex-col items-start">
                <span className="font-medium">Espace Administrateur</span>
                <span className="text-sm text-muted-foreground">Gérez votre espace entreprise</span>
              </div>
            </Button>
          </div>
          
          <div className="mt-6">
            <Button 
              variant="link"
              onClick={() => navigate('/pricing')}
              className="text-sm"
            >
              Découvrir nos offres entreprise
            </Button>
          </div>
        </div>
      );
    }
    
    let title, description, redirectText, redirectLink, redirectLinkText;
    
    switch (mode) {
      case 'b2b_admin':
        title = "Espace Administrateur";
        description = "Connectez-vous pour gérer votre espace entreprise";
        redirectText = "Vous êtes un collaborateur ?";
        redirectLink = "/b2b/user/login";
        redirectLinkText = "Accéder à l'espace collaborateur";
        break;
      case 'b2b_user':
        title = "Espace Collaborateur";
        description = "Connectez-vous pour accéder à vos outils de bien-être";
        redirectText = "Vous êtes administrateur ?";
        redirectLink = "/b2b/admin/login";
        redirectLinkText = "Accéder à l'espace administrateur";
        break;
      default:
        title = "Connexion";
        description = "Connectez-vous pour accéder à votre espace personnel";
        redirectText = "Vous n'avez pas de compte ?";
        redirectLink = "/b2c/register";
        redirectLinkText = "Créer un compte";
        break;
    }
    
    return (
      <>
        <form onSubmit={handleLogin}>
          <div className="space-y-4">
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
              <div className="flex justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <Button type="button" variant="link" size="sm" className="p-0 h-auto">
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
          </div>
          
          <Button className="w-full mt-6" type="submit">
            Se connecter
          </Button>
        </form>
        
        <div className="mt-4 text-center text-sm">
          {redirectText}{" "}
          <Button variant="link" onClick={() => navigate(redirectLink)} className="p-0">
            {redirectLinkText}
          </Button>
        </div>
      </>
    );
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">{mode === 'b2b' ? 'Espace Entreprise' : 'Connexion'}</CardTitle>
          {mode !== 'b2b' && <CardDescription>Entrez vos identifiants pour vous connecter</CardDescription>}
        </CardHeader>
        <CardContent>
          {renderContent()}
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

export default Login;
