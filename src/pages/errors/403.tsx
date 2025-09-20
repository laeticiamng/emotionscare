import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { routes } from '@/lib/routes';

const Error403Page: React.FC = () => {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-16" aria-labelledby="error-403-title">
      <div className="max-w-xl w-full text-center space-y-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <ShieldAlert className="h-8 w-8 text-destructive" aria-hidden="true" />
        </div>
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-destructive">Erreur 403</p>
          <h1 id="error-403-title" className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Accès non autorisé pour ce rôle
          </h1>
          <p className="text-muted-foreground">
            Vous êtes authentifié, mais votre rôle actuel ne permet pas d&apos;accéder à cette fonctionnalité. Rejoignez votre
            espace dédié ou changez de compte pour continuer.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link to={routes.b2c.dashboard()} aria-label="Retourner au tableau de bord">
              <Home className="h-4 w-4" aria-hidden="true" />
              Retour au dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link to={routes.auth.login()} aria-label="Changer de compte">
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Changer de compte
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Error403Page;
