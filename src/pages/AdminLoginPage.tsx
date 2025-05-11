
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const redirectUrl = location.state?.from?.pathname || '/admin/dashboard';

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // Update the function call to have the correct number of parameters
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        setError(error.message);
        toast({
          title: "Erreur de connexion",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté en tant qu'administrateur."
        });
        navigate(redirectUrl || "/admin/dashboard");
      }
    } catch (err) {
      console.error("Sign in error:", err);
      setError("Une erreur s'est produite lors de la connexion.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connexion Administrateur</CardTitle>
          <CardDescription>
            Connectez-vous pour accéder à l'interface d'administration.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignIn}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
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
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
