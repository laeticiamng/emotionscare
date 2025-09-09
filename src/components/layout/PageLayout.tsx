import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  backUrl?: string;
  backLabel?: string;
  actions?: React.ReactNode;
  className?: string;
  loading?: boolean;
  error?: string;
  emptyState?: React.ReactNode;
  helpUrl?: string;
}

/**
 * Layout de page standardisé avec :
 * - SEO et accessibilité intégrés
 * - États de chargement et d'erreur
 * - Navigation cohérente
 * - Actions contextuelles
 */
const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  description,
  backUrl,
  backLabel = 'Retour',
  actions,
  className,
  loading = false,
  error,
  emptyState,
  helpUrl
}) => {
  return (
    <>
      {/* SEO et métadonnées */}
      <Helmet>
        <title>{title} - EmotionsCare</title>
        {description && <meta name="description" content={description} />}
      </Helmet>

      <div className={cn('min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5', className)}>
        {/* Skip link pour l'accessibilité */}
        <a 
          href="#main-content"
          className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-lg"
        >
          Aller au contenu principal
        </a>

        <div className="container mx-auto px-4 py-6">
          {/* Header de page */}
          <header className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                {/* Bouton retour */}
                {backUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="hover:bg-primary/10"
                  >
                    <Link to={backUrl}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {backLabel}
                    </Link>
                  </Button>
                )}

                {/* Titre et description */}
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {title}
                  </h1>
                  {description && (
                    <p className="text-muted-foreground text-lg max-w-2xl">
                      {description}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions et aide */}
              <div className="flex items-center space-x-2">
                {helpUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Link to={helpUrl}>
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Aide
                    </Link>
                  </Button>
                )}
                {actions}
              </div>
            </div>
          </header>

          {/* Contenu principal */}
          <main id="main-content" role="main">
            {error ? (
              <ErrorState error={error} />
            ) : loading ? (
              <LoadingState />
            ) : emptyState ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {emptyState}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

// État d'erreur standardisé
const ErrorState: React.FC<{ error: string }> = ({ error }) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 mx-auto mb-4 bg-destructive/10 rounded-full flex items-center justify-center">
      <HelpCircle className="w-8 h-8 text-destructive" />
    </div>
    <h2 className="text-xl font-semibold text-foreground mb-2">
      Une erreur s'est produite
    </h2>
    <p className="text-muted-foreground mb-4 max-w-md mx-auto">
      {error}
    </p>
    <Button onClick={() => window.location.reload()}>
      Réessayer
    </Button>
  </div>
);

// État de chargement standardisé
const LoadingState: React.FC = () => (
  <div className="space-y-4">
    {/* Skeleton pour le contenu */}
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-muted rounded w-3/4"></div>
      <div className="h-4 bg-muted rounded w-1/2"></div>
      <div className="h-32 bg-muted rounded"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-24 bg-muted rounded"></div>
        <div className="h-24 bg-muted rounded"></div>
      </div>
    </div>
  </div>
);

export default PageLayout;