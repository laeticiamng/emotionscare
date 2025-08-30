import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Page 404 accessible avec navigation de retour
 */
const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Illustration 404 */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary/20 mb-4">404</div>
          <div className="text-muted-foreground text-lg">
            Oups ! Cette page n'existe pas.
          </div>
        </div>

        {/* Message d'erreur */}
        <div className="mb-8 space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">
            Page introuvable
          </h1>
          <p className="text-muted-foreground">
            La page que vous recherchez a peut-être été déplacée, supprimée ou n'existe pas.
          </p>
        </div>

        {/* Actions de navigation */}
        <div className="space-y-4">
          <Link to="/app/home" aria-label="Retour à l'accueil">
            <Button size="lg" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full"
            onClick={() => window.history.back()}
            aria-label="Page précédente"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Page précédente
          </Button>
        </div>

        {/* Liens utiles */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Liens utiles :
          </p>
          <div className="space-y-2 text-sm">
            <Link 
              to="/app/journal" 
              className="block text-primary hover:underline"
              aria-label="Aller au journal"
            >
              📝 Mon Journal
            </Link>
            <Link 
              to="/app/music" 
              className="block text-primary hover:underline"
              aria-label="Aller à la musique thérapeutique"
            >
              🎵 Musique thérapeutique
            </Link>
            <Link 
              to="/help" 
              className="block text-primary hover:underline"
              aria-label="Aller à l'aide"
            >
              ❓ Centre d'aide
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;