/**
 * UNIFIED ERROR PAGE - Fusion de 404Page + Enhanced404Page + Error404Page
 * Préserve EXACTEMENT la même fonctionnalité des trois composants
 */

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search, ArrowLeft, HelpCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface UnifiedErrorPageProps {
  variant?: 'simple' | 'enhanced' | 'accessible';
  errorCode?: number;
}

export default function UnifiedErrorPage({ 
  variant = 'enhanced', 
  errorCode = 404 
}: UnifiedErrorPageProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Focus management pour l'accessibilité
  useEffect(() => {
    document.title = `${errorCode} - Page introuvable | EmotionsCare`;
    const skipLink = document.getElementById('skip-link');
    if (skipLink) {
      skipLink.focus();
    }
  }, [errorCode]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Global search will be implemented when search API is ready
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  const popularPages = [
    { 
      title: 'Accueil', 
      href: '/', 
      description: 'Retour à l\'accueil principal'
    },
    { 
      title: 'Tableau de bord', 
      href: '/app/home', 
      description: 'Accéder à votre tableau de bord personnel'
    },
    { 
      title: 'Scanner émotionnel', 
      href: '/app/scan', 
      description: 'Effectuer un scan émotionnel'
    },
    { 
      title: 'Musique thérapeutique', 
      href: '/app/music', 
      description: 'Explorer la musicothérapie'
    },
    { 
      title: 'Centre d\'aide', 
      href: '/help', 
      description: 'Centre d\'aide et documentation'
    },
  ];

  // Version Simple (comme Error404Page)
  if (variant === 'simple') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4" data-testid="page-root">
        <div className="max-w-md w-full text-center">
          {/* Illustration 404 */}
          <div className="mb-8">
            <div className="text-9xl font-bold text-primary/20 mb-4">{errorCode}</div>
            <div className="text-muted-foreground text-lg">
              {errorCode} - Page introuvable
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
            <Link to="/" aria-label="Retour à l'accueil">
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
  }

  // Version Accessible (comme 404Page original)
  if (variant === 'accessible') {
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
                    {errorCode} - Page introuvable
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

  // Version Enhanced (par défaut, comme Enhanced404Page)
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4" data-testid="page-root">
      {/* Skip Links */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
        tabIndex={0}
      >
        Aller au contenu principal
      </a>
      
      <div className="max-w-2xl w-full">
        <main id="main-content" className="text-center space-y-8">
          {/* Titre principal */}
          <div className="space-y-4">
            <div className="text-8xl font-bold text-primary/20 select-none" aria-hidden="true">
              {errorCode}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Page introuvable
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              La page que vous recherchez n'existe pas ou a été déplacée. 
              Ne vous inquiétez pas, nous allons vous aider à retrouver votre chemin.
            </p>
          </div>

          {/* Recherche avec accessibilité améliorée */}
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSearch} className="flex gap-2" role="search">
              <div className="flex-1">
                <label htmlFor="search-404" className="sr-only">
                  Rechercher une page
                </label>
                <Input
                  id="search-404"
                  type="search"
                  placeholder="Rechercher une page..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                  aria-describedby="search-help"
                />
                <div id="search-help" className="sr-only">
                  Entrez des mots-clés pour rechercher une page
                </div>
              </div>
              <Button type="submit" variant="outline" size="icon">
                <Search className="h-4 w-4" />
                <span className="sr-only">Lancer la recherche</span>
              </Button>
            </form>
          </div>

          {/* Actions rapides avec navigation assistée */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleGoBack}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
            
            <Button 
              asChild
              className="flex items-center gap-2"
            >
              <Link to="/" data-testid="home-link">
                <Home className="h-4 w-4" />
                Accueil
              </Link>
            </Button>
            
            <Button 
              asChild
              variant="outline"
              className="flex items-center gap-2"
            >
              <Link to="/help">
                <HelpCircle className="h-4 w-4" />
                Aide
              </Link>
            </Button>
          </div>

          {/* Pages populaires avec navigation optimisée */}
          <div className="bg-card rounded-lg border p-6 text-left">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Pages populaires
            </h2>
            
            <nav aria-label="Pages populaires" role="navigation">
              <ul className="space-y-3">
                {popularPages.map((page) => (
                  <li key={page.href}>
                    <Link
                      to={page.href}
                      className="block p-3 rounded-md hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary group"
                    >
                      <div className="font-medium text-foreground group-hover:text-primary">
                        {page.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {page.description}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Informations techniques (développement) */}
          {process.env.NODE_ENV === 'development' && (
            <details className="bg-muted/50 rounded-lg p-4 text-left text-sm">
              <summary className="cursor-pointer font-medium">
                Informations techniques (dev)
              </summary>
              <div className="mt-2 space-y-1 text-muted-foreground">
                <div>URL: {window.location.href}</div>
                <div>Referrer: {document.referrer || 'Direct'}</div>
                <div>User Agent: {navigator.userAgent}</div>
              </div>
            </details>
          )}
        </main>
      </div>
    </div>
  );
}