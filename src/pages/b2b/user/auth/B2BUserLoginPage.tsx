
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2, Building, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const B2BUserLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setUserMode } = useUserMode();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      setUserMode('b2b_user');
      await login(email, password);
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans votre espace collaborateur",
        variant: "success"
      });
      
      navigate('/b2b/user/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      setError('Erreur de connexion. Vérifiez vos identifiants.');
      toast({
        title: "Erreur de connexion",
        description: "Vérifiez vos identifiants et réessayez",
        variant: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Building className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Connexion Collaborateur</CardTitle>
          <CardDescription>
            Accédez à votre espace collaborateur EmotionsCare
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email professionnel</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@entreprise.com"
                required
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
            
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-md">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>
          
          <div className="mt-6 space-y-4">
            <div className="text-center">
              <Link 
                to="/b2b/user/register"
                className="text-sm text-primary hover:underline"
              >
                Pas encore de compte ? Créer un compte collaborateur
              </Link>
            </div>
            
            <div className="flex items-center justify-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/b2b/selection')}
                className="flex items-center gap-2 text-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour à la sélection
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BUserLoginPage;
