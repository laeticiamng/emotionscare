
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const B2CLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password, 'b2c');
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans votre espace personnel !",
      });
      navigate('/b2c/dashboard');
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Vérifiez vos identifiants et réessayez.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/choose-mode')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au choix du mode
          </Button>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-pink-100 dark:bg-pink-900 rounded-full w-fit">
              <Heart className="h-8 w-8 text-pink-600 dark:text-pink-400" />
            </div>
            <CardTitle className="text-2xl">Espace Personnel</CardTitle>
            <CardDescription>
              Connectez-vous à votre compte personnel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre.email@exemple.com"
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
              <Button 
                type="submit" 
                className="w-full bg-pink-600 hover:bg-pink-700"
                disabled={isLoading}
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pas encore de compte ?{' '}
                <Button 
                  variant="link" 
                  onClick={() => navigate('/b2c/register')}
                  className="p-0 h-auto text-pink-600"
                >
                  Créer un compte
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2CLoginPage;
