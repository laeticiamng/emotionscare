
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users } from 'lucide-react';

const B2BUserLoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation de connexion
    navigate('/b2b/user/dashboard');
  };

  return (
    <main data-testid="page-root" className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-blue-500" />
          <CardTitle className="text-2xl">Connexion Utilisateur B2B</CardTitle>
          <p className="text-muted-foreground">
            Accédez à votre espace EmotionsCare entreprise
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email professionnel</Label>
              <Input
                id="email"
                type="email"
                placeholder="utilisateur@entreprise.com"
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
              onClick={() => navigate('/b2b/user/register')}
              variant="link"
            >
              Créer un compte utilisateur
            </Button>
            <br />
            <Button 
              onClick={() => navigate('/b2b/selection')}
              variant="ghost"
              size="sm"
            >
              ← Retour à la sélection
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default B2BUserLoginPage;
