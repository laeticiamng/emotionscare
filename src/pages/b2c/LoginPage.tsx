
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

const B2CLoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simulation de connexion
    navigate('/b2c/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connexion Particulier</CardTitle>
          <CardDescription>Accédez à votre espace personnel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="votre@email.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" />
          </div>
          <Button onClick={handleLogin} className="w-full">
            Se connecter
          </Button>
          <div className="text-center space-y-2">
            <Button variant="link" onClick={() => navigate('/b2c/register')}>
              Créer un compte
            </Button>
            <Button variant="link" onClick={() => navigate('/b2c/reset-password')}>
              Mot de passe oublié ?
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2CLoginPage;
