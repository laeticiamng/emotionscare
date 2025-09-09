/**
 * 401 PAGE - EMOTIONSCARE  
 * Page d'erreur 401 accessible WCAG 2.1 AA
 */

import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Lock, LogIn, AlertTriangle } from "lucide-react";

export default function Page401() {
  const navigate = useNavigate();

  // Focus management pour l'accessibilité
  useEffect(() => {
    document.title = "401 - Authentification requise | EmotionsCare";
    const skipLink = document.getElementById('skip-link');
    if (skipLink) {
      skipLink.focus();
    }
  }, []);

  const handleLogin = () => {
    navigate('/login');
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
              <div className="flex justify-center mb-4" role="img" aria-label="Icône de sécurité">
                <div className="p-4 bg-orange-100/80 rounded-full">
                  <Lock className="h-16 w-16 text-orange-600" aria-hidden="true" />
                </div>
              </div>
              
              <div className="space-y-2">
                <CardTitle 
                  id="error-title"
                  className="text-3xl font-bold text-foreground"
                >
                  401 - Authentification requise
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  Vous devez être connecté pour accéder à cette ressource.
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
                      Accès protégé
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Cette page nécessite une authentification. 
                      Connectez-vous pour accéder à votre espace personnel sécurisé.
                    </p>
                  </div>
                </div>
              </div>
              
              <nav aria-label="Actions d'authentification" className="space-y-3">
                <Button
                  onClick={handleLogin}
                  onKeyDown={(e) => handleKeyDown(e, handleLogin)}
                  className="w-full h-12 text-base bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="Se connecter à EmotionsCare"
                  tabIndex={0}
                >
                  <LogIn className="h-4 w-4 mr-2" aria-hidden="true" />
                  Se connecter
                </Button>
                
                <Button
                  onClick={handleGoHome}
                  onKeyDown={(e) => handleKeyDown(e, handleGoHome)}
                  variant="outline"
                  className="w-full h-12 text-base hover:bg-muted/50 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="Retourner à la page d'accueil d'EmotionsCare"
                  tabIndex={0}
                >
                  Retour à l'accueil
                </Button>
                
                <p className="text-xs text-muted-foreground mt-4">
                  Pas encore de compte ?{' '}
                  <a 
                    href="/signup" 
                    className="text-primary hover:underline focus:underline focus:outline-none"
                    aria-label="Créer un nouveau compte EmotionsCare"
                  >
                    Créer un compte gratuit
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