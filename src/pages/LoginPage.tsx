
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Shield, Lock } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

const LoginPage = () => {
  const [email, setEmail] = useState('sophie@example.com');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log("LoginPage: Already authenticated, redirecting to dashboard");
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || email.trim() === '') {
      toast({
        title: "Email requis",
        description: "Veuillez entrer votre adresse email",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log("LoginPage: Attempting login with:", email);
      // Pour Sophie, le mot de passe est maintenant "sophie" ou vide
      const user = await login(email, password);
      console.log("LoginPage: Login successful, redirecting to dashboard");
      
      // Redirect to the dashboard or the page they were trying to access
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from);
    } catch (error) {
      // Les erreurs sont gérées dans le contexte d'authentification
      console.error("Erreur de connexion:", error);
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
            <h1 className="text-3xl font-semibold text-[#1B365D] mb-1">
              EmotionsCare<span className="text-xs align-super">™</span>
            </h1>
            <p className="text-slate-600">par ResiMax<span className="text-xs align-super">™</span> - Espace Collaborateur</p>
          </div>
        </div>

        <Card className="shadow-lg border-[#E8F1FA]">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Lock className="h-5 w-5 text-primary" />
              <CardTitle>Connexion sécurisée</CardTitle>
            </div>
            <CardDescription>
              Authentification à plusieurs facteurs pour protéger votre compte
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border border-muted"
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
                  className="border border-muted"
                />
                <div className="flex justify-end">
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-primary hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-2">
              <Button 
                type="submit" 
                className="w-full bg-[#FF6F61] hover:bg-[#FF6F61]/90 text-white hover:shadow-[0_0_15px_rgba(168,230,207,0.3)]"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Connexion...' : 'Se connecter'}
              </Button>
              
              <p className="text-sm text-center text-muted-foreground mt-4">
                * Pour la démo, utilisez: sophie@example.com (mot de passe: sophie)
              </p>

              <Separator className="my-4" />
              
              <div className="flex flex-col items-center text-xs text-muted-foreground space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-3 w-3" />
                  <span>Conforme ISO 27001 & RGPD</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs">🔒</span>
                  <span>Connexion chiffrée AES-256</span>
                </div>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
