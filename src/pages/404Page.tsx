/**
 * 404 PAGE - EMOTIONSCARE
 * Page d'erreur 404 accessible WCAG 2.1 AA
 */

import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft, Home, AlertTriangle } from "lucide-react";

export default function Page404() {
  const navigate = useNavigate();

  // Focus management pour l'accessibilité
  useEffect(() => {
    document.title = "404 - Page introuvable | EmotionsCare";
    const skipLink = document.getElementById('skip-link');
    if (skipLink) {
      skipLink.focus();
    }
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
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
              <div className="flex justify-center mb-4" role="img" aria-label="Icône de recherche">
                <div className="p-4 bg-muted/50 rounded-full">
                  <Search className="h-16 w-16 text-muted-foreground" aria-hidden="true" />
                </div>
              </div>
              
              <div className="space-y-2">
                <CardTitle 
                  id="error-title"
                  className="text-3xl font-bold text-foreground"
                >
                  404 - Page introuvable
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  La page que vous recherchez n'existe pas ou a été déplacée.
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div 
                className="p-4 bg-muted/30 rounded-lg border-l-4 border-orange-500"
                role="alert"
                aria-live="polite"
              >
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">
                      Que s'est-il passé ?
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Cette adresse ne correspond à aucune page de notre plateforme. 
                      Vérifiez l'URL ou utilisez la navigation pour explorer nos fonctionnalités.
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
                    <Home className="h-4 w-4 mr-2" aria-hidden="true" />
                    Accueil
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground mt-4">
                  Si le problème persiste, contactez notre{' '}
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