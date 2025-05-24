
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Users, ArrowLeft } from 'lucide-react';

const B2BUserLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Erreur de connexion",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      if (data.user) {
        // Verify user has correct role
        const userRole = data.user.user_metadata?.role || data.user.role;
        if (userRole !== 'b2b_user') {
          await supabase.auth.signOut();
          toast({
            title: "Accès non autorisé",
            description: "Ce compte n'a pas accès à l'espace collaborateur",
            variant: "destructive"
          });
          return;
        }

        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans votre espace collaborateur !",
        });
        navigate('/b2b/user/dashboard');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1 text-center">
            <div className="flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-green-600 mr-2" />
              <span className="text-2xl font-bold">EmotionsCare</span>
            </div>
            <CardTitle className="text-2xl">Espace Collaborateur</CardTitle>
            <CardDescription>
              Connectez-vous à votre espace de bien-être professionnel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email professionnel</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@entreprise.com"
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
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700" 
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Se connecter
              </Button>
            </form>

            <div className="mt-4 text-center space-y-2">
              <Link 
                to="/b2b/user/reset-password" 
                className="text-sm text-green-600 hover:underline"
              >
                Mot de passe oublié ?
              </Link>
              
              <div className="text-sm text-gray-600">
                Pas encore de compte professionnel ?{' '}
                <Link to="/b2b/user/register" className="text-green-600 hover:underline">
                  S'inscrire
                </Link>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <Link 
                to="/b2b/selection" 
                className="flex items-center justify-center text-sm text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la sélection
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BUserLoginPage;
