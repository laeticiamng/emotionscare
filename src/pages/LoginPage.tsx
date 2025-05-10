import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Extract redirect URL from query parameters
  const redirectTo = new URLSearchParams(location.search).get("redirect");
  const isAdmin = location.pathname.includes('admin');

  useEffect(() => {
    document.title = "Connexion - EmotionsCare";
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Changement de l'appel à login pour n'utiliser qu'un seul argument
      const success = await login({
        email,
        password,
        remember
      });

      if (success) {
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté à votre compte.",
        });
        
        if (redirectTo) {
          navigate(redirectTo);
        } else {
          navigate(isAdmin ? '/admin' : '/dashboard');
        }
      } else {
        setError("Échec de la connexion. Veuillez vérifier vos informations d'identification.");
      }
    } catch (err) {
      setError("Une erreur s'est produite lors de la connexion. Veuillez réessayer.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <img src="/logo.svg" alt="EmotionsCare Logo" className="h-8 w-auto mr-2" />
          EmotionsCare
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "La plus grande découverte de tous les temps est qu'une personne peut changer son avenir simplement en changeant son attitude."
            </p>
            <footer className="text-sm">Oprah Winfrey</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold">
              {isAdmin ? "Connexion Administrateur" : "Connexion"}
            </h1>
            <p className="text-muted-foreground">
              Entrez vos identifiants pour accéder à votre compte
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="exemple@email.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="********"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">Afficher le mot de passe</span>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(checked) => setRemember(!!checked)}
                />
                <Label htmlFor="remember">Se souvenir de moi</Label>
              </div>
              <Link to="/forgot-password" className="text-sm text-muted-foreground hover:text-primary">
                Mot de passe oublié?
              </Link>
            </div>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <Button disabled={isLoading} className="w-full" type="submit">
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Pas de compte?{" "}
            <Link to="/register" className="hover:text-primary underline underline-offset-4">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
