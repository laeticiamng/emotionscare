/**
 * 503 SERVICE UNAVAILABLE PAGE - EMOTIONSCARE
 * Page d'erreur 503 accessible WCAG 2.1 AA
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useObservability } from '@/lib/observability';

export default function ServiceUnavailablePage() {
  const { logPageView, logUserAction } = useObservability();
  
  // Focus management pour l'accessibilité
  useEffect(() => {
    document.title = "503 - Service temporairement indisponible | EmotionsCare";
    logPageView('503_error');
    const skipLink = document.getElementById('skip-link');
    if (skipLink) {
      skipLink.focus();
    }
  }, [logPageView]);

  const handleRefresh = () => {
    logUserAction('503_refresh');
    window.location.reload();
  };

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  return (
    <>
      {/* Skip Links pour l'accessibilité */}
      <a 
        id="skip-link"
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
        tabIndex={0}
      >
        Aller au contenu principal
      </a>

      <div className="min-h-screen bg-background" data-testid="page-root">
        <main 
          id="main-content"
          role="main"
          className="min-h-screen flex items-center justify-center p-4"
          aria-labelledby="error-title"
        >
          <Card className="w-full max-w-md text-center border-2 hover:border-primary/20 transition-colors">
            <CardHeader className="space-y-4">
              <div className="flex justify-center mb-4" role="img" aria-label="Icône d'alerte">
                <div className="p-4 bg-yellow-100/80 rounded-full">
                  <AlertTriangle className="h-16 w-16 text-yellow-600" aria-hidden="true" />
                </div>
              </div>
              
              <CardTitle 
                id="error-title"
                className="text-2xl font-bold text-foreground"
              >
                Service temporairement indisponible
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-muted-foreground space-y-2">
                <p>
                  Nos services sont actuellement en maintenance ou font face à une charge élevée.
                </p>
                <p>
                  Nous travaillons activement à rétablir le service dans les plus brefs délais.
                </p>
              </div>

              {/* Status Info */}
              <section 
                className="bg-muted/50 rounded-lg p-4 space-y-3"
                aria-labelledby="status-title"
              >
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  <span>Temps d'arrêt estimé : 5-15 minutes</span>
                </div>
                
                <div className="space-y-2">
                  <h3 id="status-title" className="text-xs text-muted-foreground font-medium">
                    État des services :
                  </h3>
                  <div className="space-y-1 text-xs" role="list" aria-label="État des services">
                    <div className="flex justify-between" role="listitem">
                      <span>API principale</span>
                      <span className="text-yellow-600" aria-label="Service dégradé">⚠️ Dégradé</span>
                    </div>
                    <div className="flex justify-between" role="listitem">
                      <span>Base de données</span>
                      <span className="text-green-600" aria-label="Service opérationnel">✅ Opérationnel</span>
                    </div>
                    <div className="flex justify-between" role="listitem">
                      <span>Authentification</span>
                      <span className="text-green-600" aria-label="Service opérationnel">✅ Opérationnel</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Actions */}
              <nav aria-label="Actions de récupération" className="space-y-3">
                <Button
                  onClick={handleRefresh}
                  onKeyDown={(e) => handleKeyDown(e, handleRefresh)}
                  className="w-full h-12 text-base bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  variant="default"
                  aria-label="Recharger la page pour réessayer"
                  tabIndex={0}
                >
                  <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
                  Réessayer
                </Button>

                <Link to="/" className="block">
                  <Button 
                    variant="outline" 
                    className="w-full h-12 text-base hover:bg-muted/50 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label="Retourner à la page d'accueil d'EmotionsCare"
                    tabIndex={0}
                  >
                    <Home className="h-4 w-4 mr-2" aria-hidden="true" />
                    Retour à l'accueil
                  </Button>
                </Link>
              </nav>

              {/* Contact Info */}
              <footer className="text-xs text-muted-foreground border-t pt-4">
                <p>
                  Problème persistant ? Contactez-nous à{' '}
                  <a 
                    href="mailto:support@emotionscare.fr" 
                    className="text-primary hover:underline focus:underline focus:outline-none"
                    aria-label="Envoyer un email au support technique d'EmotionsCare"
                  >
                    support@emotionscare.fr
                  </a>
                </p>
              </footer>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}