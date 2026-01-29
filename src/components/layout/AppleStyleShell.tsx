/**
 * AppleStyleShell - Layout élégant style Apple pour toutes les pages
 * Reprend le style minimaliste et premium de la homepage
 */

import React, { useState, useEffect, memo, useMemo, useCallback, lazy, Suspense } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { useTheme } from '@/providers/theme';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight, Menu, X, Home, User, Sun, Moon, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load footer
const EnhancedFooter = lazy(() => import('./EnhancedFooter'));

interface AppleStyleShellProps {
  children?: React.ReactNode;
  hideNav?: boolean;
  hideFooter?: boolean;
  showBackButton?: boolean;
  title?: string;
  className?: string;
}

const AppleStyleShell: React.FC<AppleStyleShellProps> = memo(({
  children,
  hideNav = false,
  hideFooter = false,
  showBackButton = false,
  title,
  className = '',
}) => {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isDarkMode = useMemo(() => 
    theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches),
    [theme]
  );
  
  const reduceMotion = useMemo(() => 
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );
  
  // Scroll handler
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 10);
          const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          setScrollProgress(height ? Math.min(window.scrollY / height, 1) : 0);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleTheme = useCallback(() => {
    setTheme(isDarkMode ? 'light' : 'dark');
  }, [isDarkMode, setTheme]);

  const isHomePage = location.pathname === '/' || location.pathname === '/app/home';

  return (
    <div className={cn(
      "min-h-screen bg-background text-foreground",
      className
    )} data-testid="page-root">
      {/* Skip to main content */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:outline-none"
      >
        Aller au contenu principal
      </a>

      {/* Scroll Progress Indicator */}
      <div 
        className="fixed top-0 left-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary z-[60] origin-left will-change-transform"
        style={{ transform: `scaleX(${scrollProgress})` }}
        aria-hidden="true"
      />

      {/* Premium Header - Apple-style with glassmorphism */}
      {!hideNav && (
        <header 
          className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300 safe-area-top",
            scrolled 
              ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm" 
              : "bg-transparent"
          )}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left: Back button or Logo */}
              <div className="flex items-center gap-3">
                {showBackButton && !isHomePage && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => window.history.back()}
                    className="gap-1 text-muted-foreground hover:text-foreground"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Retour</span>
                  </Button>
                )}
                <Link 
                  to={isAuthenticated ? "/app/home" : "/"} 
                  className="font-bold text-xl tracking-tight hover:opacity-80 transition-opacity"
                >
                  EmotionsCare
                </Link>
                {title && (
                  <span className="hidden sm:block text-muted-foreground">
                    / {title}
                  </span>
                )}
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-6" aria-label="Navigation principale">
                {isAuthenticated ? (
                  <>
                    <Link 
                      to="/app/home" 
                      className={cn(
                        "text-sm transition-colors",
                        location.pathname === '/app/home' 
                          ? "text-foreground font-medium" 
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Accueil
                    </Link>
                    <Link 
                      to="/app/scan" 
                      className={cn(
                        "text-sm transition-colors",
                        location.pathname.includes('/scan') 
                          ? "text-foreground font-medium" 
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Scan
                    </Link>
                    <Link 
                      to="/app/coach" 
                      className={cn(
                        "text-sm transition-colors",
                        location.pathname.includes('/coach') 
                          ? "text-foreground font-medium" 
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Coach
                    </Link>
                    <Link 
                      to="/app/journal" 
                      className={cn(
                        "text-sm transition-colors",
                        location.pathname.includes('/journal') 
                          ? "text-foreground font-medium" 
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Journal
                    </Link>
                    <Link 
                      to="/navigation" 
                      className={cn(
                        "text-sm transition-colors",
                        location.pathname === '/navigation' 
                          ? "text-foreground font-medium" 
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Explorer
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/navigation" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Fonctionnalités
                    </Link>
                    <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Tarifs
                    </Link>
                    <Link to="/b2b" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Entreprise
                    </Link>
                  </>
                )}
              </nav>

              {/* Desktop CTA */}
              <div className="hidden md:flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  aria-label={isDarkMode ? 'Mode clair' : 'Mode sombre'}
                  className="h-9 w-9"
                >
                  {isDarkMode ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
                
                {isAuthenticated ? (
                  <Link to="/app/profile">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <User className="h-4 w-4" />
                      Profil
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="ghost" size="sm">Se connecter</Button>
                    </Link>
                    <Link to="/signup">
                      <Button size="sm" className="rounded-full px-6 bg-primary hover:bg-primary/90">
                        Essai gratuit
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="flex md:hidden items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  aria-label={isDarkMode ? 'Mode clair' : 'Mode sombre'}
                  className="h-9 w-9"
                >
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 -mr-2"
                  aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                >
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border"
              >
                <nav className="container px-4 py-6 space-y-4">
                  {isAuthenticated ? (
                    <>
                      <Link 
                        to="/app/home" 
                        className="block text-lg text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Accueil
                      </Link>
                      <Link 
                        to="/app/scan" 
                        className="block text-lg text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Scan émotionnel
                      </Link>
                      <Link 
                        to="/app/coach" 
                        className="block text-lg text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        AI Coach
                      </Link>
                      <Link 
                        to="/app/journal" 
                        className="block text-lg text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Journal
                      </Link>
                      <Link 
                        to="/navigation" 
                        className="block text-lg text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Explorer tout
                      </Link>
                      <div className="pt-4 border-t border-border">
                        <Link to="/app/profile" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full gap-2">
                            <User className="h-4 w-4" />
                            Mon profil
                          </Button>
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/navigation" 
                        className="block text-lg text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Fonctionnalités
                      </Link>
                      <Link 
                        to="/pricing" 
                        className="block text-lg text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Tarifs
                      </Link>
                      <Link 
                        to="/b2b" 
                        className="block text-lg text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Entreprise
                      </Link>
                      <div className="pt-4 border-t border-border space-y-3">
                        <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full">Se connecter</Button>
                        </Link>
                        <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                          <Button className="w-full">Essai gratuit</Button>
                        </Link>
                      </div>
                    </>
                  )}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </header>
      )}

      {/* Main Content */}
      <main 
        id="main-content" 
        role="main"
        className={cn(
          "flex-1 w-full pt-16",
          !reduceMotion && "animate-in fade-in duration-300"
        )}
      >
        {children || <Outlet />}
      </main>

      {/* Footer */}
      {!hideFooter && (
        <Suspense fallback={<div className="h-16 bg-muted/30" />}>
          <EnhancedFooter />
        </Suspense>
      )}
    </div>
  );
});

AppleStyleShell.displayName = 'AppleStyleShell';

export default AppleStyleShell;
