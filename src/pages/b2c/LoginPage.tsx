
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const B2CLoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation de connexion
    navigate('/b2c/dashboard');
  };

  return (
    <main data-testid="page-root" className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Connexion B2C</CardTitle>
          <p className="text-muted-foreground">
            Accédez à votre espace personnel EmotionsCare
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Se connecter
            </Button>
          </form>
          
          <div className="mt-6 text-center space-y-2">
            <Button 
              onClick={() => navigate('/b2c/register')}
              variant="link"
            >
              Créer un compte
            </Button>
            <br />
            <Button 
              onClick={() => navigate('/')}
              variant="ghost"
              size="sm"
            >
              ← Retour à l'accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default B2CLoginPage;
