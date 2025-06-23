
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users } from 'lucide-react';

const B2BUserLoginPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Users className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Connexion Utilisateur B2B</CardTitle>
          <CardDescription>
            Accédez à votre espace utilisateur EmotionsCare
          </CardDescription>
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
          <Button 
            onClick={() => navigate('/b2b/user/dashboard')}
            className="w-full"
          >
            Se connecter
          </Button>
          <div className="text-center space-y-2">
            <Button 
              onClick={() => navigate('/b2b/user/register')}
              variant="link"
              className="text-sm"
            >
              Créer un compte
            </Button>
            <br />
            <Button 
              onClick={() => navigate('/b2b/selection')}
              variant="ghost"
              className="text-sm"
            >
              ← Retour à la sélection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BUserLoginPage;
