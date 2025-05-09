
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, User, Shield } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('password');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from);
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur EmotionsCare!",
      });
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      toast({
        title: "Erreur de connexion",
        description: error.message || "Impossible de se connecter. Veuillez vérifier vos identifiants.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If still checking authentication status, show minimal UI
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2>Chargement...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-[#FAFBFC] to-[#E8F1FA]">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2" size={16} />
            Retour à l'accueil
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-semibold mb-1 text-[#1B365D]">
              EmotionsCare<span className="text-xs align-super">™</span>
            </h1>
            <p className="text-slate-600">
              par ResiMax<span className="text-xs align-super">™</span> - Espace Utilisateur
            </p>
          </div>
        </div>

        <Card className="shadow-lg border-[#E8F1FA]">
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>
              Identifiez-vous pour accéder à votre espace
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="utilisateur@example.com"
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
                  placeholder="••••••••"
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3">
              <Button 
                type="submit" 
                className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
              </Button>
              
              <div className="flex justify-between w-full text-sm">
                <Link to="/register" className="text-blue-600 hover:underline">
                  Créer un compte
                </Link>
                <Link to="/forgot-password" className="text-blue-600 hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>
              
              <div className="w-full border-t pt-3 mt-2">
                <p className="text-center text-sm text-muted-foreground mb-3">
                  Vous êtes un administrateur ?
                </p>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full"
                  onClick={() => navigate('/admin-login')}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Accès direction
                </Button>
              </div>
              
              <p className="text-xs text-center text-muted-foreground mt-4">
                * Pour la démo, utilisez: user@example.com (mot de passe : password)
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
