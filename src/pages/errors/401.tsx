import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldOff, LogIn, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { routes } from '@/lib/routes';

const Error401Page: React.FC = () => {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-16" aria-labelledby="error-401-title">
      <div className="max-w-xl w-full text-center space-y-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <ShieldOff className="h-8 w-8 text-primary" aria-hidden="true" />
        </div>
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Erreur 401</p>
          <h1 id="error-401-title" className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Authentification requise
          </h1>
          <p className="text-muted-foreground">
            Cette zone est réservée aux membres connectés. Connectez-vous pour poursuivre votre parcours de bien-être ou
            retournez à l&apos;accueil pour explorer nos ressources publiques.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link to={routes.auth.login()} aria-label="Se connecter">
              <LogIn className="h-4 w-4" aria-hidden="true" />
              Se connecter
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link to={routes.public.home()} aria-label="Revenir à l'accueil">
              <Home className="h-4 w-4" aria-hidden="true" />
              Retour à l&apos;accueil
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Error401Page;
