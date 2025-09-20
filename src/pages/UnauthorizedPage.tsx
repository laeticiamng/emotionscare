import React from 'react';
import { Button } from '@/components/ui/button';
import { Lock, ArrowLeft, LogIn } from 'lucide-react';
import { useRouter } from '@/hooks/router';

/**
 * Page d'erreur 401 - Non autorisé
 * Affichée quand l'utilisateur n'est pas connecté
 */
export default function UnauthorizedPage() {
  const { navigate, back } = useRouter();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8 max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-warning/10 p-6">
            <Lock className="h-16 w-16 text-warning" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">401</h1>
          <h2 className="text-xl font-semibold text-foreground">
            Authentification requise
          </h2>
          <p className="text-muted-foreground">
            Vous devez vous connecter pour accéder à cette page.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={back} variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <Button onClick={handleLogin} className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            Se connecter
          </Button>
        </div>

        <Button onClick={handleGoHome} variant="ghost">
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
}