/**
 * Page 500 améliorée avec actions de récupération
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Home, MessageCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n-core';
import { useObservability } from '@/lib/observability';

interface Enhanced500PageProps {
  error?: Error;
  errorId?: string;
  onRetry?: () => void;
}

const Enhanced500Page: React.FC<Enhanced500PageProps> = ({ 
  error, 
  errorId = 'unknown', 
  onRetry 
}) => {
  const { t } = useTranslation();
  const { logPageView, logUserAction, logError } = useObservability();
  const [isRetrying, setIsRetrying] = React.useState(false);

  React.useEffect(() => {
    logPageView('500_error', { errorId, hasError: !!error });
    
    if (error) {
      logError(error, 'Erreur serveur critique rencontrée', { errorId });
    }
  }, [logPageView, logError, error, errorId]);

  const handleRetry = async () => {
    if (onRetry) {
      setIsRetrying(true);
      logUserAction('500_retry', { errorId });
      
      try {
        await onRetry();
      } catch (retryError) {
        logError(retryError as Error, 'Échec de la tentative de récupération');
      } finally {
        setIsRetrying(false);
      }
    } else {
      // Fallback: recharger la page
      logUserAction('500_reload', { errorId });
      window.location.reload();
    }
  };

  const handleReportError = () => {
    logUserAction('500_report', { errorId });
    
    // Préparer les informations d'erreur pour le support
    const errorInfo = {
      errorId,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      errorMessage: error?.message,
    };
    
    // Ouvrir un canal de support (à adapter selon votre système)
    const supportUrl = `/support?error=${encodeURIComponent(JSON.stringify(errorInfo))}`;
    window.open(supportUrl, '_blank');
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-background via-background to-destructive/5 flex items-center justify-center p-4"
      data-testid="500-page"
    >
      <Card className="max-w-lg w-full p-8">
        {/* Skip link pour l'accessibilité */}
        <a 
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded z-50"
        >
          Aller au contenu principal
        </a>

        <main id="main-content" className="text-center space-y-6">
          {/* Icône et titre */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <AlertTriangle className="h-16 w-16 text-destructive" />
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Oops ! Un problème technique
            </h1>
            
            <p className="text-muted-foreground">
              Nous rencontrons actuellement des difficultés techniques. 
              Notre équipe a été automatiquement notifiée et travaille sur une solution.
            </p>
          </div>

          {/* Informations d'erreur (si disponibles) */}
          {error && import.meta.env.MODE === 'development' && (
            <details className="bg-muted/50 rounded-lg p-4 text-left text-sm">
              <summary className="cursor-pointer font-medium text-destructive">
                Détails de l'erreur (développement)
              </summary>
              <div className="mt-2 space-y-2">
                <div><strong>Message:</strong> {error.message}</div>
                <div><strong>ID d'erreur:</strong> {errorId}</div>
                {error.stack && (
                  <div className="text-xs">
                    <strong>Stack trace:</strong>
                    <pre className="mt-1 bg-background p-2 rounded overflow-auto max-h-32">
                      {error.stack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}

          {/* Actions de récupération */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={handleRetry}
                disabled={isRetrying}
                className="flex items-center gap-2"
                data-testid="retry-button"
              >
                <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
                {isRetrying ? 'Nouvelle tentative...' : t('action.retry')}
              </Button>
              
              <Button 
                asChild
                variant="outline"
                className="flex items-center gap-2"
              >
                <Link to="/" data-testid="home-link">
                  <Home className="h-4 w-4" />
                  {t('nav.home')}
                </Link>
              </Button>
            </div>

            <Button 
              onClick={handleReportError}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Signaler ce problème
            </Button>
          </div>

          {/* Conseils pour l'utilisateur */}
          <div className="bg-muted/30 rounded-lg p-4 text-sm text-left">
            <h2 className="font-medium mb-2">En attendant, vous pouvez :</h2>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Actualiser la page dans quelques minutes</li>
              <li>• Vérifier votre connexion internet</li>
              <li>• Retourner à la page d'accueil</li>
              <li>• Contacter notre support si le problème persiste</li>
            </ul>
          </div>

          {/* Informations de contact d'urgence */}
          <div className="text-xs text-muted-foreground">
            <p>
              ID d'incident: <code className="bg-muted px-1 rounded">{errorId}</code>
            </p>
            <p>
              En cas d'urgence: 
              <a 
                href="mailto:support@emotionscare.com" 
                className="text-primary hover:underline ml-1"
              >
                support@emotionscare.com
              </a>
            </p>
          </div>
        </main>
      </Card>
    </div>
  );
};

export default Enhanced500Page;