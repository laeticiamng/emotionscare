import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { routes } from '@/lib/routes';

const Error404Page: React.FC = () => {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-16" aria-labelledby="error-404-title">
      <div className="max-w-xl w-full text-center space-y-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted/40">
          <Compass className="h-8 w-8 text-primary" aria-hidden="true" />
        </div>
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Erreur 404</p>
          <h1 id="error-404-title" className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Page introuvable
          </h1>
          <p className="text-muted-foreground">
            Le contenu que vous recherchez a peut-être été déplacé ou n&apos;existe plus. Rejoignez votre espace personnalisé ou
            explorez nos parcours guidés pour continuer l&apos;expérience EmotionsCare.
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
            <Link to={routes.public.b2cLanding()} aria-label="Explorer les parcours guidés">
              <Map className="h-4 w-4" aria-hidden="true" />
              Explorer nos parcours
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Error404Page;
