/**
 * Page 404 améliorée avec navigation utile et accessibilité
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search, ArrowLeft, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/lib/i18n-core';
import { useObservability } from '@/lib/observability';

const Enhanced404Page: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { logPageView, logUserAction } = useObservability();
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    logPageView('404_error', { 
      url: window.location.href,
      referrer: document.referrer 
    });
  }, [logPageView]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      logUserAction('404_search', { term: searchTerm });
      // TODO: Implémenter la recherche globale
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleBack = () => {
    logUserAction('404_back');
    navigate(-1);
  };

  const popularPages = [
    { 
      title: t('nav.home'), 
      href: '/', 
      description: 'Retour à l\'accueil principal'
    },
    { 
      title: t('nav.dashboard'), 
      href: '/b2c/dashboard', 
      description: 'Accéder à votre tableau de bord personnel'
    },
    { 
      title: t('module.scan'), 
      href: '/b2c/scan', 
      description: 'Effectuer un scan émotionnel'
    },
    { 
      title: t('module.music'), 
      href: '/b2c/music', 
      description: 'Explorer la musicothérapie'
    },
    { 
      title: t('nav.help'), 
      href: '/help', 
      description: 'Centre d\'aide et documentation'
    },
  ];

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4"
      data-testid="404-page"
    >
      <div className="max-w-2xl w-full">
        {/* Skip link pour l'accessibilité */}
        <a 
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded z-50"
        >
          Aller au contenu principal
        </a>

        <main id="main-content" className="text-center space-y-8">
          {/* Titre principal */}
          <div className="space-y-4">
            <div className="text-8xl font-bold text-primary/20 select-none">
              404
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Page introuvable
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              La page que vous recherchez n'existe pas ou a été déplacée. 
              Ne vous inquiétez pas, nous allons vous aider à retrouver votre chemin.
            </p>
          </div>

          {/* Recherche */}
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-1">
                <label htmlFor="search-404" className="sr-only">
                  Rechercher une page
                </label>
                <Input
                  id="search-404"
                  type="text"
                  placeholder="Rechercher une page..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" variant="outline" size="icon">
                <Search className="h-4 w-4" />
                <span className="sr-only">Lancer la recherche</span>
              </Button>
            </form>
          </div>

          {/* Actions rapides */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleBack}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('action.back')}
            </Button>
            
            <Button 
              asChild
              className="flex items-center gap-2"
            >
              <Link to="/" data-testid="home-link">
                <Home className="h-4 w-4" />
                {t('nav.home')}
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

          {/* Pages populaires */}
          <div className="bg-card rounded-lg border p-6 text-left">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Pages populaires
            </h2>
            
            <nav aria-label="Pages populaires">
              <ul className="space-y-3">
                {popularPages.map((page) => (
                  <li key={page.href}>
                    <Link
                      to={page.href}
                      className="block p-3 rounded-md hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary group"
                      onClick={() => logUserAction('404_popular_page_click', { page: page.title })}
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
};

export default Enhanced404Page;