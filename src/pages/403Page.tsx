/**
 * 403 PAGE - EMOTIONSCARE
 * Page d'erreur 403 accessible WCAG 2.1 AA  
 */

import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Shield, ArrowLeft, AlertTriangle } from "lucide-react";

export default function Page403() {
  const navigate = useNavigate();

  // Focus management pour l'accessibilité
  useEffect(() => {
    document.title = "403 - Accès refusé | EmotionsCare";
    const skipLink = document.getElementById('skip-link');
    if (skipLink) {
      skipLink.focus();
    }
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/app/home');
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
              <div className="flex justify-center mb-4" role="img" aria-label="Icône de sécurité">
                <div className="p-4 bg-destructive/10 rounded-full">
                  <Shield className="h-16 w-16 text-destructive" aria-hidden="true" />
                </div>
              </div>
              
              <div className="space-y-2">
                <CardTitle 
                  id="error-title"
                  className="text-3xl font-bold text-foreground"
                >
                  403 - Accès refusé
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  Vous n'avez pas les permissions nécessaires pour accéder à cette page.
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div 
                className="p-4 bg-muted/30 rounded-lg border-l-4 border-destructive"
                role="alert"
                aria-live="polite"
              >
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">
                      Permissions insuffisantes
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Cette ressource nécessite des droits d'accès particuliers. 
                      Contactez votre administrateur si vous pensez qu'il s'agit d'une erreur.
                    </p>
                  </div>
                </div>
              </div>
              
              <nav aria-label="Actions de navigation d'erreur" className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleGoBack}
                    onKeyDown={(e) => handleKeyDown(e, handleGoBack)}
                    variant="outline"
                    className="flex-1 h-12 text-base hover:bg-muted/50 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label="Retourner à la page précédente"
                    tabIndex={0}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
                    Retour
                  </Button>
                  
                  <Button
                    onClick={handleGoHome}
                    onKeyDown={(e) => handleKeyDown(e, handleGoHome)}
                    className="flex-1 h-12 text-base bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label="Retourner à la page d'accueil d'EmotionsCare"
                    tabIndex={0}
                  >
                    Accueil
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground mt-4">
                  Besoin d'aide ? Visitez notre{' '}
                  <a 
                    href="/help" 
                    className="text-primary hover:underline focus:underline focus:outline-none"
                    aria-label="Accéder au centre d'aide d'EmotionsCare"
                  >
                    centre d'aide
                  </a>
                  {' '}ou contactez notre{' '}
                  <a 
                    href="/contact" 
                    className="text-primary hover:underline focus:underline focus:outline-none"
                    aria-label="Contacter le support technique d'EmotionsCare"
                  >
                    support technique
                  </a>
                </p>
              </nav>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}