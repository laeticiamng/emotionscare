
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2, Shield, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const B2BAdminLoginPage: React.FC = () => {
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
      setUserMode('b2b_admin');
      await login(email, password);
      
      toast({
        title: "Connexion administrateur réussie",
        description: "Bienvenue dans l'interface d'administration",
        variant: "success"
      });
      
      navigate('/b2b/admin/dashboard');
    } catch (error: any) {
      console.error('Admin login error:', error);
      setError('Erreur de connexion. Vérifiez vos identifiants administrateur.');
      toast({
        title: "Erreur de connexion",
        description: "Vérifiez vos identifiants administrateur",
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
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Administration EmotionsCare</CardTitle>
          <CardDescription>
            Accès réservé aux administrateurs
          </CardDescription>
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
                'Accéder à l\'administration'
              )}
            </Button>
          </form>
          
          <div className="mt-6 space-y-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Accès restreint aux administrateurs autorisés uniquement
              </p>
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

export default B2BAdminLoginPage;
