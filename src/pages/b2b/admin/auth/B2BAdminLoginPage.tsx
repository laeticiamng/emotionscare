
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Shield, Loader2 } from 'lucide-react';
import { useUserMode } from '@/contexts/UserModeContext';

const B2BAdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setUserMode } = useUserMode();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      setUserMode('b2b_admin');
      await login(email, password);
      navigate('/b2b/admin/dashboard');
    } catch (error) {
      setError('Erreur de connexion. Vérifiez vos identifiants administrateur.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Connexion Administrateur</CardTitle>
          <CardDescription>Accédez au panneau d'administration</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email administrateur</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@entreprise.com"
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
          
          <div className="mt-6 text-center space-y-2">
            <Button variant="link" onClick={() => navigate('/reset-password')}>
              Mot de passe oublié ?
            </Button>
            <div className="pt-4 border-t">
              <Button variant="ghost" onClick={() => navigate('/b2b/selection')}>
                Retour à la sélection
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BAdminLoginPage;
